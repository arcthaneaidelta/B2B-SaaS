import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Table2,
  FileText,
  Code,
  Repeat,
  GitBranch,
  Send,
  CheckSquare,
  PauseCircle,
  FileWarning,
  Mail,
  Zap,
  Info,
  CheckCircle2,
  Workflow,
} from 'lucide-react';
import { SCENARIO_NODES, ScenarioNode } from '../../mock/runEngine';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';

const iconNodeMap: Record<string, React.ReactNode> = {
  Table2: <Table2 className="w-4 h-4 text-[#24473B]" />,
  FileText: <FileText className="w-4 h-4 text-[#24473B]" />,
  Code: <Code className="w-4 h-4 text-[#24473B]" />,
  Repeat: <Repeat className="w-4 h-4 text-[#24473B]" />,
  GitBranch: <GitBranch className="w-4 h-4 text-[#24473B]" />,
  Send: <Send className="w-4 h-4 text-[#2F7D57]" />,
  CheckSquare: <CheckSquare className="w-4 h-4 text-[#2F7D57]" />,
  PauseCircle: <PauseCircle className="w-4 h-4 text-[#B23A3A]" />,
  FileWarning: <FileWarning className="w-4 h-4 text-[#B23A3A]" />,
  Mail: <Mail className="w-4 h-4 text-[#B7791F]" />,
};

export const Pipeline: React.FC = () => {
  const isRunning = useStore((s) => s.isScenarioRunning);
  const startRun = useStore((s) => s.startScenarioRun);
  const resetRun = useStore((s) => s.resetScenarioRun);
  const speed = useStore((s) => s.scenarioRunSpeed);
  const setSpeed = useStore((s) => s.setScenarioRunSpeed);
  const injectedFailure = useStore((s) => s.injectedFailure);
  const setInjectedFailure = useStore((s) => s.setInjectedFailure);
  const selectedNodeId = useStore((s) => s.selectedModuleId);
  const setSelectedNodeId = useStore((s) => s.setSelectedModuleId);
  const nodeCounts = useStore((s) => s.nodeCounts);
  const liveLogs = useStore((s) => s.liveLogs);

  const [logDrawerOpen, setLogDrawerOpen] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);

  const selectedNode = SCENARIO_NODES.find((n) => n.id === selectedNodeId) || SCENARIO_NODES[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Run Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl text-[#1F2421] font-medium">
              Make.com Scenario Canvas
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#E4ECE7] text-[#24473B] font-semibold">
              SANDBOX SCENARIO #4180
            </span>
          </div>
          <p className="text-xs text-[#7A817B] mt-0.5">
            Parses Drive CSV links, merges customer return profiles, routes valid records to API, and isolates failures.
          </p>
        </div>

        {/* Controls: Run once, Inject failure, Speed, Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Inject failure dropdown per PRD §10.3 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#7A817B]">Drill:</span>
            <select
              value={injectedFailure}
              onChange={(e) => setInjectedFailure(e.target.value as any)}
              disabled={isRunning}
              className="text-xs h-9 px-2.5 bg-[#FBFAF7] border border-[#CFC8BB] rounded-sm text-[#1F2421] cursor-pointer"
            >
              <option value="none">Clean Run (0 errors)</option>
              <option value="missing_field">Inject Missing Address</option>
              <option value="bad_postcode">Inject Invalid Postcode</option>
              <option value="duplicate_key">Inject Duplicate Key</option>
              <option value="api_500">Inject Upstream HTTP 502</option>
            </select>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center border border-[#CFC8BB] rounded-sm p-0.5 bg-[#FBFAF7]">
            <button
              type="button"
              onClick={() => setSpeed(1)}
              className={`text-xs px-2 py-1 rounded-xs font-mono font-medium ${
                speed === 1 ? 'bg-[#FFFFFF] text-[#1F2421] shadow-1' : 'text-[#7A817B]'
              }`}
            >
              1×
            </button>
            <button
              type="button"
              onClick={() => setSpeed(2)}
              className={`text-xs px-2 py-1 rounded-xs font-mono font-medium ${
                speed === 2 ? 'bg-[#FFFFFF] text-[#1F2421] shadow-1' : 'text-[#7A817B]'
              }`}
            >
              2×
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={resetRun}
            disabled={isRunning}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>

          <Button
            size="sm"
            variant="primary"
            isLoading={isRunning}
            onClick={startRun}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Run once (12 bundles)
          </Button>
        </div>
      </div>

      {/* Main Interactive Stage: Canvas + Inspector Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Canvas (8 or 9 cols on xl) */}
        <div className="xl:col-span-8 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 overflow-x-auto relative min-h-[480px]">
          {/* Subtle 24px dot grid pattern background per PRD §10.3 */}
          <div
            className="w-full min-w-[760px] h-[480px] p-6 relative"
            style={{
              backgroundImage: 'radial-gradient(#E3DED5 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {/* Path: Node 1 to 2 */}
              <path d="M 120 142 L 200 142" stroke="#CFC8BB" strokeWidth="2" fill="none" />
              {/* Path: Node 2 to 3 */}
              <path d="M 310 142 L 390 142" stroke="#CFC8BB" strokeWidth="2" fill="none" />
              {/* Path: Node 3 to 4 */}
              <path d="M 500 142 L 580 142" stroke="#CFC8BB" strokeWidth="2" fill="none" />
              {/* Path: Node 4 to 5 */}
              <path d="M 690 142 L 770 142" stroke="#CFC8BB" strokeWidth="2" fill="none" />

              {/* Upper Route: 5 -> 6 -> 7 (Clean API path) */}
              <path d="M 880 142 C 920 142, 920 90, 960 90" stroke="#CFC8BB" strokeWidth="2" fill="none" />
              <path d="M 1070 90 L 1150 90" stroke="#CFC8BB" strokeWidth="2" fill="none" />

              {/* Lower Route: 5 -> 8 -> 9 -> 10 (Break & Error path) */}
              <path d="M 880 142 C 920 142, 920 230, 960 230" stroke="#E3DED5" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 1070 230 L 1130 230" stroke="#E3DED5" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 1240 230 L 1300 230" stroke="#E3DED5" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            </svg>

            {/* Interactive Module Nodes */}
            <div className="relative z-10 w-[1400px] h-full">
              {SCENARIO_NODES.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const count = nodeCounts[node.id] || 0;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className={`absolute w-[168px] h-[64px] rounded-md border p-2.5 flex items-center justify-between cursor-pointer transition-all duration-140 select-none shadow-1 ${
                      node.isErrorBranch
                        ? isSelected
                          ? 'bg-[#F7E0DE] border-[#B23A3A] ring-2 ring-[#B23A3A]/20'
                          : 'bg-[#FBFAF7] border-[#F7E0DE] hover:border-[#B23A3A]'
                        : isSelected
                        ? 'bg-[#E4ECE7] border-[#24473B] ring-2 ring-[#24473B]/20'
                        : 'bg-[#FFFFFF] border-[#CFC8BB] hover:border-[#4A524D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-sm bg-[#EFEBE4] flex items-center justify-center shrink-0">
                        {iconNodeMap[node.iconName] || <Workflow className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[11px] font-semibold text-[#1F2421] truncate leading-tight">
                          {node.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#7A817B] truncate">
                          {node.service}
                        </span>
                      </div>
                    </div>

                    {/* Node count pill top-right */}
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[#EFEBE4] text-[#4A524D] font-bold">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Inspector Panel (360px per PRD §10.3) */}
        <div className="xl:col-span-4 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7A817B] font-semibold">
                MODULE INSPECTOR #{selectedNode.number}
              </span>
              <h3 className="font-display text-lg text-[#1F2421] font-medium">
                {selectedNode.name}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-sm bg-[#EFEBE4] flex items-center justify-center">
              {iconNodeMap[selectedNode.iconName]}
            </div>
          </div>

          <p className="text-xs text-[#4A524D] leading-relaxed">
            {selectedNode.description}
          </p>

          {/* Connection summary */}
          <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-1.5 text-xs">
            <div className="text-[#7A817B] font-mono text-[10px]">CONNECTED SYSTEM</div>
            <div className="font-semibold text-[#1F2421]">{selectedNode.configSummary.connection}</div>
            <div className="text-[#4A524D] font-mono text-[11px] truncate">
              {selectedNode.configSummary.target}
            </div>
          </div>

          {/* Config details list */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E3DED5]">
            <span className="text-[10px] font-mono uppercase text-[#7A817B] font-semibold">
              Parameter Settings (Read-only)
            </span>
            {Object.entries(selectedNode.configSummary.details).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center text-xs py-1">
                <span className="text-[#7A817B]">{key}:</span>
                <span className="font-mono font-medium text-[#1F2421] truncate max-w-[180px]">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Live Bundle In/Out metrics */}
          <div className="p-3 bg-[#EFEBE4] rounded-sm text-xs font-mono text-[#4A524D] flex justify-between items-center mt-2">
            <span>EXECUTION STATUS:</span>
            <span className="text-[#2F7D57] font-bold">200 OK (0.24s)</span>
          </div>
        </div>
      </div>

      {/* Bottom Collapsible Execution Log Drawer per PRD §10.3 */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 overflow-hidden">
        <div
          onClick={() => setLogDrawerOpen(!logDrawerOpen)}
          className="px-4 py-3 bg-[#FBFAF7] border-b border-[#E3DED5] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#1F2421]">
              Live Execution Log
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#EFEBE4] text-[#4A524D]">
              {liveLogs.length} events
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAutoScroll(!autoScroll);
              }}
              className="text-[#7A817B] hover:text-[#1F2421] underline"
            >
              {autoScroll ? 'Pause scroll' : 'Resume scroll'}
            </button>
            {logDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>

        {logDrawerOpen && (
          <div className="p-4 bg-[#1F2421] text-[#F6F3EE] max-h-56 overflow-y-auto font-mono text-xs flex flex-col gap-1.5 leading-relaxed">
            {liveLogs.map((log) => {
              const levelColor =
                log.level === 'error'
                  ? 'text-[#F7E0DE] bg-[#B23A3A]/30'
                  : log.level === 'warn'
                  ? 'text-[#F8EBD2] bg-[#B7791F]/30'
                  : log.level === 'success'
                  ? 'text-[#7BD4A8]'
                  : 'text-[#A3B8AD]';

              return (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-[#7A817B] shrink-0">[{log.time}]</span>
                  <span className={`px-1 py-0.2 rounded-xs uppercase text-[9px] shrink-0 font-bold ${levelColor}`}>
                    {log.level}
                  </span>
                  <span className="text-[#CFC8BB] shrink-0">Node #{log.nodeNumber}:</span>
                  <span className="text-[#F6F3EE] break-all">{log.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
