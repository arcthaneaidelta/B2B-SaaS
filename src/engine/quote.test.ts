import { describe, expect, it } from 'vitest'
import { FEE_RULES, PROVIDERS } from '../data/seed/providers'
import { formatMoney } from './format'
import { D, roundMinor } from './money'
import { computeQuote, rankQuotes, savings, waterfallLossSum } from './quote'
import type { FeeRule, Provider, RateInfo } from './types'

const providerMap = Object.fromEntries(PROVIDERS.map((p) => [p.id, p])) as Record<string, Provider>
const ruleMap = Object.fromEntries(FEE_RULES.map((r) => [`${r.providerId}:${r.txType}`, r])) as Record<string, FeeRule | undefined>

const rateGbpJpy: RateInfo = {
  pair: 'GBP/JPY',
  rate: 196.4,
  refRate: '196.40',
  baseRate: '196.40',
  overrideActive: false,
  source: 'Primary feed (mock)',
  fetchedAt: Date.now(),
  freshness: 'fresh',
}

describe('PRD Addendum B10: Engine Test Vectors (GBP -> JPY, mid 196.40, amount 2,000)', () => {
  // T1 Wise, Card spend
  it('T1: Wise Card spend', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'card',
      provider: providerMap.wise,
      rule: ruleMap['wise:card'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.feeHome), 2).toFixed(2)).toBe('11.00')
    expect(roundMinor(D(q.netHome), 2).toFixed(2)).toBe('1989.00')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('390640')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('11.00')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('0.55')
  })

  // T2 Revolut, Card spend
  it('T2: Revolut Card spend', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'card',
      provider: providerMap.revolut,
      rule: ruleMap['revolut:card'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.feeHome), 2).toFixed(2)).toBe('10.00')
    expect(roundMinor(D(q.netHome), 2).toFixed(2)).toBe('1990.00')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('390836')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('10.00')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('0.50')
  })

  // T3 Revolut, Card, Sat
  it('T3: Revolut Card on weekend (Sat)', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'card',
      provider: providerMap.revolut,
      rule: ruleMap['revolut:card'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: true,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.appliedRate), 3).toFixed(3)).toBe('194.436')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('386928')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('29.90')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('1.50')
  })

  // T4 Metro National, Card
  it('T4: Metro National Card spend', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'card',
      provider: providerMap.metro,
      rule: ruleMap['metro:card'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.appliedRate), 3).toFixed(3)).toBe('190.999')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('381998')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('55.00')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('2.75')
  })

  // T5 Harbour & Crown, ATM
  it('T5: Harbour & Crown ATM with waterfall sum verification', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'atm',
      provider: providerMap.harbour,
      rule: ruleMap['harbour:atm'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.feeHome), 2).toFixed(2)).toBe('32.00')
    expect(roundMinor(D(q.netHome), 2).toFixed(2)).toBe('1968.00')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('374958')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('90.84')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('4.54')

    // Waterfall sum verification: sum of waterfall steps must equal lossDest
    const sum = waterfallLossSum(q)
    expect(roundMinor(sum, 0).toFixed(0)).toBe(roundMinor(D(q.lossDest), 0).toFixed(0))
  })

  // T6 Wise, ATM
  it('T6: Wise ATM', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'atm',
      provider: providerMap.wise,
      rule: ruleMap['wise:atm'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.feeHome), 2).toFixed(2)).toBe('32.00')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('386515')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('32.00')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('1.60')
  })

  // T7 Revolut, ATM
  it('T7: Revolut ATM', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'atm',
      provider: providerMap.revolut,
      rule: ruleMap['revolut:atm'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.feeHome), 2).toFixed(2)).toBe('36.00')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('385730')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('36.00')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('1.80')
  })

  // T8 Terminal FX, Cash
  it('T8: Terminal FX Cash exchange', () => {
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'cash',
      provider: providerMap.terminal,
      rule: ruleMap['terminal:cash'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('OK')
    expect(roundMinor(D(q.appliedRate), 3).toFixed(3)).toBe('179.706')
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('358693')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('173.66')
    expect(roundMinor(D(q.effectivePct), 2).toFixed(2)).toBe('8.68')
  })

  // T9 Ranking, Card spend
  it('T9: Ranking for Card spend and savings sentence', () => {
    const quotes = PROVIDERS.map((p) =>
      computeQuote({
        amountHome: '2000',
        homeCcy: 'GBP',
        destCcy: 'JPY',
        txType: 'card',
        provider: p,
        rule: ruleMap[`${p.id}:card`],
        rate: rateGbpJpy,
        ruleToHome: '1',
        weekend: false,
      })
    )
    const ranked = rankQuotes(quotes, providerMap, ruleMap)

    // Expected order of active offered: Revolut (cost 10) < Wise (11) < Pocket (20) < Metro (55) < Harbour (59.80)
    const offeredIds = ranked.filter((q) => q.status === 'OK').map((q) => q.providerId)
    expect(offeredIds).toEqual(['revolut', 'wise', 'pocket', 'metro', 'harbour'])

    const sav = savings(ranked)
    expect(sav).not.toBeNull()
    expect(sav?.best.providerId).toBe('revolut')
    expect(sav?.worst.providerId).toBe('harbour')
    expect(roundMinor(D(sav?.diff ?? '0'), 2).toFixed(2)).toBe('49.80')
  })

  // T10 Override all providers 190.00 on T1
  it('T10: Override 190.00 applied to all providers', () => {
    const overrideRate: RateInfo = {
      pair: 'GBP/JPY',
      rate: 190.0,
      refRate: '190.00',
      baseRate: '190.00',
      overrideActive: true,
      source: 'Manual override',
      fetchedAt: Date.now(),
      freshness: 'fresh',
    }
    const q = computeQuote({
      amountHome: '2000',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'card',
      provider: providerMap.wise,
      rule: ruleMap['wise:card'],
      rate: overrideRate,
      ruleToHome: '1',
      weekend: false,
    })
    expect(roundMinor(D(q.destAmount), 0).toFixed(0)).toBe('377910')
    expect(roundMinor(D(q.costHome), 2).toFixed(2)).toBe('11.00')
  })

  // T11 Below fees
  it('T11: Metro National transfer for amount 10.00 (below fixed fee 15.00)', () => {
    const q = computeQuote({
      amountHome: '10',
      homeCcy: 'GBP',
      destCcy: 'JPY',
      txType: 'transfer',
      provider: providerMap.metro,
      rule: ruleMap['metro:transfer'],
      rate: rateGbpJpy,
      ruleToHome: '1',
      weekend: false,
    })
    expect(q.status).toBe('AMOUNT_BELOW_FEES')
  })

  // T12 Rounding: JPY shows 0 decimals; GBP 2; 0.5 rounds up
  it('T12: Currency formatting & minor units', () => {
    expect(formatMoney('390639.6', 'JPY', { showSymbol: false })).toBe('390,640')
    expect(formatMoney('11.004', 'GBP', { showSymbol: false })).toBe('11.00')
    expect(formatMoney('11.005', 'GBP', { showSymbol: false })).toBe('11.01')
  })
})
