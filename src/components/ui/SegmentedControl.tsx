import React from 'react';
import { motion } from 'framer-motion';

export interface SegmentOption<T extends string = string> {
  id: T;
  label: string;
  badge?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  name?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  name = 'segmented-control',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex p-1 bg-[#EFEBE4] rounded-sm border border-[#E3DED5] ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-140 z-10 flex items-center gap-1.5 rounded-sm ${
              isSelected ? 'text-[#1F2421]' : 'text-[#7A817B] hover:text-[#1F2421]'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={`segment-active-${name}`}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-[#FFFFFF] rounded-xs shadow-1 -z-10 border border-[#CFC8BB]"
              />
            )}
            <span>{opt.label}</span>
            {opt.badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F4E6DF] text-[#B5654A] rounded-xs font-semibold">
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
