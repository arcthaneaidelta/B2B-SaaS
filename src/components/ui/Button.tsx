import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Height & padding rules from PRD §9: 48px mobile, 44px desktop
    const sizeClasses = {
      sm: 'h-9 px-3 text-xs rounded-sm',
      md: 'h-11 sm:h-10 px-4 text-sm rounded-md font-medium',
      lg: 'h-12 px-6 text-base rounded-md font-semibold',
      icon: 'h-11 w-11 sm:h-10 sm:w-10 p-2 rounded-md flex items-center justify-center',
    };

    const variantClasses = {
      primary:
        'bg-ink-900 text-paper-0 hover:bg-ink-700 active:scale-[0.98] active:bg-ink-950 shadow-sh-1 focus:ring-2 focus:ring-thread-600 focus:ring-offset-2',
      accent:
        'bg-thread-600 text-paper-0 hover:bg-thread-700 active:scale-[0.98] shadow-sh-1 focus:ring-2 focus:ring-thread-600 focus:ring-offset-2',
      secondary:
        'bg-paper-0 text-ink-900 border border-border-strong hover:bg-paper-100 active:scale-[0.98] shadow-sh-1 focus:ring-2 focus:ring-thread-600 focus:ring-offset-2',
      ghost:
        'bg-transparent text-ink-900 hover:bg-paper-100 active:scale-[0.98] focus:ring-2 focus:ring-thread-600 focus:ring-offset-2',
      danger:
        'bg-status-error text-paper-0 hover:opacity-90 active:scale-[0.98] focus:ring-2 focus:ring-status-error focus:ring-offset-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 select-none transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            <span>Submitting…</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
