import React from 'react'
import { AlertTriangle, Clock } from 'lucide-react'
import { cn } from '../../lib/cn'
import { StatusDot } from '../ui/Chip'
import { useStore } from '../../mock/store'
import { mockNow } from '../../mock/clock'

export interface RateFreshnessProps {
  fetchedAt?: number
  variant?: 'badge' | 'inline' | 'banner'
  className?: string
}

export const RateFreshness: React.FC<RateFreshnessProps> = ({
  fetchedAt,
  variant = 'badge',
  className,
}) => {
  const { demo, fxPairs } = useStore()
  const now = mockNow()

  const targetFetch = fetchedAt ?? (fxPairs.length > 0 ? Math.min(...fxPairs.map((p) => p.fetchedAt)) : now - 3 * 60_000)
  const ageMinutes = Math.max(1, Math.round((now - targetFetch) / 60_000))

  const isStale = demo.staleFeed || ageMinutes >= 15
  const isAgeing = !isStale && ageMinutes >= 5

  const status = isStale ? 'stale' : isAgeing ? 'ageing' : 'fresh'

  if (variant === 'banner') {
    if (!isStale && !isAgeing) return null
    return (
      <div
        role="alert"
        className={cn(
          'w-full py-2.5 px-4 rounded-lg flex items-center justify-between text-xs font-mono font-medium border my-3',
          isStale
            ? 'bg-error-50 text-error border-error/30'
            : 'bg-warning-50 text-warning-text border-warning/30',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {isStale
              ? `Rates feed is delayed (${ageMinutes} min ago). Showing conservative simulation estimates.`
              : `Feed is ageing (${ageMinutes} min ago). Auto-refresh queue pending next batch.`}
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-mono text-text-muted', className)}>
        <StatusDot status={status} pulse={status === 'fresh'} />
        <span>
          {isStale ? `Stale (${ageMinutes}m)` : `Refreshed ${ageMinutes}m ago`}
        </span>
      </span>
    )
  }

  // badge variant
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-mono select-none',
        isStale
          ? 'bg-error-50 text-error border-error/30'
          : isAgeing
          ? 'bg-warning-50 text-warning-text border-warning/30'
          : 'bg-sunken text-text-secondary border-border',
        className
      )}
      title={`Rates cached from mock feed. Age: ${ageMinutes} minute(s).`}
    >
      <StatusDot status={status} pulse={status === 'fresh'} />
      <span>{isStale ? `Feed stale (${ageMinutes}m ago)` : `Rates refreshed ${ageMinutes} min ago`}</span>
    </div>
  )
}
