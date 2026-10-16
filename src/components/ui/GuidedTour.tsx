import React, { useState } from 'react';
import { useDemoStore } from '../../data/store';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';

const TOUR_STEPS = [
  {
    step: 1,
    title: '1. Scan Universal QR',
    desc: 'Simulate a packaging QR scan on a phone.',
    targetRoute: '/',
  },
  {
    step: 2,
    title: '2. Register a Patch',
    desc: 'Try the 3-step student flow with minor privacy guardrails.',
    targetRoute: '/s/register',
  },
  {
    step: 3,
    title: '3. See It Land Live',
    desc: 'New registration instantly rolls up into the dashboard & tables.',
    targetRoute: '/admin',
  },
  {
    step: 4,
    title: '4. Real Excel Export',
    desc: 'Generate a genuine .xlsx workbook with a Pivot-ready flat sheet.',
    targetRoute: '/admin',
  },
  {
    step: 5,
    title: "5. How It's Built",
    desc: 'Review the 3-table data architecture & low-code cost model.',
    targetRoute: '/how-it-works',
  },
];

export const GuidedTour: React.FC = () => {
  const navigate = useNavigate();
  const {
    guidedTourStep,
    setTourStep,
    isTourDismissed,
    dismissTour,
  } = useDemoStore();

  const [isExpanded, setIsExpanded] = useState(false);

  if (isTourDismissed) return null;

  const currentStepData = TOUR_STEPS[guidedTourStep - 1] || TOUR_STEPS[0];

  const handleNext = () => {
    if (guidedTourStep < TOUR_STEPS.length) {
      const nextStep = guidedTourStep + 1;
      setTourStep(nextStep);
      navigate(TOUR_STEPS[nextStep - 1].targetRoute);
    } else {
      dismissTour();
    }
  };

  const handleSelectStep = (stepNumber: number) => {
    setTourStep(stepNumber);
    navigate(TOUR_STEPS[stepNumber - 1].targetRoute);
  };

  return (
    <aside
      aria-label="Interactive Demo Guided Tour"
      className="fixed bottom-4 left-4 z-[50] max-w-xs sm:max-w-sm hidden sm:block select-none"
    >
      <div className="bg-ink-900 text-paper-0 rounded-lg shadow-sh-3 border border-ink-700 overflow-hidden font-ui">
        {/* Header Bar */}
        <div className="p-3 bg-ink-950 flex items-center justify-between border-b border-ink-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-thread-600 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-paper-100 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-thread-600" /> Guided Demo Tour
            </span>
            <span className="text-[10px] bg-ink-700 text-paper-100 px-1.5 py-0.5 rounded-full font-mono">
              {guidedTourStep}/5
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse tour' : 'Expand tour'}
              className="p-1 text-paper-100/60 hover:text-paper-0"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={dismissTour}
              aria-label="Dismiss tour permanently"
              className="p-1 text-paper-100/60 hover:text-paper-0"
              title="Dismiss tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Step Summary */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-semibold text-paper-0 font-display">
                {currentStepData.title}
              </h4>
              <p className="text-[11px] text-paper-100/75 mt-0.5 leading-snug">
                {currentStepData.desc}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-ink-700/60">
            <button
              type="button"
              onClick={() => navigate(currentStepData.targetRoute)}
              className="text-[11px] text-thread-600 hover:underline font-semibold"
            >
              Go to step screen →
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="bg-thread-600 hover:bg-thread-700 text-paper-0 text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
            >
              <span>{guidedTourStep === 5 ? 'Finish tour' : 'Next'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Expanded All Steps View */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-ink-700/60 flex flex-col gap-1.5 bg-ink-900/90 max-h-48 overflow-y-auto">
            {TOUR_STEPS.map((s) => {
              const isCurrent = s.step === guidedTourStep;
              const isPast = s.step < guidedTourStep;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => handleSelectStep(s.step)}
                  className={`w-full text-left p-1.5 rounded text-[11px] flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-ink-700 text-paper-0 font-semibold'
                      : 'text-paper-100/70 hover:bg-ink-700/40 hover:text-paper-0'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-status-success flex-shrink-0" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-paper-100/40 flex-shrink-0 text-[9px] flex items-center justify-center font-mono">
                        {s.step}
                      </span>
                    )}
                    <span className="truncate">{s.title}</span>
                  </span>
                  {isCurrent && <span className="text-[9px] uppercase tracking-wider text-thread-600">Active</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
