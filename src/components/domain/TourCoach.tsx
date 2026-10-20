import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useStore } from '../../mock/store'
import { Button } from '../ui/Button'

interface TourStep {
  title: string
  description: string
  route: string
  targetElementText?: string
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '1. Live Calculator Hero',
    description: 'Calculates real quotes client-side across 6 providers. Type any number or watch the auto-demo reorder rows in 60 FPS.',
    route: '/',
  },
  {
    title: '2. "What One Withdrawal Really Loses"',
    description: 'Scroll-driven stepped waterfall showing the exact anatomy of bank FX spreads, fixed fees, and percentage deductions.',
    route: '/',
  },
  {
    title: '3. Full Provider Comparison Matrix',
    description: 'Compare Card spend, ATM, and Bank transfers. Click any row to inspect the audited "Fee anatomy" and formula trace.',
    route: '/compare',
  },
  {
    title: '4. Trip Simulator & Travel Styles',
    description: 'Multiplies regional assumptions by Travel Style (Budget to Luxury) and generates an optimised payment allocation strategy.',
    route: '/trip/tokyo-10n-comfort',
  },
  {
    title: '5. Admin Overrides Driving Public Quotes',
    description: 'Create a manual currency override with fat-finger guard (>2% warning, >10% block). The public comparison matrix updates live with an "Override active" receipt chip.',
    route: '/admin/overrides',
  },
  {
    title: '6. Demo Notes & Proposed Architecture',
    description: 'Technical blueprint mapping each PRD requirement, showing the PostgreSQL schema, calculation pipeline, and proposed AWS stack.',
    route: '/demo-notes',
  },
]

export const TourCoach: React.FC = () => {
  const { demo, setDemo } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  if (!demo.tourActive) return null

  const step = TOUR_STEPS[currentStep]

  const goToStep = (index: number) => {
    setCurrentStep(index)
    navigate(TOUR_STEPS[index].route)
  }

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      goToStep(currentStep + 1)
    } else {
      setDemo({ tourActive: false, tourDismissed: true })
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }

  const handleDismiss = () => {
    setDemo({ tourActive: false, tourDismissed: true })
  }

  return (
    <aside aria-label="Guided Pitch Tour" className="fixed bottom-6 right-6 z-modal max-w-sm w-full bg-elevated border border-pine-600/60 shadow-lg rounded-xl p-4 font-sans text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-divider">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-pine-600" />
          <span className="font-mono font-semibold text-text-primary text-[11px] uppercase tracking-wider">
            2-Minute Pitch Tour ({currentStep + 1}/{TOUR_STEPS.length})
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close tour"
          className="p-1 rounded text-text-muted hover:text-text-primary cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-3">
        <h3 className="font-display text-base font-medium text-text-primary mb-1">{step.title}</h3>
        <p className="text-text-secondary leading-relaxed text-xs">{step.description}</p>
      </div>

      {/* Progress dots & controls */}
      <div className="flex items-center justify-between pt-2 border-t border-divider">
        <div className="flex items-center gap-1.5">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToStep(idx)}
              className={cn(
                'w-2 h-2 rounded-full transition-all cursor-pointer',
                idx === currentStep ? 'w-4 bg-pine-600' : 'bg-border-strong hover:bg-text-muted'
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button variant="ghost" size="sm" onClick={handlePrev}>
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleNext}>
            <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
