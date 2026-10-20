import { SEED_NOW, MIN, DAY, HOUR } from '../../mock/clock'

export interface FxPair {
  pair: string // GBP/JPY
  quote: string // JPY
  rate: string
  change24hPct: string
  source: 'Primary feed (mock)' | 'Secondary feed (mock)'
  fetchedAt: number
  ttlMin: number
  autoRefresh: boolean
  events: { at: number; rate: string; ok: boolean; note: string }[]
}

const seed: [string, string, string, string, number][] = [
  // quote, rate, 24h change %, source, minutes ago
  ['USD', '1.3400', '0.12', 'P', 2],
  ['EUR', '1.1500', '-0.08', 'P', 2],
  ['JPY', '196.40', '0.31', 'P', 3],
  ['THB', '44.60', '0.05', 'P', 4],
  ['AED', '4.9200', '0.11', 'P', 2],
  ['TRY', '56.80', '0.42', 'S', 7],
  ['MXN', '24.30', '-0.27', 'P', 4],
  ['SGD', '1.7300', '0.03', 'P', 3],
  ['MAD', '12.45', '-0.06', 'S', 4],
  ['PKR', '373.00', '0.09', 'S', 4],
  ['INR', '111.50', '0.14', 'P', 2],
]

export function seedFxPairs(now = SEED_NOW): FxPair[] {
  return seed.map(([quote, rate, ch, src, ago]) => ({
    pair: `GBP/${quote}`,
    quote,
    rate,
    change24hPct: ch,
    source: src === 'P' ? 'Primary feed (mock)' : 'Secondary feed (mock)',
    fetchedAt: now - ago * MIN,
    ttlMin: 5,
    autoRefresh: true,
    events: [
      { at: now - ago * MIN, rate, ok: true, note: 'Scheduled refresh' },
      { at: now - ago * MIN - 5 * MIN, rate, ok: true, note: 'Scheduled refresh' },
      { at: now - ago * MIN - 10 * MIN, rate, ok: true, note: 'Scheduled refresh' },
    ],
  }))
}

export interface Override {
  id: string
  pair: string
  rate: string
  liveRateAtCreation: string
  appliesTo: 'all' | string[]
  reason: string
  createdBy: string
  createdByRole: string
  approver: string
  createdAt: number
  expiresAt: number
  status: 'active' | 'expired' | 'revoked'
  endedAt?: number
}

export const OVERRIDE_HISTORY: Override[] = [
  { id: 'OVR-0418', pair: 'GBP/MXN', rate: '24.10', liveRateAtCreation: '24.30', appliesTo: 'all', reason: 'Feed lag during central bank announcement', createdBy: 'Amara Qureshi', createdByRole: 'Admin', approver: 'Amara Qureshi', createdAt: SEED_NOW - 2 * DAY - 4 * HOUR, expiresAt: SEED_NOW - 2 * DAY, status: 'expired', endedAt: SEED_NOW - 2 * DAY },
  { id: 'OVR-0411', pair: 'GBP/JPY', rate: '190.00', liveRateAtCreation: '196.40', appliesTo: 'all', reason: 'Manual correction while primary feed lags', createdBy: 'Amara Qureshi', createdByRole: 'Admin', approver: 'Daniel Okafor', createdAt: SEED_NOW - 5 * DAY - 4 * HOUR, expiresAt: SEED_NOW - 5 * DAY, status: 'expired', endedAt: SEED_NOW - 5 * DAY },
  { id: 'OVR-0397', pair: 'GBP/TRY', rate: '56.10', liveRateAtCreation: '55.90', appliesTo: ['metro', 'harbour'], reason: 'Bank feed published a stale close; aligning to desk rate', createdBy: 'Daniel Okafor', createdByRole: 'Editor', approver: 'Amara Qureshi', createdAt: SEED_NOW - 12 * DAY, expiresAt: SEED_NOW - 12 * DAY + 24 * HOUR, status: 'revoked', endedAt: SEED_NOW - 12 * DAY + 6 * HOUR },
]
