export type TxType = 'card' | 'atm' | 'transfer' | 'cash'
export const TX_TYPES: TxType[] = ['card', 'atm', 'transfer', 'cash']
export const TX_LABEL: Record<TxType, string> = {
  card: 'Card spend',
  atm: 'Cash machine (ATM)',
  transfer: 'Bank transfer',
  cash: 'Cash exchange',
}
export const TX_SHORT: Record<TxType, string> = { card: 'Card spend', atm: 'Cash machine', transfer: 'Bank transfer', cash: 'Cash exchange' }
export const TX_TINY: Record<TxType, string> = { card: 'Card', atm: 'ATM', transfer: 'Transfer', cash: 'Cash' }

export type ProviderType = 'fintech' | 'bank' | 'cash'
export const PROVIDER_TYPE_LABEL: Record<ProviderType, string> = { fintech: 'Fintech', bank: 'Bank', cash: 'Cash desk' }

export interface Currency {
  code: string
  name: string
  symbol: string
  minor: number
  locale: string
}

export interface Provider {
  id: string
  slug: string
  name: string
  monogram: string
  type: ProviderType
  typeLabel: string
  fictional: boolean
  status: 'active' | 'paused' | 'draft'
  description: string
  updatedAt: number
}

/** Fee rule. Money fields are strings in the RULE currency (GBP); percents are percent strings. */
export interface FeeRule {
  id: string // FR-WISE-CARD
  providerId: string
  txType: TxType
  offered: boolean
  notOfferedReason?: string
  fxSpreadPct: string
  fixedFee: string
  pctFee: string
  minFee: string | null
  maxFee: string | null
  freeAllowance: string
  weekendMarkupPct: string
  maxPerTx: string | null
  fixedAppliesAlways: boolean
  effectiveFrom: string // ISO date
  version: number
  status: 'published' | 'draft' | 'scheduled'
}

export const RULE_CCY = 'GBP'

export type Style = 'budget' | 'mid' | 'comfort' | 'luxury'
export const STYLES: Style[] = ['budget', 'mid', 'comfort', 'luxury']
export const STYLE_LABEL: Record<Style, string> = { budget: 'Budget', mid: 'Mid-range', comfort: 'Comfort', luxury: 'Luxury' }
export const STYLE_CAPTION: Record<Style, string> = {
  budget: 'Hostels and simple stays, street food, public transport.',
  mid: 'Three-star stays, sit-down meals, metro and the odd taxi.',
  comfort: 'Four-star stays, good restaurants, private transfers where useful.',
  luxury: 'Five-star stays, fine dining, private drivers.',
}

export type Category = 'accommodation' | 'food' | 'transport' | 'activities' | 'extras'
export const CATEGORIES: Category[] = ['accommodation', 'food', 'transport', 'activities', 'extras']
export const CATEGORY_LABEL: Record<Category, string> = {
  accommodation: 'Accommodation',
  food: 'Food',
  transport: 'Transport',
  activities: 'Activities',
  extras: 'Shopping and extras',
}
export const CATEGORY_UNIT: Record<Category, string> = {
  accommodation: 'per room-night',
  food: 'per person-day',
  transport: 'per person-day',
  activities: 'per person-day',
  extras: 'per person-day',
}

export type StyleValues = Record<Category, number | null>
export type RegionValues = Record<Style, StyleValues>

export interface RegionRecord {
  id: string // slug
  name: string
  city: string
  currency: string
  costIndex: number
  cashSharePct: number
  values: RegionValues // published, USD reference
  draft: RegionValues | null
  draftMeta: { sourceNote: string; confidence: Confidence; cashSharePct: number } | null
  draftSavedAt: number | null
  sourceNote: string
  confidence: Confidence
  lastReviewed: string // ISO date
  reviewedBy: string
  status: 'published' | 'draft'
  publishedAt: number // mock ms
  prevValues: RegionValues | null
  version: number
}
export type Confidence = 'High' | 'Medium' | 'Low'

export type QuoteStatus = 'OK' | 'NOT_OFFERED' | 'AMOUNT_BELOW_FEES' | 'INVALID_AMOUNT' | 'NO_RATE' | 'PAUSED'

export interface TraceStep {
  step: number
  key: string
  label: string
  formula: string
  inputs: string
  output: string
}

export interface WaterfallStep {
  key: 'ideal' | 'rateDiff' | 'spread' | 'weekend' | 'fixed' | 'percentage' | 'receive'
  label: string
  dest: string // destination currency, positive magnitude (unrounded)
  home: string // home equivalent at reference mid
  note?: string
}

export interface RateInfo {
  pair: string // "GBP/JPY" or cross "USD/JPY"
  rate: number // numerical rate for calculations
  refRate: string // reference mid used to measure cost
  baseRate: string // rate spread is applied to (override for selected providers)
  overrideActive: boolean
  overrideId?: string
  overrideExpiresAt?: number
  source: string
  fetchedAt: number
  freshness: 'fresh' | 'ageing' | 'stale'
}

export interface Quote {
  status: QuoteStatus
  providerId: string
  txType: TxType
  amountHome: string
  homeCcy: string
  destCcy: string
  appliedRate: string
  feeHome: string
  netHome: string
  destAmount: string
  idealDest: string
  lossDest: string
  costHome: string
  effectivePct: string // percent, e.g. "0.55"
  overLimit: boolean
  weekendApplied: boolean
  feeClamped: 'min' | 'max' | null
  ruleId?: string
  ruleVersion?: number
  ruleEffectiveFrom?: string
  reason?: string
  rate?: RateInfo
  trace: TraceStep[]
  waterfall: WaterfallStep[]
}
