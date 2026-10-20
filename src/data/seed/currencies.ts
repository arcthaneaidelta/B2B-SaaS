import type { Currency } from '../../engine/types'

export const CURRENCIES: Record<string, Currency> = {
  GBP: { code: 'GBP', name: 'British pound', symbol: '£', minor: 2, locale: 'en-GB' },
  USD: { code: 'USD', name: 'US dollar', symbol: '$', minor: 2, locale: 'en-US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', minor: 2, locale: 'en-IE' },
  JPY: { code: 'JPY', name: 'Japanese yen', symbol: '¥', minor: 0, locale: 'ja-JP' },
  THB: { code: 'THB', name: 'Thai baht', symbol: '฿', minor: 2, locale: 'th-TH' },
  AED: { code: 'AED', name: 'UAE dirham', symbol: 'AED', minor: 2, locale: 'en-AE' },
  TRY: { code: 'TRY', name: 'Turkish lira', symbol: '₺', minor: 2, locale: 'tr-TR' },
  MXN: { code: 'MXN', name: 'Mexican peso', symbol: '$', minor: 2, locale: 'es-MX' },
  SGD: { code: 'SGD', name: 'Singapore dollar', symbol: 'S$', minor: 2, locale: 'en-SG' },
  MAD: { code: 'MAD', name: 'Moroccan dirham', symbol: 'MAD', minor: 2, locale: 'fr-MA' },
  PKR: { code: 'PKR', name: 'Pakistani rupee', symbol: 'Rs', minor: 2, locale: 'en-PK' },
  INR: { code: 'INR', name: 'Indian rupee', symbol: '₹', minor: 2, locale: 'en-IN' },
}

export const HOME_CURRENCIES = ['GBP', 'USD', 'EUR', 'AED', 'PKR', 'INR']
export const DEST_CURRENCIES = ['JPY', 'THB', 'EUR', 'AED', 'TRY', 'MXN', 'SGD', 'MAD', 'USD', 'GBP', 'INR', 'PKR']
export const ALL_CURRENCY_CODES = Object.keys(CURRENCIES)
