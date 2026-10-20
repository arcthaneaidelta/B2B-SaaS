import { SEED_NOW, DAY } from '../../mock/clock'
import type { Category, Style } from '../../engine/types'

export interface SavedTrip {
  id: string
  name: string
  destinationId: string
  homeCcy: string
  nights: number
  travellers: number
  style: Style
  categories: Category[]
  startDate?: string
  customCategoryAmounts?: Partial<Record<Category, string>>
  selectedPlanId?: 'optimised' | 'simple' | 'default'
  cashShareOverride?: number
  savedAt: number
  totalHome: string
  fxCostHome: string
}

export const SEED_TRIPS: SavedTrip[] = [
  {
    id: 'tokyo-10n-comfort',
    name: 'Tokyo autumn trip',
    destinationId: 'japan',
    homeCcy: 'GBP',
    nights: 10,
    travellers: 2,
    style: 'comfort',
    categories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
    startDate: '2026-11-06',
    selectedPlanId: 'optimised',
    savedAt: SEED_NOW - 2 * DAY,
    totalHome: '4925.00',
    fxCostHome: '33.80',
  },
  {
    id: 'lisbon-weekend-budget',
    name: 'Lisbon long weekend',
    destinationId: 'portugal',
    homeCcy: 'GBP',
    nights: 3,
    travellers: 1,
    style: 'budget',
    categories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
    startDate: '2026-11-13',
    selectedPlanId: 'optimised',
    savedAt: SEED_NOW - 5 * DAY,
    totalHome: '385.00',
    fxCostHome: '4.20',
  },
  {
    id: 'bangkok-14n-mid',
    name: 'Bangkok remote working sprint',
    destinationId: 'thailand',
    homeCcy: 'GBP',
    nights: 14,
    travellers: 2,
    style: 'mid',
    categories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
    startDate: '2026-12-01',
    selectedPlanId: 'optimised',
    savedAt: SEED_NOW - 9 * DAY,
    totalHome: '2140.00',
    fxCostHome: '18.60',
  },
]
