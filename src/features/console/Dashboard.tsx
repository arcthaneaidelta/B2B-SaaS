import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../data/store';
import {
  filterRecords,
  selectKpiSummary,
  selectTotalsBySchool,
  selectTotalsByCategory,
  selectTopStudents,
  selectNeedsAttention,
} from '../../data/selectors';
import { PatchRecord, School, PatchCategory } from '../../data/schema';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { Drawer } from '../../components/ui/Drawer';
import { PatchArt } from '../../components/brand/PatchArt';
import { useToast } from '../../components/ui/Toast';
import {
  Download,
  AlertTriangle,
  Award,
  Package,
  TrendingUp,
  School as SchoolIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { openExportModal } = useOutletContext<{ openExportModal: () => void }>();
  const { addToast } = useToast();

  const {
    records,
    schools,
    patches,
    filters,
    setFilters,
    markOrderQuoted,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<'school' | 'category' | 'student'>('school');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Compute filtered records & summaries
  const filteredRecords = filterRecords(records, filters);
  const kpi = selectKpiSummary(filteredRecords, patches);
  const totalsBySchool = selectTotalsBySchool(filteredRecords);
  const totalsByCategory = selectTotalsByCategory(filteredRecords);
  const topStudents = selectTopStudents(filteredRecords);
  const needsAttention = selectNeedsAttention(records, patches);

  // Sparkline SVG renderer
  const renderSparkline = (data: number[], color = '#1C2B3A') => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible flex-shrink-0">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 font-ui">
      {/* Header & Filter Controls Bar */}
      <div className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sh-1">
        <div>
          <span className="text-xs font-semibold text-thread-600 uppercase tracking-wider">
            Season Overview · Fall 2026
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink-900 mt-0.5">
            Merit Patch Performance &amp; Activity
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Date Range Presets */}
          <div className="inline-flex rounded-md border border-border bg-paper-100 p-0.5 text-xs font-medium">
            {(['7d', '30d', 'season', 'all'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFilters({ dateRange: r })}
                className={`px-3 py-1.5 rounded-sm transition-all ${
                  filters.dateRange === r
                    ? 'bg-paper-0 text-ink-900 font-semibold shadow-sh-1'
                    : 'text-text-2 hover:text-ink-900'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === 'season' ? 'Season' : 'All'}
              </button>
            ))}
          </div>

          {/* Record Type Filter */}
          <select
            value={filters.recordType}
            onChange={(e) =>
              setFilters({
                recordType: e.target.value as 'all' | 'Registration' | 'Order',
              })
            }
            className="h-9 px-2.5 bg-paper-100 border border-border rounded-md text-xs font-medium text-ink-900 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Registration">Registrations only</option>
            <option value="Order">Bulk Orders only</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({
                category: e.target.value as 'all' | PatchCategory,
              })
            }
            className="h-9 px-2.5 bg-paper-100 border border-border rounded-md text-xs font-medium text-ink-900 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Athletic">Athletic</option>
            <option value="Leadership">Leadership</option>
          </select>

          {/* Primary Export Button */}
          <Button
            variant="accent"
            size="md"
            onClick={openExportModal}
            leftIcon={<Download className="w-4 h-4" />}
            className="ml-auto lg:ml-2 font-semibold"
          >
            Export to Excel
          </Button>
        </div>
      </div>

      {/* KPI Strip (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Patches Registered */}
        <div className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border shadow-sh-1 space-y-3">
          <div className="flex items-center justify-between text-text-3">
            <span className="text-xs font-medium uppercase tracking-wider">Patches Registered</span>
            <Award className="w-4 h-4 text-moss-600" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-display font-semibold text-ink-900 tabular-nums">
              {kpi.patchesRegistered}
            </div>
            {renderSparkline(kpi.sparklineRegistered, '#4F6B52')}
          </div>
          <div className="text-[11px] font-semibold text-moss-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{kpi.registeredDelta}</span>
          </div>
        </div>

        {/* KPI 2: Patches Ordered */}
        <div className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border shadow-sh-1 space-y-3">
          <div className="flex items-center justify-between text-text-3">
            <span className="text-xs font-medium uppercase tracking-wider">Patches Ordered</span>
            <Package className="w-4 h-4 text-thread-600" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-display font-semibold text-ink-900 tabular-nums">
              {kpi.patchesOrdered}
            </div>
            {renderSparkline(kpi.sparklineOrdered, '#B5472F')}
          </div>
          <div className="text-[11px] font-semibold text-thread-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{kpi.orderedDelta}</span>
          </div>
        </div>

        {/* KPI 3: Schools Active */}
        <div className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border shadow-sh-1 space-y-3">
          <div className="flex items-center justify-between text-text-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Schools</span>
            <SchoolIcon className="w-4 h-4 text-ink-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-display font-semibold text-ink-900 tabular-nums">
              {kpi.schoolsActive}
            </div>
            <span className="text-xs text-text-3 font-medium">of {schools.length} total</span>
          </div>
          <div className="text-[11px] font-medium text-text-2">
            {kpi.activeSchoolsDelta}
          </div>
        </div>

        {/* KPI 4: Low Stock Alert Card */}
        <div
          onClick={() => navigate('/admin/catalog')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/admin/catalog')}
          className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border shadow-sh-1 space-y-3 cursor-pointer hover:border-gold-500 transition-colors"
        >
          <div className="flex items-center justify-between text-text-3">
            <span className="text-xs font-medium uppercase tracking-wider">Low-Stock SKUs</span>
            <div className="w-2.5 h-2.5 rounded-full bg-thread-600 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-display font-semibold text-thread-600 tabular-nums">
              {kpi.lowStockCount}
            </div>
            <span className="text-xs text-gold-600 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Reorder soon
            </span>
          </div>
          <div className="text-[11px] text-text-3 underline font-medium">
            View catalog stock →
          </div>
        </div>
      </div>

      {/* Needs Attention Row */}
      {(needsAttention.pendingQuotes.length > 0 || needsAttention.lowStock.length > 0) && (
        <div className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border shadow-sh-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              Needs Owner Attention
            </h3>
            <span className="text-xs text-text-3 font-medium">
              {needsAttention.pendingQuotes.length} orders awaiting quote ·{' '}
              {needsAttention.lowStock.length} low inventory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Orders awaiting quote */}
            <div className="space-y-2">
              {needsAttention.pendingQuotes.slice(0, 2).map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-paper-100 rounded-lg border border-border flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-ink-900">{order.schoolName}</div>
                    <div className="text-text-3">
                      {order.quantity} × {order.patchName} ({order.ref})
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      markOrderQuoted(order.ref);
                      addToast({
                        type: 'success',
                        title: 'Order marked as quoted',
                        description: `Quote sent for ${order.ref} to ${order.contactEmail}.`,
                      });
                    }}
                  >
                    Mark quoted
                  </Button>
                </div>
              ))}
            </div>

            {/* Low stock alerts */}
            <div className="space-y-2">
              {needsAttention.lowStock.slice(0, 2).map((patch) => (
                <div
                  key={patch.sku}
                  className="p-3 bg-paper-100 rounded-lg border border-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <PatchArt sku={patch.sku} category={patch.category} size={32} />
                    <div>
                      <div className="font-semibold text-ink-900">{patch.name}</div>
                      <div className="text-text-3 font-mono">{patch.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-thread-600 text-sm tabular-nums">
                      {patch.stock} left
                    </span>
                    <div className="text-[10px] text-text-3">Reorder point 50</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reporting Grid (The client-requested "Totals by school, student, category") */}
      <div className="bg-paper-0 rounded-lg border border-border shadow-sh-1 overflow-hidden">
        {/* Panel Tabs */}
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-paper-100">
          <div>
            <h3 className="text-base font-display font-semibold text-ink-900">
              Aggregated Reporting Breakdown
            </h3>
            <p className="text-xs text-text-2 mt-0.5">
              Live computed rollups matching the proposed Excel Pivot structure.
            </p>
          </div>

          <div className="inline-flex rounded-md border border-border bg-paper-0 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('school')}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                activeTab === 'school'
                  ? 'bg-ink-900 text-paper-0 font-semibold'
                  : 'text-text-2 hover:text-ink-900'
              }`}
            >
              Totals by School
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('category')}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                activeTab === 'category'
                  ? 'bg-ink-900 text-paper-0 font-semibold'
                  : 'text-text-2 hover:text-ink-900'
              }`}
            >
              Totals by Category
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                activeTab === 'student'
                  ? 'bg-ink-900 text-paper-0 font-semibold'
                  : 'text-text-2 hover:text-ink-900'
              }`}
            >
              Top Students
            </button>
          </div>
        </div>

        {/* Tab 1: By School (Horizontal Bar Chart) */}
        {activeTab === 'school' && (
          <div className="p-5 space-y-4">
            <div className="text-xs text-text-3 flex items-center justify-between pb-2 border-b border-border">
              <span>High School (Click bar for school roster &amp; order history)</span>
              <span>Total Patches Counted</span>
            </div>

            <div className="space-y-3">
              {totalsBySchool.map((item) => {
                const maxVal = Math.max(...totalsBySchool.map((s) => s.total)) || 1;
                const percentage = Math.round((item.total / maxVal) * 100);
                const schoolObj = schools.find((s) => s.name === item.schoolName);

                return (
                  <div
                    key={item.schoolName}
                    onClick={() => schoolObj && setSelectedSchool(schoolObj)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && schoolObj && setSelectedSchool(schoolObj)}
                    className="group cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-ui">
                      <span className="font-semibold text-ink-900 group-hover:text-thread-600 transition-colors">
                        {item.schoolName}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-text-3 hidden sm:inline">
                          {item.registered} reg · {item.ordered} ordered
                        </span>
                        <span className="font-bold text-ink-900 tabular-nums">
                          {item.total}
                        </span>
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-3 bg-paper-100 rounded-full overflow-hidden border border-border">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="h-full bg-ink-900 group-hover:bg-thread-600 transition-all duration-300 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: By Category (3 Large Number Tiles + Proportion Bar) */}
        {activeTab === 'category' && (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Academic */}
              <div className="p-4 rounded-lg bg-[#4F6B52]/10 border border-[#4F6B52]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#345037]">
                    Academic Patches
                  </span>
                  <Award className="w-4 h-4 text-[#4F6B52]" />
                </div>
                <div className="text-3xl font-display font-bold text-[#2A422D] tabular-nums">
                  {totalsByCategory.Academic.count}
                </div>
                <div className="text-xs text-[#345037]">
                  {totalsByCategory.Academic.percentage}% of total program patches
                </div>
              </div>

              {/* Athletic */}
              <div className="p-4 rounded-lg bg-[#B5472F]/10 border border-[#B5472F]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8A2B16]">
                    Athletic Letters
                  </span>
                  <Package className="w-4 h-4 text-[#B5472F]" />
                </div>
                <div className="text-3xl font-display font-bold text-[#7A210E] tabular-nums">
                  {totalsByCategory.Athletic.count}
                </div>
                <div className="text-xs text-[#8A2B16]">
                  {totalsByCategory.Athletic.percentage}% of total program patches
                </div>
              </div>

              {/* Leadership */}
              <div className="p-4 rounded-lg bg-[#B8892B]/10 border border-[#B8892B]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7A5510]">
                    Leadership &amp; Service
                  </span>
                  <Award className="w-4 h-4 text-[#B8892B]" />
                </div>
                <div className="text-3xl font-display font-bold text-[#64440B] tabular-nums">
                  {totalsByCategory.Leadership.count}
                </div>
                <div className="text-xs text-[#7A5510]">
                  {totalsByCategory.Leadership.percentage}% of total program patches
                </div>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-text-3">Category Distribution:</span>
              <div className="w-full h-4 rounded-full overflow-hidden flex border border-border">
                <div
                  style={{ width: `${totalsByCategory.Academic.percentage}%` }}
                  className="bg-[#4F6B52]"
                  title={`Academic: ${totalsByCategory.Academic.count}`}
                />
                <div
                  style={{ width: `${totalsByCategory.Athletic.percentage}%` }}
                  className="bg-[#B5472F]"
                  title={`Athletic: ${totalsByCategory.Athletic.count}`}
                />
                <div
                  style={{ width: `${totalsByCategory.Leadership.percentage}%` }}
                  className="bg-[#B8892B]"
                  title={`Leadership: ${totalsByCategory.Leadership.count}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: By Student */}
        {activeTab === 'student' && (
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-ui">
                <thead>
                  <tr className="border-b border-border text-text-3 pb-2">
                    <th className="py-2 font-semibold">Student Recipient</th>
                    <th className="py-2 font-semibold">Class</th>
                    <th className="py-2 font-semibold">High School</th>
                    <th className="py-2 font-semibold">Patches Logged</th>
                    <th className="py-2 font-semibold text-right">Total Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topStudents.slice(0, 8).map((stu, idx) => (
                    <tr key={idx} className="hover:bg-paper-100 transition-colors">
                      <td className="py-2.5 font-semibold text-ink-900">{stu.student}</td>
                      <td className="py-2.5 text-text-2 font-mono">{stu.gradYear}</td>
                      <td className="py-2.5 text-text-2">{stu.schoolName}</td>
                      <td className="py-2.5 text-text-3">{stu.patches.join(', ')}</td>
                      <td className="py-2.5 font-bold text-ink-900 text-right tabular-nums">
                        {stu.patchesEarned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Ledger Strip */}
      <div className="bg-paper-0 p-5 rounded-lg border border-border shadow-sh-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-3" />
            Recent Live Feed
          </h3>
          <button
            type="button"
            onClick={() => navigate('/admin/records')}
            className="text-xs text-thread-600 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View all {records.length} records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-border text-xs">
          {records.slice(0, 6).map((r) => {
            const isReg = r.recordType === 'Registration';
            return (
              <div
                key={r.id}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-paper-100 px-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                      isReg ? 'bg-moss-600/10 text-moss-600' : 'bg-thread-600/10 text-thread-600'
                    }`}
                  >
                    {isReg ? <Award className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                  </span>

                  <div className="min-w-0">
                    <div className="font-semibold text-ink-900 truncate">
                      {isReg ? (
                        <span>
                          {r.student} ({r.gradYear}) earned <strong>{r.patchName}</strong>
                        </span>
                      ) : (
                        <span>
                          {r.schoolName} ordered {r.quantity} × <strong>{r.patchName}</strong>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-3">
                      {r.schoolName} · {r.sportOrProgram}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-[11px] text-text-3">{r.ref}</div>
                  <Chip
                    label={r.recordType}
                    recordType={r.recordType}
                    size="sm"
                    className="mt-0.5"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* School Detail Drawer */}
      <Drawer
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        title={selectedSchool?.name}
        subtitle={selectedSchool?.conference}
      >
        {selectedSchool && (
          <div className="space-y-6 text-xs font-ui">
            {/* Contact Details */}
            <div className="p-3 bg-paper-100 rounded-lg border border-border space-y-1.5">
              <span className="font-semibold text-ink-900 block text-sm">Athletic Contact</span>
              <div>{selectedSchool.contact}</div>
              <div className="text-text-3">{selectedSchool.contactEmail}</div>
            </div>

            {/* School Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-paper-100 rounded-lg border border-border">
                <span className="text-text-3 block text-[11px]">Patches Ordered</span>
                <span className="text-xl font-bold text-ink-900 tabular-nums">
                  {records
                    .filter((r) => r.schoolId === selectedSchool.id && r.recordType === 'Order')
                    .reduce((sum, r) => sum + r.quantity, 0)}
                </span>
              </div>
              <div className="p-3 bg-paper-100 rounded-lg border border-border">
                <span className="text-text-3 block text-[11px]">Student Registrations</span>
                <span className="text-xl font-bold text-ink-900 tabular-nums">
                  {records
                    .filter((r) => r.schoolId === selectedSchool.id && r.recordType === 'Registration')
                    .reduce((sum, r) => sum + r.quantity, 0)}
                </span>
              </div>
            </div>

            {/* School Recent Records */}
            <div className="space-y-2">
              <h4 className="font-semibold text-ink-900">Recent School Records:</h4>
              <div className="divide-y divide-border max-h-64 overflow-y-auto border border-border rounded-lg bg-paper-0 p-2">
                {records
                  .filter((r) => r.schoolId === selectedSchool.id)
                  .map((r) => (
                    <div key={r.id} className="py-2 text-[11px] flex justify-between">
                      <div>
                        <div className="font-semibold text-ink-900">{r.patchName}</div>
                        <div className="text-text-3">
                          {r.recordType === 'Registration' ? r.student : r.contactName} · {r.quantity} qty
                        </div>
                      </div>
                      <div className="text-right text-text-3 font-mono">{r.ref}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
