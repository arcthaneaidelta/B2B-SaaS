import React, { useState } from 'react'
import { Download, Search, ShieldCheck } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import type { AuditEntry } from '../../data/seed/audit'

export const AuditLogPage: React.FC = () => {
  const { auditEntries } = useStore()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null)

  const filteredEntries = auditEntries.filter(
    (e) =>
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.entityType.toLowerCase().includes(search.toLowerCase()) ||
      (e.summary && e.summary.toLowerCase().includes(search.toLowerCase()))
  )

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Summary', 'Reason']
    const rows = filteredEntries.map((e) => [
      new Date(e.timestamp).toISOString(),
      `"${e.actor}"`,
      `"${e.role}"`,
      `"${e.action}"`,
      `"${e.entityType}"`,
      `"${e.summary || ''}"`,
      `"${e.reason || ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `relziwallet-audit-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    toast({
      title: 'Audit Log Exported',
      description: 'Downloaded full ledger snapshot as CSV.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-mono text-text-muted">Immutable Ledger Trail</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Administrative Audit Log
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Cryptographically timestamped record of all rate overrides, fee schedule publications, and regional index changes.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="gap-1.5 font-mono text-xs"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search actor, action, entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-sunken border border-divider rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-pine-500"
          />
        </div>

        <div className="text-xs font-mono text-text-muted">
          Showing {filteredEntries.length} recorded events
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/60">
              {filteredEntries.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelectedEntry(e)}
                  className="hover:bg-sunken/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-text-primary">
                    {e.actor}
                    <span className="block text-[10px] text-text-muted font-normal">{e.role}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-pine-100 text-pine-800 text-[10px] font-bold">
                      {e.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {e.entityType} ({e.entityId})
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary max-w-sm truncate">
                    {e.summary}
                  </td>
                  <td className="py-3.5 px-4 text-right text-pine-700 font-semibold">
                    Inspect →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal with Before/After Diff */}
      {selectedEntry && (
        <Modal
          open={Boolean(selectedEntry)}
          onClose={() => setSelectedEntry(null)}
          title={`Audit Record: ${selectedEntry.action} ${selectedEntry.entityType}`}
          description={`Logged at ${new Date(selectedEntry.timestamp).toLocaleString()} by ${selectedEntry.actor}`}
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 bg-sunken rounded-xl border border-divider space-y-1">
              <div><strong>Summary:</strong> {selectedEntry.summary}</div>
              {selectedEntry.reason && <div><strong>Reason:</strong> {selectedEntry.reason}</div>}
              <div><strong>Request ID:</strong> {selectedEntry.requestId}</div>
            </div>

            {selectedEntry.diff && selectedEntry.diff.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] uppercase text-text-muted font-semibold">State Mutation Diff</div>
                <div className="divide-y divide-divider border border-border rounded-xl overflow-hidden">
                  {selectedEntry.diff.map((d, i) => (
                    <div key={i} className="p-3 bg-surface grid grid-cols-3 gap-2">
                      <span className="font-semibold text-text-primary">{d.field}</span>
                      <span className="text-clay-600 line-through truncate">{String(d.before)}</span>
                      <span className="text-emerald-600 font-bold truncate">{String(d.after)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
