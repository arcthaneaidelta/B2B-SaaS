import React from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  successText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      successText,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-sm focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2 h-10 gap-2',
      lg: 'text-base px-5 py-2.5 h-12 gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'bg-[#24473B] text-[#F6F3EE] hover:bg-[#1B382F] active:bg-[#142A23] shadow-1 group',
      secondary:
        'bg-[#46617A] text-[#FFFFFF] hover:bg-[#3B5267] active:bg-[#304354] shadow-1',
      outline:
        'bg-transparent border border-[#CFC8BB] text-[#1F2421] hover:bg-[#EFEBE4] hover:border-[#1F2421]',
      ghost:
        'bg-transparent text-[#1F2421] hover:bg-[#EFEBE4] active:bg-[#E3DED5]',
      accent:
        'bg-[#B5654A] text-white hover:bg-[#9E543C] active:bg-[#854530] shadow-1',
      danger:
        'bg-[#B23A3A] text-white hover:bg-[#992E2E] active:bg-[#802525] shadow-1',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading || isSuccess}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading…</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4 text-[#2F7D57]" />
            <span>{successText || 'Done'}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
                {icon}
              </span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="transition-transform duration-150 group-hover:translate-x-1">
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
