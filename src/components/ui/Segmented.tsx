import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { duration, easing } from '../../motion/tokens'

export interface SegmentedOption<T extends string = string> {
  value: T
  label: string
  sublabel?: string
  icon?: React.ReactNode
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (val: T) => void
  name?: string
  className?: string
  size?: 'sm' | 'md'
}

export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'relative inline-flex p-1 bg-sunken rounded-lg border border-border select-none max-w-full overflow-x-auto no-scrollbar',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={isSelected}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-1.5 px-3 rounded-md font-medium text-sm transition-colors cursor-pointer whitespace-nowrap',
              size === 'sm' ? 'py-1 text-xs' : 'py-1.5',
              isSelected ? 'text-pine-800 font-semibold' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-thumb"
                className="absolute inset-0 bg-elevated rounded-md shadow-xs border border-border/60 -z-10"
                transition={{ duration: duration.base, ease: easing.outExpo }}
              />
            )}
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
