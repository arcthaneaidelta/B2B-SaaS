import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Tabs } from '../../components/ui/Tabs'
import { Tag } from '../../components/ui/Chip'
import { useStore, getRateInfo } from '../../mock/store'
import { computeQuote } from '../../engine/quote'
import { formatMoney, formatPct } from '../../engine/format'
import { TX_TYPES, TX_LABEL } from '../../engine/types'

export const ProviderDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const state = useStore()
  const { providers, feeRules } = state

  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'notes'>('overview')

  const provider = providers.find((p) => p.slug === slug || p.id === slug)
  const rateInfo = getRateInfo(state, 'GBP', 'EUR')

  if (!provider) {
    return (
      <div className="container-app py-16 text-center space-y-4">
        <h1 className="font-display text-2xl">Provider not found</h1>
        <p className="text-text-muted text-sm">We couldn't locate this provider profile.</p>
        <Link to="/compare">
          <Button variant="primary">Return to comparison matrix</Button>
        </Link>
      </div>
    )
  }

  const providerRules = feeRules.filter((r) => r.providerId === provider.id)

  // Typical sample quotes on GBP 2,000 across offered types
  const sampleQuotes = TX_TYPES.map((t) => {
    const rule = providerRules.find((r) => r.txType === t)
    return {
      txType: t,
      rule,
      quote: computeQuote({
        amountHome: '2000',
        homeCcy: 'GBP',
        destCcy: 'EUR',
        txType: t,
        provider,
        rule,
        rate: rateInfo,
        ruleToHome: '1',
        weekend: false,
      }),
    }
  })

  return (
    <div className="container-app py-8 md:py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
        <Link to="/compare" className="hover:text-text-primary flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Compare</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-text-primary">{provider.name}</span>
      </div>

      {/* Header */}
      <div className="card card-pad bg-elevated shadow-xs flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full border border-border bg-sunken flex items-center justify-center font-display text-2xl font-semibold text-text-primary select-none shrink-0">
            {provider.monogram}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl font-medium text-text-primary">{provider.name}</h1>
              <Tag variant={provider.type === 'fintech' ? 'pine' : provider.type === 'bank' ? 'outline' : 'clay'}>
                {provider.typeLabel}
              </Tag>
              {provider.fictional && (
                <span className="text-[11px] font-mono text-text-muted bg-sunken px-1.5 py-0.5 rounded">
                  Fictional baseline
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm max-w-xl leading-relaxed">
              {provider.description}
            </p>
          </div>
        </div>

        <Link to={`/compare`}>
          <Button variant="secondary" size="sm">
            <span>Open in live matrix</span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs<'overview' | 'fees' | 'notes'>
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'overview', label: 'Pricing overview' },
          { id: 'fees', label: 'Published rule schedule' },
          { id: 'notes', label: 'Methodology notes' },
        ]}
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="card card-pad bg-elevated space-y-4">
              <h3 className="font-display text-lg font-medium text-text-primary">
                Typical cost on £2,000 spend (GBP → EUR)
              </h3>

              <div className="space-y-3">
                {sampleQuotes.map(({ txType, quote }) => {
                  const isOffered = quote.status === 'OK'
                  return (
                    <div key={txType} className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm text-text-primary block">{TX_LABEL[txType]}</span>
                        <span className="text-xs text-text-muted font-mono">
                          {isOffered ? `Applied fee: ${formatMoney(quote.feeHome, 'GBP')}` : 'Not offered by this provider'}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        {isOffered ? (
                          <>
                            <span className="text-sm font-semibold text-text-primary block">
                              {formatPct(quote.effectivePct)}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              Cost: {formatMoney(quote.costHome, 'GBP')}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-text-muted">—</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="card card-pad bg-elevated space-y-4">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                Highlights & watch-outs
              </h4>
              <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pine-600 mt-1.5 shrink-0" />
                  <span>
                    <strong>Exchange margin:</strong>{' '}
                    {providerRules.some((r) => Number(r.fxSpreadPct) > 0)
                      ? `Charges up to ${Math.max(...providerRules.map((r) => Number(r.fxSpreadPct)))}% exchange rate markup over mid-market rates.`
                      : 'Zero FX spread. Converts at mid-market reference rates.'}
                  </span>
                </li>
                {providerRules.some((r) => Number(r.weekendMarkupPct) > 0) && (
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                    <span>
                      <strong>Weekend markup:</strong> Applies a 1.00% surcharge on transactions processed on Saturdays and Sundays.
                    </span>
                  </li>
                )}
                {providerRules.some((r) => Number(r.freeAllowance) > 0) && (
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pine-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>Free allowance:</strong> Offers a monthly fee-free allowance before percentage transaction fees apply.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISHED RULES */}
      {activeTab === 'fees' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction type</th>
                <th className="num">FX Spread</th>
                <th className="num">Fixed fee</th>
                <th className="num">Percentage fee</th>
                <th className="num">Free allowance</th>
                <th className="num">Weekend markup</th>
                <th className="num">Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider font-mono text-xs">
              {providerRules.map((r) => (
                <tr key={r.id}>
                  <td className="font-sans font-medium text-text-primary">{TX_LABEL[r.txType]}</td>
                  <td className="num">{r.offered ? `${r.fxSpreadPct}%` : '—'}</td>
                  <td className="num">{r.offered ? `£${r.fixedFee}` : '—'}</td>
                  <td className="num">{r.offered ? `${r.pctFee}%` : '—'}</td>
                  <td className="num">{r.offered ? (Number(r.freeAllowance) > 0 ? `£${r.freeAllowance}` : 'None') : '—'}</td>
                  <td className="num">{r.offered ? (Number(r.weekendMarkupPct) > 0 ? `${r.weekendMarkupPct}%` : '0%') : '—'}</td>
                  <td className="num text-text-muted">v{r.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: METHODOLOGY NOTES */}
      {activeTab === 'notes' && (
        <div className="card card-pad bg-elevated max-w-2xl space-y-4 text-sm text-text-secondary leading-relaxed">
          <h3 className="font-display text-lg font-medium text-text-primary">Rule verification notice</h3>
          <p>
            Fee schedules are verified against official published pricing disclosures. When providers update their fee rules or introduce seasonal rate markups, changes are published to this rulebook via the Relziwallet operator panel with a full audit log.
          </p>
          <p className="text-xs font-mono text-text-muted pt-2 border-t border-divider">
            Last audited: 12 October 2026 • Verified by Daniel Okafor (Editor)
          </p>
        </div>
      )}
    </div>
  )
}
