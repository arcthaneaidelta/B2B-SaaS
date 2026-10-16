import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  label?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 500,
  step = 1,
  className = '',
  label = 'Quantity',
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <div className={`inline-flex items-center border border-border-strong rounded-md bg-paper-0 shadow-sh-1 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        className="w-11 h-11 flex items-center justify-center text-ink-900 hover:bg-paper-100 disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-thread-600 rounded-l-md"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        aria-label={label}
        className="w-14 h-11 text-center font-ui text-base font-semibold tabular-nums text-ink-900 border-x border-border focus:outline-none focus:bg-paper-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className="w-11 h-11 flex items-center justify-center text-ink-900 hover:bg-paper-100 disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-thread-600 rounded-r-md"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
