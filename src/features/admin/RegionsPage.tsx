import React, { useState } from 'react'
import { AlertTriangle, Edit3 } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { Drawer } from '../../components/ui/Drawer'
import { useToast } from '../../components/ui/Toast'
import type { RegionRecord } from '../../engine/types'

export const RegionsPage: React.FC = () => {
  const { regions, updateRegionDraft, publishRegionDraft } = useStore()
  const { toast } = useToast()

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Draft state for selected region
  const [cashShare, setCashShare] = useState<number>(30)
  const [midAccPrice, setMidAccPrice] = useState<number>(120)
  const [sourceNote, setSourceNote] = useState('')

  const activeRegion = regions.find((r) => r.id === selectedRegionId)

  const handleOpenEdit = (region: RegionRecord) => {
    setSelectedRegionId(region.id)
    setCashShare(region.draftMeta?.cashSharePct ?? region.cashSharePct)
    setMidAccPrice(region.draft?.mid?.accommodation ?? region.values.mid.accommodation ?? 120)
    setSourceNote(region.draftMeta?.sourceNote ?? region.sourceNote)
    setDrawerOpen(true)
  }

  // Sanity check: warning if mid accommodation changed by > 40%
  const originalAcc = activeRegion?.values.mid.accommodation || 120
  const accDeltaPct = ((midAccPrice - originalAcc) / originalAcc) * 100
  const isSanityWarning = Math.abs(accDeltaPct) > 40

  const handleSaveDraft = () => {
    if (!activeRegion) return

    const newValues = {
      ...activeRegion.values,
      mid: {
        ...activeRegion.values.mid,
        accommodation: midAccPrice,
      },
    }

    updateRegionDraft(activeRegion.id, newValues, {
      cashSharePct: cashShare,
      sourceNote,
      confidence: activeRegion.confidence,
    })

    setDrawerOpen(false)
    toast({
      title: 'Regional Draft Saved',
      description: `Draft for ${activeRegion.name} staged for operator review.`,
      type: 'info',
    })
  }

  const handlePublish = async (regionId: string) => {
    await publishRegionDraft(regionId, 'Audited local accommodation price shift')
    toast({
      title: 'Region CMS Published',
      description: 'Public destination guide updated with "Updated Today" badge.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-text-muted">Regional Benchmark CMS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Regional Cost Indices & Personas
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage local market basket assumptions, hotel room nightly anchors, and cash reliance percentages across 8 reference global destinations.
          </p>
        </div>
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.map((r) => {
          const hasDraft = Boolean(r.draft)

          return (
            <div
              key={r.id}
              className={`bg-surface border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                hasDraft ? 'border-amber-400 bg-amber-50/20' : 'border-border shadow-xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Chip variant={hasDraft ? 'warning' : 'neutral'} size="sm">
                    {hasDraft ? 'Draft Staged' : `v${r.version || 3} Published`}
                  </Chip>
                  <span className="font-mono text-xs font-bold text-pine-700">{r.currency}</span>
                </div>

                <div>
                  <h2 className="font-display text-xl text-ink font-semibold">{r.city}, {r.name}</h2>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    Reviewed: {r.lastReviewed}
                  </div>
                </div>

                <div className="p-3 bg-sunken rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Cash Reliance:</span>
                    <strong className="text-text-primary">{r.draftMeta?.cashSharePct ?? r.cashSharePct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Mid Hotel / Night:</span>
                    <strong className="text-pine-700">${r.draft?.mid?.accommodation ?? r.values.mid.accommodation}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Cost Index:</span>
                    <span className="text-text-secondary">{(r.costIndex * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-divider mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(r)}
                  className="gap-1 font-mono text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Draft
                </Button>

                {hasDraft && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePublish(r.id)}
                    className="font-mono text-xs"
                  >
                    Publish
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`Edit Regional CMS: ${activeRegion?.city}, ${activeRegion?.name}`}
        description="Stage adjustments to local cost assumptions and cash dependency."
      >
        <div className="space-y-6 text-xs font-mono">
          <div className="space-y-2">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Cash Reliance Percentage (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={95}
                value={cashShare}
                onChange={(e) => setCashShare(Number(e.target.value))}
                className="flex-1 accent-pine-600"
              />
              <span className="font-bold text-sm w-12 text-right">{cashShare}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Mid-Range Hotel Room Night ($ USD Anchor)</label>
            <input
              type="number"
              value={midAccPrice}
              onChange={(e) => setMidAccPrice(Number(e.target.value))}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-base font-bold text-ink focus:ring-1 focus:ring-pine-500"
            />
            <span className="text-[10px] text-text-muted">Original baseline: ${originalAcc} USD / night</span>
          </div>

          {/* Sanity Check Warning */}
          {isSanityWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <strong>Sanity Warning:</strong> Nightly rate adjustment of <strong>{accDeltaPct.toFixed(1)}%</strong> exceeds typical monthly inflation bounds (&gt;40%).
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Data Source & Auditor Reference</label>
            <textarea
              rows={3}
              value={sourceNote}
              onChange={(e) => setSourceNote(e.target.value)}
              className="w-full bg-sunken border border-divider rounded-xl p-2.5 text-xs font-sans focus:ring-1 focus:ring-pine-500"
            />
          </div>

          <div className="pt-4 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveDraft} className="flex-1">
              Save Staged Draft
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
