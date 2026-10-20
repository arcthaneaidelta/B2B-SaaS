import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Banknote, CheckCircle2, Share2, Printer, Sparkles, AlertCircle, FileText } from 'lucide-react'
import { useStore, getRateInfo } from '../../mock/store'
import { computePaymentStrategy } from '../../engine/strategy'
import { simulateTripCosts } from '../../engine/trip'
import { formatMoney } from '../../engine/format'
import { MoneyValue } from '../../components/domain/MoneyValue'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { Drawer } from '../../components/ui/Drawer'
import { useToast } from '../../components/ui/Toast'
import { STYLE_LABEL } from '../../engine/types'

export const PaymentStrategyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const state = useStore()
  const { savedTrips, regions, providers, feeRules } = state
  const [activeTab, setActiveTab] = useState<'strategy' | 'atm' | 'cards'>('strategy')
  const [mathDrawerOpen, setMathDrawerOpen] = useState(false)

  const trip = savedTrips.find((t) => t.id === id) || savedTrips[0]
  const region = regions.find((r) => r.id === trip.destinationId) || regions[0]

  const rateInfo = getRateInfo(state, trip.homeCcy, region.currency)
  const homeToDest = rateInfo ? rateInfo.refRate : '196.40'

  // Run simulation to get category breakdowns
  const sim = simulateTripCosts({
    region,
    nights: trip.nights,
    travellers: trip.travellers,
    style: trip.style,
    activeCategories: trip.categories,
    usdToDest: '1.0',
    homeToDest,
  })

  // Map rules dictionary for strategy engine
  const rulesMap = Object.fromEntries(feeRules.map((r) => [`${r.providerId}:${r.txType}`, r]))

  const strategy = computePaymentStrategy({
    categories: sim.categories,
    homeCcy: trip.homeCcy,
    destCcy: region.currency,
    cashSharePct: region.cashSharePct,
    providers,
    rules: rulesMap,
    rate: rateInfo,
    ruleToHome: '1.0',
    weekend: false,
  })

  const optimisedPlan = strategy.plans.find((p) => p.id === 'optimised') || strategy.plans[0]
  const simplePlan = strategy.plans.find((p) => p.id === 'simple') || strategy.plans[1]
  const defaultPlan = strategy.plans.find((p) => p.id === 'default') || strategy.plans[2]

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Strategy Link Copied',
        description: 'Direct link to this payment strategy copied to clipboard.',
        type: 'success',
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <Link to={`/trip/${trip.id}`} className="hover:text-text-primary inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Simulator
          </Link>
          <span>/</span>
          <span className="text-text-primary font-semibold">Payment Strategy</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 text-xs font-mono">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-mono">
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Trip Context Banner */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Chip variant="pine" size="sm">Optimal Multi-Card Strategy</Chip>
            <span className="text-xs font-mono text-text-muted">{STYLE_LABEL[trip.style]} travel style</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            {trip.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Destination: <strong className="text-text-primary font-mono">{region.city}, {region.name}</strong> ({trip.nights} nights, {trip.travellers} travelers)
          </p>
        </div>

        <div className="flex items-center gap-6 bg-sunken p-4 rounded-xl border border-divider">
          <div>
            <div className="text-[11px] font-mono text-text-muted uppercase">Optimised FX Fee Loss</div>
            <div className="text-2xl font-mono font-bold text-pine-700">
              <MoneyValue amount={optimisedPlan.totalFxCostHome} currency={trip.homeCcy} />
            </div>
          </div>
          <div className="border-l border-divider pl-6">
            <div className="text-[11px] font-mono text-text-muted uppercase">Potential Savings</div>
            <div className="text-2xl font-mono font-bold text-emerald-600">
              +<MoneyValue amount={optimisedPlan.savingsVsDefaultHome} currency={trip.homeCcy} />
            </div>
            <div className="text-[10px] font-mono text-text-muted">vs traditional bank card</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-divider gap-8 text-sm font-mono">
        <button
          onClick={() => setActiveTab('strategy')}
          className={`pb-3 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'strategy' ? 'border-pine-600 text-pine-700' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          1. Multi-Card Strategy
        </button>
        <button
          onClick={() => setActiveTab('atm')}
          className={`pb-3 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'atm' ? 'border-pine-600 text-pine-700' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          2. ATM & Cash Protocol
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`pb-3 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'cards' ? 'border-pine-600 text-pine-700' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          3. Comparative Baseline
        </button>
      </div>

      {/* Tab 1: Strategy Split */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Split Breakdown */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-ink font-semibold">Recommended Spending Split</h2>
                  <p className="text-xs text-text-secondary">Tailored to avoid weekend markups and ATM free-tier exhaustion.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setMathDrawerOpen(true)} className="gap-1 text-xs font-mono">
                  <FileText className="w-3.5 h-3.5" /> Show Receipt
                </Button>
              </div>

              {/* Items in Optimised Plan */}
              <div className="space-y-3 pt-2">
                {optimisedPlan.items.map((item, idx) => (
                  <div key={idx} className="border border-border/80 rounded-xl p-4 bg-sunken/40 flex items-start gap-4">
                    <div className="p-2.5 bg-pine-100 rounded-lg text-pine-700">
                      {item.txType === 'atm' ? <Banknote className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-ink">{item.label} ({item.providerName})</h3>
                        <span className="font-mono text-sm font-bold text-pine-700">
                          {formatMoney(item.amountHome, trip.homeCcy)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Transaction rail: <span className="uppercase text-[10px] font-mono font-semibold">{item.txType}</span>. Effective FX cost: {item.effectivePct}% ({formatMoney(item.fxCostHome, trip.homeCcy)}).
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Quick Action Rules */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-base text-ink font-semibold mb-3">Golden Rules for Abroad</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Always pay in local currency ({region.currency})</strong>. Decline merchant Dynamic Currency Conversion (DCC) which adds 4%–8% markup.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Convert on weekdays</strong>. Some neo-banks apply a 1.0% surcharge between Friday 22:00 UTC and Sunday 22:00 UTC.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Never use airport exchange desks</strong>. Typically 12%–18% worse than interbank mid-market.</span>
                  </div>
                </div>
              </div>

              <div className="bg-pine-50/60 border border-pine-200/80 rounded-xl p-4">
                <div className="text-xs font-mono text-pine-900 font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pine-700" /> Relziwallet Intelligence
                </div>
                <p className="text-xs text-pine-800 leading-relaxed">
                  Executing this combined strategy saves an estimated <strong>{formatMoney(optimisedPlan.savingsVsDefaultHome, trip.homeCcy)}</strong> compared to paying solely with your home high-street bank card.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ATM Protocol */}
      {activeTab === 'atm' && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl text-ink font-semibold">ATM Withdrawal Schedule & Allowances</h2>
            <p className="text-xs text-text-secondary mt-1">
              To avoid the 2.0% excess ATM surcharge once your free allowance is exceeded, space your withdrawals according to this schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="border border-border rounded-xl p-5 bg-sunken/30">
              <div className="text-xs font-mono text-text-muted uppercase">Monthly Free Allowance</div>
              <div className="text-2xl font-mono font-bold text-ink mt-1">£200 / $250</div>
              <p className="text-xs text-text-secondary mt-2">Zero provider fee until this limit is reached in any rolling 30-day window.</p>
            </div>

            <div className="border border-border rounded-xl p-5 bg-sunken/30">
              <div className="text-xs font-mono text-text-muted uppercase">Recommended Cash Share</div>
              <div className="text-2xl font-mono font-bold text-pine-700 mt-1">
                {region.cashSharePct}% of budget
              </div>
              <p className="text-xs text-text-secondary mt-2">Based on local merchant cash-acceptance indices for {region.city}.</p>
            </div>

            <div className="border border-border rounded-xl p-5 bg-sunken/30">
              <div className="text-xs font-mono text-text-muted uppercase">Local ATM Operator Fee</div>
              <div className="text-2xl font-mono font-bold text-clay-600 mt-1">
                {region.currency === 'JPY' ? '¥0–¥220' : region.currency === 'THB' ? '220 THB' : '€0–€3'}
              </div>
              <p className="text-xs text-text-secondary mt-2">Charged by the local ATM operator, independent of your card provider.</p>
            </div>
          </div>

          <div className="border-t border-divider pt-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-clay-600 shrink-0 mt-0.5" />
            <div className="text-xs text-text-secondary space-y-1">
              <div className="font-semibold text-text-primary">Important ATM Safety Tip</div>
              <p>When the ATM prompts "Debit in {trip.homeCcy} or debit in {region.currency}?", always pick <strong>"{region.currency}" (Without Conversion)</strong>. If you accept the ATM's conversion, the machine owner converts at their arbitrary rate, costing an extra 6%–10%.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Comparative Baseline */}
      {activeTab === 'cards' && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
          <h2 className="font-display text-xl text-ink font-semibold">Comparative Cost Matrix for Full Trip</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-divider text-text-muted uppercase">
                  <th className="py-3 px-4">Option</th>
                  <th className="py-3 px-4">Providers</th>
                  <th className="py-3 px-4">Total Fee Loss</th>
                  <th className="py-3 px-4">Savings vs Bank</th>
                  <th className="py-3 px-4">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider/60">
                <tr className="bg-pine-50/40">
                  <td className="py-3.5 px-4 font-semibold text-pine-900">{optimisedPlan.name}</td>
                  <td className="py-3.5 px-4">{optimisedPlan.providerCount} Providers</td>
                  <td className="py-3.5 px-4 font-bold text-pine-800">
                    <MoneyValue amount={optimisedPlan.totalFxCostHome} currency={trip.homeCcy} />
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700">
                    +<MoneyValue amount={optimisedPlan.savingsVsDefaultHome} currency={trip.homeCcy} />
                  </td>
                  <td className="py-3.5 px-4 font-sans"><Chip variant="pine" size="sm">Recommended</Chip></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-primary">{simplePlan.name}</td>
                  <td className="py-3.5 px-4">{simplePlan.providerCount} Provider</td>
                  <td className="py-3.5 px-4">
                    <MoneyValue amount={simplePlan.totalFxCostHome} currency={trip.homeCcy} />
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600">
                    +<MoneyValue amount={simplePlan.savingsVsDefaultHome} currency={trip.homeCcy} />
                  </td>
                  <td className="py-3.5 px-4 font-sans"><Chip variant="neutral" size="sm">Good Alternative</Chip></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-primary">{defaultPlan.name}</td>
                  <td className="py-3.5 px-4">{defaultPlan.providerCount} Provider</td>
                  <td className="py-3.5 px-4 font-semibold text-clay-700">
                    <MoneyValue amount={defaultPlan.totalFxCostHome} currency={trip.homeCcy} />
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    £0.00 (Baseline)
                  </td>
                  <td className="py-3.5 px-4 font-sans"><Chip variant="warning" size="sm">Expensive</Chip></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show The Math Drawer */}
      <Drawer
        open={mathDrawerOpen}
        onClose={() => setMathDrawerOpen(false)}
        title="Payment Strategy Audit Receipt"
        description="Exact mathematical calculation verifying the optimal card and cash split."
      >
        <div className="space-y-6 text-xs font-mono">
          <div className="p-4 bg-sunken rounded-xl border border-divider space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Total Budget:</span>
              <span className="font-bold">{formatMoney(sim.totalDest, region.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Mid-Market Exchange Rate:</span>
              <span>1 {trip.homeCcy} = {rateInfo?.refRate || '1.0000'} {region.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total Home Equivalent:</span>
              <span>{formatMoney(sim.totalHome, trip.homeCcy)}</span>
            </div>
          </div>

          <div className="p-4 bg-pine-50 rounded-xl border border-pine-200 text-pine-900 space-y-2">
            <div className="font-semibold text-sm">Auditable Net Savings</div>
            <p className="text-xs leading-relaxed">
              Comparing the Bank baseline against the Optimised Strategy yields exactly <strong>{formatMoney(optimisedPlan.savingsVsDefaultHome, trip.homeCcy)}</strong> in retained wealth.
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
