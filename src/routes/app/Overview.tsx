import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkline,
} from '../../components/ui/Sparkline';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Workflow,
  ShieldCheck,
  ExternalLink,
  Table2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const runs = useStore((s) => s.runs);
  const errors = useStore((s) => s.errors);

  const openErrors = errors.filter((e) => e.status !== 'Resolved');

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#1F2421] font-medium">
            Good morning, Amina
          </h1>
          <p className="text-xs text-[#7A817B] font-mono mt-1">
            Pipeline healthy · {openErrors.length} items need review · Next scheduled run in 38m
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/app/pipeline')}
            icon={<Workflow className="w-3.5 h-3.5" />}
          >
            Scenario Canvas
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/app/test')}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Sandbox Verification
          </Button>
        </div>
      </div>

      {/* Row 1: KPI Cards (4) with Sparklines per PRD §10.2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-[#7A817B]">Records Today</div>
          <div className="flex items-baseline justify-between my-2">
            <span className="font-display text-3xl font-medium text-[#1F2421]">1,284</span>
            <span className="text-xs font-mono text-[#2F7D57]">+14.2%</span>
          </div>
          <div className="pt-2 border-t border-[#E3DED5] flex items-center justify-between">
            <span className="text-[11px] text-[#7A817B]">24-hour volume</span>
            <Sparkline data={[24, 30, 45, 42, 60, 58, 70, 65, 80, 85, 92, 104, 110, 115, 120, 128]} color="#24473B" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-[#7A817B]">Delivered to API</div>
          <div className="flex items-baseline justify-between my-2">
            <span className="font-display text-3xl font-medium text-[#2F7D57]">1,267</span>
            <span className="text-xs font-mono text-[#2F7D57]">98.7% Clean</span>
          </div>
          <div className="pt-2 border-t border-[#E3DED5] flex items-center justify-between">
            <span className="text-[11px] text-[#7A817B]">HTTP 201 Created</span>
            <Sparkline data={[24, 30, 44, 41, 59, 57, 69, 64, 79, 84, 91, 102, 108, 114, 118, 126]} color="#2F7D57" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-[#7A817B]">Caught & Logged</div>
          <div className="flex items-baseline justify-between my-2">
            <span className="font-display text-3xl font-medium text-[#B23A3A]">17</span>
            <span className="text-xs font-mono text-[#B7791F]">1.3% diverted</span>
          </div>
          <div className="pt-2 border-t border-[#E3DED5] flex items-center justify-between">
            <span className="text-[11px] text-[#7A817B]">Break directive</span>
            <Sparkline data={[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1]} color="#B23A3A" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-[#7A817B]">Avg Run Time</div>
          <div className="flex items-baseline justify-between my-2">
            <span className="font-display text-3xl font-medium text-[#1F2421]">42s</span>
            <span className="text-xs font-mono text-[#4A524D]">12 bundles/sec</span>
          </div>
          <div className="pt-2 border-t border-[#E3DED5] flex items-center justify-between">
            <span className="text-[11px] text-[#7A817B]">Drive parse + POST</span>
            <Sparkline data={[38, 41, 40, 42, 45, 42, 39, 41, 42, 44, 43, 42, 41, 42, 40, 42]} color="#46617A" />
          </div>
        </div>
      </div>

      {/* Row 2: Needs Your Attention (8 cols) + Scenario Health (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (8 cols): Needs Attention */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
              <h2 className="font-display text-lg text-[#1F2421] font-medium">
                Needs Your Attention
              </h2>
            </div>
            <span className="text-xs font-mono text-[#7A817B]">
              {openErrors.length} open items in queue
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {openErrors.slice(0, 3).map((err) => (
              <div
                key={err.id}
                className="p-3.5 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#B23A3A] bg-[#F7E0DE] px-1.5 py-0.5 rounded-xs">
                      {err.errorType}
                    </span>
                    <span className="text-xs font-bold text-[#1F2421]">
                      {err.company} ({err.accountId})
                    </span>
                    <span className="text-xs text-[#7A817B]">Row {err.rowNumber}</span>
                  </div>
                  <p className="text-xs text-[#4A524D]">{err.message}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/errors')}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Review
                </Button>
              </div>
            ))}

            {openErrors.length === 0 && (
              <div className="p-6 text-center text-xs text-[#7A817B] font-mono">
                Nothing needs review. Every row from the last run was delivered.
              </div>
            )}
          </div>
        </div>

        {/* Right (4 cols): Scenario Health & Retainer */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
          <h3 className="font-display text-lg text-[#1F2421] font-medium pb-3 border-b border-[#E3DED5]">
            Scenario Health
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#7A817B]">Scenario Status:</span>
              <span className="inline-flex items-center gap-1.5 text-[#2F7D57] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2F7D57] animate-pulse" />
                Active (Polling)
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#E3DED5]">
              <span className="text-[#7A817B]">Last Execution:</span>
              <span className="font-mono text-[#1F2421]">{runs[0]?.id || 'RUN-2026-1019-007'}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#E3DED5]">
              <span className="text-[#7A817B]">Trigger Mode:</span>
              <span className="font-mono text-[#1F2421]">Google Sheets Watch Rows</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#E3DED5]">
              <span className="text-[#7A817B]">Retainer Monitoring:</span>
              <span className="text-[#24473B] font-semibold bg-[#E4ECE7] px-2 py-0.5 rounded-xs">
                Active (30-day SLA)
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/app/handoff')}
            >
              View Maintenance Runbook
            </Button>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Runs Table */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5]">
          <h3 className="font-display text-lg text-[#1F2421] font-medium">
            Recent Scenario Executions
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/app/runs')}
            icon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            All Runs
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E3DED5] text-[#7A817B] font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Trigger</th>
                <th className="py-2.5 px-3">Started</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Delivered</th>
                <th className="py-2.5 px-3">Errors</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DED5]">
              {runs.slice(0, 5).map((run) => (
                <tr
                  key={run.id}
                  onClick={() => navigate('/app/runs')}
                  className="hover:bg-[#FBFAF7] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-medium text-[#24473B]">{run.id}</td>
                  <td className="py-3 px-3 text-[#4A524D]">{run.trigger}</td>
                  <td className="py-3 px-3 text-[#7A817B] font-mono">{run.startedAt}</td>
                  <td className="py-3 px-3 font-mono text-[#1F2421]">{run.duration}</td>
                  <td className="py-3 px-3 font-mono text-[#2F7D57] font-semibold">{run.deliveredCount}</td>
                  <td className="py-3 px-3 font-mono text-[#B23A3A] font-semibold">{run.errorsCount}</td>
                  <td className="py-3 px-3">
                    <StatusPill status={run.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
