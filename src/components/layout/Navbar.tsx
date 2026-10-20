import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, ShieldCheck, Sparkles, Command } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Drawer'

export const LogoMark: React.FC<{ className?: string; inverted?: boolean }> = ({ className, inverted = false }) => (
  <div className={cn('relative w-7 h-7 flex items-center justify-center select-none shrink-0', className)}>
    <svg viewBox="0 0 32 32" className="w-7 h-7">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke={inverted ? 'var(--paper)' : 'var(--pine-600)'}
        strokeWidth="1.75"
        strokeDasharray="64 18"
        strokeLinecap="round"
      />
      <circle
        cx="25.5"
        cy="8.5"
        r="2.2"
        fill="var(--clay-500)"
      />
    </svg>
    <span
      className={cn(
        'absolute font-display italic font-semibold text-base pb-0.5 leading-none',
        inverted ? 'text-paper' : 'text-pine-800'
      )}
    >
      r
    </span>
  </div>
)

export const Navbar: React.FC<{ onOpenCommandPalette?: () => void }> = ({ onOpenCommandPalette }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'Compare', to: '/compare' },
    { label: 'Plan a trip', to: '/trip/new' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Rates', to: '/rates' },
    { label: 'Methodology', to: '/methodology' },
  ]

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-nav w-full h-16 max-md:h-14 bg-paper transition-all duration-200',
          scrolled ? 'border-b border-border shadow-xs' : 'border-b border-transparent'
        )}
      >
        <div className="container-landing h-full flex items-center justify-between gap-4">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <LogoMark />
            <span className="font-display text-xl font-medium tracking-tight text-pine-800 group-hover:text-pine-700 transition-colors">
              Relziwallet
            </span>
          </Link>

          {/* Centre: Nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'link-grow text-sm font-medium transition-colors py-1',
                    isActive ? 'text-pine-700 font-semibold' : 'text-text-secondary hover:text-text-primary'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Quick search shortcut button */}
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                aria-label="Search"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-text-muted bg-sunken hover:bg-border/60 border border-border rounded-md transition-colors"
                title="Search (Press / or Ctrl+K)"
              >
                <Command className="w-3 h-3" />
                <span>Search</span>
                <kbd className="text-[10px] bg-elevated px-1 py-0.5 rounded border border-border/80">
                  /
                </kbd>
              </button>
            )}

            {/* "Demo data" disclaimer chip */}
            <span
              className="tag-outline text-[11px] font-mono text-text-muted hidden sm:inline-flex"
              title="All figures, rates, and spreads are illustrative demo data. Not live provider quotes."
            >
              Demo data
            </span>

            {/* Subtle Admin Link */}
            <Link
              to="/admin"
              className="text-xs font-mono font-medium text-text-secondary hover:text-pine-700 transition-colors px-1.5 py-1"
            >
              Admin
            </Link>

            {/* Primary CTA */}
            <Link to="/trip/new" className="hidden sm:inline-block">
              <Button size="sm" variant="primary">
                <span>Plan a trip</span>
                <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-sunken -mr-1"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Sheet */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Menu"
        subtitle="Spend-abroad cost calculator"
      >
        <div className="flex flex-col gap-1 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-3 px-2 border-b border-divider font-display text-xl text-text-primary hover:text-pine-700 transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </Link>
          ))}
          <Link
            to="/trips"
            className="py-3 px-2 border-b border-divider font-display text-xl text-text-primary hover:text-pine-700 transition-colors flex items-center justify-between"
          >
            <span>Saved trips</span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
          </Link>
          <Link
            to="/settings"
            className="py-3 px-2 border-b border-divider font-display text-xl text-text-primary hover:text-pine-700 transition-colors flex items-center justify-between"
          >
            <span>Settings</span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
          </Link>
          <Link
            to="/admin"
            className="py-3 px-2 border-b border-divider font-display text-xl text-clay-700 hover:text-clay-800 transition-colors flex items-center justify-between"
          >
            <span>Admin panel</span>
            <ArrowRight className="w-4 h-4 text-clay-700" />
          </Link>

          <div className="pt-6">
            <Link to="/trip/new">
              <Button variant="primary" className="w-full">
                <span>Plan a trip budget</span>
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  )
}
