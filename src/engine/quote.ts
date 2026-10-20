import { Big, D, ONE, ZERO, maxB, minB, pct } from './money'
import type { FeeRule, Provider, Quote, RateInfo, TraceStep, TxType, WaterfallStep } from './types'

export interface QuoteInput {
  amountHome: string
  homeCcy: string
  destCcy: string
  txType: TxType
  provider: Provider
  rule: FeeRule | undefined
  rate: RateInfo | null
  /** Units of home currency per 1 unit of the rule currency (GBP). 1 when home is GBP. */
  ruleToHome: string
  weekend: boolean
}

const n = (b: Big, dp = 2) => {
  const s = b.toFixed(dp)
  return s
}
const r = (b: Big) => {
  // rates: up to 6 dp, trimmed
  const s = b.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
  return s
}

function emptyQuote(input: QuoteInput, status: Quote['status'], reason?: string): Quote {
  return {
    status,
    providerId: input.provider.id,
    txType: input.txType,
    amountHome: input.amountHome,
    homeCcy: input.homeCcy,
    destCcy: input.destCcy,
    appliedRate: '0',
    feeHome: '0',
    netHome: '0',
    destAmount: '0',
    idealDest: '0',
    lossDest: '0',
    costHome: '0',
    effectivePct: '0',
    overLimit: false,
    weekendApplied: false,
    feeClamped: null,
    ruleId: input.rule?.id,
    ruleVersion: input.rule?.version,
    ruleEffectiveFrom: input.rule?.effectiveFrom,
    reason,
    rate: input.rate ?? undefined,
    trace: [],
    waterfall: [],
  }
}

/**
 * PRD Section 10.0 computeQuote. 12 steps, each recorded in `trace`.
 * All arithmetic is big.js; nothing is rounded here (display rounds).
 */
export function computeQuote(input: QuoteInput): Quote {
  const { provider, rule, rate } = input
  if (provider.status !== 'active') return emptyQuote(input, 'PAUSED', 'Provider paused by an admin')
  if (!rule || !rule.offered) return emptyQuote(input, 'NOT_OFFERED', rule?.notOfferedReason ?? `${provider.name} doesn't offer this`)
  if (!rate) return emptyQuote(input, 'NO_RATE', 'No rate available for this pair')

  let amount: Big
  try {
    amount = D(input.amountHome)
  } catch {
    return emptyQuote(input, 'INVALID_AMOUNT', 'Enter an amount like 1,200.50')
  }
  if (amount.lte(0)) return emptyQuote(input, 'INVALID_AMOUNT', 'Enter an amount above zero')

  const k = D(input.ruleToHome)
  const refMid = D(rate.refRate)
  const baseMid = D(rate.baseRate)

  // 1-4: rates
  const spread = pct(rule.fxSpreadPct)
  const weekendApplied = input.weekend && D(rule.weekendMarkupPct).gt(0)
  const weekend = weekendApplied ? pct(rule.weekendMarkupPct) : ZERO
  const applied = baseMid.times(ONE.minus(spread)).times(ONE.minus(weekend))

  // 5-6: fees (rule money converted into home currency)
  const allowance = D(rule.freeAllowance).times(k)
  const fixed = D(rule.fixedFee).times(k)
  const pctFee = pct(rule.pctFee)
  const chargeable = maxB(ZERO, amount.minus(allowance))
  const feeApplies = chargeable.gt(0) || rule.fixedAppliesAlways
  let fee = ZERO
  let feeClamped: Quote['feeClamped'] = null
  let fixedPart = ZERO
  if (feeApplies) {
    fixedPart = fixed
    const raw = fixed.plus(chargeable.times(pctFee))
    fee = raw
    if (rule.minFee !== null && rule.minFee !== '' && raw.lt(D(rule.minFee).times(k))) {
      fee = D(rule.minFee).times(k)
      feeClamped = 'min'
    }
    if (rule.maxFee !== null && rule.maxFee !== '' && fee.gt(D(rule.maxFee).times(k))) {
      fee = D(rule.maxFee).times(k)
      feeClamped = 'max'
    }
    if (fee.lt(fixedPart)) fixedPart = fee
  }
  const pctPart = fee.minus(fixedPart)

  // 7: net
  const net = amount.minus(fee)
  const overLimit = rule.maxPerTx !== null && rule.maxPerTx !== '' && amount.gt(D(rule.maxPerTx).times(k))

  const trace: TraceStep[] = []
  const H = input.homeCcy
  const X = input.destCcy
  trace.push({ step: 1, key: 'midRate', label: 'Reference rate', formula: rate.overrideActive ? 'midRate = activeOverride(pair).rate' : 'midRate = cache(pair).rate', inputs: `${rate.pair}${rate.overrideActive ? ' (override)' : ''}`, output: `${r(baseMid)} ${X} per ${H}` })
  trace.push({ step: 2, key: 'spread', label: 'FX spread', formula: 'spread = rule.fxSpreadPct', inputs: rule.id, output: `${D(rule.fxSpreadPct).toFixed(2)}%` })
  trace.push({ step: 3, key: 'weekend', label: 'Weekend markup', formula: 'weekend = isWeekend ? rule.weekendMarkupPct : 0', inputs: input.weekend ? 'weekend' : 'weekday', output: `${weekend.times(100).toFixed(2)}%` })
  trace.push({ step: 4, key: 'appliedRate', label: 'Applied rate', formula: 'midRate x (1 - spread) x (1 - weekend)', inputs: `${r(baseMid)} x ${r(ONE.minus(spread))} x ${r(ONE.minus(weekend))}`, output: r(applied) })
  trace.push({ step: 5, key: 'chargeable', label: 'Chargeable amount', formula: 'max(0, amount - freeAllowance)', inputs: `${n(amount)} - ${n(allowance)}`, output: `${H} ${n(chargeable)}` })
  trace.push({ step: 6, key: 'fee', label: 'Fees', formula: 'clamp(fixed + chargeable x pctFee, minFee, maxFee)', inputs: `${n(fixed)} + ${n(chargeable)} x ${D(rule.pctFee).toFixed(2)}%${feeClamped ? ` (${feeClamped} applied)` : ''}`, output: `${H} ${n(fee)}` })
  trace.push({ step: 7, key: 'net', label: 'Net converted', formula: 'amount - fee', inputs: `${n(amount)} - ${n(fee)}`, output: `${H} ${n(net)}` })

  if (net.lte(0)) {
    const q = emptyQuote(input, 'AMOUNT_BELOW_FEES', "Fee is higher than this amount.")
    q.feeHome = fee.toString()
    q.trace = trace
    return q
  }

  // 8-12
  const dest = net.times(applied)
  const ideal = amount.times(refMid)
  const loss = ideal.minus(dest)
  const cost = loss.div(refMid)
  const eff = cost.div(amount).times(100)
  trace.push({ step: 8, key: 'destAmount', label: 'You receive', formula: 'net x appliedRate', inputs: `${n(net)} x ${r(applied)}`, output: `${X} ${dest.toFixed(4)}` })
  trace.push({ step: 9, key: 'idealDest', label: 'Ideal amount', formula: 'amount x midRate', inputs: `${n(amount)} x ${r(refMid)}`, output: `${X} ${ideal.toFixed(4)}` })
  trace.push({ step: 10, key: 'lossDest', label: 'Lost to costs', formula: 'idealDest - destAmount', inputs: `${ideal.toFixed(4)} - ${dest.toFixed(4)}`, output: `${X} ${loss.toFixed(4)}` })
  trace.push({ step: 11, key: 'costHome', label: 'Cost in home currency', formula: 'lossDest / midRate', inputs: `${loss.toFixed(4)} / ${r(refMid)}`, output: `${H} ${cost.toFixed(4)}` })
  trace.push({ step: 12, key: 'effective', label: 'Effective cost', formula: 'costHome / amount', inputs: `${cost.toFixed(4)} / ${n(amount)}`, output: `${eff.toFixed(4)}%` })

  // Waterfall (B2). Fees valued at base mid; spread and weekend on the net amount.
  const waterfall: WaterfallStep[] = []
  waterfall.push({ key: 'ideal', label: 'Ideal amount', dest: ideal.toString(), home: amount.toString() })
  const rateDiff = amount.times(refMid.minus(baseMid))
  if (!rateDiff.eq(0)) {
    waterfall.push({ key: 'rateDiff', label: 'Override rate difference', dest: rateDiff.toString(), home: rateDiff.div(refMid).toString(), note: 'Manual override applied to this provider only' })
  }
  const spreadLoss = net.times(baseMid).times(spread)
  const weekendLoss = net.times(baseMid).times(ONE.minus(spread)).times(weekend)
  const fixedLoss = fixedPart.times(baseMid)
  const pctLoss = pctPart.times(baseMid)
  if (spreadLoss.gt(0)) waterfall.push({ key: 'spread', label: 'Exchange-rate spread', dest: spreadLoss.toString(), home: spreadLoss.div(refMid).toString(), note: `${D(rule.fxSpreadPct).toFixed(2)}% below mid-market` })
  if (weekendLoss.gt(0)) waterfall.push({ key: 'weekend', label: 'Weekend markup', dest: weekendLoss.toString(), home: weekendLoss.div(refMid).toString(), note: `${D(rule.weekendMarkupPct).toFixed(2)}% on Saturdays and Sundays` })
  if (fixedLoss.gt(0)) waterfall.push({ key: 'fixed', label: 'Fixed fee', dest: fixedLoss.toString(), home: fixedPart.times(baseMid).div(refMid).toString() })
  if (pctLoss.gt(0)) waterfall.push({ key: 'percentage', label: feeClamped === 'min' ? 'Percentage fee (minimum applied)' : feeClamped === 'max' ? 'Percentage fee (cap applied)' : 'Percentage fee', dest: pctLoss.toString(), home: pctPart.times(baseMid).div(refMid).toString(), note: `${D(rule.pctFee).toFixed(2)}% of ${n(chargeable)} ${H}` })
  waterfall.push({ key: 'receive', label: 'You receive', dest: dest.toString(), home: dest.div(refMid).toString() })

  return {
    status: 'OK',
    providerId: provider.id,
    txType: input.txType,
    amountHome: amount.toString(),
    homeCcy: H,
    destCcy: X,
    appliedRate: applied.toString(),
    feeHome: fee.toString(),
    netHome: net.toString(),
    destAmount: dest.toString(),
    idealDest: ideal.toString(),
    lossDest: loss.toString(),
    costHome: cost.toString(),
    effectivePct: eff.toString(),
    overLimit,
    weekendApplied,
    feeClamped,
    ruleId: rule.id,
    ruleVersion: rule.version,
    ruleEffectiveFrom: rule.effectiveFrom,
    rate,
    trace,
    waterfall,
  }
}

const groupOf = (q: Quote) => {
  if (q.status === 'OK' && !q.overLimit) return 0
  if (q.status === 'OK') return 1
  if (q.status === 'AMOUNT_BELOW_FEES') return 2
  return 3
}

/** B5: destAmount desc; ties -> lower fixed fee -> name A-Z. Invalid groups last. */
export function rankQuotes(quotes: Quote[], providers: Record<string, Provider>, rules: Record<string, FeeRule | undefined>): Quote[] {
  return [...quotes].sort((a, b) => {
    const g = groupOf(a) - groupOf(b)
    if (g !== 0) return g
    if (a.status === 'OK' && b.status === 'OK') {
      const c = D(b.destAmount).cmp(D(a.destAmount))
      if (c !== 0) return c
      const fa = D(rules[`${a.providerId}:${a.txType}`]?.fixedFee ?? 0)
      const fb = D(rules[`${b.providerId}:${b.txType}`]?.fixedFee ?? 0)
      const f = fa.cmp(fb)
      if (f !== 0) return f
    }
    return (providers[a.providerId]?.name ?? '').localeCompare(providers[b.providerId]?.name ?? '')
  })
}

export const isRankable = (q: Quote) => q.status === 'OK' && !q.overLimit

/** B7 savings sentence inputs. Uses only offered, valid rows. */
export function savings(ranked: Quote[]): { best: Quote; worst: Quote; diff: string } | null {
  const valid = ranked.filter(isRankable)
  if (valid.length < 2) return null
  const best = valid[0]
  let worst = valid[0]
  for (const q of valid) if (D(q.costHome).gt(D(worst.costHome))) worst = q
  return { best, worst, diff: D(worst.costHome).minus(D(best.costHome)).toString() }
}

/** Sum of waterfall losses must equal total loss (asserted in tests). */
export function waterfallLossSum(q: Quote): Big {
  return q.waterfall.filter((w) => w.key !== 'ideal' && w.key !== 'receive').reduce((acc, w) => acc.plus(D(w.dest)), ZERO)
}

export { minB }
