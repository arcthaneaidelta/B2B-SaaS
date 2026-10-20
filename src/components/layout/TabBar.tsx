import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Table2, Compass, MapPin, MoreHorizontal, FileText, Bookmark, Settings, HelpCircle, SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Drawer } from '../ui/Drawer'
import { useStore } from '../../mock/store'

export const TabBar: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { setDemo } = useStore()

  // Do not show on admin screens
  if (location.pathname.startsWith('/admin')) return null

  const tabs = [
    { label: 'Convert', to: '/convert', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { label: 'Compare', to: '/compare', icon: <Table2 className="w-5 h-5" /> },
    { label: 'Trip', to: '/trip/new', icon: <Compass className="w-5 h-5" /> },
    { label: 'Destinations', to: '/destinations', icon: <MapPin className="w-5 h-5" /> },
  ]

  const isMoreActive = ['/rates', '/trips', '/methodology', '/settings', '/help', '/demo-notes'].some((p) =>
    location.pathname.startsWith(p)
  )

  return (
    <>
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-tabbar bg-paper/95 border-t border-border backdrop-none h-16 pb-safe md:hidden flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors',
                isActive ? 'text-pine-700 font-semibold' : 'text-text-muted hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="tabbar-active-rail"
                  className="absolute top-0 left-3 right-3 h-0.5 bg-pine-600 rounded-full"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {tab.icon}
              <span className="mt-1 leading-none">{tab.label}</span>
            </NavLink>
          )
        })}

        {/* More Tab */}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            'relative flex-1 flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors cursor-pointer',
            isMoreActive ? 'text-pine-700 font-semibold' : 'text-text-muted hover:text-text-primary'
          )}
        >
          {isMoreActive && (
            <motion.div
              layoutId="tabbar-active-rail"
              className="absolute top-0 left-3 right-3 h-0.5 bg-pine-600 rounded-full"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          <MoreHorizontal className="w-5 h-5" />
          <span className="mt-1 leading-none">More</span>
        </button>
      </nav>

      {/* "More" Sheet */}
      <Drawer
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="More options"
        subtitle="Tools, settings & documentation"
      >
        <div className="divide-y divide-divider text-sm font-medium">
          <button
            type="button"
            onClick={() => {
              navigate('/rates')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors"
          >
            <Table2 className="w-4 h-4 text-pine-600" />
            <span>Rate insights & charts</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/trips')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors"
          >
            <Bookmark className="w-4 h-4 text-pine-600" />
            <span>Saved trips</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/methodology')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors"
          >
            <FileText className="w-4 h-4 text-pine-600" />
            <span>Methodology & formula receipt</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/settings')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors"
          >
            <Settings className="w-4 h-4 text-pine-600" />
            <span>Preferences & settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/help')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-pine-600" />
            <span>Help & FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/demo-notes')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors text-clay-700"
          >
            <FileText className="w-4 h-4 text-clay-700" />
            <span>Demo Notes (Proposal spec)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDemo({ tourActive: true, tourDismissed: false })
              navigate('/')
              setMoreOpen(false)
            }}
            className="w-full py-3 px-2 flex items-center gap-3 hover:text-pine-700 text-left transition-colors font-semibold text-pine-700"
          >
            <Compass className="w-4 h-4 text-pine-700" />
            <span>Start 2-minute tour</span>
          </button>
        </div>
      </Drawer>
    </>
  )
}
