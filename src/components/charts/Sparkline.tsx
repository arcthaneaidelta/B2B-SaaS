import React from 'react'
import { scaleLinear } from 'd3-scale'
import { line, curveMonotoneX } from 'd3-shape'
import { cn } from '../../lib/cn'

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 72,
  height = 20,
  color = 'var(--pine-600)',
  className,
}) => {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const diff = max - min || 1

  const xScale = scaleLinear().domain([0, data.length - 1]).range([2, width - 2])
  const yScale = scaleLinear().domain([min - diff * 0.1, max + diff * 0.1]).range([height - 2, 2])

  const lineGen = line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(curveMonotoneX)

  const path = lineGen(data) || ''

  return (
    <svg width={width} height={height} className={cn('overflow-visible select-none inline-block align-middle', className)}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.25} strokeLinecap="round" />
    </svg>
  )
}
