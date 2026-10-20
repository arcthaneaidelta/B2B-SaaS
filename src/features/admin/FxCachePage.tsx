import React, { useState } from 'react'
import { RefreshCw, Search, Zap } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { RateFreshness } from '../../components/domain/RateFreshness'
import { formatRate } from '../../engine/format'
import { useToast } from '../../components/ui/Toast'

export const FxCachePage: React.FC = () => {
  const { fxPairs, refreshPair, refreshAllPairs, activeOverrides } = useStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [refreshingPair, setRefreshingPair] = useState<string | null>(null)

  const handleRefreshSingle = async (pairName: string) => {
    setRefreshingPair(pairName)
    await refreshPair(pairName)
    setRefreshingPair(null)
    toast({
      title: 'Feed Refreshed',
      description: `Rate for ${pairName} refreshed from primary interbank feed.`,
      type: 'success',
    })
  }

  const handleRefreshAll = async () => {
    await refreshAllPairs()
    toast({
      title: 'All Feeds Refreshed',
      description: 'Synchronized all currency pairs with primary feeds.',
      type: 'success',
    })
  }

  const filteredPairs = fxPairs.filter(
    (p) =>
      p.pair.toLowerCase().includes(search.toLowerCase()) ||
      p.source.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RateFreshness variant="badge" />
            <span className="text-xs font-mono text-text-muted">60s In-Memory Cache TTL</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            FX Mid-Market Rate Cache
          </h1>
        </div>

        <Button
          variant="primary"
          onClick={handleRefreshAll}
          className="gap-1.5 font-mono text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh All {fxPairs.length} Pairs
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search currency pair (e.g. GBP/EUR)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-sunken border border-divider rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-pine-500"
          />
        </div>

        <div className="text-xs font-mono text-text-secondary flex items-center gap-4">
          <span>Total Pairs: <strong>{fxPairs.length}</strong></span>
          <span>Overrides Applied: <strong>{activeOverrides.length}</strong></span>
        </div>
      </div>

      {/* Pairs Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4">Mid Rate</th>
                <th className="py-3 px-4">Inverse Rate</th>
                <th className="py-3 px-4">Source Feed</th>
                <th className="py-3 px-4">Override Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/60">
              {filteredPairs.map((p) => {
                const hasOverride = activeOverrides.some(
                  (o) => o.pair === p.pair || o.appliesTo === 'all'
                )
                const isRefreshing = refreshingPair === p.pair
                const numRate = parseFloat(p.rate) || 1

                return (
                  <tr key={p.pair} className="hover:bg-sunken/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ink">
                      {p.pair}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-pine-700">
                      {isRefreshing ? (
                        <span className="animate-pulse text-text-muted">Fetching...</span>
                      ) : (
                        formatRate(p.rate)
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {formatRate((1 / numRate).toString())}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      <span className="px-2 py-0.5 rounded bg-sunken border border-divider text-[10px]">
                        {p.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {hasOverride ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-pine-100 text-pine-800 text-[10px] font-bold">
                          <Zap className="w-3 h-3 text-pine-600" /> Overridden
                        </span>
                      ) : (
                        <span className="text-text-muted text-[10px]">Pure Feed</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefreshSingle(p.pair)}
                        disabled={isRefreshing}
                        className="gap-1 text-[11px] font-mono"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
