import React, { useState, useEffect } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if returning visit
    const hasVisited = sessionStorage.getItem('aap-visited');
    if (hasVisited) {
      onComplete();
      return;
    }

    // Progress timer floor 800ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);
          sessionStorage.setItem('aap-visited', 'true');
          setTimeout(onComplete, 350);
          return 100;
        }
        return prev + 12;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-paper-50 flex flex-col items-center justify-center p-6 select-none transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
        {/* Animated Stitching Monogram */}
        <div className="w-20 h-20 relative">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <rect
              x="6"
              y="6"
              width="88"
              height="88"
              rx="20"
              fill="#1C2B3A"
              stroke="#13202C"
              strokeWidth="2"
            />
            {/* Stitched Thread Border */}
            <rect
              x="12"
              y="12"
              width="76"
              height="76"
              rx="16"
              stroke="#B5472F"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <text
              x="50"
              y="63"
              textAnchor="middle"
              fill="#F7F3EC"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="34"
              fontWeight="600"
              letterSpacing="-1px"
            >
              A&amp;A
            </text>
          </svg>
        </div>

        {/* Brand Text */}
        <div className="space-y-1">
          <h2 className="font-display font-semibold text-lg text-ink-900 tracking-tight">
            A&amp;A Patch Work
          </h2>
          <p className="text-[11px] uppercase tracking-wider text-text-3 font-semibold font-ui">
            Custom Merit Patches
          </p>
        </div>

        {/* 2px Progress Bar */}
        <div className="w-40 h-0.5 bg-border rounded-full overflow-hidden mt-3">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-thread-600 transition-all duration-75"
          />
        </div>
      </div>
    </div>
  );
};
