import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  removable?: boolean
  onRemove?: () => void
  variant?: 'neutral' | 'outline' | 'pine' | 'clay' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export const Chip: React.FC<ChipProps> = ({
  className,
  selected = false,
  removable = false,
  onRemove,
  variant,
  size = 'md',
  children,
  ...props
}) => {
  if (variant) {
    return <Tag variant={variant} className={cn(size === 'sm' && 'text-[10px] py-0.5 px-2', className)}>{children}</Tag>
  }
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-selected={selected}
      className={cn('chip', size === 'sm' && 'text-xs py-1 px-2.5', className)}
      {...props}
    >
      <span>{children}</span>
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-border transition-colors"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  )
}

export interface TagProps {
  variant?: 'neutral' | 'outline' | 'pine' | 'clay' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  children: React.ReactNode
}

export const Tag: React.FC<TagProps> = ({ variant = 'neutral', className, children }) => {
  const variantClass = {
    neutral: 'tag-neutral',
    outline: 'tag-outline',
    pine: 'tag-pine',
    clay: 'tag-clay',
    success: 'tag-success',
    warning: 'tag-warning',
    error: 'tag-error',
    info: 'tag-info',
  }[variant]

  return <span className={cn('tag', variantClass, className)}>{children}</span>
}

export interface StatusDotProps {
  status: 'fresh' | 'ageing' | 'stale' | 'active' | 'scheduled' | 'draft' | 'published'
  pulse?: boolean
  className?: string
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, pulse = false, className }) => {
  const colorClass = {
    fresh: 'bg-success text-success',
    published: 'bg-success text-success',
    active: 'bg-success text-success',
    ageing: 'bg-warning text-warning',
    scheduled: 'bg-info text-info',
    stale: 'bg-error text-error',
    draft: 'bg-text-muted text-text-muted',
  }[status]

  return (
    <span
      className={cn('dot', colorClass, pulse && 'live-dot', className)}
      aria-hidden="true"
    />
  )
}
