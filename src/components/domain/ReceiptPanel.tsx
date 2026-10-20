import React, { useState } from 'react'
import { ChevronDown, Code2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Quote } from '../../engine/types'

export interface ReceiptPanelProps {
  quote: Quote
  defaultOpen?: boolean
  className?: string
}

export const ReceiptPanel: React.FC<ReceiptPanelProps> = ({ quote, defaultOpen = false, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border border-border/80 rounded-lg bg-surface overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-3 text-left font-mono text-xs font-medium text-pine-700 hover:bg-pine-50/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-pine-600" />
          <span>Show the math (formula & receipt trace)</span>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      <div className="collapse-grid" data-open={isOpen}>
        <div className="p-3.5 pt-0 border-t border-divider/60 font-mono text-xs text-text-secondary space-y-3">
          {/* Metadata receipt block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-b border-divider/60 text-[11px]">
            <div>
              <span className="text-text-muted block">Rate source</span>
              <span className="font-medium text-text-primary">{quote.rate?.source ?? 'Feed'}</span>
            </div>
            <div>
              <span className="text-text-muted block">Rule ID</span>
              <span className="font-medium text-text-primary">{quote.ruleId ?? 'Standard'}</span>
            </div>
            <div>
              <span className="text-text-muted block">Version</span>
              <span className="font-medium text-text-primary">v{quote.ruleVersion ?? 1}</span>
            </div>
            <div>
              <span className="text-text-muted block">Status</span>
              <span className="font-medium text-text-primary">
                {quote.rate?.overrideActive ? 'Override active' : 'Live mid-market'}
              </span>
            </div>
          </div>

          {/* Step-by-step formula trace */}
          <div className="space-y-1.5 pt-1">
            <span className="text-text-muted block font-semibold text-[11px] uppercase tracking-wider">
              Calculation receipt
            </span>
            <div className="divide-y divide-divider/40">
              {quote.trace.map((t) => (
                <div key={t.step} className="py-1.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-[11px]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-text-muted font-mono w-4">{t.step}.</span>
                    <span className="font-medium text-text-primary">{t.label}:</span>
                    <span className="text-text-muted text-[10px] hidden sm:inline">[{t.formula}]</span>
                  </div>
                  <div className="flex items-center gap-2 sm:text-right pl-6 sm:pl-0">
                    <span className="text-text-muted text-[10px] sm:hidden">{t.formula} =</span>
                    <span className="font-mono font-medium text-text-primary tnum">{t.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
