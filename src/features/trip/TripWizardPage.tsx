import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, Compass, Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Stepper } from '../../components/ui/Stepper'
import { Segmented } from '../../components/ui/Segmented'
import { Chip } from '../../components/ui/Chip'
import { useStore, getRateInfo } from '../../mock/store'
import { formatMoney } from '../../engine/format'
import { STYLES, STYLE_LABEL, STYLE_CAPTION, type Style } from '../../engine/types'
import { simulateTripCosts } from '../../engine/trip'
import { cn } from '../../lib/cn'

export const TripWizardPage: React.FC = () => {
  const navigate = useNavigate()
  const state = useStore()
  const { regions, prefs, saveTrip } = state

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [destinationId, setDestinationId] = useState('japan')
  const [nights, setNights] = useState(10)
  const [travellers, setTravellers] = useState(2)
  const [startDate, setStartDate] = useState('2026-11-06')
  const [style, setStyle] = useState<Style>('comfort')
  const [searchFilter, setSearchFilter] = useState('')

  // Staged loading state (PRD 10.D)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildStage, setBuildStage] = useState(0)

  const selectedRegion = regions.find((r) => r.id === destinationId) || regions[0]
  const rateInfo = getRateInfo(state, prefs.homeCcy, selectedRegion.currency)

  // Simulation preview for Review step
  const previewSimulation = React.useMemo(() => {
    return simulateTripCosts({
      region: selectedRegion,
      nights,
      travellers,
      style,
      activeCategories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
      usdToDest: '146.50',
      homeToDest: rateInfo?.refRate ?? '196.40',
    })
  }, [selectedRegion, nights, travellers, style, rateInfo])

  // Quick start presets
  const handleQuickStart = (dest: string, n: number, trav: number, st: Style) => {
    setDestinationId(dest)
    setNights(n)
    setTravellers(trav)
    setStyle(st)
    setStep(4) // Jump directly to Review
  }

  // Handle final simulation creation
  const handleCreateSimulation = async () => {
    setIsBuilding(true)
    setBuildStage(0)
    await new Promise((r) => setTimeout(r, 300))
    setBuildStage(1)
    await new Promise((r) => setTimeout(r, 300))
    setBuildStage(2)
    await new Promise((r) => setTimeout(r, 300))

    const newTripId = `${destinationId}-${nights}n-${style}`

    // Save to user trips
    await saveTrip({
      id: newTripId,
      name: `${selectedRegion.city} ${nights}-night trip`,
      destinationId,
      homeCcy: prefs.homeCcy,
      nights,
      travellers,
      style,
      categories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
      startDate,
      savedAt: Date.now(),
      totalHome: previewSimulation.totalHome,
      fxCostHome: '34.20',
    })

    setIsBuilding(false)
    navigate(`/trip/${newTripId}`)
  }

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.city.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div className="container-app py-8 md:py-12 max-w-3xl mx-auto space-y-8">
      {/* Wizard Header & Progress Segments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow block">TRIP SETUP WIZARD</span>
          <span className="font-mono text-xs text-text-muted">Step {step} of 4</span>
        </div>

        {/* 4 hairline progress segments */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1.5 rounded-full transition-colors',
                s <= step ? 'bg-pine-600' : 'bg-sunken border border-border/40'
              )}
            />
          ))}
        </div>
      </div>

      {/* Quick-start shortcuts */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-text-muted flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-clay-500" />
          <span>Quick starts:</span>
        </span>
        <Chip onClick={() => handleQuickStart('japan', 10, 2, 'comfort')}>
          Tokyo, 10 nights, Comfort
        </Chip>
        <Chip onClick={() => handleQuickStart('portugal', 3, 1, 'budget')}>
          Weekend in Lisbon, Budget
        </Chip>
        <Chip onClick={() => handleQuickStart('thailand', 14, 2, 'mid')}>
          Bangkok, 14 nights, Mid-range
        </Chip>
      </div>

      {/* Wizard Card Body */}
      <div className="card card-pad bg-elevated shadow-sm border-border min-h-[380px] flex flex-col justify-between">
        {/* STEP 1: DESTINATION */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-medium text-text-primary">Where are you travelling?</h2>
              <p className="text-xs text-text-muted mt-1">Select your target destination country or city.</p>
            </div>

            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search destinations (e.g. Japan, Portugal)..."
              className="input text-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredRegions.map((r) => {
                const isSelected = r.id === destinationId
                return (
                  <div
                    key={r.id}
                    onClick={() => setDestinationId(r.id)}
                    className={cn(
                      'p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between',
                      isSelected
                        ? 'border-pine-600 bg-pine-50/40 shadow-xs'
                        : 'border-border bg-surface hover:border-border-strong'
                    )}
                  >
                    <div>
                      <span className="font-display font-medium text-base text-text-primary block">{r.name}</span>
                      <span className="text-xs text-text-muted">{r.city} • Currency: {r.currency}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-pine-700 shrink-0" />}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DATES & TRAVELLERS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-text-primary">Dates and party size</h2>
              <p className="text-xs text-text-muted mt-1">Duration directly influences hotel room math and daily meal allocations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Stepper
                label="Number of nights"
                value={nights}
                onChange={setNights}
                min={1}
                max={60}
                unit="nights"
                helperText="Longer stays benefit from flat fee amortization."
              />

              <Stepper
                label="Number of travellers"
                value={travellers}
                onChange={setTravellers}
                min={1}
                max={8}
                unit="travellers"
                helperText={`Assumes ${Math.ceil(travellers / 2)} double room(s).`}
              />
            </div>

            <div className="space-y-1 pt-2 border-t border-divider">
              <label className="field-label">Trip start date (optional)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input max-w-xs font-mono text-xs"
              />
              <span className="text-xs text-text-muted block mt-1">
                Used to determine how many weekend days occur during your stay for provider markup checks.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: TRAVEL STYLE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-text-primary">Choose your travel style</h2>
              <p className="text-xs text-text-muted mt-1">Controls the regional daily expense multipliers for hotels, food, and transit.</p>
            </div>

            <Segmented<Style>
              value={style}
              onChange={setStyle}
              options={STYLES.map((s) => ({
                value: s,
                label: STYLE_LABEL[s],
              }))}
            />

            <div className="p-4 rounded-xl bg-sunken/60 border border-border space-y-2">
              <span className="font-display text-lg font-medium text-text-primary block capitalize">
                {STYLE_LABEL[style]} Profile
              </span>
              <p className="text-xs text-text-secondary leading-relaxed">
                {STYLE_CAPTION[style]}
              </p>
              <div className="pt-2 border-t border-divider/60 flex items-center justify-between text-xs font-mono text-text-muted">
                <span>Estimated daily spend:</span>
                <span className="font-semibold text-text-primary text-sm">
                  {formatMoney(previewSimulation.perDayHome, prefs.homeCcy)} / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-text-primary">Review trip parameters</h2>
              <p className="text-xs text-text-muted mt-1">Verify your setup before building the simulation and ranking payment plans.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between border-b border-divider pb-2">
                <span className="text-xs text-text-muted">Destination</span>
                <span className="font-display font-medium text-text-primary text-base">{selectedRegion.name} ({selectedRegion.city})</span>
              </div>
              <div className="flex items-center justify-between border-b border-divider pb-2 text-xs">
                <span className="text-text-muted">Stay duration & Party</span>
                <span className="font-mono font-medium text-text-primary">{nights} nights • {travellers} traveller(s)</span>
              </div>
              <div className="flex items-center justify-between border-b border-divider pb-2 text-xs">
                <span className="text-text-muted">Travel Style</span>
                <span className="tag-pine font-mono capitalize">{style}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-muted">Estimated budget</span>
                <div className="text-right">
                  <span className="font-display text-2xl font-medium text-text-primary block">
                    {formatMoney(previewSimulation.totalHome, prefs.homeCcy)}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    ≈ {formatMoney(previewSimulation.totalDest, selectedRegion.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Staged Building feedback */}
            {isBuilding && (
              <div className="p-4 bg-pine-50 border border-pine-200 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-pine-800 font-semibold text-xs">
                  <Compass className="w-4 h-4 animate-spin" />
                  <span>Building your simulation...</span>
                </div>
                <div className="text-xs font-mono text-pine-700 pl-6">
                  {['Reading live rates...', 'Applying regional spend assumptions...', 'Ranking cheapest payment strategies...'][buildStage]}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Buttons */}
        <div className="pt-6 border-t border-divider flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button
              variant="ghost"
              disabled={isBuilding}
              onClick={() => setStep((step - 1) as any)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              variant="primary"
              onClick={() => setStep((step + 1) as any)}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Button>
          ) : (
            <Button
              variant="primary"
              isLoading={isBuilding}
              loadingText="Building simulation..."
              onClick={handleCreateSimulation}
            >
              <span>Create simulation</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
