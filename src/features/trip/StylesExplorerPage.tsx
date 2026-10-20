import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, ArrowRight } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { simulateTripCosts } from '../../engine/trip'
import { formatMoney } from '../../engine/format'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { STYLES, STYLE_LABEL, STYLE_CAPTION, type Style } from '../../engine/types'

const STYLES_TRAITS: Record<Style, { accommodation: string; food: string; transit: string; activities: string }> = {
  budget: {
    accommodation: 'Dorm bed or capsule hostel with shared bathroom.',
    food: 'Local street food, convenience stores (7-Eleven/FamilyMart), self-cook.',
    transit: 'Metros, local trains, walking.',
    activities: 'Free walking tours, public parks, temples, viewpoints.',
  },
  mid: {
    accommodation: 'Private serviced studio or 3-star hotel with WiFi.',
    food: 'Mid-range neighborhood cafes, mix of local bistros and casual dining.',
    transit: 'Public transit with occasional rideshares / scooters.',
    activities: 'Museum passes, weekend day-trips, self-guided excursions.',
  },
  comfort: {
    accommodation: 'Comfortable 4-star reputable hotel or boutique apartment.',
    food: 'Full sit-down dining, hotel breakfast, evening drinks.',
    transit: 'Express airport rail, pre-booked taxi transfers.',
    activities: 'Guided cultural tours, skip-the-line admissions.',
  },
  luxury: {
    accommodation: 'Five-star luxury resort or suite with executive privileges.',
    food: 'Fine dining, Michelin-starred bistros, chef omakase.',
    transit: 'Private chauffeur, premier taxi services, first-class rail.',
    activities: 'Private guides, VIP lounge access, chartered day-trips.',
  },
}

export const StylesExplorerPage: React.FC = () => {
  const navigate = useNavigate()
  const state = useStore()
  const { regions, prefs } = state
  const [selectedRegionId, setSelectedRegionId] = useState('japan')

  const region = regions.find((r) => r.id === selectedRegionId) || regions[0]
  const rateInfo = getRateInfo(state, prefs.homeCcy, region.currency)
  const homeToDest = rateInfo ? Number(rateInfo.refRate) : 196.4

  const handleLaunchStyle = (style: Style) => {
    navigate(`/trip/wizard?destination=${region.id}&style=${style}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-mono font-medium">
          <Compass className="w-3.5 h-3.5" /> Empirical Spending Personas
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
          Travel Styles & Spending Personas
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Relziwallet doesn't rely on generic guesses. We calibrate our budgeting models against four distinct spending personas, calculated from local market indexes.
        </p>

        {/* Region Selector */}
        <div className="inline-flex items-center gap-3 p-2 bg-surface border border-border rounded-xl shadow-sm text-xs font-mono mt-4">
          <span className="text-text-muted uppercase pl-2">Preview in Destination:</span>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="bg-sunken border border-divider rounded-lg px-3 py-1.5 font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-pine-500 cursor-pointer"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.city}, {r.name} ({r.currency})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STYLES.map((style) => {
          const sim = simulateTripCosts({
            region,
            nights: 7,
            travellers: 1,
            style,
            activeCategories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
            usdToDest: '1.0',
            homeToDest: String(homeToDest),
          })

          const traits = STYLES_TRAITS[style]

          return (
            <div
              key={style}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-pine-500 transition-all hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-ink font-semibold">{STYLE_LABEL[style]}</h3>
                  <Chip variant={style === 'comfort' ? 'pine' : 'neutral'} size="sm">
                    {style === 'comfort' ? 'Most Popular' : 'Persona'}
                  </Chip>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {STYLE_CAPTION[style]}
                </p>

                {/* 7-day Cost in local destination currency */}
                <div className="p-3 bg-sunken rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-text-muted uppercase">7-Day Estimate</span>
                  <div className="text-xl font-mono font-bold text-pine-700">
                    {formatMoney(sim.totalDest, region.currency)}
                  </div>
                  <div className="text-[11px] font-mono text-text-muted">
                    ≈ {formatMoney(sim.totalHome, prefs.homeCcy)} in {prefs.homeCcy}
                  </div>
                </div>

                {/* Itemized Traits */}
                <div className="space-y-2.5 text-xs text-text-secondary border-t border-divider pt-4">
                  <div>
                    <strong className="text-text-primary block text-[11px]">Stay:</strong>
                    <span>{traits.accommodation}</span>
                  </div>
                  <div>
                    <strong className="text-text-primary block text-[11px]">Food:</strong>
                    <span>{traits.food}</span>
                  </div>
                  <div>
                    <strong className="text-text-primary block text-[11px]">Transit:</strong>
                    <span>{traits.transit}</span>
                  </div>
                  <div>
                    <strong className="text-text-primary block text-[11px]">Leisure:</strong>
                    <span>{traits.activities}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-divider mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleLaunchStyle(style)}
                  className="w-full gap-2 text-xs font-mono hover:bg-pine-50 hover:border-pine-500"
                >
                  <span>Build Trip ({STYLE_LABEL[style]})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Methodology Callout */}
      <div className="bg-sunken border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h3 className="font-display text-lg text-ink font-semibold">How Multipliers Are Maintained</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Our Regional Content Management System continuously audits local accommodation and daily basket indices across 8 benchmark global cities. You can view or adjust raw assumptions inside our transparent methodology book.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/methodology')} className="shrink-0 text-xs font-mono">
          View Calculation Methodology
        </Button>
      </div>
    </div>
  )
}
