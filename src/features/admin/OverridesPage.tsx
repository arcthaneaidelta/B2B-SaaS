import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Plus, AlertTriangle, ShieldAlert, ExternalLink } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { Drawer } from '../../components/ui/Drawer'
import { formatRate, formatMoney } from '../../engine/format'
import { computeQuote } from '../../engine/quote'
import { useToast } from '../../components/ui/Toast'
import { HOUR, mockNow } from '../../mock/clock'

const PAIRS = ['GBP/EUR', 'GBP/USD', 'GBP/JPY', 'EUR/USD', 'USD/JPY', 'GBP/THB', 'GBP/TRY', 'GBP/MXN']

export const OverridesPage: React.FC = () => {
  const state = useStore()
  const {
    activeOverrides,
    overrideHistory,
    providers,
    feeRules,
    createOverride,
    revokeOverride,
    extendOverride,
    prefs,
  } = state
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Drawer Form state
  const [selectedPair, setSelectedPair] = useState('GBP/EUR')
  const [scope, setScope] = useState<'all' | 'specific'>('all')
  const [overrideRate, setOverrideRate] = useState('')
  const [durationHours, setDurationHours] = useState(4)
  const [reason, setReason] = useState('')

  // Derive current live rate for selected pair
  const [homeCcy, destCcy] = selectedPair.split('/')
  const currentRateInfo = getRateInfo(state, homeCcy, destCcy)
  const liveRate = currentRateInfo ? Number(currentRateInfo.refRate) : 1.18

  // Initialize or update overrideRate when pair changes
  const targetRateNum = parseFloat(overrideRate) || liveRate
  const diffPct = ((targetRateNum - liveRate) / liveRate) * 100
  const diffBps = Math.round(diffPct * 100)

  // Fat finger guard
  const isWarning = Math.abs(diffPct) > 2.0 && Math.abs(diffPct) <= 10.0
  const isBlocked = Math.abs(diffPct) > 10.0

  // Live impact calculation for £1,000
  const testProvider = providers[0]
  const testRule = feeRules.find((r) => r.providerId === testProvider.id && r.txType === 'transfer')
  const quoteBefore = computeQuote({
    amountHome: '1000',
    homeCcy,
    destCcy,
    txType: 'transfer',
    provider: testProvider,
    rule: testRule,
    rate: currentRateInfo,
    ruleToHome: '1',
    weekend: false,
  })

  const quoteAfter = computeQuote({
    amountHome: '1000',
    homeCcy,
    destCcy,
    txType: 'transfer',
    provider: testProvider,
    rule: testRule,
    rate: currentRateInfo
      ? {
          ...currentRateInfo,
          rate: targetRateNum,
          refRate: targetRateNum.toFixed(4),
          baseRate: targetRateNum.toFixed(4),
        }
      : null,
    ruleToHome: '1',
    weekend: false,
  })

  const handleOpenDrawer = () => {
    setOverrideRate(liveRate.toFixed(4))
    setReason('')
    setDrawerOpen(true)
  }

  const handleApplyOverride = async () => {
    if (isBlocked) return
    if (!reason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please specify an operational rationale for this override.',
        type: 'error',
      })
      return
    }

    const now = mockNow()
    await createOverride({
      pair: selectedPair,
      rate: targetRateNum.toFixed(4),
      liveRateAtCreation: liveRate.toFixed(4),
      appliesTo: scope === 'all' ? 'all' : [testProvider.id],
      reason,
      createdBy: prefs.adminUser.name,
      createdByRole: prefs.adminRole,
      approver: prefs.adminUser.name,
      expiresAt: now + durationHours * HOUR,
    })

    setDrawerOpen(false)
    toast({
      title: 'Override Deployed (W5 Success)',
      description: `${selectedPair} rate adjusted to ${targetRateNum.toFixed(4)}. Public screens updated instantly.`,
      type: 'success',
    })
  }

  const handleRevoke = async (id: string) => {
    await revokeOverride(id, 'Operator manual revoke')
    toast({
      title: 'Override Revoked',
      description: 'Exchange rate reverted to real-time ECB feed.',
      type: 'info',
    })
  }

  const handleExtend = async (id: string, hours: number) => {
    await extendOverride(id, hours * HOUR)
    toast({
      title: 'Override Extended',
      description: `Extended expiry by ${hours} hour(s).`,
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Chip variant="pine" size="sm">Hero Admin Moment W5</Chip>
            <span className="text-xs font-mono text-text-muted">Live Public Sync Active</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Rate Overrides & Strategic Spreads
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Inject manual rate corrections, promotional spreads, or defensive hedges with fat-finger guard rails and live impact previews.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenDrawer}
          className="gap-2 font-mono text-xs"
        >
          <Plus className="w-4 h-4" /> Create Rate Override
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-divider text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`pb-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'active' ? 'border-pine-600 text-pine-700' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Active Overrides ({activeOverrides.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'history' ? 'border-pine-600 text-pine-700' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Archived History ({overrideHistory.length})
        </button>
      </div>

      {/* Active Overrides Table */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeOverrides.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
              <Zap className="w-10 h-10 text-text-muted mx-auto" />
              <h2 className="font-display text-lg text-ink font-semibold">No Active Overrides</h2>
              <p className="text-xs text-text-secondary">
                All currency conversions across public and private pages are currently executing against pure interbank ECB reference feeds.
              </p>
              <Button variant="primary" onClick={handleOpenDrawer} className="font-mono text-xs">
                Launch Override W5
              </Button>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Pair</th>
                      <th className="py-3 px-4">Override Rate</th>
                      <th className="py-3 px-4">Live at Creation</th>
                      <th className="py-3 px-4">Scope</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Operator</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider/60">
                    {activeOverrides.map((ov) => {
                      const [h, d] = ov.pair.split('/')
                      return (
                        <tr key={ov.id} className="hover:bg-sunken/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-pine-800">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              {ov.pair}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-ink">
                            {formatRate(Number(ov.rate))}
                          </td>
                          <td className="py-3.5 px-4 text-text-muted">
                            {formatRate(Number(ov.liveRateAtCreation))}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-pine-100 text-pine-800 text-[10px] font-semibold">
                              {ov.appliesTo === 'all' ? 'All Providers' : `${ov.appliesTo.length} Providers`}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-text-secondary max-w-xs truncate" title={ov.reason}>
                            {ov.reason}
                          </td>
                          <td className="py-3.5 px-4 text-text-muted">
                            {ov.createdBy}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <Link
                              to={`/convert?from=${h}&to=${d}&amount=1000`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sunken hover:bg-border/60 text-[11px] text-text-primary transition-colors"
                              title="Test in Public Converter"
                            >
                              <ExternalLink className="w-3 h-3" /> Test Public
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExtend(ov.id, 2)}
                              className="text-[11px]"
                            >
                              +2h
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevoke(ov.id)}
                              className="text-[11px] text-error hover:bg-error-50"
                            >
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Pair</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider/60">
                {overrideHistory.map((h) => (
                  <tr key={h.id}>
                    <td className="py-3 px-4 text-text-muted">{h.id}</td>
                    <td className="py-3 px-4 font-bold">{h.pair}</td>
                    <td className="py-3 px-4">{h.rate}</td>
                    <td className="py-3 px-4">
                      <Chip variant={h.status === 'expired' ? 'neutral' : 'warning'} size="sm">
                        {h.status}
                      </Chip>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{h.reason}</td>
                    <td className="py-3 px-4 text-text-muted">{h.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Override Drawer (W5 Hero Moment) */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Deploy Rate Override (W5)"
        description="Temporarily alter applied conversion rates with audit tracking and live impact preview."
      >
        <div className="space-y-6 text-xs font-mono">
          {/* Pair Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Target Currency Pair</label>
            <select
              value={selectedPair}
              onChange={(e) => {
                setSelectedPair(e.target.value)
                const [h, d] = e.target.value.split('/')
                const rInfo = getRateInfo(state, h, d)
                setOverrideRate(rInfo ? Number(rInfo.refRate).toFixed(4) : '1.0000')
              }}
              className="w-full bg-sunken border border-divider rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-pine-500"
            >
              {PAIRS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Current Live Rate & Target Rate */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-sunken rounded-xl border border-divider">
            <div>
              <span className="text-[10px] text-text-muted block uppercase">Current Mid-Market</span>
              <strong className="text-sm font-bold text-text-primary">{formatRate(liveRate)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block uppercase">Proposed Shift</span>
              <strong className={`text-sm font-bold ${diffPct >= 0 ? 'text-emerald-600' : 'text-clay-600'}`}>
                {diffPct >= 0 ? '+' : ''}{diffPct.toFixed(2)}% ({diffBps > 0 ? '+' : ''}{diffBps} bps)
              </strong>
            </div>
          </div>

          {/* Override Rate Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Override Rate Value</label>
            <input
              type="number"
              step="0.0001"
              value={overrideRate}
              onChange={(e) => setOverrideRate(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-base font-bold text-ink focus:outline-none focus:ring-2 focus:ring-pine-500"
            />
          </div>

          {/* Fat-Finger Guard Alerts */}
          {isWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <strong>Fat-Finger Caution:</strong> This override shifts the market rate by <strong>{diffPct.toFixed(2)}%</strong> (&gt;2.0%). Ensure this is intentional.
              </div>
            </div>
          )}

          {isBlocked && (
            <div className="p-3 bg-error-50 border border-error/50 rounded-xl flex items-start gap-2.5 text-error">
              <ShieldAlert className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <strong>Fat-Finger Safety Lock:</strong> Adjustments exceeding ±10% are strictly blocked to protect calculation integrity.
              </div>
            </div>
          )}

          {/* Live Impact Preview (1000 Send) */}
          <div className="p-4 bg-pine-50/60 border border-pine-200 rounded-xl space-y-2">
            <div className="text-[11px] font-semibold text-pine-900 flex items-center justify-between">
              <span>Live Quote Impact Preview (1,000 {homeCcy})</span>
              <span className="text-[10px] text-pine-700">Test with {testProvider.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-text-muted block text-[10px]">Before Override:</span>
                <span className="font-bold text-text-primary">{formatMoney(quoteBefore.destAmount, destCcy)}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">After Override:</span>
                <span className="font-bold text-pine-800">{formatMoney(quoteAfter.destAmount, destCcy)}</span>
              </div>
            </div>
            <div className="text-[10px] text-text-muted pt-1 border-t border-pine-200/40">
              Net Recipient Delta: <strong>{(parseFloat(quoteAfter.destAmount) - parseFloat(quoteBefore.destAmount)) > 0 ? '+' : ''}{formatMoney((parseFloat(quoteAfter.destAmount) - parseFloat(quoteBefore.destAmount)).toString(), destCcy)}</strong>
            </div>
          </div>

          {/* Scope Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Scope</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                  scope === 'all' ? 'bg-pine-600 text-white font-bold border-pine-600' : 'bg-sunken border-divider text-text-secondary'
                }`}
              >
                All Providers
              </button>
              <button
                type="button"
                onClick={() => setScope('specific')}
                className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                  scope === 'specific' ? 'bg-pine-600 text-white font-bold border-pine-600' : 'bg-sunken border-divider text-text-secondary'
                }`}
              >
                Specific Providers
              </button>
            </div>
          </div>

          {/* Expiry Hours */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Duration</label>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[1, 4, 12, 24].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDurationHours(h)}
                  className={`py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    durationHours === h ? 'bg-surface border-pine-600 text-pine-800 font-bold' : 'bg-sunken border-divider text-text-muted'
                  }`}
                >
                  {h} Hours
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase text-text-muted font-semibold">Operational Rationale (Mandatory)</label>
            <input
              type="text"
              placeholder="e.g. Primary feed lag during central bank announcement"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pine-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={handleApplyOverride}
              disabled={isBlocked || !reason.trim()}
              className="w-full font-mono text-xs py-3"
            >
              Confirm & Deploy Override (Sync Public)
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
