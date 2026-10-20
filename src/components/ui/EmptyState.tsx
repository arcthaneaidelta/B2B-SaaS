import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

export interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div className={cn('text-center py-12 px-4 max-w-md mx-auto', className)}>
      {icon && <div className="mx-auto mb-4 text-text-muted flex justify-center">{icon}</div>}
      <h3 className="font-display text-2xl font-normal text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "We couldn't load rates.",
  description = 'Check your connection and try again.',
  onRetry,
  className,
}) => {
  return (
    <div className={cn('p-6 bg-error-50/60 border border-error/30 rounded-xl text-center max-w-md mx-auto my-6', className)}>
      <div className="w-10 h-10 rounded-full bg-error-50 text-error flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="font-display text-xl font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-text-secondary text-sm mb-5">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
