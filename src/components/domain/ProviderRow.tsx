import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatMoney, formatPct, formatRate } from '../../engine/format'
import type { Provider, Quote } from '../../engine/types'
import { EffectiveCostBar } from './EffectiveCostBar'

export interface ProviderRowProps {
  quote: Quote
  provider: Provider
  rank: number
  isBest?: boolean
  onClick?: () => void
  showRateCol?: boolean
}

export const ProviderMonogram: React.FC<{ monogram: string; className?: string }> = ({ monogram, className }) => (
  <div
    className={cn(
      'w-7 h-7 rounded-full border border-border bg-sunken flex items-center justify-center font-display text-sm font-semibold text-text-primary select-none shrink-0',
      className
    )}
  >
    {monogram}
  </div>
)

export const ProviderRow: React.FC<ProviderRowProps> = ({
  quote,
  provider,
  rank,
  isBest = false,
  onClick,
  showRateCol = true,
}) => {
  const isOffered = quote.status === 'OK'

  return (
    <tr
      onClick={isOffered ? onClick : undefined}
      tabIndex={isOffered ? 0 : undefined}
      onKeyDown={(e) => {
        if (isOffered && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'group transition-colors',
        isOffered ? 'row-click hover:bg-surface' : 'opacity-40 cursor-not-allowed bg-sunken/40',
        isBest && 'rail-selected bg-pine-50/20'
      )}
    >
      {/* Rank */}
      <td className="w-10 text-center font-mono text-xs text-text-muted tnum pl-4">
        {isOffered ? rank : '—'}
      </td>

      {/* Provider name & Monogram */}
      <td>
        <div className="flex items-center gap-2.5">
          <ProviderMonogram monogram={provider.monogram} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-text-primary text-sm tracking-tight">{provider.name}</span>
              {isBest && (
                <span className="text-[11px] font-medium text-clay-700 bg-clay-50 px-1.5 py-0.2 rounded font-sans tracking-wide">
                  Lowest cost
                </span>
              )}
            </div>
            <div className="text-[11px] text-text-muted font-sans">
              {provider.typeLabel}
              {!isOffered && quote.reason && ` • ${quote.reason}`}
            </div>
          </div>
        </div>
      </td>

      {/* Applied Rate */}
      {showRateCol && (
        <td className="num font-mono text-xs text-text-secondary">
          {isOffered ? formatRate(quote.appliedRate, 4) : '—'}
        </td>
      )}

      {/* Fees (home) */}
      <td className="num font-mono text-xs text-text-secondary">
        {isOffered ? formatMoney(quote.feeHome, quote.homeCcy) : '—'}
      </td>

      {/* You get (dest amount) */}
      <td className="num">
        <span className="font-display font-medium text-base text-text-primary tnum">
          {isOffered ? formatMoney(quote.destAmount, quote.destCcy) : 'Not offered'}
        </span>
      </td>

      {/* Cost (home) */}
      <td className="num font-mono text-xs text-text-primary font-medium">
        {isOffered ? formatMoney(quote.costHome, quote.homeCcy) : '—'}
      </td>

      {/* Effective % & Bar */}
      <td className="pr-4">
        {isOffered ? (
          <div className="flex items-center justify-end gap-2">
            <EffectiveCostBar effectivePct={quote.effectivePct} isBest={isBest} />
            <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ) : (
          <span className="text-right block text-xs text-text-muted">—</span>
        )}
      </td>
    </tr>
  )
}

export const ProviderCard: React.FC<ProviderRowProps> = ({
  quote,
  provider,
  rank,
  isBest = false,
  onClick,
}) => {
  const isOffered = quote.status === 'OK'

  return (
    <div
      onClick={isOffered ? onClick : undefined}
      className={cn(
        'card p-4 transition-all relative overflow-hidden',
        isOffered ? 'card-hover' : 'opacity-50 cursor-not-allowed bg-sunken/40',
        isBest && 'card-selected'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="font-mono text-xs text-text-muted tnum w-4 text-center">
            {isOffered ? rank : '—'}
          </div>
          <ProviderMonogram monogram={provider.monogram} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-text-primary text-sm">{provider.name}</span>
              {isBest && (
                <span className="text-[11px] font-medium text-clay-700 bg-clay-50 px-1.5 rounded">
                  Lowest
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-muted">{provider.typeLabel}</span>
          </div>
        </div>

        {isOffered && (
          <div className="text-right">
            <span className="text-xs font-mono font-medium text-pine-700 block">
              {formatPct(quote.effectivePct)}
            </span>
            <span className="text-[11px] text-text-muted font-mono">
              Cost: {formatMoney(quote.costHome, quote.homeCcy)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-divider/60 pt-2.5 mt-2 text-xs">
        <span className="text-text-muted">You receive</span>
        <span className="font-display font-medium text-lg text-text-primary tnum">
          {isOffered ? formatMoney(quote.destAmount, quote.destCcy) : 'Not offered'}
        </span>
      </div>
    </div>
  )
}
