import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  isValid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, isValid, className = '', id, disabled, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={generatedId}
            className="text-xs font-semibold uppercase tracking-wider text-[#4A524D] select-none"
          >
            {label}
            {props.required && <span className="text-[#B23A3A] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={generatedId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${generatedId}-error` : hint ? `${generatedId}-hint` : undefined}
            className={`w-full h-11 px-3.5 py-2 text-sm bg-[#FFFFFF] border rounded-sm text-[#1F2421] placeholder-[#7A817B] transition-colors duration-140 disabled:bg-[#EFEBE4] disabled:text-[#7A817B] disabled:cursor-not-allowed ${
              error
                ? 'border-[#B23A3A] focus:border-[#B23A3A] focus-visible:outline-[#B23A3A]'
                : isValid
                ? 'border-[#2F7D57] pr-9'
                : 'border-[#CFC8BB] hover:border-[#4A524D] focus:border-[#46617A]'
            } ${className}`}
            {...props}
          />
          {error && (
            <div className="absolute right-3 pointer-events-none text-[#B23A3A]">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {isValid && !error && (
            <div className="absolute right-3 pointer-events-none text-[#2F7D57]">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && (
          <p id={`${generatedId}-error`} className="text-xs text-[#B23A3A] flex items-center gap-1 font-medium mt-0.5">
            <span>{error}</span>
          </p>
        )}
        {hint && !error && (
          <p id={`${generatedId}-hint`} className="text-xs text-[#7A817B] mt-0.5">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
