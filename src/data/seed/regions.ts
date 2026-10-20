import type { Category, RegionRecord, RegionValues, Style, StyleValues } from '../../engine/types'
import { SEED_NOW, DAY } from '../../mock/clock'

// PRD 11.4 - Japan (Tokyo) reference, USD per room-night / per person-day. Illustrative.
export const JAPAN: Record<Style, Record<Category, number>> = {
  budget: { accommodation: 55, food: 28, transport: 10, activities: 10, extras: 6 },
  mid: { accommodation: 120, food: 55, transport: 18, activities: 25, extras: 15 },
  comfort: { accommodation: 220, food: 95, transport: 30, activities: 45, extras: 30 },
  luxury: { accommodation: 480, food: 210, transport: 75, activities: 110, extras: 80 },
}

const scale = (idx: number): RegionValues => {
  const out = {} as RegionValues
  for (const s of Object.keys(JAPAN) as Style[]) {
    const row = {} as StyleValues
    for (const c of Object.keys(JAPAN[s]) as Category[]) row[c] = Math.round(JAPAN[s][c] * idx)
    out[s] = row
  }
  return out
}

const SOURCE = 'Compiled from public tourism board averages and operator review - illustrative'

type D = [id: string, name: string, city: string, ccy: string, idx: number, cash: number, reviewed: string, by: string, conf: 'High' | 'Medium' | 'Low', publishedDaysAgo: number]
const DESTS: D[] = [
  ['japan', 'Japan', 'Tokyo', 'JPY', 1.0, 30, '2026-09-12', 'Amara Qureshi', 'High', 38],
  ['thailand', 'Thailand', 'Bangkok', 'THB', 0.62, 45, '2026-08-28', 'Daniel Okafor', 'High', 53],
  ['portugal', 'Portugal', 'Lisbon', 'EUR', 0.85, 15, '2026-09-30', 'Daniel Okafor', 'High', 20],
  ['uae', 'UAE', 'Dubai', 'AED', 1.2, 15, '2026-08-14', 'Amara Qureshi', 'Medium', 67],
  ['turkiye', 'Türkiye', 'Istanbul', 'TRY', 0.6, 35, '2026-05-18', 'Daniel Okafor', 'Low', 155],
  ['mexico', 'Mexico', 'Mexico City', 'MXN', 0.58, 40, '2026-07-02', 'Amara Qureshi', 'Medium', 110],
  ['singapore', 'Singapore', 'Singapore', 'SGD', 1.3, 10, '2026-09-03', 'Daniel Okafor', 'High', 47],
  ['morocco', 'Morocco', 'Marrakech', 'MAD', 0.5, 55, '2026-06-11', 'Amara Qureshi', 'Medium', 131],
]

export function seedRegions(): RegionRecord[] {
  return DESTS.map(([id, name, city, ccy, idx, cash, reviewed, by, conf, pubAgo]) => ({
    id,
    name,
    city,
    currency: ccy,
    costIndex: idx,
    cashSharePct: cash,
    values: scale(idx),
    draft: null,
    draftMeta: null,
    draftSavedAt: null,
    sourceNote: SOURCE,
    confidence: conf,
    lastReviewed: reviewed,
    reviewedBy: by,
    status: 'published',
    publishedAt: SEED_NOW - pubAgo * DAY,
    prevValues: id === 'japan' ? { ...scale(1), mid: { ...scale(1).mid, accommodation: 110 } } : null,
    version: id === 'japan' ? 4 : 3,
  }))
}

export const REVIEW_DUE_DAYS = 90
