import React, { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { area, line, curveMonotoneX } from 'd3-shape'
import { cn } from '../../lib/cn'
import { formatRate } from '../../engine/format'

export interface DataSeries {
  id: string
  label: string
  color: string
  data: number[] // array of values
}

export interface AreaLineProps {
  series: DataSeries[]
  height?: number
  className?: string
  yLabel?: string
  showArea?: boolean
}

export const AreaLine: React.FC<AreaLineProps> = ({
  series,
  height = 240,
  className,
  yLabel,
  showArea = true,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [viewAsTable, setViewAsTable] = useState(false)

  if (series.length === 0 || series[0].data.length === 0) return null

  const pointsCount = series[0].data.length
  const width = 640 // viewBox coordinate width

  // Compute overall min and max across all series
  let minVal = Infinity
  let maxVal = -Infinity
  for (const s of series) {
    for (const v of s.data) {
      if (v < minVal) minVal = v
      if (v > maxVal) maxVal = v
    }
  }

  // Padding on Y scale
  const ySpan = maxVal - minVal || 1
  const domainMin = minVal - ySpan * 0.08
  const domainMax = maxVal + ySpan * 0.08

  const xScale = scaleLinear().domain([0, pointsCount - 1]).range([10, width - 10])
  const yScale = scaleLinear().domain([domainMin, domainMax]).range([height - 24, 16])

  const lineGen = line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(curveMonotoneX)

  const areaGen = area<number>()
    .x((_, i) => xScale(i))
    .y0(height - 24)
    .y1((d) => yScale(d))
    .curve(curveMonotoneX)

  const activeIndex = hoverIndex !== null ? hoverIndex : pointsCount - 1

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
        <div className="flex items-center gap-3">
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-text-secondary font-sans font-medium">{s.label}:</span>
              <span className="font-semibold text-text-primary tnum">
                {formatRate(s.data[activeIndex])}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setViewAsTable(!viewAsTable)}
          className="text-pine-700 hover:underline font-sans cursor-pointer text-xs"
        >
          {viewAsTable ? 'View as chart' : 'View as table'}
        </button>
      </div>

      {viewAsTable ? (
        <div className="max-h-60 overflow-y-auto border border-border rounded-lg bg-elevated text-xs font-mono">
          <table className="table">
            <thead>
              <tr>
                <th>Index</th>
                {series.map((s) => (
                  <th key={s.id} className="num">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series[0].data.map((_, idx) => (
                <tr key={idx}>
                  <td className="text-text-muted">Point #{idx + 1}</td>
                  {series.map((s) => (
                    <td key={s.id} className="num">{formatRate(s.data[idx])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Horizontal guide lines */}
            <line x1={10} y1={yScale(minVal)} x2={width - 10} y2={yScale(minVal)} stroke="var(--divider)" strokeDasharray="3 3" />
            <line x1={10} y1={yScale(maxVal)} x2={width - 10} y2={yScale(maxVal)} stroke="var(--divider)" strokeDasharray="3 3" />

            {/* Area and Line for each series */}
            {series.map((s) => {
              const linePath = lineGen(s.data) || ''
              const areaPath = areaGen(s.data) || ''
              return (
                <g key={s.id}>
                  {showArea && (
                    <path
                      d={areaPath}
                      fill={s.color}
                      fillOpacity={0.07}
                    />
                  )}
                  <path
                    d={linePath}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={1.75}
                    strokeLinecap="round"
                  />
                </g>
              )
            })}

            {/* Hover hairline */}
            {hoverIndex !== null && (
              <line
                x1={xScale(hoverIndex)}
                y1={10}
                x2={xScale(hoverIndex)}
                y2={height - 24}
                stroke="var(--text-muted)"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            )}

            {/* Hover scrub capture rect */}
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="transparent"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const relX = (e.clientX - rect.left) / rect.width
                const idx = Math.round(relX * (pointsCount - 1))
                setHoverIndex(Math.max(0, Math.min(pointsCount - 1, idx)))
              }}
            />
          </svg>
        </div>
      )}
    </div>
  )
}
