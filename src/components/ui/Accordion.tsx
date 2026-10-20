import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
  allowMultiple?: boolean
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []))

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      }
      return allowMultiple ? [...prev, id] : [id]
    })
  }

  return (
    <div className={cn('divide-y divide-divider border-y border-divider', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        return (
          <div key={item.id} className="py-1">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-4 text-left font-display text-lg font-medium text-text-primary hover:text-pine-700 transition-colors cursor-pointer group"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-text-muted transition-transform duration-200 shrink-0 ml-4 group-hover:text-text-primary',
                  isOpen && 'rotate-180 text-pine-700'
                )}
              />
            </button>
            <div className="collapse-grid" data-open={isOpen}>
              <div className="text-sm text-text-secondary leading-relaxed pb-4 pr-6">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
