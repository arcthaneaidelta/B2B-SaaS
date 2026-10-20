import React, { useState } from 'react'
import { Terminal } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { Chip } from '../../components/ui/Chip'
import { computeQuote } from '../../engine/quote'
import { formatMoney, formatRate } from '../../engine/format'
import type { TxType } from '../../engine/types'

export const SandboxPage: React.FC = () => {
  const state = useStore()
  const { providers, feeRules } = state

  const [providerId, setProviderId] = useState('wise')
  const [homeAmount, setHomeAmount] = useState('1000')
  const [homeCcy, setHomeCcy] = useState('GBP')
  const [destCcy, setDestCcy] = useState('EUR')
  const [txType, setTxType] = useState<TxType>('transfer')
  const [isWeekend, setIsWeekend] = useState(false)

  const selectedProvider = providers.find((p) => p.id === providerId) || providers[0]
  const rateInfo = getRateInfo(state, homeCcy, destCcy, selectedProvider.id)
  const rule = feeRules.find((r) => r.providerId === selectedProvider.id && r.txType === txType)

  const quote = computeQuote({
    amountHome: homeAmount || '1000',
    homeCcy,
    destCcy,
    txType,
    provider: selectedProvider,
    rule,
    rate: rateInfo,
    ruleToHome: '1',
    weekend: isWeekend,
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-divider pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-pine-700" />
          <span className="text-xs font-mono text-text-muted">Direct Engine Runner</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
          Calculation Engine Sandbox & Trace
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Directly execute quotes against the 12-step waterfall calculation engine and inspect intermediate Big.js decimal precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters Form */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-xs">
          <h2 className="font-display text-lg text-ink font-semibold">Execution Parameters</h2>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase text-text-muted block mb-1">Provider</label>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="w-full bg-sunken border border-divider rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-pine-500"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.status})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase text-text-muted block mb-1">Gross Home Amount</label>
              <input
                type="number"
                value={homeAmount}
                onChange={(e) => setHomeAmount(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl p-2.5 font-bold text-sm focus:ring-1 focus:ring-pine-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase text-text-muted block mb-1">Home Currency</label>
                <select
                  value={homeCcy}
                  onChange={(e) => setHomeCcy(e.target.value)}
                  className="w-full bg-sunken border border-divider rounded-xl p-2 font-bold focus:ring-1 focus:ring-pine-500"
                >
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase text-text-muted block mb-1">Destination Currency</label>
                <select
                  value={destCcy}
                  onChange={(e) => setDestCcy(e.target.value)}
                  className="w-full bg-sunken border border-divider rounded-xl p-2 font-bold focus:ring-1 focus:ring-pine-500"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="THB">THB</option>
                  <option value="TRY">TRY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase text-text-muted block mb-1">Transaction Rail</label>
              <div className="grid grid-cols-3 gap-2">
                {(['transfer', 'card', 'atm'] as TxType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTxType(t)}
                    className={`py-1.5 rounded-lg border uppercase text-[11px] font-bold transition-colors cursor-pointer ${
                      txType === t ? 'bg-pine-600 text-white border-pine-600' : 'bg-sunken border-divider text-text-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-divider">
              <span className="text-text-secondary text-xs">Simulate Weekend Surcharge:</span>
              <button
                type="button"
                onClick={() => setIsWeekend(!isWeekend)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isWeekend ? 'bg-clay-600 text-white' : 'bg-sunken text-text-muted border border-divider'
                }`}
              >
                {isWeekend ? 'Weekend (+1.0%)' : 'Weekday'}
              </button>
            </div>
          </div>
        </div>

        {/* Output & 12-Step Waterfall Trace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Result Banner */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div>
              <div className="text-[11px] font-mono text-text-muted uppercase">Final Destination Amount</div>
              <div className="text-3xl font-mono font-bold text-pine-700 mt-1">
                {formatMoney(quote.destAmount, destCcy)}
              </div>
              <div className="text-xs font-mono text-text-muted mt-1">
                Effective FX Rate: 1 {homeCcy} = {formatRate(quote.appliedRate)} {destCcy}
              </div>
            </div>

            <div className="p-4 bg-sunken rounded-xl border border-divider text-xs font-mono space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Total Loss vs Parity:</span>
                <span className="font-bold text-clay-600">{formatMoney(quote.costHome, homeCcy)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Effective Fee %:</span>
                <span className="font-bold text-clay-600">
                  {parseFloat(quote.effectivePct || '0').toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Trace Execution Waterfall */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <h3 className="font-display text-lg text-ink font-semibold">12-Step Audit Trace</h3>
              <Chip variant="pine" size="sm">Big.js 12-dp Precision</Chip>
            </div>

            {quote.trace.length > 0 ? (
              <div className="space-y-2 text-xs font-mono">
                {quote.trace.map((step) => (
                  <div
                    key={step.step}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-divider/60 gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-pine-900">Step {step.step}:</span>
                        <span className="text-text-primary font-medium">{step.label}</span>
                      </div>
                      <span className="text-[10px] text-text-muted block font-sans mt-0.5">
                        {step.formula} &rarr; <span className="font-mono text-text-secondary">{step.inputs}</span>
                      </span>
                    </div>
                    <div className="font-bold text-sm text-text-primary text-right shrink-0">
                      {step.output}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-text-muted text-xs font-mono">
                {quote.reason || 'No calculation trace available for this configuration.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
