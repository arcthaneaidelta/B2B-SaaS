import React from 'react'
import { Sliders, RotateCcw, Check } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'

export const SettingsPage: React.FC = () => {
  const { prefs, setPrefs, resetDemoData } = useStore()
  const { toast } = useToast()

  const handleReset = () => {
    resetDemoData()
    toast({
      title: 'Demo Store Reset',
      description: 'Factory seed data restored (overrides cleared, fee drafts reset).',
      type: 'success',
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-divider pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-mono font-medium">
          <Sliders className="w-3.5 h-3.5" /> User & Prototype Configuration
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
          Preferences & Demo Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Configure default currencies, display densities, and reset demo states to initial seed.
        </p>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Home Currency */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-display text-lg text-ink font-semibold">Default Home Currency</h2>
          <p className="text-xs text-text-secondary">
            Used as the default base currency across the Converter, Trip Wizard, and Provider comparisons.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md font-mono text-xs">
            {['GBP', 'EUR', 'USD'].map((ccy) => (
              <button
                key={ccy}
                type="button"
                onClick={() => setPrefs({ homeCcy: ccy })}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  prefs.homeCcy === ccy
                    ? 'border-pine-600 bg-pine-50/60 text-pine-900 font-bold shadow-xs'
                    : 'border-border bg-sunken/40 text-text-secondary hover:text-text-primary hover:border-border/80'
                }`}
              >
                <span>{ccy}</span>
                {prefs.homeCcy === ccy && <Check className="w-4 h-4 text-pine-700" />}
              </button>
            ))}
          </div>
        </div>

        {/* Motion Preference */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-display text-lg text-ink font-semibold">Animation & Motion</h2>
          <p className="text-xs text-text-secondary">
            Control Framer Motion transitions and spring physics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {(
              [
                { id: 'system', label: 'Respect System (OS)' },
                { id: 'reduce', label: 'Reduced Motion' },
                { id: 'no-preference', label: 'Full Animations' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPrefs({ motionPreference: opt.id })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  prefs.motionPreference === opt.id
                    ? 'border-pine-600 bg-pine-50/60 text-pine-900 font-bold shadow-xs'
                    : 'border-border bg-sunken/40 text-text-secondary hover:text-text-primary hover:border-border/80'
                }`}
              >
                <span>{opt.label}</span>
                {prefs.motionPreference === opt.id && <Check className="w-4 h-4 text-pine-700" />}
              </button>
            ))}
          </div>
        </div>

        {/* Factory Reset */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg text-ink font-semibold">Reset Demo Environment</h2>
              <p className="text-xs text-text-secondary mt-1">
                Clears all custom fee drafts, active rate overrides, saved trips, and resets the persistent localStorage store to initial seed state.
              </p>
            </div>
            <Button variant="outline" onClick={handleReset} className="gap-2 font-mono text-xs border-error/40 text-error hover:bg-error-50">
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Factory Seed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
