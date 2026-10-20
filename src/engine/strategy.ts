import { Big, D, ZERO } from './money'
import { computeQuote } from './quote'
import type { CategoryBreakdown } from './trip'
import type { FeeRule, Provider, Quote, RateInfo, TxType } from './types'

export interface AllocationItem {
  name: string
  category?: string
  txType: TxType
  amountHome: string
}

export interface PlanItemBreakdown {
  label: string
  txType: TxType
  providerId: string
  providerName: string
  amountHome: string
  fxCostHome: string
  destAmount: string
  effectivePct: string
  quote: Quote
}

export interface PaymentPlan {
  id: 'optimised' | 'simple' | 'default'
  name: string
  tagline: string
  totalFxCostHome: string
  savingsVsDefaultHome: string
  items: PlanItemBreakdown[]
  providerCount: number
}

export interface StrategyCalculationInput {
  categories: CategoryBreakdown[]
  homeCcy: string
  destCcy: string
  cashSharePct: number
  providers: Provider[]
  rules: Record<string, FeeRule | undefined>
  rate: RateInfo | null
  ruleToHome: string
  weekend: boolean
}

export function computePaymentStrategy(input: StrategyCalculationInput): {
  plans: PaymentPlan[]
  allocations: AllocationItem[]
  cashSharePct: number
} {
  const { categories, homeCcy, destCcy, cashSharePct, providers, rules, rate, ruleToHome, weekend } = input

  let accomHome = ZERO
  let nonAccomHome = ZERO

  for (const c of categories) {
    if (c.category === 'accommodation') {
      accomHome = accomHome.plus(D(c.homeAmount))
    } else {
      nonAccomHome = nonAccomHome.plus(D(c.homeAmount))
    }
  }

  const cashShareFraction = D(cashSharePct).div(100)
  const atmAmount = nonAccomHome.times(cashShareFraction)
  const cardAmount = nonAccomHome.minus(atmAmount)

  const allocations: AllocationItem[] = []

  // Prepay threshold rule: if accommodation > 400 home currency, treat as prepay bank transfer; otherwise card
  const accomTxType: TxType = accomHome.gt(400) ? 'transfer' : 'card'
  if (accomHome.gt(0)) {
    allocations.push({
      name: accomTxType === 'transfer' ? 'Accommodation prepay' : 'Accommodation on card',
      category: 'accommodation',
      txType: accomTxType,
      amountHome: accomHome.toFixed(2),
    })
  }

  if (cardAmount.gt(0)) {
    allocations.push({
      name: 'Daily card spend (meals, transit, shopping)',
      txType: 'card',
      amountHome: cardAmount.toFixed(2),
    })
  }

  if (atmAmount.gt(0)) {
    allocations.push({
      name: 'Local cash withdrawals (cash machines)',
      txType: 'atm',
      amountHome: atmAmount.toFixed(2),
    })
  }

  // Helper to get quotes for a given bucket across all active providers
  function getQuotesForBucket(txType: TxType, amountHome: string): Quote[] {
    return providers
      .filter((p) => p.status === 'active')
      .map((p) => {
        const rule = rules[`${p.id}:${txType}`]
        return computeQuote({
          amountHome,
          homeCcy,
          destCcy,
          txType,
          provider: p,
          rule,
          rate,
          ruleToHome,
          weekend,
        })
      })
      .filter((q) => q.status === 'OK' && !q.overLimit)
  }

  // 1. Build Optimised Plan: best provider per allocation
  const optimisedItems: PlanItemBreakdown[] = []
  let optimisedTotalCost = ZERO

  for (const alloc of allocations) {
    const quotes = getQuotesForBucket(alloc.txType, alloc.amountHome)
    quotes.sort((a, b) => D(a.costHome).cmp(D(b.costHome)))
    const bestQuote = quotes[0]
    if (bestQuote) {
      const p = providers.find((prov) => prov.id === bestQuote.providerId)
      optimisedItems.push({
        label: alloc.name,
        txType: alloc.txType,
        providerId: bestQuote.providerId,
        providerName: p?.name ?? bestQuote.providerId,
        amountHome: alloc.amountHome,
        fxCostHome: bestQuote.costHome,
        destAmount: bestQuote.destAmount,
        effectivePct: bestQuote.effectivePct,
        quote: bestQuote,
      })
      optimisedTotalCost = optimisedTotalCost.plus(D(bestQuote.costHome))
    }
  }

  // 2. Default Bank Plan: choose a traditional bank like Harbour & Crown (or Metro National)
  const defaultBankProvider = providers.find((p) => p.id === 'harbour') || providers.find((p) => p.id === 'metro') || providers[0]
  const defaultItems: PlanItemBreakdown[] = []
  let defaultTotalCost = ZERO

  for (const alloc of allocations) {
    const rule = rules[`${defaultBankProvider.id}:${alloc.txType}`]
    const q = computeQuote({
      amountHome: alloc.amountHome,
      homeCcy,
      destCcy,
      txType: alloc.txType,
      provider: defaultBankProvider,
      rule,
      rate,
      ruleToHome,
      weekend,
    })
    defaultItems.push({
      label: alloc.name,
      txType: alloc.txType,
      providerId: defaultBankProvider.id,
      providerName: defaultBankProvider.name,
      amountHome: alloc.amountHome,
      fxCostHome: q.costHome,
      destAmount: q.destAmount,
      effectivePct: q.effectivePct,
      quote: q,
    })
    defaultTotalCost = defaultTotalCost.plus(D(q.costHome))
  }

  // 3. Simple Plan: pick the single best fintech provider (Wise or Revolut) that can cover the trip
  const fintechProviders = providers.filter((p) => p.type === 'fintech' && p.status === 'active')
  let bestSimpleProvider = fintechProviders[0] || providers[0]
  let lowestSimpleCost = new Big(99999999)
  let bestSimpleItems: PlanItemBreakdown[] = []

  for (const fp of fintechProviders) {
    let candidateCost = ZERO
    const candidateItems: PlanItemBreakdown[] = []
    let viable = true

    for (const alloc of allocations) {
      const rule = rules[`${fp.id}:${alloc.txType}`]
      const q = computeQuote({
        amountHome: alloc.amountHome,
        homeCcy,
        destCcy,
        txType: alloc.txType,
        provider: fp,
        rule,
        rate,
        ruleToHome,
        weekend,
      })
      if (q.status !== 'OK' || q.overLimit) {
        viable = false
        break
      }
      candidateItems.push({
        label: alloc.name,
        txType: alloc.txType,
        providerId: fp.id,
        providerName: fp.name,
        amountHome: alloc.amountHome,
        fxCostHome: q.costHome,
        destAmount: q.destAmount,
        effectivePct: q.effectivePct,
        quote: q,
      })
      candidateCost = candidateCost.plus(D(q.costHome))
    }

    if (viable && candidateCost.lt(lowestSimpleCost)) {
      lowestSimpleCost = candidateCost
      bestSimpleProvider = fp
      bestSimpleItems = candidateItems
    }
  }

  if (bestSimpleItems.length === 0) {
    bestSimpleItems = defaultItems
    lowestSimpleCost = defaultTotalCost
  }

  const optProviderSet = new Set(optimisedItems.map((i) => i.providerId))

  const plans: PaymentPlan[] = [
    {
      id: 'optimised',
      name: 'Optimised multi-provider plan',
      tagline: 'Best rate and lowest fee for each specific expense type.',
      totalFxCostHome: optimisedTotalCost.toFixed(2),
      savingsVsDefaultHome: defaultTotalCost.minus(optimisedTotalCost).toFixed(2),
      items: optimisedItems,
      providerCount: optProviderSet.size,
    },
    {
      id: 'simple',
      name: `Single card (${bestSimpleProvider.name})`,
      tagline: 'Convenient single wallet with low fees on all daily transactions.',
      totalFxCostHome: lowestSimpleCost.toFixed(2),
      savingsVsDefaultHome: defaultTotalCost.minus(lowestSimpleCost).toFixed(2),
      items: bestSimpleItems,
      providerCount: 1,
    },
    {
      id: 'default',
      name: `Traditional bank (${defaultBankProvider.name})`,
      tagline: 'Baseline cost of using a high-street bank debit or credit card abroad.',
      totalFxCostHome: defaultTotalCost.toFixed(2),
      savingsVsDefaultHome: '0.00',
      items: defaultItems,
      providerCount: 1,
    },
  ]

  return {
    plans,
    allocations,
    cashSharePct,
  }
}
