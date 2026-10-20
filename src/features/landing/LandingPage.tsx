import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { AmountInput } from '../../components/ui/Input'
import { Segmented } from '../../components/ui/Segmented'
import { ProviderRow } from '../../components/domain/ProviderRow'
import { RateFreshness } from '../../components/domain/RateFreshness'
import { StackedBar } from '../../components/charts/StackedBar'
import { Accordion } from '../../components/ui/Accordion'
import { Drawer } from '../../components/ui/Drawer'
import { Waterfall } from '../../components/charts/Waterfall'
import { ReceiptPanel } from '../../components/domain/ReceiptPanel'
import { useStore, getRateInfo } from '../../mock/store'
import { computeQuote, rankQuotes, savings } from '../../engine/quote'
import { simulateTripCosts } from '../../engine/trip'
import { formatMoney, formatPct } from '../../engine/format'
import { STYLE_CAPTION, type Style, type TxType } from '../../engine/types'
import { rateLineSeries } from '../../lib/series'
import { cn } from '../../lib/cn'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const state = useStore()
  const { providers, feeRules, regions, demo, setDemo } = state

  // Hero Live Card State
  const [heroAmount, setHeroAmount] = useState('2000')
  const [heroTxType, setHeroTxType] = useState<TxType>('card')
  const [heroShowMath, setHeroShowMath] = useState(false)
  const [selectedQuoteForDrawer, setSelectedQuoteForDrawer] = useState<any | null>(null)

  // Style Morph Simulator Section State
  const [morphStyle, setMorphStyle] = useState<Style>('mid')
  const morphNights = 7

  // S2 Scroll-driven waterfall state
  const [waterfallStep, setWaterfallStep] = useState(1)

  const providerMap = React.useMemo(() => Object.fromEntries(providers.map((p) => [p.id, p])), [providers])
  const ruleMap = React.useMemo(() => Object.fromEntries(feeRules.map((r) => [`${r.providerId}:${r.txType}`, r])), [feeRules])

  // Current rate for GBP/JPY
  const rateGbpJpy = getRateInfo(state, 'GBP', 'JPY')

  // Compute live hero quotes
  const heroQuotes = React.useMemo(() => {
    return providers.map((p) =>
      computeQuote({
        amountHome: heroAmount,
        homeCcy: 'GBP',
        destCcy: 'JPY',
        txType: heroTxType,
        provider: p,
        rule: ruleMap[`${p.id}:${heroTxType}`],
        rate: rateGbpJpy,
        ruleToHome: '1',
        weekend: false,
      })
    )
  }, [heroAmount, heroTxType, providers, ruleMap, rateGbpJpy])

  const rankedHeroQuotes = React.useMemo(() => rankQuotes(heroQuotes, providerMap, ruleMap), [heroQuotes, providerMap, ruleMap])
  const heroSavings = React.useMemo(() => savings(rankedHeroQuotes), [rankedHeroQuotes])

  // Auto-demo (PRD Section 7.5 W1): Plays ONCE if user has not interacted for 2.5s
  const autoDemoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (demo.autoDemoPlayed) return

    autoDemoTimerRef.current = setTimeout(() => {
      setHeroAmount('5000')
      setTimeout(() => {
        setHeroTxType('atm')
        setDemo({ autoDemoPlayed: true })
      }, 1500)
    }, 2500)

    return () => {
      if (autoDemoTimerRef.current) clearTimeout(autoDemoTimerRef.current)
    }
  }, [demo.autoDemoPlayed, setDemo])

  const handleUserInteractHero = () => {
    if (autoDemoTimerRef.current) clearTimeout(autoDemoTimerRef.current)
    if (!demo.autoDemoPlayed) setDemo({ autoDemoPlayed: true })
  }

  // Rate Line visual generator
  const rateLinePoints = React.useMemo(() => rateLineSeries('hero-rate-line-seed', 60), [])
  const rateLineSvgPath = React.useMemo(() => {
    const w = 1200
    const h = 180
    return rateLinePoints
      .map((pt, i) => {
        const x = (i / (rateLinePoints.length - 1)) * w
        const y = pt * h
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }, [rateLinePoints])

  // Style Morph Simulation calculation for Tokyo
  const japanRegion = regions.find((r) => r.id === 'japan') || regions[0]
  const morphSimulation = React.useMemo(() => {
    return simulateTripCosts({
      region: japanRegion,
      nights: morphNights,
      travellers: 2,
      style: morphStyle,
      activeCategories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
      usdToDest: '146.50',
      homeToDest: rateGbpJpy?.refRate ?? '196.40',
    })
  }, [japanRegion, morphNights, morphStyle, rateGbpJpy])

  return (
    <div className="w-full">
      {/* SECTION 1: HERO */}
      <section className="relative pt-6 pb-16 md:pt-8 md:pb-20 overflow-hidden border-b border-divider/60">
        {/* Hairline ambient rate line in background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.14] overflow-hidden -z-10">
          <svg className="w-full h-full" viewBox="0 0 1200 180" preserveAspectRatio="none">
            <path d={rateLineSvgPath} fill="none" stroke="var(--pine-600)" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="container-landing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 6 columns: Headline & Pitch */}
            <div className="lg:col-span-6 space-y-6 pt-1">
              <div className="inline-flex items-center gap-2">
                <span className="eyebrow">SPEND-ABROAD COST SIMULATOR</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-pine-900 leading-[1.04]">
                The{' '}
                <span className="relative inline-block">
                  real price
                  <svg className="absolute -bottom-1.5 left-0 right-0 w-full h-1 text-clay-500 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 4">
                    <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                of spending abroad.
              </h1>

              <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
                Compare what Wise, Revolut and traditional banks actually charge, then simulate your entire trip—accommodation, food, transport—before you leave home. No bookings. Just the math.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/trip/new">
                  <Button size="lg" variant="primary">
                    <span>Plan a trip budget</span>
                    <ArrowRight className="w-4 h-4 btn-arrow" />
                  </Button>
                </Link>
                <Link to="/compare">
                  <Button size="lg" variant="secondary">
                    <span>Compare providers</span>
                  </Button>
                </Link>
              </div>

              {/* Quick-start shortcut chip */}
              <div className="pt-1 flex items-center gap-2 text-xs text-text-muted">
                <span>Quick demo:</span>
                <button
                  type="button"
                  onClick={() => navigate('/trip/tokyo-10n-comfort')}
                  className="inline-flex items-center gap-1 font-mono text-pine-700 hover:text-pine-800 underline underline-offset-2 cursor-pointer font-medium"
                >
                  Try Tokyo, 10 nights, Comfort →
                </button>
              </div>

              {/* Trust line with live freshness indicator */}
              <div className="pt-4 border-t border-divider flex items-center gap-3 text-xs font-mono text-text-muted flex-wrap">
                <RateFreshness variant="inline" />
                <span>• 38 currencies</span>
                <span>• 6 providers</span>
                <span>• every fee itemised</span>
              </div>
            </div>

            {/* Right 6 columns: Live Comparison Card (Hero Centerpiece W1) */}
            <div className="lg:col-span-6">
              <div
                onMouseDown={handleUserInteractHero}
                onTouchStart={handleUserInteractHero}
                className="card card-pad shadow-md max-w-xl mx-auto border-border bg-elevated relative overflow-hidden"
              >
                {/* Card Header & Rates Reference */}
                <div className="flex items-center justify-between pb-4 border-b border-divider mb-4">
                  <div>
                    <span className="eyebrow block">LIVE COMPARISON</span>
                    <span className="font-display font-medium text-lg text-text-primary">
                      Instant Currency Quote
                    </span>
                  </div>
                  <div className="text-right font-mono text-xs text-text-muted">
                    <span className="block text-text-primary font-medium">1 GBP = {rateGbpJpy?.refRate ?? '196.40'} JPY</span>
                    <span className="text-[11px]">mid-market rate</span>
                  </div>
                </div>

                {/* Amount input & Tx type segmented tabs */}
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AmountInput
                      label="You send"
                      value={heroAmount}
                      onChange={(v) => {
                        handleUserInteractHero()
                        setHeroAmount(v)
                      }}
                      currencyCode="GBP"
                      currencySymbol="£"
                    />

                    <div>
                      <label className="field-label">Transaction type</label>
                      <Segmented<TxType>
                        value={heroTxType}
                        onChange={(t) => {
                          handleUserInteractHero()
                          setHeroTxType(t)
                        }}
                        options={[
                          { value: 'card', label: 'Card spend' },
                          { value: 'atm', label: 'ATM cash' },
                          { value: 'transfer', label: 'Transfer' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Provider rows table */}
                <div className="table-wrap mb-4 overflow-hidden">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-8">#</th>
                        <th>Provider</th>
                        <th className="num">Fees</th>
                        <th className="num">You receive</th>
                        <th className="num">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {rankedHeroQuotes.slice(0, 5).map((q, idx) => {
                        const prov = providerMap[q.providerId]
                        return (
                          <ProviderRow
                            key={q.providerId}
                            quote={q}
                            provider={prov}
                            rank={idx + 1}
                            isBest={idx === 0 && q.status === 'OK'}
                            showRateCol={false}
                            onClick={() => setSelectedQuoteForDrawer(q)}
                          />
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Computed savings sentence & "Show the math" button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {heroSavings ? (
                    <p className="font-mono text-text-secondary leading-snug">
                      You keep{' '}
                      <span className="font-semibold text-pine-700">
                        {formatMoney(heroSavings.diff, 'GBP')} more
                      </span>{' '}
                      with {providerMap[heroSavings.best.providerId]?.name} than with {providerMap[heroSavings.worst.providerId]?.name}.
                    </p>
                  ) : (
                    <span className="text-text-muted">Comparing live provider rules...</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setHeroShowMath(!heroShowMath)}
                    className="font-mono text-xs font-semibold text-pine-700 hover:text-pine-800 underline underline-offset-2 shrink-0 cursor-pointer"
                  >
                    {heroShowMath ? 'Hide calculation math' : 'Show the math →'}
                  </button>
                </div>

                {/* Expandable Receipt Panel */}
                {heroShowMath && rankedHeroQuotes[0] && (
                  <div className="mt-4 pt-3 border-t border-divider">
                    <ReceiptPanel quote={rankedHeroQuotes[0]} defaultOpen />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: "WHAT ONE WITHDRAWAL REALLY LOSES" PINNED STORYTELLING (WOW MOMENT 2) */}
      <section className="section-pad bg-surface border-b border-divider">
        <div className="container-landing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 cols: Story narrative with interactive progress tabs */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="space-y-2">
                <span className="eyebrow">THE FEE WATERFALL</span>
                <h2 className="font-display text-3xl sm:text-4xl text-text-primary tracking-tight">
                  What one cash machine withdrawal really loses.
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Traditional banks rarely charge a single clean fee. Watch how Harbour & Crown Bank quietly deducts exchange-rate margins, fixed machine fees, and percentage surcharges on a £2,000 withdrawal in Japan.
                </p>
              </div>

              {/* 4 Steps selector */}
              <div className="space-y-2">
                {[
                  { step: 1, title: '1. Mid-market baseline', desc: '£2,000 converted directly at 196.40 mid-market buys ¥392,800.' },
                  { step: 2, title: "2. The bank's exchange margin", desc: 'A 2.99% spread is quietly trimmed off the conversion rate (-¥11,557).' },
                  { step: 3, title: '3. Fixed & percentage fees', desc: 'A £2.00 ATM fee plus 1.50% percentage charge are tacked on (-¥6,285).' },
                  { step: 4, title: '4. What actually lands in your hand', desc: 'You receive ¥374,958—losing over £90.84 to hidden deductions.' },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setWaterfallStep(s.step)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer',
                      waterfallStep === s.step
                        ? 'bg-elevated border-pine-600 shadow-sm'
                        : 'border-border bg-sunken/40 hover:bg-sunken text-text-secondary'
                    )}
                  >
                    <span className="font-display font-medium text-sm text-text-primary block">{s.title}</span>
                    <span className="text-xs text-text-muted mt-0.5 block leading-relaxed">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right 7 cols: Interactive Fee Waterfall Visual */}
            <div className="lg:col-span-7">
              <div className="card card-pad shadow-sm bg-elevated space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-divider">
                  <div>
                    <span className="eyebrow block">HARBOUR & CROWN BANK (FICTIONAL)</span>
                    <span className="font-display text-xl font-medium text-text-primary">
                      £2,000 Cash Machine Withdrawal
                    </span>
                  </div>
                  <span className="tag-clay font-mono text-xs">
                    Step {waterfallStep} of 4
                  </span>
                </div>

                {/* Dynamic Waterfall Graphic reflecting step */}
                <div className="space-y-4">
                  {/* Ideal Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-primary font-medium">Ideal Mid-market baseline</span>
                      <span className="font-semibold text-text-primary">¥392,800 (£2,000.00)</span>
                    </div>
                    <div className="w-full h-3.5 bg-sunken rounded-full overflow-hidden">
                      <div className="h-full bg-pine-600 rounded-full w-full" />
                    </div>
                  </div>

                  {/* Spread Bar */}
                  {waterfallStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-clay-700 font-medium">- Exchange rate margin (2.99% spread)</span>
                        <span className="font-semibold text-clay-700">- ¥11,557 (£58.84)</span>
                      </div>
                      <div className="w-full h-3.5 bg-sunken rounded-full overflow-hidden">
                        <div className="h-full bg-clay-500 rounded-full w-[2.99%]" />
                      </div>
                    </motion.div>
                  )}

                  {/* Fixed & Percentage Bar */}
                  {waterfallStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-700 font-medium">- ATM fixed (£2.00) + 1.50% fee</span>
                        <span className="font-semibold text-slate-700">- ¥6,285 (£32.00)</span>
                      </div>
                      <div className="w-full h-3.5 bg-sunken rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 rounded-full w-[1.6%]" />
                      </div>
                    </motion.div>
                  )}

                  {/* Final Received */}
                  <div className="pt-3 border-t border-divider flex items-center justify-between">
                    <div>
                      <span className="text-xs text-text-muted block">What actually arrives in your hand</span>
                      <span className="font-display text-2xl font-medium text-text-primary">
                        {waterfallStep === 4 ? '¥374,958' : 'Simulating...'}
                      </span>
                    </div>
                    {waterfallStep === 4 && (
                      <div className="text-right">
                        <span className="text-xs text-clay-700 font-mono font-medium block">
                          Total lost: £90.84 (4.54%)
                        </span>
                        <span className="text-[11px] text-text-muted">
                          Rate applied: 187.48 JPY
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-sunken/60 p-3.5 rounded-lg border border-border text-xs text-text-secondary leading-relaxed">
                  <span className="font-semibold text-text-primary block mb-1">
                    Receipt rule note:
                  </span>
                  Rule ID: <code className="font-mono">FR-HARBOUR-ATM</code> applies spread first to the converted rate, followed by a flat transaction fee and percentage charge on the gross home currency.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRIP SIMULATOR STYLE MORPH (WOW MOMENT 4) */}
      <section className="section-pad border-b border-divider">
        <div className="container-landing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 5 cols */}
            <div className="lg:col-span-5 space-y-5">
              <span className="eyebrow">CATEGORY-WISE TRIP SIMULATION</span>
              <h2 className="font-display text-3xl sm:text-4xl text-text-primary tracking-tight">
                Simulate the whole trip before leaving.
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Pick a Travel Style to morph daily spending benchmarks across accommodation, dining, transit, activities, and extra purchases—priced in your own currency with estimated FX costs included.
              </p>

              {/* Style selector */}
              <div className="space-y-2 pt-2">
                <label className="field-label">Choose Travel Style</label>
                <Segmented<Style>
                  value={morphStyle}
                  onChange={setMorphStyle}
                  options={[
                    { value: 'budget', label: 'Budget' },
                    { value: 'mid', label: 'Mid-range' },
                    { value: 'comfort', label: 'Comfort' },
                    { value: 'luxury', label: 'Luxury' },
                  ]}
                />
                <p className="text-xs text-text-muted leading-relaxed italic pt-1">
                  "{STYLE_CAPTION[morphStyle]}"
                </p>
              </div>

              <div className="pt-2">
                <Link to="/trip/tokyo-10n-comfort">
                  <Button variant="secondary">
                    <span>Open full trip simulator</span>
                    <ArrowRight className="w-4 h-4 btn-arrow" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right 7 cols: Morphing Budget Preview */}
            <div className="lg:col-span-7">
              <div className="card card-pad bg-elevated shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-divider">
                  <div>
                    <span className="eyebrow block">TOKYO, JAPAN • 7 NIGHTS • 2 TRAVELLERS</span>
                    <span className="font-display text-2xl font-normal text-text-primary">
                      {formatMoney(morphSimulation.totalHome, 'GBP')}
                    </span>
                    <span className="text-xs font-mono text-text-muted ml-2">
                      ({formatMoney(morphSimulation.perDayHome, 'GBP')} / day)
                    </span>
                  </div>
                  <span className="tag-pine font-mono text-xs capitalize">
                    {morphStyle}
                  </span>
                </div>

                {/* Morphing stacked category bar */}
                <StackedBar
                  categories={morphSimulation.categories}
                  currency="GBP"
                />

                {/* Category breakdown cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {morphSimulation.categories.map((c) => (
                    <div key={c.category} className="p-2.5 rounded-lg bg-surface border border-border text-xs">
                      <span className="text-text-muted block capitalize">{c.category}</span>
                      <span className="font-display font-medium text-base text-text-primary block mt-0.5">
                        {formatMoney(c.homeAmount, 'GBP')}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">
                        ≈ {formatMoney(c.destAmount, 'JPY')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TRUST & RECEIPTS */}
      <section className="section-pad bg-surface border-b border-divider">
        <div className="container-landing space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="eyebrow">AUDITABLE BY DESIGN</span>
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary tracking-tight">
              Every number has a receipt.
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Comparison tools lose trust when figures appear without explanation. Relziwallet logs every timestamp, fee schedule version, and operator override.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-pad bg-elevated space-y-3">
              <span className="font-mono text-xs text-pine-700 font-semibold block uppercase tracking-wider">
                1. Rate Freshness
              </span>
              <h3 className="font-display text-xl font-medium text-text-primary">
                Live, cached, timestamped
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Rates arrive through automated ingest feeds. We track age, TTL countdowns, and flag stale data clearly.
              </p>
              <div className="receipt p-2 bg-sunken rounded border border-border text-[11px]">
                GBP/JPY • Primary feed (mock) • 09:44:12 UTC
              </div>
            </div>

            <div className="card card-pad bg-elevated space-y-3">
              <span className="font-mono text-xs text-pine-700 font-semibold block uppercase tracking-wider">
                2. Fee Anatomy
              </span>
              <h3 className="font-display text-xl font-medium text-text-primary">
                Itemised mathematical trace
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Spreads, fixed charges, percentage surcharges, and free allowances are separated and calculated individually.
              </p>
              <div className="receipt p-2 bg-sunken rounded border border-border text-[11px]">
                FR-WISE-CARD v7 • fxSpread: 0.00% • pctFee: 0.55%
              </div>
            </div>

            <div className="card card-pad bg-elevated space-y-3">
              <span className="font-mono text-xs text-pine-700 font-semibold block uppercase tracking-wider">
                3. Assumptions CMS
              </span>
              <h3 className="font-display text-xl font-medium text-text-primary">
                Reviewed regional data
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Regional daily travel spend figures are maintained by verified internal operators with an immutable audit log.
              </p>
              <div className="receipt p-2 bg-sunken rounded border border-border text-[11px]">
                Japan benchmark • Reviewed 12 Sep 2026 • Amara Q.
              </div>
            </div>
          </div>

          <div className="p-4 bg-elevated rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-display text-base font-medium text-text-primary block">
                Maintained by operators with full audit accountability
              </span>
              <span className="text-xs text-text-muted">
                Inspect how overrides and fee rules propagate to live calculations in our operator admin.
              </span>
            </div>
            <Link to="/admin">
              <Button variant="secondary" size="sm">
                <span>Peek at the admin panel</span>
                <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: DESTINATIONS INDEX STRIP */}
      <section className="section-pad border-b border-divider">
        <div className="container-landing space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="eyebrow block">WHERE ARE YOU GOING?</span>
              <h2 className="font-display text-3xl font-normal text-text-primary">
                Typical daily budget & best way to pay
              </h2>
            </div>
            <Link to="/destinations" className="text-xs font-mono font-semibold text-pine-700 hover:underline">
              View all 8 destinations →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {regions.map((r) => (
              <Link
                key={r.id}
                to={`/destinations/${r.id}`}
                className="card card-pad bg-elevated card-hover block space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-medium text-text-primary group-hover:text-pine-700 transition-colors">
                    {r.name}
                  </span>
                  <span className="font-mono text-xs text-text-muted">{r.currency}</span>
                </div>
                <div className="text-xs text-text-secondary">
                  <span className="text-text-muted block text-[11px]">Mid-range daily:</span>
                  <span className="font-mono font-medium text-text-primary text-sm">
                    {formatMoney(Math.round((r.values.mid.food ?? 0) + (r.values.mid.transport ?? 0) + ((r.values.mid.accommodation ?? 0) / 2)), 'USD')} / day
                  </span>
                </div>
                <span className="text-[11px] font-mono text-pine-700 block pt-1">
                  Cash share: {r.cashSharePct}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
      <section className="section-pad bg-surface border-b border-divider">
        <div className="container-landing max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="font-display text-3xl font-normal text-text-primary">
              Clear answers about our calculations.
            </h2>
          </div>

          <Accordion
            items={[
              {
                id: 'faq-1',
                title: 'Is this a booking site?',
                content: "No. Relziwallet doesn't sell flights, hotels, or tickets. It estimates what spending abroad really costs and shows the cheapest way to pay.",
              },
              {
                id: 'faq-2',
                title: 'Where do the exchange rates come from?',
                content: "From an automated FX cache feed that is timestamped and monitored for latency. Admins can configure manual rate overrides for a limited time, and they are always visibly labelled with an audit receipt.",
              },
              {
                id: 'faq-3',
                title: 'Why do traditional banks cost more?',
                content: 'Many retail banks add a hidden markup (often 2.75% to 3.00%) to the exchange rate and charge additional fixed and percentage fees on foreign card usage. We itemise each component separately.',
              },
              {
                id: 'faq-4',
                title: 'How accurate are the estimates?',
                content: 'Rates and provider fees are as accurate as their last verified update, displayed beside every figure. Spend assumptions are averages based on official tourism board figures and regular review.',
              },
              {
                id: 'faq-5',
                title: 'Do you earn affiliate commissions?',
                content: 'In this demo, no. Rankings are calculated strictly from rates and fees to determine the mathematically lowest cost.',
              },
              {
                id: 'faq-6',
                title: 'Can I save my trip simulations?',
                content: 'Yes. Saved trips live securely in your local browser storage and can be reviewed, duplicated, or exported at any time.',
              },
            ]}
          />
        </div>
      </section>

      {/* Drawer overlay for Fee Anatomy when clicking a hero row */}
      {selectedQuoteForDrawer && (
        <Drawer
          isOpen={!!selectedQuoteForDrawer}
          onClose={() => setSelectedQuoteForDrawer(null)}
          title={`Fee Anatomy: ${providerMap[selectedQuoteForDrawer.providerId]?.name}`}
          subtitle={`${selectedQuoteForDrawer.homeCcy} ${selectedQuoteForDrawer.amountHome} → ${selectedQuoteForDrawer.destCcy}`}
        >
          <div className="space-y-6">
            <div className="p-4 bg-sunken rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-text-muted block">You receive</span>
                <span className="font-display text-2xl font-medium text-text-primary">
                  {formatMoney(selectedQuoteForDrawer.destAmount, selectedQuoteForDrawer.destCcy)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted block">Total cost</span>
                <span className="font-mono text-sm font-semibold text-pine-700">
                  {formatMoney(selectedQuoteForDrawer.costHome, selectedQuoteForDrawer.homeCcy)} ({formatPct(selectedQuoteForDrawer.effectivePct)})
                </span>
              </div>
            </div>

            <Waterfall
              steps={selectedQuoteForDrawer.waterfall}
              homeCcy={selectedQuoteForDrawer.homeCcy}
              destCcy={selectedQuoteForDrawer.destCcy}
            />

            <ReceiptPanel quote={selectedQuoteForDrawer} defaultOpen />
          </div>
        </Drawer>
      )}
    </div>
  )
}
