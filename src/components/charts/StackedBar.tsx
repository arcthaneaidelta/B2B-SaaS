import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { formatMoney } from '../../engine/format'
import { CATEGORY_LABEL, type Category } from '../../engine/types'
import type { CategoryBreakdown } from '../../engine/trip'

export interface StackedBarProps {
  categories: CategoryBreakdown[]
  currency?: string
  className?: string
  showLegend?: boolean
}

export const CATEGORY_COLORS: Record<Category, string> = {
  accommodation: '#1E4D45', // pine
  food: '#C2663D', // clay
  transport: '#44627A', // slate
  activities: '#B39B6E', // sand
  extras: '#86A596', // sage
}

export const StackedBar: React.FC<StackedBarProps> = ({
  categories,
  currency = 'GBP',
  className,
  showLegend = true,
}) => {
  const total = categories.reduce((acc, c) => acc + Number(c.homeAmount), 0)

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Morphing stacked track */}
      <div className="w-full h-3.5 bg-sunken rounded-full overflow-hidden flex border border-border/50">
        {categories.map((c) => {
          const val = Number(c.homeAmount)
          const sharePct = total > 0 ? (val / total) * 100 : 0
          if (sharePct <= 0) return null

          return (
            <motion.div
              key={c.category}
              layout
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: `${sharePct}%`,
                backgroundColor: CATEGORY_COLORS[c.category],
              }}
              className="h-full relative group cursor-pointer"
              title={`${CATEGORY_LABEL[c.category]}: ${formatMoney(c.homeAmount, currency)} (${sharePct.toFixed(1)}%)`}
            />
          )
        })}
      </div>

      {/* Legend with amounts & % share */}
      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {categories.map((c) => {
            const val = Number(c.homeAmount)
            const sharePct = total > 0 ? (val / total) * 100 : 0
            return (
              <div key={c.category} className="flex items-center gap-1.5 font-medium text-text-secondary">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[c.category] }}
                />
                <span className="text-text-primary">{CATEGORY_LABEL[c.category]}:</span>
                <span className="font-mono tnum">{formatMoney(c.homeAmount, currency)}</span>
                <span className="text-text-muted font-mono text-[11px]">({sharePct.toFixed(0)}%)</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
