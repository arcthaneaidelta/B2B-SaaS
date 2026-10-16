import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      isSuccess,
      leftIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui"
          >
            {label}
            {props.required && <span className="text-thread-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-text-3">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`w-full h-12 bg-paper-0 border rounded-md text-base text-ink-900 placeholder:text-text-3 transition-colors px-3.5 focus:outline-none font-ui ${
              leftIcon ? 'pl-10' : ''
            } ${
              error
                ? 'border-status-error focus:border-status-error focus:ring-2 focus:ring-status-error/20'
                : 'border-border-strong focus:border-thread-600 focus:ring-2 focus:ring-thread-600/15'
            } ${isSuccess ? 'pr-10' : ''} ${className}`}
            {...props}
          />

          {isSuccess && !error && (
            <div className="absolute right-3.5 pointer-events-none text-status-success animate-fade-in">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-status-error mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-text-3">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
