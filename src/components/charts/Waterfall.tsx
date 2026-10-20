import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { formatMoney } from '../../engine/format'
import type { WaterfallStep } from '../../engine/types'

export interface WaterfallProps {
  steps: WaterfallStep[]
  homeCcy: string
  destCcy: string
  className?: string
  height?: number
}

export const Waterfall: React.FC<WaterfallProps> = ({
  steps,
  homeCcy,
  destCcy,
  className,
  height = 240,
}) => {
  if (steps.length === 0) return null

  // Find max value to calibrate bar widths
  const idealStep = steps.find((s) => s.key === 'ideal')
  const maxVal = idealStep ? Number(idealStep.dest) : 1

  return (
    <div className={cn('w-full space-y-3', className)}>
      <div className="space-y-2">
        {steps.map((s, idx) => {
          const valNum = Number(s.dest)
          const widthPct = Math.min(100, Math.max(3, (valNum / maxVal) * 100))

          const isGain = s.key === 'ideal' || s.key === 'receive'
          const isDeduction = !isGain

          const barColor = {
            ideal: 'bg-pine-600',
            rateDiff: 'bg-clay-500',
            spread: 'bg-clay-500',
            weekend: 'bg-warning',
            fixed: 'bg-slate-600',
            percentage: 'bg-slate-600',
            receive: 'bg-pine-700',
          }[s.key]

          return (
            <div key={s.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={cn('font-medium', isGain ? 'text-text-primary' : 'text-text-secondary')}>
                  {s.label}
                  {s.note && <span className="text-[11px] text-text-muted font-normal ml-1.5 font-sans">({s.note})</span>}
                </span>
                <div className="font-mono text-xs flex items-center gap-1.5 tnum">
                  <span className={cn('font-semibold', isDeduction ? 'text-clay-700' : 'text-text-primary')}>
                    {isDeduction ? '-' : ''}
                    {formatMoney(s.dest, destCcy)}
                  </span>
                  <span className="text-text-muted text-[11px]">
                    ({isDeduction ? '-' : ''}{formatMoney(s.home, homeCcy)})
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full h-3 bg-sunken rounded-full overflow-hidden border border-border/40">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.42,
                    delay: idx * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ width: `${widthPct}%`, transformOrigin: 'left' }}
                  className={cn('h-full rounded-full', barColor)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
