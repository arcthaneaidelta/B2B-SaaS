import React from 'react'
import { cn } from '../../lib/cn'
import { formatMoney } from '../../engine/format'

export interface MoneyValueProps {
  amount: string | number | null | undefined
  currency?: string
  size?: 'sm' | 'base' | 'lg' | 'kpi' | 'display'
  showSymbol?: boolean
  showCode?: boolean
  subAmount?: string | number
  subCurrency?: string
  isOverride?: boolean
  isEstimate?: boolean
  className?: string
}

export const MoneyValue: React.FC<MoneyValueProps> = ({
  amount,
  currency = 'GBP',
  size = 'base',
  showSymbol = true,
  showCode = false,
  subAmount,
  subCurrency,
  isOverride,
  isEstimate,
  className,
}) => {
  const formatted = formatMoney(amount, currency, { showSymbol, showCode })
  const formattedSub = subAmount ? formatMoney(subAmount, subCurrency || 'USD') : null

  const sizeClass = {
    sm: 'text-sm font-medium',
    base: 'text-base font-medium',
    lg: 'text-xl font-display font-medium',
    kpi: 'text-3xl sm:text-4xl font-display font-normal',
    display: 'text-4xl sm:text-5xl font-display font-normal',
  }[size]

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <div className="inline-flex items-baseline gap-1.5 flex-wrap">
        <span className={cn('tnum tracking-tight text-text-primary', sizeClass)}>
          {formatted}
        </span>
        {isOverride && (
          <span className="tag-clay text-[11px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide">
            Override
          </span>
        )}
        {isEstimate && (
          <span className="tag-warning text-[11px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide">
            Estimate
          </span>
        )}
      </div>
      {formattedSub && (
        <span className="text-xs font-mono text-text-muted mt-0.5 tnum">
          ≈ {formattedSub}
        </span>
      )}
    </div>
  )
}
