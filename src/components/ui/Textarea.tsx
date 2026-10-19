import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, maxChars, value, className = '', id, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label
              htmlFor={generatedId}
              className="text-xs font-semibold uppercase tracking-wider text-[#4A524D] select-none"
            >
              {label}
              {props.required && <span className="text-[#B23A3A] ml-1">*</span>}
            </label>
          )}
          {maxChars && (
            <span className="text-xs text-[#7A817B] font-mono">
              {currentLength}/{maxChars}
            </span>
          )}
        </div>
        <textarea
          id={generatedId}
          ref={ref}
          value={value}
          maxLength={maxChars}
          aria-invalid={!!error}
          className={`w-full min-h-[96px] p-3 text-sm bg-[#FFFFFF] border rounded-sm text-[#1F2421] placeholder-[#7A817B] transition-colors duration-140 disabled:bg-[#EFEBE4] disabled:text-[#7A817B] ${
            error
              ? 'border-[#B23A3A] focus:border-[#B23A3A]'
              : 'border-[#CFC8BB] hover:border-[#4A524D] focus:border-[#46617A]'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#B23A3A] flex items-center gap-1 font-medium mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 inline" />
            <span>{error}</span>
          </p>
        )}
        {hint && !error && <p className="text-xs text-[#7A817B] mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, className = '', id, ...props }, ref) => {
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
        <div className="relative">
          <select
            id={generatedId}
            ref={ref}
            className={`w-full h-11 px-3.5 py-2 text-sm bg-[#FFFFFF] border rounded-sm text-[#1F2421] appearance-none pr-10 transition-colors duration-140 cursor-pointer ${
              error
                ? 'border-[#B23A3A]'
                : 'border-[#CFC8BB] hover:border-[#4A524D] focus:border-[#46617A]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#4A524D]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-[#B23A3A] font-medium mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-[#7A817B] mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
