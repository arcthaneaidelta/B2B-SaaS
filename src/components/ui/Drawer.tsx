import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { drawerVariants, scrimVariants, sheetVariants } from '../../motion/variants'

export interface DrawerProps {
  isOpen?: boolean
  open?: boolean
  onClose: () => void
  title?: React.ReactNode
  subtitle?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  width?: 'default' | 'wide' // 480px or 560px
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  description,
  children,
  width = 'default',
  className,
}) => {
  const visible = open !== undefined ? open : Boolean(isOpen)
  const displaySubtitle = description || subtitle
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) onClose()
    }
    if (visible) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [visible, onClose])

  const widthClass = width === 'wide' ? 'md:w-[560px]' : 'md:w-[480px]'

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-drawer flex justify-end">
          {/* Scrim */}
          <motion.div
            variants={scrimVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-scrim"
            aria-hidden="true"
          />

          {/* Desktop Right Drawer OR Mobile Bottom Sheet */}
          <motion.div
            variants={isMobile ? sheetVariants : drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative z-10 w-full bg-elevated border-border shadow-lg flex flex-col',
              isMobile
                ? 'mt-auto max-h-[90dvh] rounded-t-xl border-t pb-safe'
                : cn('h-full border-l', widthClass),
              className
            )}
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="w-full flex justify-center pt-3 pb-1 shrink-0" aria-hidden="true">
                <div className="w-9 h-1 rounded-full bg-border-strong opacity-80" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-divider shrink-0">
              <div className="pr-6">
                {title && <h2 className="text-xl font-display font-medium text-text-primary leading-tight">{title}</h2>}
                {displaySubtitle && <p className="text-xs text-text-muted mt-0.5">{displaySubtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-sunken transition-colors -mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
