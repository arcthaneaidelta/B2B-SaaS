// PRD 24.5 / B9: mockNow() starts at 20 Oct 2026 09:46 local and ticks with real elapsed time.
// The anchor is persisted so relative labels ("3 min ago") stay coherent across reloads.
export const SEED_NOW = new Date(2026, 9, 20, 9, 46, 0).getTime()
const ANCHOR_KEY = 'rw-clock-anchor'

let anchor: number = (() => {
  if (typeof window === 'undefined') return Date.now()
  try {
    const v = window.localStorage.getItem(ANCHOR_KEY)
    if (v) return Number(v)
    const now = Date.now()
    window.localStorage.setItem(ANCHOR_KEY, String(now))
    return now
  } catch {
    return Date.now()
  }
})()

export function mockNow(): number {
  return SEED_NOW + (Date.now() - anchor)
}

export function resetClock() {
  anchor = Date.now()
  try {
    window.localStorage.setItem(ANCHOR_KEY, String(anchor))
  } catch {
    /* ignore */
  }
}

/** For tests */
export function setClockAnchor(a: number) {
  anchor = a
}

export const MIN = 60_000
export const HOUR = 60 * MIN
export const DAY = 24 * HOUR
