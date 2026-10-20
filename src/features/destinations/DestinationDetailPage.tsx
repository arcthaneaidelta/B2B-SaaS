import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { simulateTripCosts } from '../../engine/trip'
import { formatMoney } from '../../engine/format'
import { computeQuote } from '../../engine/quote'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const state = useStore()
  const { regions, providers } = state

  const region = regions.find((r) => r.id === slug) || regions[0]
  const [homeCurrency, setHomeCurrency] = useState('GBP')
  const [convertAmount, setConvertAmount] = useState('500')

  const rateInfo = getRateInfo(state, homeCurrency, region.currency)
  const bestProvider = providers[0]

  const rule = state.feeRules.find((r) => r.providerId === bestProvider.id && r.txType === 'card')
  const quote = computeQuote({
    amountHome: convertAmount || '500',
    homeCcy: homeCurrency,
    destCcy: region.currency,
    txType: 'card',
    provider: bestProvider,
    rule,
    rate: rateInfo,
    ruleToHome: '1',
    weekend: false,
  })

  // Sample 3-day spend for Mid-range
  const sampleSim = simulateTripCosts({
    region,
    nights: 3,
    travellers: 2,
    style: 'mid',
    activeCategories: ['accommodation', 'food', 'transport', 'activities', 'extras'],
    usdToDest: '1.0',
    homeToDest: rateInfo?.refRate || '1.0',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-text-muted border-b border-divider pb-4">
        <Link to="/destinations" className="hover:text-text-primary inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Destinations
        </Link>
        <span>/</span>
        <span className="text-text-primary font-semibold">{region.city}, {region.name}</span>
      </div>

      {/* Hero Banner */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Chip variant={region.cashSharePct >= 35 ? 'warning' : 'pine'} size="sm">
              {region.cashSharePct}% Cash Reliance
            </Chip>
            <span className="text-xs font-mono text-text-muted">Currency: {region.currency}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
            {region.city}, {region.name}
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Local spend index benchmarked at <strong>{(region.costIndex * 100).toFixed(0)}%</strong> of standard baseline. Reviewed by <em>{region.reviewedBy}</em>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate(`/trip/wizard?destination=${region.id}`)}
            className="gap-2 font-mono text-xs"
          >
            <Sparkles className="w-4 h-4" /> Simulate Full Trip Here
          </Button>
        </div>
      </div>

      {/* Payment Ecosystem Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Gotchas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-xl text-ink font-semibold">Payment Infrastructure Profile</h2>

            {/* Cash vs Card Split Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-pine-800">Card & Digital ({100 - region.cashSharePct}%)</span>
                <span className="font-semibold text-amber-800">Physical Cash ({region.cashSharePct}%)</span>
              </div>
              <div className="h-5 w-full rounded-lg overflow-hidden flex shadow-inner">
                <div style={{ width: `${100 - region.cashSharePct}%` }} className="bg-pine-600" />
                <div style={{ width: `${region.cashSharePct}%` }} className="bg-amber-600" />
              </div>
            </div>

            {/* Gotchas & Best Practices */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono font-semibold uppercase text-text-muted">Local FX & Card Gotchas</h3>

              <div className="border border-border/80 rounded-xl p-4 bg-sunken/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-clay-600 shrink-0 mt-0.5" />
                <div className="text-xs text-text-secondary space-y-1">
                  <div className="font-semibold text-text-primary">ATM Operator Surcharges</div>
                  <p>
                    {region.id === 'thailand'
                      ? 'Local ATMs in Thailand charge 220 THB (~£5) per withdrawal on foreign debit cards regardless of your provider. Withdraw larger amounts less frequently.'
                      : region.id === 'japan'
                      ? 'Use 7-Bank (inside 7-Eleven) or Japan Post ATMs. They accept foreign Visa/Mastercard without local machine surcharges.'
                      : 'Always select "Debit in local currency" to prevent the ATM operator from applying their own predatory conversion markups (DCC).'}
                  </p>
                </div>
              </div>

              <div className="border border-border/80 rounded-xl p-4 bg-sunken/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-text-secondary space-y-1">
                  <div className="font-semibold text-text-primary">Merchant Dynamic Currency Conversion (DCC)</div>
                  <p>
                    Card machines will frequently detect your foreign card and offer to charge in your home currency. <strong>Always press Decline / Pay in {region.currency}</strong> to ensure your card provider converts at mid-market interbank rates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 3-Day Spend Breakdown */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl text-ink font-semibold">Sample 3-Day Baseline Budget</h2>
            <p className="text-xs text-text-secondary">
              Illustrative mid-range cost for 2 adults over 3 days in {region.city}.
            </p>

            <div className="divide-y divide-divider/60 text-xs font-mono pt-2">
              {sampleSim.categories.map((c) => (
                <div key={c.category} className="py-2.5 flex items-center justify-between">
                  <span className="text-text-secondary capitalize">{c.category}</span>
                  <span className="font-bold text-text-primary">{formatMoney(c.destAmount, region.currency)}</span>
                </div>
              ))}
              <div className="py-3 flex items-center justify-between font-bold text-sm text-pine-800">
                <span>Total 3-Day Estimate</span>
                <span>{formatMoney(sampleSim.totalDest, region.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Currency Converter */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink font-semibold">Live Rate Converter</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pine-100 text-pine-800 font-semibold">
                Live ECB Feed
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-text-muted block text-[11px] mb-1">You send</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    className="flex-1 bg-sunken border border-divider rounded-lg p-2 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pine-500"
                  />
                  <select
                    value={homeCurrency}
                    onChange={(e) => setHomeCurrency(e.target.value)}
                    className="bg-sunken border border-divider rounded-lg px-2 font-bold focus:outline-none"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-pine-50/60 border border-pine-200/80 rounded-xl space-y-2">
                <div className="text-[11px] text-pine-900 font-medium">Recipient receives ({region.currency})</div>
                <div className="text-2xl font-bold font-mono text-pine-800">
                  {formatMoney(quote.destAmount, region.currency)}
                </div>
                <div className="text-[10px] text-text-muted pt-1 border-t border-pine-200/40">
                  Mid-market: 1 {homeCurrency} = {rateInfo?.refRate || '1.0000'} {region.currency}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/convert?from=${homeCurrency}&to=${region.currency}&amount=${convertAmount}`)}
                className="w-full text-xs font-mono"
              >
                Full Multi-Provider Comparison
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
