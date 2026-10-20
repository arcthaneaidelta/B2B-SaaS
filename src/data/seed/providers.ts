import type { FeeRule, Provider, TxType } from '../../engine/types'
import { SEED_NOW, DAY } from '../../mock/clock'

export const PROVIDERS: Provider[] = [
  { id: 'wise', slug: 'wise', name: 'Wise', monogram: 'W', type: 'fintech', typeLabel: 'Fintech', fictional: false, status: 'active', description: 'Multi-currency account and card that converts at the mid-market rate and charges a visible percentage fee.', updatedAt: SEED_NOW - 12 * DAY },
  { id: 'revolut', slug: 'revolut', name: 'Revolut', monogram: 'R', type: 'fintech', typeLabel: 'Fintech', fictional: false, status: 'active', description: 'App-based account with a monthly fee-free exchange allowance and a markup on weekends.', updatedAt: SEED_NOW - 8 * DAY },
  { id: 'metro', slug: 'metro-national', name: 'Metro National Bank', monogram: 'M', type: 'bank', typeLabel: 'Bank', fictional: true, status: 'active', description: 'A fictional high-street bank. Adds an exchange-rate margin to card spend and fixed fees on cash machines and transfers.', updatedAt: SEED_NOW - 30 * DAY },
  { id: 'harbour', slug: 'harbour-crown', name: 'Harbour & Crown Bank', monogram: 'H', type: 'bank', typeLabel: 'Bank', fictional: true, status: 'active', description: 'A fictional traditional bank with an exchange margin close to 3% and fixed fees on most foreign transactions.', updatedAt: SEED_NOW - 41 * DAY },
  { id: 'pocket', slug: 'pocket', name: 'Pocket', monogram: 'P', type: 'fintech', typeLabel: 'Fintech prepaid', fictional: true, status: 'active', description: 'A fictional prepaid travel card. Small spread, low ATM fees, but a per-withdrawal limit.', updatedAt: SEED_NOW - 6 * DAY },
  { id: 'terminal', slug: 'terminal-fx', name: 'Terminal FX', monogram: 'T', type: 'cash', typeLabel: 'Airport exchange desk', fictional: true, status: 'active', description: 'A fictional airport exchange desk, used as the worst-case baseline for cash.', updatedAt: SEED_NOW - 60 * DAY },
]

type RuleSeed = Partial<FeeRule> & { providerId: string; txType: TxType }
const base = (s: RuleSeed): FeeRule => ({
  id: `FR-${s.providerId.toUpperCase()}-${s.txType.toUpperCase()}`,
  offered: true,
  fxSpreadPct: '0.00',
  fixedFee: '0.00',
  pctFee: '0.00',
  minFee: null,
  maxFee: null,
  freeAllowance: '0',
  weekendMarkupPct: '0.00',
  maxPerTx: null,
  fixedAppliesAlways: true,
  effectiveFrom: '2026-06-01',
  version: 3,
  status: 'published',
  ...s,
  // B1: rules with an allowance only charge the fixed fee when chargeable > 0
  ...(s.freeAllowance && Number(s.freeAllowance) > 0 ? { fixedAppliesAlways: false } : {}),
})
const no = (providerId: string, txType: TxType, reason: string): FeeRule => base({ providerId, txType, offered: false, notOfferedReason: reason })

// PRD 11.2 - ILLUSTRATIVE, NOT LIVE PROVIDER PRICING. Money in GBP.
export const FEE_RULES: FeeRule[] = [
  base({ providerId: 'wise', txType: 'card', pctFee: '0.55', version: 7, effectiveFrom: '2026-10-19' }),
  base({ providerId: 'wise', txType: 'atm', freeAllowance: '200', pctFee: '1.75', fixedFee: '0.50', version: 5, effectiveFrom: '2026-08-01' }),
  base({ providerId: 'wise', txType: 'transfer', pctFee: '0.65', fixedFee: '0.30', version: 4, effectiveFrom: '2026-07-01' }),
  no('wise', 'cash', 'Wise does not exchange physical cash.'),

  base({ providerId: 'revolut', txType: 'card', freeAllowance: '1000', pctFee: '1.00', weekendMarkupPct: '1.00', version: 6, effectiveFrom: '2026-10-12' }),
  base({ providerId: 'revolut', txType: 'atm', freeAllowance: '200', pctFee: '2.00', version: 5, effectiveFrom: '2026-08-01' }),
  base({ providerId: 'revolut', txType: 'transfer', pctFee: '0.40', weekendMarkupPct: '1.00', version: 4, effectiveFrom: '2026-07-01' }),
  no('revolut', 'cash', 'Revolut does not exchange physical cash.'),

  base({ providerId: 'metro', txType: 'card', fxSpreadPct: '2.75', version: 3 }),
  base({ providerId: 'metro', txType: 'atm', fxSpreadPct: '2.75', fixedFee: '1.50', pctFee: '2.00', minFee: '3.00', version: 4, effectiveFrom: '2026-07-01' }),
  base({ providerId: 'metro', txType: 'transfer', fxSpreadPct: '3.10', fixedFee: '15.00', version: 3 }),
  base({ providerId: 'metro', txType: 'cash', fxSpreadPct: '4.00', version: 3 }),

  base({ providerId: 'harbour', txType: 'card', fxSpreadPct: '2.99', version: 3 }),
  base({ providerId: 'harbour', txType: 'atm', fxSpreadPct: '2.99', fixedFee: '2.00', pctFee: '1.50', version: 3 }),
  base({ providerId: 'harbour', txType: 'transfer', fxSpreadPct: '2.50', fixedFee: '20.00', version: 3 }),
  base({ providerId: 'harbour', txType: 'cash', fxSpreadPct: '4.50', version: 3 }),

  base({ providerId: 'pocket', txType: 'card', fxSpreadPct: '1.00', version: 4, effectiveFrom: '2026-09-01' }),
  base({ providerId: 'pocket', txType: 'atm', freeAllowance: '100', fixedFee: '1.00', pctFee: '1.00', maxPerTx: '1000', version: 4, effectiveFrom: '2026-09-01' }),
  no('pocket', 'transfer', 'Pocket is a prepaid card and cannot send bank transfers.'),
  no('pocket', 'cash', 'Pocket does not exchange physical cash.'),

  no('terminal', 'card', 'Terminal FX is a cash desk only.'),
  no('terminal', 'atm', 'Terminal FX is a cash desk only.'),
  no('terminal', 'transfer', 'Terminal FX is a cash desk only.'),
  base({ providerId: 'terminal', txType: 'cash', fxSpreadPct: '8.50', fixedFee: '4.00', version: 3 }),
]

/** Scheduled change published in v7, effective 1 Nov 2026 */
export const SCHEDULED_RULES: FeeRule[] = [
  { ...FEE_RULES.find((r) => r.id === 'FR-METRO-ATM')!, pctFee: '2.25', effectiveFrom: '2026-11-01', version: 7, status: 'scheduled' },
]

export const MATRIX_VERSION = 7

export interface MatrixVersion {
  version: number
  author: string
  at: number
  note: string
  changes: { ruleId: string; field: string; before: string; after: string }[]
  snapshot: FeeRule[]
}

const v6Snapshot = FEE_RULES.map((r) => (r.id === 'FR-WISE-CARD' ? { ...r, pctFee: '0.50', version: 6, effectiveFrom: '2026-10-12' } : r))
const v5Snapshot = v6Snapshot.map((r) => (r.id === 'FR-REVOLUT-CARD' ? { ...r, weekendMarkupPct: '0.50', version: 5, effectiveFrom: '2026-08-01' } : r))

export const MATRIX_HISTORY: MatrixVersion[] = [
  { version: 7, author: 'Daniel Okafor', at: SEED_NOW - 1 * DAY - 3 * 3600_000, note: 'Wise card fee aligned with published pricing page; Metro ATM change scheduled for 1 Nov.', changes: [{ ruleId: 'FR-WISE-CARD', field: 'pctFee', before: '0.50', after: '0.55' }, { ruleId: 'FR-METRO-ATM', field: 'pctFee (scheduled 1 Nov)', before: '2.00', after: '2.25' }], snapshot: FEE_RULES },
  { version: 6, author: 'Daniel Okafor', at: SEED_NOW - 8 * DAY, note: 'Revolut weekend markup raised to 1.00%.', changes: [{ ruleId: 'FR-REVOLUT-CARD', field: 'weekendMarkupPct', before: '0.50', after: '1.00' }], snapshot: v6Snapshot },
  { version: 5, author: 'Amara Qureshi', at: SEED_NOW - 81 * DAY, note: 'ATM allowances reviewed for Wise and Revolut.', changes: [{ ruleId: 'FR-WISE-ATM', field: 'freeAllowance', before: '250', after: '200' }], snapshot: v5Snapshot },
]
