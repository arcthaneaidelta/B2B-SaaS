import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Compass } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const GuidedTourPill: React.FC = () => {
  const navigate = useNavigate();
  const dismissed = useStore((s) => s.guidedTourDismissed);
  const step = useStore((s) => s.guidedTourStep);
  const dismiss = useStore((s) => s.dismissGuidedTour);
  const nextStep = useStore((s) => s.nextGuidedTourStep);

  if (dismissed) return null;

  const tourSteps = [
    {
      title: 'Step 1: Check Data & Merge CSV',
      desc: 'See the new row in Customer Parameters and click "Merge on Account ID".',
      route: '/app/data',
    },
    {
      title: 'Step 2: Test Scenario with Failure',
      desc: 'In Pipeline, set "Inject failure" and press "Run once" to watch the Break route divert.',
      route: '/app/pipeline',
    },
    {
      title: 'Step 3: Run Sandbox Verification',
      desc: 'In Test Run, launch the 8-step runner to verify zero unhandled errors.',
      route: '/app/test',
    },
  ];

  const current = tourSteps[step - 1] || tourSteps[0];

  const handleAction = () => {
    navigate(current.route);
    if (step < 3) {
      nextStep();
    } else {
      dismiss();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-md bg-[#24473B] text-[#F6F3EE] p-3.5 rounded-md shadow-3 flex items-center justify-between gap-3 border border-[#325A4C] text-xs">
      <div className="flex items-center gap-2.5">
        <Compass className="w-4 h-4 text-[#7BD4A8] shrink-0" />
        <div className="flex flex-col">
          <div className="font-semibold text-[11px] font-mono text-[#7BD4A8]">
            GUIDED REVIEW ({step}/3)
          </div>
          <div className="text-[#F6F3EE] font-medium leading-snug">{current.title}</div>
          <div className="text-[#C5D5CC] text-[11px] leading-tight mt-0.5">{current.desc}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAction}
          className="px-2.5 py-1.5 rounded-xs bg-[#F6F3EE] text-[#24473B] font-semibold text-[11px] hover:bg-white flex items-center gap-1 shrink-0"
        >
          <span>Take me</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="p-1 text-[#A3B8AD] hover:text-white"
          aria-label="Dismiss guided tour"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
