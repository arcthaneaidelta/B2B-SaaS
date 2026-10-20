import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'inverse' | 'ghost-inverse'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  isSuccess?: boolean
  successText?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Working',
      isSuccess = false,
      successText = 'Done',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    }[size]

    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-secondary border border-border',
      ghost: 'btn-ghost',
      destructive: 'btn-destructive',
      inverse: 'btn-inverse',
      'ghost-inverse': 'btn-ghost-inverse',
    }[variant]

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn('btn', sizeClasses, variantClasses, className)}
        {...props}
      >
        {isLoading && <span className="btn-sweep" aria-hidden="true" />}
        {isSuccess ? (
          <span className="inline-flex items-center gap-1.5 text-success">
            <Check className="w-4 h-4 stroke-[2]" />
            <span>{successText}</span>
          </span>
        ) : isLoading ? (
          <span className="opacity-80">{loadingText}</span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  variant?: 'ghost' | 'secondary' | 'outline'
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', children, ...props }, ref) => {
    const borderClass = variant === 'outline' ? 'border border-border bg-elevated hover:border-border-strong' : ''
    return (
      <button
        ref={ref}
        className={cn('icon-btn', borderClass, className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'
