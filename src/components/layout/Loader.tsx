import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../mock/store'
import { useIsReducedMotion } from '../../motion/useMotion'

export const Loader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [mounted, setMounted] = useState(true)
  const [exiting, setExiting] = useState(false)
  const isReduced = useIsReducedMotion()

  useEffect(() => {
    // Check if seen before in session
    const seen = sessionStorage.getItem('rw-loader-seen')
    const displayTime = isReduced || seen ? 500 : 1200

    const exitTimer = setTimeout(() => {
      setExiting(true)
      sessionStorage.setItem('rw-loader-seen', 'true')
    }, displayTime)

    const unmountTimer = setTimeout(() => {
      setMounted(false)
      onComplete?.()
    }, displayTime + 520)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(unmountTimer)
    }
  }, [isReduced, onComplete])

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-loader bg-paper flex flex-col items-center justify-center select-none overflow-hidden transition-transform duration-500 ${
        exiting ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <span className="sr-only">Loading Relziwallet</span>

      <div className="flex flex-col items-center gap-4 relative z-10 px-4 text-center">
        {/* Ring & serif "r" mark with clay rate point */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-16 h-16">
            {/* Ring with upper-right gap */}
            <motion.circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="var(--pine-600)"
              strokeWidth="2"
              strokeDasharray="72 24"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            />
            {/* Clay rate point */}
            <motion.circle
              cx="32"
              cy="11"
              r="2.5"
              fill="var(--clay-500)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.45, duration: 0.2 }}
            />
          </svg>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="absolute font-display italic font-semibold text-2xl text-pine-800 pb-0.5"
          >
            r
          </motion.span>
        </div>

        {/* Wordmark reveal */}
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ delay: 0.3, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl font-medium tracking-tight text-pine-800"
        >
          Relziwallet
        </motion.h1>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.4 }}
          className="font-mono text-xs text-text-muted"
        >
          Rates, fees, and every receipt.
        </motion.p>
      </div>

      {/* Hairline rate line device in lower third */}
      <svg className="absolute bottom-16 left-0 right-0 w-full h-8 overflow-visible opacity-30" preserveAspectRatio="none">
        <motion.path
          d="M 0,16 Q 150,4 300,18 T 600,12 T 900,20 T 1200,8 T 1600,16"
          fill="none"
          stroke="var(--pine-600)"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>

      {/* 2px bottom hairline progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-pine-600 origin-left"
      />
    </div>
  )
}
