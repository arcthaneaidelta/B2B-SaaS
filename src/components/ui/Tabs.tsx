import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { duration, easing } from '../../motion/tokens'

export interface TabItem<T extends string = string> {
  id: T
  label: string
  count?: number | string
  icon?: React.ReactNode
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[]
  activeTab: T
  onChange: (id: T) => void
  className?: string
  layoutId?: string
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
  layoutId = 'tabs-underline',
}: TabsProps<T>) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-divider overflow-x-auto no-scrollbar', className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative py-2.5 px-3.5 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2',
              isActive ? 'text-pine-700 font-semibold' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full font-mono',
                  isActive ? 'bg-pine-100 text-pine-800' : 'bg-sunken text-text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pine-600 z-10"
                transition={{ duration: duration.base, ease: easing.outExpo }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
