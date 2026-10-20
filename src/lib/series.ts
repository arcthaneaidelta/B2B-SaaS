// Deterministic seeded random walks so the demo looks identical on every load (PRD 11.1).
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Random walk of `points` values that ENDS exactly at `end`, with per-step volatility `vol` (fraction).
 * Built backwards so the latest point equals the current rate. Display-only (not money math).
 */
export function walkTo(seedKey: string, end: number, points: number, vol: number, drift = 0): number[] {
  const rnd = mulberry32(hashString(seedKey))
  const out = new Array<number>(points)
  out[points - 1] = end
  for (let i = points - 2; i >= 0; i--) {
    const shock = (rnd() - 0.5) * 2 * vol + drift
    out[i] = out[i + 1] * (1 - shock)
  }
  return out
}

export type Range = '24h' | '7d' | '30d'
export const RANGE_POINTS: Record<Range, number> = { '24h': 48, '7d': 84, '30d': 90 }
export const RANGE_STEP_MS: Record<Range, number> = { '24h': 30 * 60_000, '7d': 2 * 3600_000, '30d': 8 * 3600_000 }
const RANGE_VOL: Record<Range, number> = { '24h': 0.0009, '7d': 0.0018, '30d': 0.0032 }

export function rateSeries(pair: string, end: number, range: Range): number[] {
  return walkTo(`${pair}:${range}`, end, RANGE_POINTS[range], RANGE_VOL[range], range === '30d' ? 0.0002 : 0)
}

/** The "rate line" visual device: a long seeded walk, normalised 0..1 */
export function rateLineSeries(seedKey: string, points: number): number[] {
  const rnd = mulberry32(hashString(seedKey))
  const vals: number[] = []
  let v = 0.5
  let vel = 0
  for (let i = 0; i < points; i++) {
    vel = vel * 0.86 + (rnd() - 0.5) * 0.05
    v = Math.min(0.92, Math.max(0.08, v + vel))
    vals.push(v)
  }
  return vals
}

export function nextRateLinePoint(rnd: () => number, prev: number, vel: number): [number, number] {
  const nv = vel * 0.86 + (rnd() - 0.5) * 0.05
  return [Math.min(0.92, Math.max(0.08, prev + nv)), nv]
}
