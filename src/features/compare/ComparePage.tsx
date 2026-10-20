import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AmountInput } from '../../components/ui/Input'
import { Segmented } from '../../components/ui/Segmented'
import { Tabs } from '../../components/ui/Tabs'
import { Chip } from '../../components/ui/Chip'
import { Button } from '../../components/ui/Button'
import { ProviderRow, ProviderCard } from '../../components/domain/ProviderRow'
import { RateFreshness } from '../../components/domain/RateFreshness'
import { Drawer } from '../../components/ui/Drawer'
import { Waterfall } from '../../components/charts/Waterfall'
import { ReceiptPanel } from '../../components/domain/ReceiptPanel'
import { useStore, getRateInfo } from '../../mock/store'
import { computeQuote, rankQuotes } from '../../engine/quote'
import { formatMoney, formatPct } from '../../engine/format'
import { D } from '../../engine/money'
import { HOME_CURRENCIES, DEST_CURRENCIES } from '../../data/seed/currencies'
import { TX_TYPES, TX_LABEL, TX_SHORT, type TxType, type Quote, type ProviderType } from '../../engine/types'
import { cn } from '../../lib/cn'

export const ComparePage: React.FC = () => {
  const state = useStore()
  const { providers, feeRules, prefs } = state

  const [amount, setAmount] = useState('2000')
  const [homeCcy, setHomeCcy] = useState(prefs.homeCcy || 'GBP')
  const [destCcy, setDestCcy] = useState('JPY')
  const [txType, setTxType] = useState<TxType>('card')
  const [viewMode, setViewMode] = useState<'type' | 'matrix'>('type')
  const [typeFilter, setTypeFilter] = useState<'all' | ProviderType>('all')
  const [hideNotOffered, setHideNotOffered] = useState(false)
  const [sortBy, setSortBy] = useState<'cost' | 'rate' | 'fee'>('cost')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const providerMap = React.useMemo(() => Object.fromEntries(providers.map((p) => [p.id, p])), [providers])
  const ruleMap = React.useMemo(() => Object.fromEntries(feeRules.map((r) => [`${r.providerId}:${r.txType}`, r])), [feeRules])

  const rateInfo = getRateInfo(state, homeCcy, destCcy)

  // Compute all quotes for View A
  const activeProviders = providers.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    return true
  })

  const viewAQuotes = React.useMemo(() => {
    return activeProviders.map((p) =>
      computeQuote({
        amountHome: amount,
        homeCcy,
        destCcy,
        txType,
        provider: p,
        rule: ruleMap[`${p.id}:${txType}`],
        rate: rateInfo,
        ruleToHome: '1',
        weekend: false,
      })
    )
  }, [activeProviders, amount, homeCcy, destCcy, txType, ruleMap, rateInfo])

  // Sort View A quotes
  const sortedViewAQuotes = React.useMemo(() => {
    let list = rankQuotes(viewAQuotes, providerMap, ruleMap)
    if (hideNotOffered) list = list.filter((q) => q.status === 'OK')

    if (sortBy === 'rate') {
      return [...list].sort((a, b) => D(b.appliedRate).cmp(D(a.appliedRate)))
    }
    if (sortBy === 'fee') {
      return [...list].sort((a, b) => D(a.feeHome).cmp(D(b.feeHome)))
    }
    return list
  }, [viewAQuotes, providerMap, ruleMap, hideNotOffered, sortBy])

  // Matrix View (View B): Provider rows x 4 transaction types
  const matrixData = React.useMemo(() => {
    return activeProviders.map((p) => {
      const typeQuotes: Record<TxType, Quote> = {} as any
      for (const t of TX_TYPES) {
        typeQuotes[t] = computeQuote({
          amountHome: amount,
          homeCcy,
          destCcy,
          txType: t,
          provider: p,
          rule: ruleMap[`${p.id}:${t}`],
          rate: rateInfo,
          ruleToHome: '1',
          weekend: false,
        })
      }
      return { provider: p, quotes: typeQuotes }
    })
  }, [activeProviders, amount, homeCcy, destCcy, ruleMap, rateInfo])

  // Find lowest effective % per column in matrix view
  const bestPerColumn = React.useMemo(() => {
    const best: Record<TxType, string | null> = { card: null, atm: null, transfer: null, cash: null }
    for (const t of TX_TYPES) {
      let lowest = Infinity
      let bestId: string | null = null
      for (const row of matrixData) {
        const q = row.quotes[t]
        if (q.status === 'OK' && !q.overLimit) {
          const val = Number(q.effectivePct)
          if (val < lowest) {
            lowest = val
            bestId = q.providerId
          }
        }
      }
      best[t] = bestId
    }
    return best
  }, [matrixData])

  return (
    <div className="container-app py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-divider pb-4">
        <div>
          <span className="eyebrow block">PROVIDER COMPARISON MATRIX</span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-text-primary">
            Compare Providers & Pricing
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Audited ranking matrices across card spends, cash machines, and bank transfers.
          </p>
        </div>
        <RateFreshness variant="badge" />
      </div>

      {/* Control Bar */}
      <div className="card card-pad bg-elevated shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <AmountInput
            label="Amount to convert"
            value={amount}
            onChange={setAmount}
            currencyCode={homeCcy}
            currencySymbol={homeCcy === 'GBP' ? '£' : '$'}
          />

          <div className="space-y-1">
            <label className="field-label">Home currency</label>
            <select
              value={homeCcy}
              onChange={(e) => setHomeCcy(e.target.value)}
              className="input font-mono text-xs font-semibold cursor-pointer"
            >
              {HOME_CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="field-label">Destination currency</label>
            <select
              value={destCcy}
              onChange={(e) => setDestCcy(e.target.value)}
              className="input font-mono text-xs font-semibold cursor-pointer"
            >
              {DEST_CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="field-label">View layout</label>
            <Segmented<'type' | 'matrix'>
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: 'type', label: 'By transaction type' },
                { value: 'matrix', label: 'Full 4x6 Matrix' },
              ]}
            />
          </div>
        </div>

        {/* Filter Chips Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-divider text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-text-muted mr-1">Filter type:</span>
            {(['all', 'fintech', 'bank', 'cash'] as const).map((t) => (
              <Chip
                key={t}
                selected={typeFilter === t}
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'All providers' : t === 'fintech' ? 'Fintech' : t === 'bank' ? 'Banks' : 'Cash desks'}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
              <input
                type="checkbox"
                checked={hideNotOffered}
                onChange={(e) => setHideNotOffered(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-pine-600 focus:ring-pine-600"
              />
              <span>Hide not offered</span>
            </label>

            {viewMode === 'type' && (
              <div className="flex items-center gap-1.5">
                <span className="text-text-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input h-8 py-0 px-2 text-xs font-mono font-medium"
                >
                  <option value="cost">Lowest cost</option>
                  <option value="rate">Highest rate</option>
                  <option value="fee">Lowest fixed fee</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIEW A: BY TRANSACTION TYPE */}
      {viewMode === 'type' && (
        <div className="space-y-4">
          <Tabs<TxType>
            activeTab={txType}
            onChange={setTxType}
            tabs={[
              { id: 'card', label: 'Card spend' },
              { id: 'atm', label: 'Cash machine (ATM)' },
              { id: 'transfer', label: 'Bank transfer' },
              { id: 'cash', label: 'Cash desk' },
            ]}
          />

          {/* Desktop Table */}
          <div className="table-wrap hidden md:block">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-10">Rank</th>
                  <th>Provider</th>
                  <th className="num">Applied Rate</th>
                  <th className="num">Fees</th>
                  <th className="num">You receive</th>
                  <th className="num">Cost</th>
                  <th className="w-36 text-right pr-4">Effective %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {sortedViewAQuotes.map((q, idx) => (
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

          {/* Mobile Card List */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {sortedViewAQuotes.map((q, idx) => (
              <ProviderCard
                key={q.providerId}
                quote={q}
                provider={providerMap[q.providerId]}
                rank={idx + 1}
                isBest={idx === 0 && q.status === 'OK'}
                onClick={() => setSelectedQuote(q)}
              />
            ))}
          </div>
        </div>
      )}

      {/* VIEW B: FULL 4x6 MATRIX */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          <div className="table-wrap overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-48">Provider</th>
                  {TX_TYPES.map((t) => (
                    <th key={t} className="num text-center">{TX_SHORT[t]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {matrixData.map((row) => (
                  <tr key={row.provider.id} className="hover:bg-surface/80 transition-colors">
                    <td className="font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full border border-border bg-sunken flex items-center justify-center font-display text-xs font-semibold">
                          {row.provider.monogram}
                        </span>
                        <div>
                          <span className="block text-sm font-semibold">{row.provider.name}</span>
                          <span className="text-[10px] text-text-muted">{row.provider.typeLabel}</span>
                        </div>
                      </div>
                    </td>

                    {TX_TYPES.map((t) => {
                      const q = row.quotes[t]
                      const isBest = bestPerColumn[t] === row.provider.id
                      const isOffered = q.status === 'OK'

                      return (
                        <td
                          key={t}
                          onClick={isOffered ? () => setSelectedQuote(q) : undefined}
                          className={cn(
                            'text-center p-3 font-mono transition-colors',
                            isOffered ? 'cursor-pointer hover:bg-pine-50/50' : 'bg-sunken/40 text-text-disabled',
                            isBest && 'bg-pine-50/30 font-semibold text-pine-800'
                          )}
                        >
                          {isOffered ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-sm font-display">{formatPct(q.effectivePct)}</span>
                                {isBest && (
                                  <span className="text-[9px] font-sans font-medium text-clay-700 bg-clay-50 px-1 rounded">
                                    Lowest
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-text-muted block">
                                {formatMoney(q.costHome, q.homeCcy)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-text-muted text-xs">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-text-muted font-mono leading-relaxed">
            Matrix cells show effective cost percentage and total home currency loss for {formatMoney(amount, homeCcy)}. Click any cell to view the full fee deduction receipt.
          </p>
        </div>
      )}

      {/* Fee Anatomy Drawer overlay (PRD U05) */}
      {selectedQuote && (
        <Drawer
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Fee Breakdown: ${providerMap[selectedQuote.providerId]?.name}`}
          subtitle={`${selectedQuote.homeCcy} ${selectedQuote.amountHome} • ${TX_LABEL[selectedQuote.txType]}`}
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

            <div className="pt-2">
              <Link to={`/providers/${providerMap[selectedQuote.providerId]?.slug}`}>
                <Button variant="secondary" className="w-full">
                  <span>View provider details & full rulebook</span>
                </Button>
              </Link>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )
}
