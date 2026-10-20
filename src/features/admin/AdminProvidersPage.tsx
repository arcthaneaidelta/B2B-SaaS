import React from 'react'
import { Link } from 'react-router-dom'
import { Pause, Play, ExternalLink } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { useToast } from '../../components/ui/Toast'

export const AdminProvidersPage: React.FC = () => {
  const { providers, toggleProviderStatus, feeRules } = useStore()
  const { toast } = useToast()

  const handleToggle = async (providerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active'
    await toggleProviderStatus(providerId, nextStatus)
    toast({
      title: `Provider ${nextStatus === 'active' ? 'Activated' : 'Paused'}`,
      description: `${providerId} is now ${nextStatus}. Changes propagate instantly to public comparisons.`,
      type: nextStatus === 'active' ? 'success' : 'warning',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-text-muted">Dynamic Matrix Routing</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Provider Registry & Routing Status
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Enable or pause consumer providers. Pausing a provider immediately removes them from public ranking and quotes without deleting their fee schedule.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => {
          const isActive = p.status === 'active'
          const ruleCount = feeRules.filter((r) => r.providerId === p.id).length

          return (
            <div
              key={p.id}
              className={`bg-surface border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                isActive ? 'border-border shadow-xs' : 'border-clay-300 bg-clay-50/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Chip variant={isActive ? 'pine' : 'warning'} size="sm">
                    {isActive ? 'Active & Routing' : 'Paused / Suppressed'}
                  </Chip>
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    v6 Schedule
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl text-ink font-semibold">{p.name}</h2>
                  <div className="text-xs font-mono text-text-muted capitalize mt-0.5">
                    Category: {p.typeLabel}
                  </div>
                </div>

                <div className="p-3 bg-sunken rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Active Fee Rules:</span>
                    <strong className="text-text-primary">{ruleCount} tiers</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Supported Rails:</span>
                    <strong className="text-text-primary">Card, ATM, Transfer</strong>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-divider mt-6 flex items-center justify-between">
                <Link
                  to={`/compare`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-mono text-pine-700 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public
                </Link>

                <Button
                  variant={isActive ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggle(p.id, p.status)}
                  className="gap-1.5 font-mono text-xs"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-clay-600" />
                      <span>Pause Provider</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-white" />
                      <span>Resume Provider</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
