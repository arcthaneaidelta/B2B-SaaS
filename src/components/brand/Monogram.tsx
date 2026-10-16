import React from 'react';

interface MonogramProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const Monogram: React.FC<MonogramProps> = ({
  size = 48,
  className = '',
  animate = false,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Navy woven patch backing */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="20"
          fill="#1C2B3A"
          stroke="#13202C"
          strokeWidth="2"
        />

        {/* Stitched red thread border */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="16"
          stroke="#B5472F"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
          className={animate ? 'animate-dash' : ''}
        />

        {/* Inner subtle guide frame */}
        <rect
          x="16"
          y="16"
          width="68"
          height="68"
          rx="12"
          stroke="#34475A"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* Intertwined A&A letters */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="#F7F3EC"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="36"
          fontWeight="600"
          letterSpacing="-1px"
        >
          A&amp;A
        </text>

        {/* Small stitched star at top */}
        <circle cx="50" cy="24" r="2.5" fill="#B8892B" />
      </svg>
    </div>
  );
};
