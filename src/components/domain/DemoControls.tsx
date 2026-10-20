import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, RotateCcw, FileText, Check, AlertTriangle, Shield, Compass, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useStore } from '../../mock/store'
import { useToast } from '../ui/Toast'

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { demo, setDemo, resetDemoData } = useStore()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = location.pathname.startsWith('/admin')

  const handleReset = () => {
    resetDemoData()
    toast({
      title: 'Demo data reset',
      description: 'Restored original rates, seeds, overrides and assumptions.',
      type: 'info',
    })
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Pill Button Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-sticky max-md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-xs font-medium border shadow-md transition-all cursor-pointer select-none',
            isOpen
              ? 'bg-pine-800 text-white border-pine-700 font-semibold'
              : 'bg-white text-pine-900 border-pine-200 hover:border-pine-400 hover:bg-pine-50/50 font-semibold shadow-md'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-pine-600" />
          <span>Demo Controls</span>
          {(demo.staleFeed || demo.failNextWrite || demo.slowNetwork) && (
            <span className="w-2 h-2 rounded-full bg-clay-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Floating Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 z-modal w-84 bg-elevated border border-border shadow-lg rounded-xl p-4 font-sans text-xs space-y-3.5 max-md:hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-divider">
            <div className="flex items-center gap-1.5 font-mono font-semibold text-text-primary text-[11px] uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-pine-600" />
              <span>Interactive Demo Controls</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Guided Tour Trigger */}
          <div className="bg-pine-50/60 p-2.5 rounded-lg border border-pine-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-pine-800 block text-xs">2-Minute Pitch Tour</span>
              <span className="text-[11px] text-text-muted">6 key client checkpoints</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDemo({ tourActive: true, tourDismissed: false })
                setIsOpen(false)
                if (location.pathname !== '/') navigate('/')
              }}
              className="px-2.5 py-1 bg-pine-600 hover:bg-pine-700 text-text-on-dark rounded font-medium text-[11px] transition-colors cursor-pointer"
            >
              Start tour
            </button>
          </div>

          {/* Navigation Jump */}
          <div className="flex items-center justify-between py-1">
            <span className="text-text-secondary font-medium">Quick area switch</span>
            <Link
              to={isAdmin ? '/' : '/admin'}
              onClick={() => setIsOpen(false)}
              className="text-pine-700 hover:underline font-mono text-[11px] font-semibold"
            >
              {isAdmin ? 'Jump to Public Site →' : 'Jump to Admin Panel →'}
            </Link>
          </div>

          {/* State Simulation Toggles */}
          <div className="space-y-2 pt-1 border-t border-divider">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-text-secondary">
                Simulate stale FX feed
                <span className="block text-[10px] text-text-muted">Causes rates to degrade & show warnings</span>
              </span>
              <input
                type="checkbox"
                checked={demo.staleFeed}
                onChange={(e) => {
                  setDemo({ staleFeed: e.target.checked })
                  toast({
                    title: e.target.checked ? 'Stale feed simulation active' : 'Feed reverted to fresh status',
                    type: e.target.checked ? 'warning' : 'success',
                  })
                }}
                className="rounded border-border text-pine-600 focus:ring-pine-600 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-text-secondary">
                Simulate write failure
                <span className="block text-[10px] text-text-muted">Fails next save with Retry state</span>
              </span>
              <input
                type="checkbox"
                checked={demo.failNextWrite}
                onChange={(e) => {
                  setDemo({ failNextWrite: e.target.checked })
                  if (e.target.checked) toast({ title: 'Next mutation will simulate network error', type: 'info' })
                }}
                className="rounded border-border text-pine-600 focus:ring-pine-600 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-text-secondary">
                Slow network simulation
                <span className="block text-[10px] text-text-muted">Adds 1.2s delay to test loading skeletons</span>
              </span>
              <input
                type="checkbox"
                checked={demo.slowNetwork}
                onChange={(e) => setDemo({ slowNetwork: e.target.checked })}
                className="rounded border-border text-pine-600 focus:ring-pine-600 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 border-t border-divider flex items-center justify-between">
            <Link
              to="/demo-notes"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-[11px]"
            >
              <FileText className="w-3.5 h-3.5 text-text-muted" />
              <span>Demo Notes (Proposal)</span>
            </Link>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-clay-700 hover:text-clay-800 text-[11px] font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset data</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
