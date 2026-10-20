import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { formatPct } from '../../engine/format'

export interface EffectiveCostBarProps {
  effectivePct: string | number
  maxPct?: number // e.g. 5% or 10% for full scale
  isBest?: boolean
  className?: string
  showLabel?: boolean
}

export const EffectiveCostBar: React.FC<EffectiveCostBarProps> = ({
  effectivePct,
  maxPct = 8.5,
  isBest = false,
  className,
  showLabel = true,
}) => {
  const pctNum = Math.max(0, Number(effectivePct))
  const widthPercent = Math.min(100, Math.max(4, (pctNum / maxPct) * 100))

  return (
    <div className={cn('flex items-center gap-2 min-w-[90px]', className)}>
      <div className="flex-1 h-1.5 bg-sunken rounded-full overflow-hidden border border-border/40">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: `${widthPercent}%`, transformOrigin: 'left' }}
          className={cn(
            'h-full rounded-full',
            isBest ? 'bg-pine-600' : pctNum > 5 ? 'bg-clay-500' : 'bg-slate-600'
          )}
        />
      </div>
      {showLabel && (
        <span className={cn('text-xs font-mono font-medium tnum w-11 text-right', isBest ? 'text-pine-700 font-semibold' : 'text-text-muted')}>
          {formatPct(effectivePct)}
        </span>
      )}
    </div>
  )
}
