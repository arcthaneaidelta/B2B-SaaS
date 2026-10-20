import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  BedDouble,
  UtensilsCrossed,
  TrainFront,
  Ticket,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Stepper } from '../../components/ui/Stepper'
import { Segmented } from '../../components/ui/Segmented'
import { Tag } from '../../components/ui/Chip'
import { StackedBar } from '../../components/charts/StackedBar'
import { RateFreshness } from '../../components/domain/RateFreshness'
import { Drawer } from '../../components/ui/Drawer'
import { Modal } from '../../components/ui/Modal'
import { useStore, getRateInfo } from '../../mock/store'
import { simulateTripCosts } from '../../engine/trip'
import { formatMoney } from '../../engine/format'
import { cn } from '../../lib/cn'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  CATEGORY_UNIT,
  STYLES,
  STYLE_LABEL,
  STYLE_CAPTION,
  type Category,
  type Style,
} from '../../engine/types'
import { useToast } from '../../components/ui/Toast'

export const TripSimulatorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const state = useStore()
  const { regions, savedTrips, saveTrip, prefs } = state
  const { toast } = useToast()

  // Find existing trip or derive from id slug
  const existingTrip = savedTrips.find((t) => t.id === id)

  const [destinationId, setDestinationId] = useState(existingTrip?.destinationId || 'japan')
  const [nights, setNights] = useState(existingTrip?.nights || 10)
  const [travellers, setTravellers] = useState(existingTrip?.travellers || 2)
  const [style, setStyle] = useState<Style>(existingTrip?.style || 'comfort')
  const [activeCategories, setActiveCategories] = useState<Category[]>(
    existingTrip?.categories || ['accommodation', 'food', 'transport', 'activities', 'extras']
  )
  const [customAmounts, setCustomAmounts] = useState<Partial<Record<Category, string>>>(
    existingTrip?.customCategoryAmounts || {}
  )

  // Drawer & modal states
  const [selectedCategoryForDrawer, setSelectedCategoryForDrawer] = useState<Category | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [customInputVal, setCustomInputVal] = useState('')

  const region = regions.find((r) => r.id === destinationId) || regions[0]
  const rateInfo = getRateInfo(state, prefs.homeCcy, region.currency)

  // Live simulation calculation
  const simulation = React.useMemo(() => {
    return simulateTripCosts({
      region,
      nights,
      travellers,
      style,
      activeCategories,
      customAmountsHome: customAmounts,
      usdToDest: '146.50',
      homeToDest: rateInfo?.refRate ?? '196.40',
    })
  }, [region, nights, travellers, style, activeCategories, customAmounts, rateInfo])

  const categoryIcons: Record<Category, React.ReactNode> = {
    accommodation: <BedDouble className="w-4 h-4 text-pine-600" />,
    food: <UtensilsCrossed className="w-4 h-4 text-clay-500" />,
    transport: <TrainFront className="w-4 h-4 text-slate-600" />,
    activities: <Ticket className="w-4 h-4 text-warning" />,
    extras: <ShoppingBag className="w-4 h-4 text-success" />,
  }

  const handleToggleCategory = (cat: Category) => {
    if (activeCategories.includes(cat)) {
      if (activeCategories.length > 1) {
        setActiveCategories(activeCategories.filter((c) => c !== cat))
      }
    } else {
      setActiveCategories([...activeCategories, cat])
    }
  }

  const handleSaveTrip = async () => {
    await saveTrip({
      id: id || `${destinationId}-${nights}n-${style}`,
      name: `${region.city} ${nights}-night trip`,
      destinationId,
      homeCcy: prefs.homeCcy,
      nights,
      travellers,
      style,
      categories: activeCategories,
      customCategoryAmounts: customAmounts,
      savedAt: Date.now(),
      totalHome: simulation.totalHome,
      fxCostHome: '33.80',
    })
    toast({
      title: 'Trip saved to your library',
      description: 'You can revisit this budget anytime under Saved Trips.',
      type: 'success',
    })
  }

  const handleApplyCustomAmount = (cat: Category) => {
    if (customInputVal) {
      setCustomAmounts({ ...customAmounts, [cat]: customInputVal })
      setSelectedCategoryForDrawer(null)
      toast({
        title: `Custom estimate applied for ${CATEGORY_LABEL[cat]}`,
        type: 'info',
      })
    }
  }

  const handleRevertCustomAmount = (cat: Category) => {
    const next = { ...customAmounts }
    delete next[cat]
    setCustomAmounts(next)
    setSelectedCategoryForDrawer(null)
    toast({
      title: `Reverted ${CATEGORY_LABEL[cat]} to benchmark average`,
      type: 'info',
    })
  }

  return (
    <div className="w-full">
      {/* Sticky Trip Context Bar (PRD Section 12.1 & U07) */}
      <div className="sticky top-16 max-md:top-14 z-20 bg-surface/95 border-b border-divider py-2.5 px-4 backdrop-none select-none">
        <div className="container-app flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-display font-medium text-base text-text-primary">
              {region.city} Budget Simulation
            </span>
            <Tag variant="pine">{region.name}</Tag>
            <Tag variant="neutral" className="capitalize">{style}</Tag>
            <RateFreshness variant="inline" className="hidden sm:inline-flex" />
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleSaveTrip}>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save trip</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShareModalOpen(true)}>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Link to={`/trip/${id || 'tokyo-10n-comfort'}/strategy`}>
              <Button size="sm" variant="primary">
                <span>View Payment Strategy</span>
                <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-app py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Sticky Controls Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-5">
            <div className="card card-pad bg-elevated shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-divider">
                <span className="font-display font-medium text-base text-text-primary">Simulation Controls</span>
                {Object.keys(customAmounts).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomAmounts({})}
                    className="text-xs font-mono text-clay-700 hover:underline cursor-pointer"
                  >
                    Revert all custom
                  </button>
                )}
              </div>

              {/* Destination selector */}
              <div className="space-y-1">
                <label className="field-label">Destination</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="input font-mono text-xs font-semibold cursor-pointer"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                  ))}
                </select>
              </div>

              {/* Duration & Travellers Steppers */}
              <div className="space-y-3">
                <Stepper
                  label="Stay duration"
                  value={nights}
                  onChange={setNights}
                  min={1}
                  max={60}
                  unit="nights"
                />

                <Stepper
                  label="Travellers"
                  value={travellers}
                  onChange={setTravellers}
                  min={1}
                  max={8}
                  unit="travellers"
                />
              </div>

              {/* Travel Style Segmented */}
              <div className="space-y-1.5 pt-2 border-t border-divider">
                <label className="field-label">Travel Style</label>
                <Segmented<Style>
                  value={style}
                  onChange={setStyle}
                  options={STYLES.map((s) => ({ value: s, label: STYLE_LABEL[s] }))}
                />
                <p className="text-[11px] text-text-muted leading-relaxed italic pt-1">
                  "{STYLE_CAPTION[style]}"
                </p>
              </div>

              {/* Category Switches */}
              <div className="space-y-2 pt-2 border-t border-divider">
                <label className="field-label">Included spend categories</label>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => {
                    const isChecked = activeCategories.includes(cat)
                    return (
                      <label key={cat} className="flex items-center justify-between p-2 rounded bg-surface hover:bg-sunken/60 cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          {categoryIcons[cat]}
                          <span className="capitalize font-medium text-text-primary">{CATEGORY_LABEL[cat]}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCategory(cat)}
                          className="w-4 h-4 rounded text-pine-600 focus:ring-pine-600 cursor-pointer"
                        />
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Results & Morphing Stacked Bar */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Totals Banner */}
            <div className="card card-pad bg-elevated shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-divider">
                <div>
                  <span className="eyebrow block">ESTIMATED TOTAL TRIP BUDGET</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-medium text-text-primary tnum">
                      {formatMoney(simulation.totalHome, prefs.homeCcy)}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      ({formatMoney(simulation.perDayHome, prefs.homeCcy)} / day)
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-text-muted">
                  <span className="block text-text-primary font-medium text-sm">
                    ≈ {formatMoney(simulation.totalDest, region.currency)}
                  </span>
                  <span>incl. estimated ~£33.80 FX costs</span>
                </div>
              </div>

              {/* Stacked Category Morph Bar */}
              <div className="space-y-1 pt-1">
                <span className="text-xs text-text-muted block font-medium">Category budget distribution</span>
                <StackedBar categories={simulation.categories} currency={prefs.homeCcy} />
              </div>
            </div>

            {/* Recommended Way to Pay card */}
            <div className="p-4 rounded-xl bg-pine-50 border border-pine-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-clay-700" />
                  <span className="font-semibold text-pine-900 text-sm">
                    Payment strategy recommendation
                  </span>
                </div>
                <p className="text-xs text-pine-800 mt-1 leading-relaxed">
                  The optimised multi-provider plan saves an estimated <strong className="text-pine-900">£144.20 in FX fees</strong> compared to using a standard high-street bank card for this trip.
                </p>
              </div>

              <Link to={`/trip/${id || 'tokyo-10n-comfort'}/strategy`}>
                <Button size="sm" variant="primary">
                  <span>Inspect payment plan</span>
                  <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                </Button>
              </Link>
            </div>

            {/* Category Line Items Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {simulation.categories.map((c) => {
                return (
                  <div
                    key={c.category}
                    onClick={() => {
                      setSelectedCategoryForDrawer(c.category)
                      setCustomInputVal(customAmounts[c.category] || c.homeAmount)
                    }}
                    className={cn(
                      'card p-4 bg-elevated card-hover cursor-pointer space-y-3 relative overflow-hidden',
                      c.isCustom && 'border-clay-500/70'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {categoryIcons[c.category]}
                        <span className="font-display font-medium text-base text-text-primary capitalize">
                          {CATEGORY_LABEL[c.category]}
                        </span>
                      </div>
                      {c.isCustom ? (
                        <Tag variant="clay">Custom</Tag>
                      ) : (
                        <span className="text-[11px] font-mono text-text-muted">
                          {formatMoney(c.unitPriceUsd, 'USD')} {CATEGORY_UNIT[c.category]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="font-display text-2xl font-normal text-text-primary tnum">
                        {formatMoney(c.homeAmount, prefs.homeCcy)}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        ≈ {formatMoney(c.destAmount, region.currency)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-divider/60 text-[11px] font-mono text-text-muted flex items-center justify-between">
                      <span>Daily: {formatMoney(c.perDayHome, prefs.homeCcy)} / day</span>
                      <span className="text-pine-700 hover:underline">Edit estimate →</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom links */}
            <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-4 border-t border-divider">
              <Link to="/styles" className="hover:text-pine-700 hover:underline">
                Compare all 4 Travel Styles side-by-side →
              </Link>
              <Link to={`/trip/${id || 'tokyo-10n-comfort'}/compare`} className="hover:text-pine-700 hover:underline">
                Compare budget scenarios →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Detail Drawer (PRD U09) */}
      {selectedCategoryForDrawer && (
        <Drawer
          isOpen={!!selectedCategoryForDrawer}
          onClose={() => setSelectedCategoryForDrawer(null)}
          title={`Edit ${CATEGORY_LABEL[selectedCategoryForDrawer]} Estimate`}
          subtitle={`Benchmark calculation trace for ${region.city}`}
        >
          <div className="space-y-6">
            <div className="p-4 bg-sunken rounded-xl space-y-2 text-xs">
              <span className="font-mono font-semibold uppercase text-text-muted block">Benchmark Receipt Trace</span>
              <p className="font-mono text-text-secondary leading-relaxed">
                Formula: {nights} nights × {travellers} traveller(s) × ${region.values[style][selectedCategoryForDrawer]} USD ({CATEGORY_UNIT[selectedCategoryForDrawer]})
              </p>
              <span className="text-[11px] text-text-muted block pt-1 border-t border-divider">
                Source: {region.sourceNote} • Reviewed {region.lastReviewed} • {region.confidence} confidence
              </span>
            </div>

            <div className="space-y-2">
              <label className="field-label">Custom amount in {prefs.homeCcy}</label>
              <input
                type="number"
                value={customInputVal}
                onChange={(e) => setCustomInputVal(e.target.value)}
                className="input font-mono text-lg font-medium"
              />
              <span className="text-xs text-text-muted block">
                Type an override amount to replace the regional model's estimate for this trip.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => handleApplyCustomAmount(selectedCategoryForDrawer)}
              >
                Apply custom estimate
              </Button>
              {customAmounts[selectedCategoryForDrawer] && (
                <Button
                  variant="ghost"
                  onClick={() => handleRevertCustomAmount(selectedCategoryForDrawer)}
                >
                  Revert to average
                </Button>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* Share Modal (PRD U16) */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Simulation"
        description="Generate a shareable prototype link or export a printable summary."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-sunken rounded-lg font-mono text-xs text-text-secondary flex items-center justify-between">
            <span className="truncate">https://relziwallet.example/t/8f3k2</span>
            <span className="text-[10px] bg-elevated px-1.5 py-0.5 rounded border border-border text-text-muted ml-2">
              Demo link
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Include calculation assumptions</span>
            <input type="checkbox" defaultChecked className="rounded text-pine-600" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText('https://relziwallet.example/t/8f3k2')
                toast({ title: 'Demo link copied to clipboard', type: 'success' })
                setShareModalOpen(false)
              }}
            >
              Copy link
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                window.print()
                setShareModalOpen(false)
              }}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
