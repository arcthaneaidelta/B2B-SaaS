import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, CreditCard, Banknote, ArrowRight, Filter } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Chip } from '../../components/ui/Chip'

export const DestinationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { regions } = useStore()
  const [search, setSearch] = useState('')
  const [cashFilter, setCashFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all')

  const filteredRegions = regions.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.currency.toLowerCase().includes(search.toLowerCase())

    let matchesCash = true
    if (cashFilter === 'high') matchesCash = r.cashSharePct >= 40
    else if (cashFilter === 'moderate') matchesCash = r.cashSharePct >= 20 && r.cashSharePct < 40
    else if (cashFilter === 'low') matchesCash = r.cashSharePct < 20

    return matchesSearch && matchesCash
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-mono font-medium">
          <MapPin className="w-3.5 h-3.5" /> Regional Spend Index Directory
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
          Global Destination FX Guides
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Payment ecosystems differ fundamentally around the world. Browse local cash dependence, card acceptance thresholds, and regional ATM surcharge gotchas before you depart.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city, country, currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-sunken border border-divider rounded-lg text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-pine-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-mono">
          <span className="text-text-muted text-[11px] uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Cash Reliance:
          </span>
          {(['all', 'high', 'moderate', 'low'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setCashFilter(filter)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                cashFilter === filter
                  ? 'bg-pine-600 text-white font-semibold'
                  : 'bg-sunken text-text-secondary hover:text-text-primary hover:bg-border/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRegions.map((r) => {
          const cashBadge =
            r.cashSharePct >= 40
              ? { text: 'Cash Dominant', variant: 'warning' as const }
              : r.cashSharePct >= 20
              ? { text: 'Hybrid (Card + Cash)', variant: 'neutral' as const }
              : { text: 'Cashless First', variant: 'pine' as const }

          return (
            <div
              key={r.id}
              onClick={() => navigate(`/destinations/${r.id}`)}
              className="bg-surface border border-border hover:border-pine-500 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Chip variant={cashBadge.variant} size="sm">
                    {cashBadge.text}
                  </Chip>
                  <span className="font-mono text-xs font-bold text-pine-700">{r.currency}</span>
                </div>

                <div>
                  <h2 className="font-display text-xl text-ink font-semibold group-hover:text-pine-800 transition-colors">
                    {r.city}, {r.name}
                  </h2>
                  <div className="text-xs font-mono text-text-muted mt-1">
                    Cost Index: {(r.costIndex * 100).toFixed(0)}% of US benchmark
                  </div>
                </div>

                <div className="p-3 bg-sunken rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5" /> Cash Reliance:
                    </span>
                    <span className="font-bold text-text-primary">{r.cashSharePct}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Contactless:
                    </span>
                    <span className="font-bold text-text-primary">{100 - r.cashSharePct}%</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-snug">
                  {r.id === 'japan' && '7-Eleven & Post Office ATMs accept foreign cards with zero local network surcharge.'}
                  {r.id === 'thailand' && 'Local Thai ATMs levy a mandatory ~220 THB surcharge per foreign card withdrawal.'}
                  {r.id === 'portugal' && 'Multibanco network is ubiquitous; contactless debit accepted virtually everywhere.'}
                  {r.id === 'uae' && 'Nearly 100% card penetration from taxis to street markets; cash rarely required.'}
                  {r.id === 'turkiye' && 'Cash essential for bazaars and small shops; watch out for aggressive DCC prompts.'}
                  {r.id === 'mexico' && 'Cash needed for street stalls and intercity colectivos; cards standard in urban centers.'}
                  {r.id === 'singapore' && 'Extremely high digital adoption via NETS & Visa contactless even for hawker centers.'}
                  {r.id === 'morocco' && 'Cash economy in souks and riads; carry smaller notes for local tipping.'}
                </p>
              </div>

              <div className="pt-4 border-t border-divider mt-4 flex items-center justify-between text-xs font-mono text-pine-700 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Explore Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
