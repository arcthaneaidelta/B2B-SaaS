import React, { useState } from 'react'
import { ArrowLeftRight, RotateCcw } from 'lucide-react'
import { AmountInput } from '../../components/ui/Input'
import { Segmented } from '../../components/ui/Segmented'
import { Chip, Tag } from '../../components/ui/Chip'
import { ProviderRow } from '../../components/domain/ProviderRow'
import { RateFreshness } from '../../components/domain/RateFreshness'
import { Drawer } from '../../components/ui/Drawer'
import { Waterfall } from '../../components/charts/Waterfall'
import { ReceiptPanel } from '../../components/domain/ReceiptPanel'
import { useStore, getRateInfo } from '../../mock/store'
import { computeQuote, rankQuotes, savings } from '../../engine/quote'
import { formatMoney, formatPct } from '../../engine/format'
import { CURRENCIES, HOME_CURRENCIES, DEST_CURRENCIES } from '../../data/seed/currencies'
import type { TxType, Quote } from '../../engine/types'

export const ConverterPage: React.FC = () => {
  const state = useStore()
  const { providers, feeRules, prefs } = state

  const [amount, setAmount] = useState('2000')
  const [homeCcy, setHomeCcy] = useState(prefs.homeCcy || 'GBP')
  const [destCcy, setDestCcy] = useState('JPY')
  const [txType, setTxType] = useState<TxType>('card')
  const [isWeekend, setIsWeekend] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const providerMap = React.useMemo(() => Object.fromEntries(providers.map((p) => [p.id, p])), [providers])
  const ruleMap = React.useMemo(() => Object.fromEntries(feeRules.map((r) => [`${r.providerId}:${r.txType}`, r])), [feeRules])

  const rateInfo = getRateInfo(state, homeCcy, destCcy)

  // Swap currencies
  const handleSwap = () => {
    setHomeCcy(destCcy)
    setDestCcy(homeCcy)
  }

  // Calculate live quotes
  const quotes = React.useMemo(() => {
    return providers.map((p) =>
      computeQuote({
        amountHome: amount,
        homeCcy,
        destCcy,
        txType,
        provider: p,
        rule: ruleMap[`${p.id}:${txType}`],
        rate: rateInfo,
        ruleToHome: '1',
        weekend: isWeekend,
      })
    )
  }, [amount, homeCcy, destCcy, txType, providers, ruleMap, rateInfo, isWeekend])

  const rankedQuotes = React.useMemo(() => rankQuotes(quotes, providerMap, ruleMap), [quotes, providerMap, ruleMap])
  const quoteSavings = React.useMemo(() => savings(rankedQuotes), [rankedQuotes])

  return (
    <div className="container-app py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-divider pb-4">
        <div>
          <span className="eyebrow block">CURRENCY CONVERSION ENGINE</span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-text-primary">
            Quick Currency Converter
          </h1>
        </div>
        <RateFreshness variant="badge" />
      </div>

      {/* Main 2-column layout (PRD U02) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Sticky Input Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="card card-pad bg-elevated shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display font-medium text-lg text-text-primary">Transfer parameters</span>
              <button
                type="button"
                onClick={() => {
                  setAmount('2000')
                  setHomeCcy('GBP')
                  setDestCcy('JPY')
                  setTxType('card')
                  setIsWeekend(false)
                }}
                className="inline-flex items-center gap-1 text-xs font-mono text-text-muted hover:text-pine-700 transition-colors cursor-pointer"
                title="Reset to default values"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Currency Pair inputs with central swap button */}
            <div className="space-y-3 relative">
              <div className="space-y-1">
                <label className="field-label">You send</label>
                <div className="flex items-center gap-2">
                  <AmountInput
                    value={amount}
                    onChange={setAmount}
                    currencyCode={homeCcy}
                    currencySymbol={CURRENCIES[homeCcy]?.symbol}
                  />
                  <select
                    value={homeCcy}
                    onChange={(e) => setHomeCcy(e.target.value)}
                    className="input w-28 font-mono text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    {HOME_CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1 relative z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-8 h-8 rounded-full border border-border bg-sunken hover:bg-pine-100 text-text-secondary hover:text-pine-800 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Swap currencies"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="field-label">You spend in</label>
                <div className="flex items-center gap-2">
                  <div className="input flex items-center justify-between font-mono font-medium text-base tnum bg-sunken/40">
                    <span>
                      {rankedQuotes[0]?.status === 'OK'
                        ? formatMoney(rankedQuotes[0].destAmount, destCcy, { showSymbol: false })
                        : '—'}
                    </span>
                    <span className="text-xs text-text-muted font-sans">(Est. top payout)</span>
                  </div>
                  <select
                    value={destCcy}
                    onChange={(e) => setDestCcy(e.target.value)}
                    className="input w-28 font-mono text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    {DEST_CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick amount chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-text-muted">Quick amounts:</span>
              <div className="flex flex-wrap gap-1.5">
                {['500', '1000', '2500', '5000', '10000'].map((val) => (
                  <Chip
                    key={val}
                    selected={amount === val}
                    onClick={() => setAmount(val)}
                  >
                    {formatMoney(val, homeCcy, { showSymbol: false })}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Transaction Type Tabs */}
            <div className="space-y-1.5 pt-2 border-t border-divider">
              <label className="field-label">Payment method</label>
              <Segmented<TxType>
                value={txType}
                onChange={setTxType}
                options={[
                  { value: 'card', label: 'Card spend' },
                  { value: 'atm', label: 'ATM cash' },
                  { value: 'transfer', label: 'Bank transfer' },
                  { value: 'cash', label: 'Cash desk' },
                ]}
              />
            </div>

            {/* Weekend markup toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-divider">
              <div>
                <span className="text-xs font-medium text-text-primary block">Paying on a weekend</span>
                <span className="text-[11px] text-text-muted">Simulates weekend exchange rate markups</span>
              </div>
              <input
                type="checkbox"
                checked={isWeekend}
                onChange={(e) => setIsWeekend(e.target.checked)}
                className="w-4 h-4 rounded text-pine-600 focus:ring-pine-600 cursor-pointer"
              />
            </div>

            {/* Rate Receipt Line */}
            <div className="pt-2 border-t border-divider text-xs font-mono text-text-muted flex items-center justify-between">
              <div>
                <span className="block text-text-primary font-medium">
                  1 {homeCcy} = {rateInfo?.refRate} {destCcy}
                </span>
                <span className="text-[11px]">
                  {rateInfo?.source} {rateInfo?.overrideActive && '• (Override active)'}
                </span>
              </div>
              {rateInfo?.overrideActive && (
                <Tag variant="clay">Override</Tag>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Ranked Provider Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Savings banner */}
          {quoteSavings && (
            <div className="p-3.5 bg-pine-50 border border-pine-200/80 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-pine-900 leading-snug">
                You keep <span className="font-semibold text-pine-800">{formatMoney(quoteSavings.diff, homeCcy)} more</span> with {providerMap[quoteSavings.best.providerId]?.name} than with {providerMap[quoteSavings.worst.providerId]?.name}.
              </span>
            </div>
          )}

          {/* Table Container */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-8">Rank</th>
                  <th>Provider</th>
                  <th className="num">Rate applied</th>
                  <th className="num">Fees</th>
                  <th className="num">You receive</th>
                  <th className="num">Cost</th>
                  <th className="w-36 text-right pr-4">Effective cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {rankedQuotes.map((q, idx) => (
                  <ProviderRow
                    key={q.providerId}
                    quote={q}
                    provider={providerMap[q.providerId]}
                    rank={idx + 1}
                    isBest={idx === 0 && q.status === 'OK'}
                    onClick={() => setSelectedQuote(q)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-text-muted leading-relaxed font-mono">
            Click any provider row to inspect the audited mathematical waterfall and fee deduction trace.
          </p>
        </div>
      </div>

      {/* Fee Anatomy Drawer overlay (PRD U05) */}
      {selectedQuote && (
        <Drawer
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Fee Breakdown: ${providerMap[selectedQuote.providerId]?.name}`}
          subtitle={`${selectedQuote.homeCcy} ${selectedQuote.amountHome} converted to ${selectedQuote.destCcy}`}
        >
          <div className="space-y-6">
            <div className="p-4 bg-sunken rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-text-muted block">You receive</span>
                <span className="font-display text-2xl font-medium text-text-primary">
                  {formatMoney(selectedQuote.destAmount, selectedQuote.destCcy)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted block">Total cost in {selectedQuote.homeCcy}</span>
                <span className="font-mono text-sm font-semibold text-pine-700">
                  {formatMoney(selectedQuote.costHome, selectedQuote.homeCcy)} ({formatPct(selectedQuote.effectivePct)})
                </span>
              </div>
            </div>

            <Waterfall
              steps={selectedQuote.waterfall}
              homeCcy={selectedQuote.homeCcy}
              destCcy={selectedQuote.destCcy}
            />

            <ReceiptPanel quote={selectedQuote} defaultOpen />
          </div>
        </Drawer>
      )}
    </div>
  )
}
