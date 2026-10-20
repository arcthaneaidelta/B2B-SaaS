import { Big, D, ZERO } from './money'
import type { Category, RegionRecord, Style } from './types'

export interface TripInput {
  region: RegionRecord
  nights: number
  travellers: number
  style: Style
  activeCategories: Category[]
  customAmountsHome?: Partial<Record<Category, string>> // manual category override
  // FX conversion rates:
  // usdToDest: units of destination currency per 1 USD
  // homeToDest: units of destination currency per 1 Home ccy
  usdToDest: string
  homeToDest: string
}

export interface CategoryBreakdown {
  category: Category
  usdAmount: string
  destAmount: string
  homeAmount: string
  perDayHome: string
  isCustom: boolean
  unitPriceUsd: number
  unitLabel: string
}

export interface TripSimulationResult {
  categories: CategoryBreakdown[]
  totalHome: string
  totalDest: string
  totalUsd: string
  perDayHome: string
  daysCount: number
  roomsCount: number
}

export function simulateTripCosts(input: TripInput): TripSimulationResult {
  const { region, nights, travellers, style, activeCategories, customAmountsHome, usdToDest, homeToDest } = input

  const days = Math.max(1, nights + 1)
  const rooms = Math.ceil(Math.max(1, travellers) / 2)
  const rateUsdToDest = D(usdToDest)
  const rateHomeToDest = D(homeToDest)

  const styleValues = region.values[style]
  const breakdown: CategoryBreakdown[] = []

  let totalHomeBig = ZERO
  let totalDestBig = ZERO
  let totalUsdBig = ZERO

  for (const cat of activeCategories) {
    const unitPrice = styleValues[cat] ?? 0
    let catUsd: Big
    let catDest: Big
    let catHome: Big
    let isCustom = false

    if (customAmountsHome && customAmountsHome[cat]) {
      isCustom = true
      catHome = D(customAmountsHome[cat])
      catDest = catHome.times(rateHomeToDest)
      catUsd = rateUsdToDest.gt(0) ? catDest.div(rateUsdToDest) : ZERO
    } else {
      if (cat === 'accommodation') {
        catUsd = D(unitPrice).times(nights).times(rooms)
      } else {
        catUsd = D(unitPrice).times(days).times(travellers)
      }
      catDest = catUsd.times(rateUsdToDest)
      catHome = rateHomeToDest.gt(0) ? catDest.div(rateHomeToDest) : ZERO
    }

    const perDay = catHome.div(days)

    totalHomeBig = totalHomeBig.plus(catHome)
    totalDestBig = totalDestBig.plus(catDest)
    totalUsdBig = totalUsdBig.plus(catUsd)

    breakdown.push({
      category: cat,
      usdAmount: catUsd.toFixed(2),
      destAmount: catDest.toFixed(2),
      homeAmount: catHome.toFixed(2),
      perDayHome: perDay.toFixed(2),
      isCustom,
      unitPriceUsd: unitPrice,
      unitLabel: cat === 'accommodation' ? 'per room-night' : 'per person-day',
    })
  }

  const perDayOverall = totalHomeBig.div(days)

  return {
    categories: breakdown,
    totalHome: totalHomeBig.toFixed(2),
    totalDest: totalDestBig.toFixed(2),
    totalUsd: totalUsdBig.toFixed(2),
    perDayHome: perDayOverall.toFixed(2),
    daysCount: days,
    roomsCount: rooms,
  }
}
