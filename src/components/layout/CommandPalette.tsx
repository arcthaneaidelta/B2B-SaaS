import React, { useEffect } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { Search, Compass, Table2, ArrowLeftRight, Landmark, MapPin, Sliders, Shield } from 'lucide-react'
import { CURRENCIES } from '../../data/seed/currencies'
import { PROVIDERS } from '../../data/seed/providers'
import { seedRegions } from '../../data/seed/regions'

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  const regions = seedRegions()

  const handleSelect = (path: string) => {
    onOpenChange(false)
    navigate(path)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-scrim"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Cmdk Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-elevated border border-border shadow-lg rounded-xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
        <Command label="Global Command Palette">
          <div className="flex items-center px-4 border-b border-divider">
            <Search className="w-4 h-4 text-text-muted mr-3 shrink-0" />
            <Command.Input
              placeholder="Search currencies, destinations, providers, or admin pages..."
              className="w-full h-12 bg-transparent text-sm text-text-primary placeholder:text-text-disabled focus:outline-none"
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 divide-y divide-divider/40 text-xs">
            <Command.Empty className="py-8 text-center text-text-muted">
              No matching records found.
            </Command.Empty>

            {/* Quick Actions / Pages */}
            <Command.Group heading="QUICK NAVIGATION" className="text-[10px] font-mono font-semibold text-text-muted px-2 py-1.5 uppercase">
              <Command.Item
                onSelect={() => handleSelect('/convert')}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
              >
                <ArrowLeftRight className="w-4 h-4 text-pine-600" />
                <span>Quick Currency Converter</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/compare')}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
              >
                <Table2 className="w-4 h-4 text-pine-600" />
                <span>Provider Comparison Matrix</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/trip/new')}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
              >
                <Compass className="w-4 h-4 text-pine-600" />
                <span>Plan a Trip Budget Simulator</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/admin/overrides')}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
              >
                <Sliders className="w-4 h-4 text-clay-700" />
                <span>Admin: Manual Rate Overrides</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/admin/fee-matrix')}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
              >
                <Shield className="w-4 h-4 text-clay-700" />
                <span>Admin: Provider Fee Matrix</span>
              </Command.Item>
            </Command.Group>

            {/* Providers */}
            <Command.Group heading="PROVIDERS" className="text-[10px] font-mono font-semibold text-text-muted px-2 py-1.5 uppercase">
              {PROVIDERS.map((p) => (
                <Command.Item
                  key={p.id}
                  onSelect={() => handleSelect(`/providers/${p.slug}`)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
                >
                  <div className="flex items-center gap-2.5">
                    <Landmark className="w-3.5 h-3.5 text-text-muted" />
                    <span>{p.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">{p.typeLabel}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Destinations */}
            <Command.Group heading="DESTINATIONS" className="text-[10px] font-mono font-semibold text-text-muted px-2 py-1.5 uppercase">
              {regions.map((r) => (
                <Command.Item
                  key={r.id}
                  onSelect={() => handleSelect(`/destinations/${r.id}`)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-text-muted" />
                    <span>{r.name} ({r.city})</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">{r.currency}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Currencies */}
            <Command.Group heading="CURRENCIES" className="text-[10px] font-mono font-semibold text-text-muted px-2 py-1.5 uppercase">
              {Object.values(CURRENCIES).map((c) => (
                <Command.Item
                  key={c.code}
                  onSelect={() => handleSelect(`/rates?pair=GBP/${c.code}`)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer hover:bg-sunken aria-selected:bg-pine-100/60 aria-selected:text-pine-800 text-text-primary"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-pine-700 w-10">{c.code}</span>
                    <span>{c.name}</span>
                  </div>
                  <span className="font-mono text-text-muted">{c.symbol}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="p-2.5 border-t border-divider bg-surface flex items-center justify-between text-[11px] text-text-muted">
            <div className="flex items-center gap-3">
              <span>Navigate <kbd className="bg-elevated px-1 py-0.5 rounded border">↑</kbd> <kbd className="bg-elevated px-1 py-0.5 rounded border">↓</kbd></span>
              <span>Select <kbd className="bg-elevated px-1 py-0.5 rounded border">↵</kbd></span>
              <span>Dismiss <kbd className="bg-elevated px-1 py-0.5 rounded border">esc</kbd></span>
            </div>
            <span className="font-mono">Relziwallet Search</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
