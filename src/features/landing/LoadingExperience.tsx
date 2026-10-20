import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface LoadingExperienceProps {
  onComplete: () => void;
}

export const LoadingExperience: React.FC<LoadingExperienceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user already saw the loading experience this session
    const hasLoaded = sessionStorage.getItem('verity_visited');
    if (hasLoaded) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem('verity_visited', 'true');
          setTimeout(onComplete, 160);
          return 100;
        }
        return prev + 25;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F6F2] flex flex-col items-center justify-center p-6 select-none animate-fade-in">
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-5">
        {/* Geometric Mark */}
        <div className="w-14 h-14 rounded-2xl bg-[#24483D] flex items-center justify-center shadow-lg border border-[#356653] transform transition-transform hover:scale-105 duration-200">
          <ShieldCheck className="w-8 h-8 text-[#E7EEE7]" />
        </div>

        {/* Centered Wordmark */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#28332F]">VERITY</h1>
          <p className="text-xs uppercase tracking-widest text-[#777F79] font-medium">
            Nordic Verification Network
          </p>
        </div>

        {/* Thin Forest-green Progress Line */}
        <div className="w-full bg-[#E5E5DD] h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#24483D] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Supporting Copy & Status Line */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#28332F]">A more trusted way to connect talent.</p>
          <p className="text-[11px] text-[#777F79] animate-pulse-subtle">
            {progress < 40 ? 'Calibrating Swedish qualification registers...' : progress < 80 ? 'Preparing explainable matching...' : 'Entering workspace...'}
          </p>
        </div>

        {/* Skip button for accessibility */}
        <button
          onClick={() => {
            sessionStorage.setItem('verity_visited', 'true');
            onComplete();
          }}
          className="text-[11px] text-[#777F79] hover:text-[#24483D] underline pt-2 cursor-pointer"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
};
