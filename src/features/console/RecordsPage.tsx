import React, { useState } from 'react';
import { useDemoStore } from '../../data/store';
import { filterRecords } from '../../data/selectors';
import { PatchRecord, RecordType, PatchCategory } from '../../data/schema';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { PatchArt } from '../../components/brand/PatchArt';
import {
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Award,
  Package,
  ExternalLink,
} from 'lucide-react';

const PAGE_SIZE = 25;

export const RecordsPage: React.FC = () => {
  const { records, schools, filters, setFilters } = useDemoStore();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<PatchRecord | null>(null);

  // Apply filters
  const filtered = filterRecords(records, filters).filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      r.ref.toLowerCase().includes(term) ||
      r.student.toLowerCase().includes(term) ||
      r.schoolName.toLowerCase().includes(term) ||
      r.patchName.toLowerCase().includes(term) ||
      r.sportOrProgram.toLowerCase().includes(term)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginatedRecords = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6 font-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink-900">
            Student Registry &amp; Orders
          </h2>
          <p className="text-xs text-text-2 mt-0.5">
            Single master flat ledger holding all student registrations and school bulk orders.
          </p>
        </div>

        <div className="text-xs text-text-3 font-medium">
          Total {filtered.length} entries matching view
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-paper-0 p-3 sm:p-4 rounded-lg border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sh-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-text-3 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student, ref, school, or patch..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-paper-100 border border-border rounded-md text-ink-900 focus:outline-none focus:border-thread-600"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Record Type Filter */}
          <select
            value={filters.recordType}
            onChange={(e) => {
              setFilters({ recordType: e.target.value as 'all' | RecordType });
              setCurrentPage(1);
            }}
            className="h-10 px-2.5 bg-paper-100 border border-border rounded-md font-medium text-ink-900 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Registration">Registrations only</option>
            <option value="Order">Bulk Orders only</option>
          </select>

          {/* School Filter */}
          <select
            value={filters.schoolId}
            onChange={(e) => {
              setFilters({ schoolId: e.target.value });
              setCurrentPage(1);
            }}
            className="h-10 px-2.5 bg-paper-100 border border-border rounded-md font-medium text-ink-900 focus:outline-none max-w-[160px] truncate"
          >
            <option value="all">All Schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => {
              setFilters({
                dateRange: e.target.value as '7d' | '30d' | 'season' | 'all',
              });
              setCurrentPage(1);
            }}
            className="h-10 px-2.5 bg-paper-100 border border-border rounded-md font-medium text-ink-900 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="season">Current Season</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Desktop Spreadsheet Table View */}
      <div className="hidden md:block bg-paper-0 rounded-lg border border-border shadow-sh-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-paper-100 border-b border-border text-text-3 select-none">
              <tr>
                <th className="py-3 px-3.5 font-semibold">Ref #</th>
                <th className="py-3 px-3.5 font-semibold">Timestamp</th>
                <th className="py-3 px-3.5 font-semibold">Record Type</th>
                <th className="py-3 px-3.5 font-semibold">Student / Recipient</th>
                <th className="py-3 px-3.5 font-semibold">Class</th>
                <th className="py-3 px-3.5 font-semibold">High School (Linked)</th>
                <th className="py-3 px-3.5 font-semibold">Sport / Program</th>
                <th className="py-3 px-3.5 font-semibold">Patch (Linked)</th>
                <th className="py-3 px-3.5 font-semibold text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedRecords.map((r) => {
                const dateObj = new Date(r.timestamp);
                const dateFormatted = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const timeFormatted = dateObj.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRecord(r)}
                    className="hover:bg-paper-100/80 cursor-pointer transition-colors"
                  >
                    {/* Ref */}
                    <td className="py-3 px-3.5 font-mono font-bold text-thread-600">
                      {r.ref}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-3.5 text-text-3 whitespace-nowrap">
                      <span>{dateFormatted}</span>{' '}
                      <span className="text-[11px] text-text-3/70">{timeFormatted}</span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3.5">
                      <Chip label={r.recordType} recordType={r.recordType} size="sm" />
                    </td>

                    {/* Student */}
                    <td className="py-3 px-3.5 font-medium text-ink-900">
                      {r.recordType === 'Registration' ? (
                        <span>{r.student}</span>
                      ) : (
                        <span className="text-text-3">
                          (Order: {r.contactName || 'Staff'})
                        </span>
                      )}
                    </td>

                    {/* Class */}
                    <td className="py-3 px-3.5 font-mono text-text-2">
                      {r.gradYear}
                    </td>

                    {/* School (Linked Chip) */}
                    <td className="py-3 px-3.5">
                      <span className="font-medium text-ink-900 hover:text-thread-600 hover:underline">
                        {r.schoolName}
                      </span>
                    </td>

                    {/* Sport/Program */}
                    <td className="py-3 px-3.5 text-text-2">
                      {r.sportOrProgram}
                    </td>

                    {/* Patch (Linked Chip) */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink-900 hover:text-thread-600 hover:underline">
                          {r.patchName}
                        </span>
                        <Chip label={r.patchCategory} category={r.patchCategory} size="sm" />
                      </div>
                    </td>

                    {/* Qty */}
                    <td className="py-3 px-3.5 text-right font-display font-bold text-ink-900 tabular-nums">
                      {r.quantity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Record Cards (No horizontal scroll!) */}
      <div className="md:hidden space-y-3">
        {paginatedRecords.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedRecord(r)}
            className="bg-paper-0 p-4 rounded-lg border border-border shadow-sh-1 space-y-2.5 active:bg-paper-100 cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-thread-600">{r.ref}</span>
              <Chip label={r.recordType} recordType={r.recordType} size="sm" />
            </div>

            <div className="text-sm font-semibold text-ink-900">
              {r.recordType === 'Registration'
                ? `${r.student} (${r.gradYear})`
                : `Bulk Order · ${r.contactName}`}
            </div>

            <div className="text-xs text-text-2 flex items-center justify-between">
              <span className="truncate max-w-[200px]">{r.schoolName}</span>
              <span className="text-text-3">{r.sportOrProgram}</span>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-ink-900">
                <Award className="w-3.5 h-3.5 text-thread-600" />
                <span>{r.patchName}</span>
              </div>
              <span className="font-display font-bold text-ink-900 tabular-nums">
                {r.quantity} units
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="bg-paper-0 p-3 sm:p-4 rounded-lg border border-border flex items-center justify-between text-xs shadow-sh-1">
        <span className="text-text-3">
          Page {currentPage} of {totalPages} ({filtered.length} total rows)
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Record Detail Drawer */}
      <Drawer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.ref}
        subtitle={`${selectedRecord?.recordType} · ${new Date(
          selectedRecord?.timestamp || ''
        ).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`}
      >
        {selectedRecord && (
          <div className="space-y-6 text-xs font-ui">
            {/* Patch Card */}
            <div className="p-4 bg-paper-100 rounded-lg border border-border flex items-center gap-4">
              <PatchArt
                sku={selectedRecord.patchSku}
                category={selectedRecord.patchCategory}
                size={52}
              />
              <div>
                <h4 className="text-sm font-display font-semibold text-ink-900">
                  {selectedRecord.patchName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Chip
                    label={selectedRecord.patchCategory}
                    category={selectedRecord.patchCategory}
                    size="sm"
                  />
                  <span className="text-text-3 font-mono">{selectedRecord.patchSku}</span>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="p-4 bg-paper-0 border border-border rounded-lg space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-3 block">
                Record Breakdown
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-3 block">Recipient / Contact</span>
                  <span className="font-semibold text-ink-900">
                    {selectedRecord.recordType === 'Registration'
                      ? selectedRecord.student
                      : selectedRecord.contactName}
                  </span>
                </div>
                <div>
                  <span className="text-text-3 block">Graduation Year</span>
                  <span className="font-semibold text-ink-900">{selectedRecord.gradYear}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-text-3 block">High School Organization</span>
                  <span className="font-semibold text-ink-900">{selectedRecord.schoolName}</span>
                  <span className="text-text-3 block text-[11px] mt-0.5">
                    {selectedRecord.schoolConference}
                  </span>
                </div>
                <div>
                  <span className="text-text-3 block">Activity / Program</span>
                  <span className="font-semibold text-ink-900">{selectedRecord.sportOrProgram}</span>
                </div>
                <div>
                  <span className="text-text-3 block">Quantity Counted</span>
                  <span className="font-bold text-ink-900 text-sm tabular-nums">
                    {selectedRecord.quantity}
                  </span>
                </div>
              </div>

              {selectedRecord.contactEmail && (
                <div className="pt-2 border-t border-border">
                  <span className="text-text-3 block">Contact Email:</span>
                  <span className="font-medium text-ink-900 font-mono">
                    {selectedRecord.contactEmail}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
