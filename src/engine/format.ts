import { CURRENCIES } from '../data/seed/currencies'
import { D, roundMinor } from './money'

/**
 * Format an amount in currency with proper symbol, minor units, and thousands separators.
 * Display-only rounding (half-up) per PRD Section 10.0 and Addendum B8.
 */
export function formatMoney(
  amount: string | number | null | undefined,
  currencyCode = 'GBP',
  options: { showSymbol?: boolean; showCode?: boolean } = {}
): string {
  if (amount === null || amount === undefined || amount === '') return '-'
  const cur = CURRENCIES[currencyCode] || { code: currencyCode, symbol: currencyCode, minor: 2, locale: 'en-GB' }

  const bigVal = D(amount)
  const rounded = roundMinor(bigVal, cur.minor)
  const numVal = Number(rounded.toString())

  const formattedNum = new Intl.NumberFormat(cur.locale || 'en-GB', {
    minimumFractionDigits: cur.minor,
    maximumFractionDigits: cur.minor,
  }).format(numVal)

  const showSym = options.showSymbol !== false
  const showCod = options.showCode === true

  if (showCod && showSym) {
    return `${cur.code} ${formattedNum}`
  }
  if (showSym) {
    // If currency symbol is e.g. "£", "$", "¥"
    if (['£', '$', '€', '¥', '฿', '₹'].includes(cur.symbol)) {
      return `${cur.symbol}${formattedNum}`
    }
    return `${cur.symbol} ${formattedNum}`
  }
  if (showCod) {
    return `${formattedNum} ${cur.code}`
  }
  return formattedNum
}

export function formatPct(percent: string | number | null | undefined): string {
  if (percent === null || percent === undefined || percent === '') return '0.00%'
  const n = D(percent).round(2).toFixed(2)
  return `${n}%`
}

export function formatRate(rate: string | number | null | undefined, maxDp = 4): string {
  if (rate === null || rate === undefined || rate === '') return '-'
  const d = D(rate)
  return d.toFixed(maxDp).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
}
