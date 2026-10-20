import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface StepperProps {
  label?: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  unit?: string
  className?: string
  helperText?: string
}

export const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 60,
  unit,
  className,
  helperText,
}) => {
  const handleDec = () => {
    if (value > min) onChange(value - 1)
  }

  const handleInc = () => {
    if (value < max) onChange(value + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      handleInc()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      handleDec()
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="field-label">{label}</label>}
      <div
        tabIndex={0}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between h-11 px-1 bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pine-600 focus:ring-offset-1 select-none"
      >
        <button
          type="button"
          onClick={handleDec}
          disabled={value <= min}
          aria-label="Decrease value"
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-sunken text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 font-mono font-medium text-base tnum text-text-primary">
          <span>{value}</span>
          {unit && <span className="text-text-muted text-xs font-sans">{unit}</span>}
        </div>

        <button
          type="button"
          onClick={handleInc}
          disabled={value >= max}
          aria-label="Increase value"
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-sunken text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {helperText && <p className="field-help">{helperText}</p>}
    </div>
  )
}
