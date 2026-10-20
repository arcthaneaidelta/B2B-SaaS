import React, { useState } from 'react'
import { Clock, ShieldAlert, Activity } from 'lucide-react'
import { useStore } from '../../mock/store'
import { AreaLine } from '../../components/charts/AreaLine'
import { rateSeries, type Range } from '../../lib/series'
import { RateFreshness } from '../../components/domain/RateFreshness'
import { Chip } from '../../components/ui/Chip'
import { formatRate } from '../../engine/format'

const POPULAR_PAIRS = [
  { pair: 'GBP/EUR', from: 'GBP', to: 'EUR' },
  { pair: 'GBP/USD', from: 'GBP', to: 'USD' },
  { pair: 'GBP/JPY', from: 'GBP', to: 'JPY' },
  { pair: 'EUR/USD', from: 'EUR', to: 'USD' },
  { pair: 'USD/JPY', from: 'USD', to: 'JPY' },
  { pair: 'GBP/THB', from: 'GBP', to: 'THB' },
]

export const RateInsightsPage: React.FC = () => {
  const { getRateInfo } = useStore()
  const [selectedPair, setSelectedPair] = useState(POPULAR_PAIRS[0])
  const [range, setRange] = useState<Range>('7d')

  const rateInfo = getRateInfo(selectedPair.from, selectedPair.to)
  const currentRate = rateInfo.rate

  // Generate deterministic walk for the mid-market
  const midPoints = rateSeries(`${selectedPair.from}_${selectedPair.to}`, currentRate, range)

  // Generate synthetic provider markup line (e.g. 2.99% bank markup)
  const bankPoints = midPoints.map((v) => v * 0.9701)

  const chartSeries = [
    {
      id: 'mid-market',
      label: 'Interbank Mid-Market',
      color: 'var(--color-pine-600, #1E4D45)',
      data: midPoints,
    },
    {
      id: 'bank-baseline',
      label: 'Typical Bank Card (-2.99%)',
      color: 'var(--color-clay-600, #C2663D)',
      data: bankPoints,
    },
  ]

  const minMid = Math.min(...midPoints)
  const maxMid = Math.max(...midPoints)
  const rangeDiff = maxMid - minMid
  const pctSpread = (rangeDiff / minMid) * 100

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Chip variant="pine" size="sm">Audited Reference Feed</Chip>
            <RateFreshness variant="badge" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Foreign Exchange Insights & Volatility
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Empirical mid-market reference rates, historical fluctuation bands, and provider markup spreads.
          </p>
        </div>
      </div>

      {/* Pair Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
        <span className="text-text-muted text-[11px] uppercase mr-2 flex items-center gap-1 shrink-0">
          <Activity className="w-3.5 h-3.5" /> Select Pair:
        </span>
        {POPULAR_PAIRS.map((p) => (
          <button
            key={p.pair}
            type="button"
            onClick={() => setSelectedPair(p)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 cursor-pointer ${
              selectedPair.pair === p.pair
                ? 'bg-pine-600 text-white'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-sunken'
            }`}
          >
            {p.pair}
          </button>
        ))}
      </div>

      {/* Rate Hero Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-text-muted uppercase">1 {selectedPair.from} equals</div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-ink mt-1">
              {formatRate(currentRate)} <span className="text-lg font-semibold text-text-muted">{selectedPair.to}</span>
            </div>
            <div className="text-xs font-mono text-text-muted mt-1 flex items-center gap-2">
              <span>Source: European Central Bank & Interbank</span>
              <span>•</span>
              <RateFreshness variant="inline" />
            </div>
          </div>

          {/* Range Buttons */}
          <div className="flex items-center gap-1 bg-sunken p-1 rounded-xl border border-divider text-xs font-mono">
            {(['24h', '7d', '30d'] as Range[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                  range === r ? 'bg-surface text-pine-700 font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="pt-4 border-t border-divider">
          <AreaLine series={chartSeries} height={260} />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-divider text-xs font-mono">
          <div className="p-3 bg-sunken rounded-xl">
            <span className="text-text-muted block text-[10px] uppercase">Period Low</span>
            <strong className="text-text-primary text-sm">{formatRate(minMid)}</strong>
          </div>
          <div className="p-3 bg-sunken rounded-xl">
            <span className="text-text-muted block text-[10px] uppercase">Period High</span>
            <strong className="text-text-primary text-sm">{formatRate(maxMid)}</strong>
          </div>
          <div className="p-3 bg-sunken rounded-xl">
            <span className="text-text-muted block text-[10px] uppercase">Period Spread Volatility</span>
            <strong className="text-pine-700 text-sm">±{pctSpread.toFixed(2)}%</strong>
          </div>
        </div>
      </div>

      {/* Explanatory Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekend Surcharge Watch */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-clay-100 rounded-lg text-clay-700">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg text-ink font-semibold">Weekend FX Surcharge Watch</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Global foreign exchange markets close Friday at 22:00 UTC and reopen Sunday at 22:00 UTC. During this window, several providers (e.g. Revolut standard tiers) introduce an automated <strong>1.0% weekend surcharge</strong> to hedge market risk.
          </p>
          <div className="p-3 bg-sunken rounded-xl text-xs font-mono text-text-muted">
            Tip: Pre-convert required destination currency into a multi-currency pot before Friday 21:00 UTC to avoid weekend fees.
          </div>
        </div>

        {/* Dynamic Currency Conversion */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pine-100 rounded-lg text-pine-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg text-ink font-semibold">The "Zero Fee" Illusion</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Many credit cards advertise "0% foreign transaction fees" while quietly routing your conversion through a non-interbank card network rate or allowing point-of-sale card readers to apply Dynamic Currency Conversion (DCC).
          </p>
          <div className="p-3 bg-sunken rounded-xl text-xs font-mono text-text-muted">
            Relziwallet tracks the pure mathematical difference between interbank mid-market and realized checkout cost.
          </div>
        </div>
      </div>
    </div>
  )
}
