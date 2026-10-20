import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorMessage?: string
  hasError?: boolean
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, errorMessage, hasError, leftElement, rightElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const isError = hasError || !!errorMessage

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="field-label">
            {label}
            {props.required && <span className="text-text-muted text-xs ml-1 font-normal">(required)</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">{leftElement}</div>}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={isError}
            className={cn(
              'input',
              leftElement && 'pl-10',
              rightElement && 'pr-12',
              isError && 'border-error focus:border-error focus:ring-error-50',
              className
            )}
            {...props}
          />
          {rightElement && <div className="absolute right-3 flex items-center text-text-muted">{rightElement}</div>}
        </div>
        {isError && errorMessage ? (
          <p className="field-error shake">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </p>
        ) : helperText ? (
          <p className="field-help">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface AmountInputProps {
  label?: string
  value: string
  onChange: (val: string) => void
  currencyCode?: string
  currencySymbol?: string
  onCurrencyClick?: () => void
  className?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  size?: 'md' | 'lg'
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  currencyCode = 'GBP',
  currencySymbol,
  onCurrencyClick,
  className,
  placeholder = '0.00',
  helperText,
  errorMessage,
  size = 'md',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Filter to valid numeric characters and decimal point
    const cleaned = raw.replace(/[^\d.]/g, '')
    // Prevent multiple decimals
    const parts = cleaned.split('.')
    const valid = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned
    onChange(valid)
  }

  // Display value formatted with commas for integer portion
  const formattedDisplay = (() => {
    if (!value) return ''
    const parts = value.split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
  })()

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="field-label">{label}</label>}
      <div className="relative flex items-center">
        {currencySymbol && (
          <span className="absolute left-3 text-text-muted font-mono select-none text-base">
            {currencySymbol}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={formattedDisplay}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'input font-mono font-medium tnum',
            size === 'lg' ? 'h-14 text-2xl pr-28' : 'h-12 text-lg pr-24',
            currencySymbol ? 'pl-8' : 'pl-3.5',
            errorMessage && 'border-error'
          )}
        />
        <div className="absolute right-2 flex items-center">
          <button
            type="button"
            onClick={onCurrencyClick}
            disabled={!onCurrencyClick}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wide border border-border bg-sunken text-text-primary transition-colors',
              onCurrencyClick ? 'hover:bg-pine-100 hover:text-pine-800 cursor-pointer' : 'cursor-default'
            )}
          >
            <span>{currencyCode}</span>
            {onCurrencyClick && <span className="text-[10px] opacity-60">▼</span>}
          </button>
        </div>
      </div>
      {errorMessage ? (
        <p className="field-error shake">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </p>
      ) : helperText ? (
        <p className="field-help">{helperText}</p>
      ) : null}
    </div>
  )
}
