import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Sliders, RefreshCw, Layers, MapPin, History, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Chip } from '../../components/ui/Chip'
import { Button } from '../../components/ui/Button'

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    fxPairs,
    activeOverrides,
    feeRules,
    feeRuleDrafts,
    regions,
    auditEntries,
    refreshAllPairs,
  } = useStore()

  const draftCount = Object.keys(feeRuleDrafts).length
  const stalePairs = fxPairs.filter((p) => (Date.now() - p.fetchedAt) > p.ttlMin * 60 * 1000)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-text-muted">Operator Control Plane Active</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Admin Overview & Health
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshAllPairs()}
            className="gap-1.5 font-mono text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Force Refresh All Feeds
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/overrides')}
            className="gap-1.5 font-mono text-xs"
          >
            <Zap className="w-3.5 h-3.5" /> Create Override
          </Button>
        </div>
      </div>

      {/* Band 1: Needs Attention (if any alerts) */}
      {(draftCount > 0 || stalePairs.length > 0 || activeOverrides.length > 0) && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs font-mono uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Items Requiring Operator Attention</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {draftCount > 0 && (
              <div className="p-3 bg-surface rounded-xl border border-amber-200 flex items-center justify-between">
                <span>{draftCount} unpublished fee rule draft(s)</span>
                <Link to="/admin/fee-matrix" className="text-pine-700 font-bold hover:underline">
                  Review Matrix →
                </Link>
              </div>
            )}
            {activeOverrides.length > 0 && (
              <div className="p-3 bg-surface rounded-xl border border-amber-200 flex items-center justify-between">
                <span>{activeOverrides.length} active FX override(s) running</span>
                <Link to="/admin/overrides" className="text-pine-700 font-bold hover:underline">
                  Inspect Overrides →
                </Link>
              </div>
            )}
            {stalePairs.length > 0 && (
              <div className="p-3 bg-surface rounded-xl border border-amber-200 flex items-center justify-between">
                <span>{stalePairs.length} FX pair(s) near TTL expiry</span>
                <Link to="/admin/fx-cache" className="text-pine-700 font-bold hover:underline">
                  View Cache →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Band 2: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-text-muted">Cached Currency Pairs</span>
          <div className="text-2xl font-mono font-bold text-ink">{fxPairs.length}</div>
          <div className="text-[11px] font-mono text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Operational
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-text-muted">Active Spreads & Overrides</span>
          <div className="text-2xl font-mono font-bold text-pine-700">{activeOverrides.length}</div>
          <div className="text-[11px] font-mono text-text-muted">
            Audited via immutable log
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-text-muted">Fee Matrix Version</span>
          <div className="text-2xl font-mono font-bold text-ink">v6.4</div>
          <div className="text-[11px] font-mono text-text-muted">
            {feeRules.length} active schedule rules
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-text-muted">Regional Benchmark Cities</span>
          <div className="text-2xl font-mono font-bold text-ink">{regions.length}</div>
          <div className="text-[11px] font-mono text-text-muted">
            Tokyo baseline anchor
          </div>
        </div>
      </div>

      {/* Band 3: Quick Navigation Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/overrides')}
          className="bg-surface border border-border hover:border-pine-500 rounded-2xl p-6 transition-all hover:shadow-md cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-pine-100 rounded-xl text-pine-800">
              <Zap className="w-5 h-5" />
            </div>
            <Chip variant="pine" size="sm">Hero Action W5</Chip>
          </div>
          <h2 className="font-display text-lg text-ink font-semibold group-hover:text-pine-800 transition-colors">
            Rate Overrides & Spreads
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Apply temporary rate adjustments with fat-finger guards (&gt;2% warning, &gt;10% blocking) and live quote impact previews.
          </p>
          <div className="text-xs font-mono font-semibold text-pine-700 flex items-center gap-1 pt-2">
            Open Overrides <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/fee-matrix')}
          className="bg-surface border border-border hover:border-pine-500 rounded-2xl p-6 transition-all hover:shadow-md cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800">
              <Layers className="w-5 h-5" />
            </div>
            <Chip variant="neutral" size="sm">Test Harness W6</Chip>
          </div>
          <h2 className="font-display text-lg text-ink font-semibold group-hover:text-pine-800 transition-colors">
            Fee Matrix & Test Harness
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Inline spreadsheet editing of provider fee tiers with dirty draft state, sample quote simulation, and version bumping.
          </p>
          <div className="text-xs font-mono font-semibold text-pine-700 flex items-center gap-1 pt-2">
            Manage Fee Matrix <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/regions')}
          className="bg-surface border border-border hover:border-pine-500 rounded-2xl p-6 transition-all hover:shadow-md cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-800">
              <MapPin className="w-5 h-5" />
            </div>
            <Chip variant="neutral" size="sm">CMS</Chip>
          </div>
          <h2 className="font-display text-lg text-ink font-semibold group-hover:text-pine-800 transition-colors">
            Regional Cost CMS
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Update accommodation and daily category index averages. Draft sanity warnings trigger on adjustments exceeding 40%.
          </p>
          <div className="text-xs font-mono font-semibold text-pine-700 flex items-center gap-1 pt-2">
            Configure Regions <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Recent Audit Log Feed */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-text-muted" />
            <h2 className="font-display text-base text-ink font-semibold">Latest Audit Log Records</h2>
          </div>
          <Link to="/admin/audit" className="text-xs font-mono text-pine-700 hover:underline">
            View Full Audit Log →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/60">
              {auditEntries.slice(0, 5).map((entry) => (
                <tr key={entry.id}>
                  <td className="py-2.5 px-3 font-medium text-text-primary">{entry.actor}</td>
                  <td className="py-2.5 px-3 text-pine-700 font-bold">{entry.action}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{entry.entityType} ({entry.entityId})</td>
                  <td className="py-2.5 px-3 text-text-muted">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
