import Big from 'big.js'

// PRD 10.0 / B8: 12 dp intermediate precision, half-up rounding, applied ONLY at display.
Big.DP = 12
Big.RM = Big.roundHalfUp

export type Dec = Big
export { Big }

export const D = (v: Big.BigSource | null | undefined): Big => {
  if (v === null || v === undefined || v === '') return new Big(0)
  return new Big(v)
}

export const ZERO = new Big(0)
export const ONE = new Big(1)
export const HUNDRED = new Big(100)

/** Percent string ("0.55") -> fraction Big (0.0055) */
export const pct = (p: Big.BigSource | null | undefined): Big => D(p).div(HUNDRED)

export const maxB = (a: Big, b: Big) => (a.gt(b) ? a : b)
export const minB = (a: Big, b: Big) => (a.lt(b) ? a : b)

/** Round to currency minor units, half-up. Display only. */
export const roundMinor = (v: Big, minor: number) => v.round(minor, Big.roundHalfUp)

/** Parse user text like "2,500.50" -> Big or null if invalid. */
export function parseAmount(text: string): Big | null {
  const cleaned = text.replace(/[,\s]/g, '')
  if (cleaned === '' || !/^-?\d*\.?\d*$/.test(cleaned) || cleaned === '.' || cleaned === '-') return null
  try {
    return new Big(cleaned)
  } catch {
    return null
  }
}

export const isValidBig = (s: string) => parseAmount(s) !== null
