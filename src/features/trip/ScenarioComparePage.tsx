import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingDown, TrendingUp, Sparkles } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { simulateTripCosts } from '../../engine/trip'
import { computeQuote } from '../../engine/quote'
import { formatMoney } from '../../engine/format'
import { MoneyValue } from '../../components/domain/MoneyValue'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { STYLES, STYLE_LABEL, type Style } from '../../engine/types'
import { useToast } from '../../components/ui/Toast'

export const ScenarioComparePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const state = useStore()
  const { savedTrips, regions, providers } = state

  const originalTrip = savedTrips.find((t) => t.id === id) || savedTrips[0]
  const region = regions.find((r) => r.id === originalTrip.destinationId) || regions[0]

  // Alternative scenario parameters state
  const [altStyle, setAltStyle] = useState<Style>(
    originalTrip.style === 'mid' ? 'budget' : 'luxury'
  )
  const [altNights, setAltNights] = useState(originalTrip.nights)
  const [altTravellers, setAltTravellers] = useState(originalTrip.travellers)

  const bestProvider = providers[0]
  const rateInfo = getRateInfo(state, originalTrip.homeCcy, region.currency)
  const homeToDest = rateInfo ? rateInfo.refRate : '196.40'

  // Simulation 1: Baseline / Current
  const baseSim = simulateTripCosts({
    region,
    nights: originalTrip.nights,
    travellers: originalTrip.travellers,
    style: originalTrip.style,
    activeCategories: originalTrip.categories,
    usdToDest: '1.0',
    homeToDest,
  })

  const rule = state.feeRules.find((r) => r.providerId === bestProvider.id && r.txType === 'card')
  const baseQuote = computeQuote({
    amountHome: baseSim.totalHome || '1000',
    homeCcy: originalTrip.homeCcy,
    destCcy: region.currency,
    txType: 'card',
    provider: bestProvider,
    rule,
    rate: rateInfo,
    ruleToHome: '1',
    weekend: false,
  })

  // Simulation 2: Alternative Scenario
  const altSim = simulateTripCosts({
    region,
    nights: altNights,
    travellers: altTravellers,
    style: altStyle,
    activeCategories: originalTrip.categories,
    usdToDest: '1.0',
    homeToDest,
  })

  const altQuote = computeQuote({
    amountHome: altSim.totalHome || '1000',
    homeCcy: originalTrip.homeCcy,
    destCcy: region.currency,
    txType: 'card',
    provider: bestProvider,
    rule,
    rate: rateInfo,
    ruleToHome: '1',
    weekend: false,
  })

  const homeDiff = parseFloat(altSim.totalHome) - parseFloat(baseSim.totalHome)
  const destDiff = parseFloat(altSim.totalDest) - parseFloat(baseSim.totalDest)

  const handleApplyAlternative = () => {
    toast({
      title: 'Scenario Configured',
      description: 'You can now save or simulate this scenario directly.',
      type: 'success',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <Link to={`/trip/${originalTrip.id}`} className="hover:text-text-primary inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Simulator
          </Link>
          <span>/</span>
          <span className="text-text-primary font-semibold">Scenario Comparison</span>
        </div>
      </div>

      {/* Hero explanation */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
          Side-by-Side Trip Scenario Comparison
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Evaluate how tweaking your travel style, trip duration, or party count affects your total cost and foreign exchange efficiency for <strong>{region.city}, {region.name}</strong>.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Card 1: Original Scenario */}
        <div className="bg-surface border-2 border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pine-600" />
              <h2 className="font-display text-lg text-ink font-semibold">Scenario A: Original Setup</h2>
            </div>
            <Chip variant="neutral" size="sm">Baseline</Chip>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-sunken rounded-xl text-xs font-mono">
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Style</span>
              <strong className="text-text-primary">{STYLE_LABEL[originalTrip.style]}</strong>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Duration</span>
              <strong className="text-text-primary">{originalTrip.nights} Nights</strong>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Party</span>
              <strong className="text-text-primary">{originalTrip.travellers} Person(s)</strong>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono text-text-muted">Total Estimated Spend:</div>
            <div className="text-3xl font-mono font-bold text-ink">
              {formatMoney(baseSim.totalDest, region.currency)}
            </div>
            <div className="text-xs font-mono text-pine-700">
              ≈ <MoneyValue amount={baseQuote.amountHome} currency={originalTrip.homeCcy} />
            </div>
          </div>

          {/* Category breakdown */}
          <div className="space-y-3 pt-2 border-t border-divider text-xs font-mono">
            <div className="text-[11px] font-semibold text-text-muted uppercase">Spending Breakdown</div>
            {baseSim.categories.map((c) => (
              <div key={c.category} className="flex items-center justify-between py-1">
                <span className="text-text-secondary capitalize">{c.category}</span>
                <span className="font-semibold">{formatMoney(c.destAmount, region.currency)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-divider/60 font-semibold text-text-primary">
              <span>Per Person / Day</span>
              <span>{formatMoney(baseSim.perDayHome, originalTrip.homeCcy)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Alternative Scenario */}
        <div className="bg-surface border-2 border-pine-500 rounded-2xl p-6 space-y-6 shadow-md relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="font-display text-lg text-ink font-semibold">Scenario B: Alternative</h2>
            </div>
            <Chip variant="pine" size="sm">Configurable</Chip>
          </div>

          {/* Controls */}
          <div className="space-y-4 p-4 bg-pine-50/50 rounded-xl border border-pine-200/60 text-xs font-mono">
            <div>
              <label className="block text-[10px] uppercase text-pine-900 font-semibold mb-1">Travel Style</label>
              <select
                value={altStyle}
                onChange={(e) => setAltStyle(e.target.value as Style)}
                className="w-full bg-surface border border-pine-300 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-pine-500"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>{STYLE_LABEL[s]}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-pine-900 font-semibold mb-1">Duration: {altNights} Nights</label>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={altNights}
                  onChange={(e) => setAltNights(Number(e.target.value))}
                  className="w-full accent-pine-600"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-pine-900 font-semibold mb-1">Party: {altTravellers} People</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={altTravellers}
                  onChange={(e) => setAltTravellers(Number(e.target.value))}
                  className="w-full accent-pine-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono text-text-muted">Total Estimated Spend:</div>
            <div className="text-3xl font-mono font-bold text-ink">
              {formatMoney(altSim.totalDest, region.currency)}
            </div>
            <div className="text-xs font-mono text-pine-700">
              ≈ <MoneyValue amount={altQuote.amountHome} currency={originalTrip.homeCcy} />
            </div>
          </div>

          {/* Category breakdown */}
          <div className="space-y-3 pt-2 border-t border-divider text-xs font-mono">
            <div className="text-[11px] font-semibold text-text-muted uppercase">Spending Breakdown</div>
            {altSim.categories.map((c) => (
              <div key={c.category} className="flex items-center justify-between py-1">
                <span className="text-text-secondary capitalize">{c.category}</span>
                <span className="font-semibold">{formatMoney(c.destAmount, region.currency)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-divider/60 font-semibold text-text-primary">
              <span>Per Person / Day</span>
              <span>{formatMoney(altSim.perDayHome, originalTrip.homeCcy)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delta Analysis Banner */}
      <div className="bg-sunken border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${homeDiff <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-clay-100 text-clay-800'}`}>
            {homeDiff <= 0 ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-text-muted">Delta vs Scenario A</div>
            <div className="text-xl font-mono font-bold text-ink">
              {homeDiff <= 0 ? '-' : '+'}{formatMoney(Math.abs(homeDiff), originalTrip.homeCcy)} ({homeDiff <= 0 ? '-' : '+'}{formatMoney(Math.abs(destDiff), region.currency)})
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {homeDiff <= 0
                ? 'Scenario B reduces total expenditure by optimizing category assumptions.'
                : 'Scenario B increases expenditure due to style, duration, or group size additions.'}
            </p>
          </div>
        </div>

        <Button variant="primary" onClick={handleApplyAlternative} className="shrink-0 gap-2 font-mono text-xs">
          <Sparkles className="w-4 h-4" /> Save Scenario B
        </Button>
      </div>
    </div>
  )
}
