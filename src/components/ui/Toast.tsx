import React, { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      const duration = item.duration ?? (item.action ? 8000 : item.type === 'error' ? 6000 : 4000)
      const newToast: ToastItem = { ...item, id, duration }

      setToasts((prev) => [...prev.slice(-2), newToast]) // Max 3 stacked

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed z-toast bottom-6 right-6 flex flex-col gap-2 max-w-sm w-full pointer-events-none max-md:bottom-20 max-md:right-4 max-md:left-4 max-md:max-w-none"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-error shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
              info: <Info className="w-5 h-5 text-info shrink-0" />,
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                role={t.type === 'error' ? 'alert' : 'status'}
                className="pointer-events-auto bg-elevated border border-border shadow-md rounded-lg p-3.5 flex items-start gap-3 w-full"
              >
                {icons[t.type || 'info']}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-sm font-medium text-text-primary leading-snug">{t.title}</p>
                  {t.description && <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{t.description}</p>}
                  {t.action && (
                    <button
                      type="button"
                      onClick={() => {
                        t.action?.onClick()
                        removeToast(t.id)
                      }}
                      className="mt-2 text-xs font-semibold text-pine-700 hover:text-pine-800 underline underline-offset-2 cursor-pointer"
                    >
                      {t.action.label}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  aria-label="Dismiss toast"
                  className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-sunken -mr-1 -mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
