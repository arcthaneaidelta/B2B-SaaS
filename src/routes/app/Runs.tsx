import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { Filter, RotateCcw, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { RunHistoryItem } from '../../mock/seed';

export const Runs: React.FC = () => {
  const runs = useStore((s) => s.runs);
  const addToast = useStore((s) => s.addToast);

  const [selectedRun, setSelectedRun] = useState<RunHistoryItem | null>(null);
  const [filterTrigger, setFilterTrigger] = useState<string>('all');
  const [isRerunning, setIsRerunning] = useState(false);

  const filteredRuns = runs.filter((r) => {
    if (filterTrigger === 'all') return true;
    return r.trigger.toLowerCase().includes(filterTrigger.toLowerCase());
  });

  const handleRerunFailed = async () => {
    setIsRerunning(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsRerunning(false);
    addToast({
      message: `Re-run of failed bundles from ${selectedRun?.id} finished clean (2/2 delivered).`,
      type: 'success',
    });
    setSelectedRun(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#1F2421] font-medium">
            Scenario Execution History
          </h1>
          <p className="text-xs text-[#7A817B] font-mono mt-0.5">
            Audit log of scheduled cron triggers, manual dispatches, and sandbox tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#7A817B]">
            <Filter className="w-3.5 h-3.5" />
            <span>Trigger:</span>
          </div>
          <select
            value={filterTrigger}
            onChange={(e) => setFilterTrigger(e.target.value)}
            className="text-xs h-9 px-2 bg-[#FFFFFF] border border-[#CFC8BB] rounded-sm text-[#1F2421]"
          >
            <option value="all">All Triggers</option>
            <option value="schedule">Schedule</option>
            <option value="manual">Manual</option>
            <option value="sandbox">Sandbox Test</option>
          </select>
        </div>
      </div>

      {/* Runs Table */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px] divide-y divide-[#E3DED5]">
            <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Run Identifier</th>
                <th className="py-3 px-4">Trigger</th>
                <th className="py-3 px-4">Started At</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Total Records</th>
                <th className="py-3 px-4">Delivered</th>
                <th className="py-3 px-4">Errors Caught</th>
                <th className="py-3 px-4">Execution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DED5]">
              {filteredRuns.map((run) => (
                <tr
                  key={run.id}
                  onClick={() => setSelectedRun(run)}
                  className="hover:bg-[#FBFAF7] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#24473B]">{run.id}</td>
                  <td className="py-3 px-4 text-[#4A524D]">{run.trigger}</td>
                  <td className="py-3 px-4 text-[#7A817B] font-mono">{run.startedAt}</td>
                  <td className="py-3 px-4 font-mono text-[#1F2421]">{run.duration}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1F2421]">{run.recordsCount}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#2F7D57]">{run.deliveredCount}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#B23A3A]">{run.errorsCount}</td>
                  <td className="py-3 px-4">
                    <StatusPill status={run.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Detail Drawer per PRD §10.5 */}
      <Drawer
        isOpen={!!selectedRun}
        onClose={() => setSelectedRun(null)}
        title={selectedRun ? `Run Audit: ${selectedRun.id}` : 'Run Detail'}
      >
        {selectedRun && (
          <div className="flex flex-col gap-6 text-xs font-sans">
            <div className="flex justify-between items-center p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm">
              <div>
                <div className="font-semibold text-sm text-[#1F2421]">{selectedRun.trigger} Execution</div>
                <div className="font-mono text-[#7A817B]">{selectedRun.startedAt} ({selectedRun.duration})</div>
              </div>
              <StatusPill status={selectedRun.status} />
            </div>

            {/* Per-Module Throughput Bars */}
            <div className="flex flex-col gap-3">
              <span className="font-mono uppercase text-[10px] text-[#7A817B] font-semibold">
                Per-Module Bundle Counters
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[#4A524D]">
                  <span>Watch Rows (Sheets):</span>
                  <span className="font-mono font-bold">{selectedRun.modulesStats.watchRows}</span>
                </div>
                <div className="flex justify-between text-[#4A524D]">
                  <span>Parse CSV:</span>
                  <span className="font-mono font-bold">{selectedRun.modulesStats.parseCsv}</span>
                </div>
                <div className="flex justify-between text-[#4A524D]">
                  <span>Iterator Bundles:</span>
                  <span className="font-mono font-bold">{selectedRun.modulesStats.iterator}</span>
                </div>
                <div className="flex justify-between text-[#2F7D57] font-semibold">
                  <span>Send to API (201 Created):</span>
                  <span className="font-mono font-bold">{selectedRun.modulesStats.sendApi}</span>
                </div>
                <div className="flex justify-between text-[#B23A3A] font-semibold">
                  <span>Break Route Diverted:</span>
                  <span className="font-mono font-bold">{selectedRun.modulesStats.breakRoute}</span>
                </div>
              </div>
            </div>

            {/* Re-run Failed Only Action */}
            {selectedRun.errorsCount > 0 && (
              <div className="p-4 bg-[#F8EBD2] border border-[#B7791F]/30 rounded-md flex flex-col gap-2">
                <span className="font-semibold text-[#B7791F]">Incomplete Bundles Stored</span>
                <p className="text-[#4A524D]">
                  {selectedRun.errorsCount} bundle(s) diverted to the Break directive. You can re-run
                  just the failed records without reprocessing the full CSV.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isRerunning}
                  onClick={handleRerunFailed}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Re-run failed only ({selectedRun.errorsCount})
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
