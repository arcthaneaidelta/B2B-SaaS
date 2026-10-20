import React, { useState } from 'react'
import { Sparkles, Play } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { Drawer } from '../../components/ui/Drawer'
import { computeQuote } from '../../engine/quote'
import { formatMoney } from '../../engine/format'
import { useToast } from '../../components/ui/Toast'

export const FeeMatrixPage: React.FC = () => {
  const state = useStore()
  const {
    feeRules,
    feeRuleDrafts,
    updateRuleDraftCell,
    discardFeeDrafts,
    publishFeeDrafts,
    providers,
    matrixHistory,
  } = state
  const { toast } = useToast()

  const [testDrawerOpen, setTestDrawerOpen] = useState(false)
  const [testAmount, setTestAmount] = useState('1000')
  const [testProviderId, setTestProviderId] = useState('wise')

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [publishNote, setPublishNote] = useState('')

  const dirtyCount = Object.keys(feeRuleDrafts).length

  const handlePublish = async () => {
    if (!publishNote.trim()) {
      toast({
        title: 'Note Required',
        description: 'Provide an audit explanation for this fee schedule version bump.',
        type: 'error',
      })
      return
    }

    const newVersion = await publishFeeDrafts(publishNote, new Date().toISOString())
    setPublishModalOpen(false)
    setPublishNote('')
    toast({
      title: 'Fee Matrix Published (W6 Success)',
      description: `Version v${newVersion} published to live calculation engine.`,
      type: 'success',
    })
  }

  // Sample Quote calculation for Test Harness
  const currentProvider = providers.find((p) => p.id === testProviderId) || providers[0]
  const rateInfo = getRateInfo(state, 'GBP', 'EUR', currentProvider.id)
  const testRule = feeRules.find((r) => r.providerId === currentProvider.id && r.txType === 'card')

  const sampleQuote = computeQuote({
    amountHome: testAmount || '1000',
    homeCcy: 'GBP',
    destCcy: 'EUR',
    txType: 'card',
    provider: currentProvider,
    rule: testRule,
    rate: rateInfo,
    ruleToHome: '1',
    weekend: false,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Chip variant="pine" size="sm">Test Harness W6</Chip>
            <span className="text-xs font-mono text-text-muted">Spreadsheet Rule Editor</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Provider Fee Matrix Schedule
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Maintain fixed and percentage fee schedules, free monthly allowances, and weekend surcharges across card, ATM, and transfer rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setTestDrawerOpen(true)}
            className="gap-1.5 font-mono text-xs"
          >
            <Play className="w-3.5 h-3.5 text-pine-700" /> Test with Sample Quote
          </Button>
          <Button
            variant="primary"
            disabled={dirtyCount === 0}
            onClick={() => setPublishModalOpen(true)}
            className="gap-1.5 font-mono text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Publish Drafts ({dirtyCount})
          </Button>
        </div>
      </div>

      {/* Dirty Draft Banner */}
      {dirtyCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-4 text-xs font-mono text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
            <span><strong>{dirtyCount} unsaved rule edit(s) in draft.</strong> These changes are staged locally and not yet affecting public quotes.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => discardFeeDrafts()} className="text-xs text-amber-900 hover:bg-amber-100">
              Discard Drafts
            </Button>
            <Button variant="primary" size="sm" onClick={() => setPublishModalOpen(true)} className="text-xs">
              Publish v{((matrixHistory[0]?.version ?? 7) + 1)}
            </Button>
          </div>
        </div>
      )}

      {/* Matrix Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Rail / Type</th>
                <th className="py-3 px-4">Percent Fee (%)</th>
                <th className="py-3 px-4">Fixed Fee</th>
                <th className="py-3 px-4">Free Allowance</th>
                <th className="py-3 px-4">Weekend Markup (%)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/60">
              {feeRules.map((rule) => {
                const draft = feeRuleDrafts[rule.id]
                const isDirty = Boolean(draft)
                const currentPct = draft?.pctFee !== undefined ? draft.pctFee : rule.pctFee
                const currentFixed = draft?.fixedFee !== undefined ? draft.fixedFee : rule.fixedFee
                const currentWeekend = draft?.weekendMarkupPct !== undefined ? draft.weekendMarkupPct : rule.weekendMarkupPct
                const p = providers.find((pr) => pr.id === rule.providerId)

                return (
                  <tr key={rule.id} className={isDirty ? 'bg-amber-50/40' : 'hover:bg-sunken/30 transition-colors'}>
                    <td className="py-3 px-4 font-bold text-ink">
                      {p?.name || rule.providerId}
                    </td>
                    <td className="py-3 px-4 text-text-secondary uppercase text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-sunken border border-divider">
                        {rule.txType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentPct}
                          onChange={(e) => updateRuleDraftCell(rule.id, 'pctFee', e.target.value)}
                          className="w-20 bg-surface border border-divider rounded p-1 text-xs font-mono font-bold focus:ring-1 focus:ring-pine-500"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-text-muted">£</span>
                        <input
                          type="text"
                          value={currentFixed}
                          onChange={(e) => updateRuleDraftCell(rule.id, 'fixedFee', e.target.value)}
                          className="w-20 bg-surface border border-divider rounded p-1 text-xs font-mono font-bold focus:ring-1 focus:ring-pine-500"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {rule.freeAllowance ? `£${rule.freeAllowance}` : 'None'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentWeekend}
                          onChange={(e) => updateRuleDraftCell(rule.id, 'weekendMarkupPct', e.target.value)}
                          className="w-16 bg-surface border border-divider rounded p-1 text-xs font-mono focus:ring-1 focus:ring-pine-500"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {isDirty ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Draft Edited
                        </span>
                      ) : (
                        <span className="text-text-muted">v{rule.version || 6} Live</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Harness Drawer */}
      <Drawer
        open={testDrawerOpen}
        onClose={() => setTestDrawerOpen(false)}
        title="Live Fee Schedule Verification"
        description="Verify how current matrix numbers reflect inside a live 12-step calculation."
      >
        <div className="space-y-5 text-xs font-mono">
          <div className="space-y-2">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Test Provider</label>
            <select
              value={testProviderId}
              onChange={(e) => setTestProviderId(e.target.value)}
              className="w-full bg-sunken border border-divider rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-pine-500"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Test Amount (£ GBP)</label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-pine-500"
            />
          </div>

          {/* Result Card */}
          <div className="p-4 bg-pine-50/70 border border-pine-200 rounded-xl space-y-3">
            <div className="text-[11px] font-semibold text-pine-900 uppercase">
              12-Step Waterfall Output
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Gross Send:</span>
                <span className="font-bold">£{testAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Fee Deducted:</span>
                <span>{formatMoney(sampleQuote.feeHome, 'GBP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Net Converted:</span>
                <span className="font-bold text-pine-800">{formatMoney(sampleQuote.netHome, 'GBP')}</span>
              </div>
              <div className="flex justify-between border-t border-pine-200/60 pt-2 font-bold text-sm text-ink">
                <span>Delivered in EUR:</span>
                <span>{formatMoney(sampleQuote.destAmount, 'EUR')}</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Publish Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 z-modal">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl text-xs font-mono">
            <h2 className="font-display text-xl text-ink font-semibold">Publish Fee Matrix Schedule</h2>
            <p className="text-text-secondary leading-relaxed">
              This will bump the global fee schedule version and immediately apply your {dirtyCount} staged edits across all public quotes and trip simulations.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase text-text-muted font-semibold">Audit Change Note</label>
              <textarea
                rows={3}
                value={publishNote}
                onChange={(e) => setPublishNote(e.target.value)}
                placeholder="e.g. Wise lowered weekend surcharge for Q4 holiday corridor"
                className="w-full bg-sunken border border-divider rounded-xl p-3 text-xs focus:ring-1 focus:ring-pine-500 font-sans"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setPublishModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handlePublish} className="flex-1">
                Confirm & Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
