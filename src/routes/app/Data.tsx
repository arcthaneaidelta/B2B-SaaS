import React, { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import {
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  FastForward,
  HelpCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { downloadSampleCsv } from '../../mock/api';
import { CsvRecipientRow } from '../../mock/seed';

export const Data: React.FC = () => {
  const accounts = useStore((s) => s.accounts);
  const csvRows = useStore((s) => s.csvRows);
  const mergedResult = useStore((s) => s.mergedResult);
  const runMerge = useStore((s) => s.runCsvMerge);
  const errors = useStore((s) => s.errors);
  const resolveError = useStore((s) => s.resolveErrorItem);

  const [activeTab, setActiveTab] = useState<'parameters' | 'csv' | 'merge' | 'errors'>('parameters');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; value: string } | null>(null);

  // Merge Visualizer Animation State
  const [isMerging, setIsMerging] = useState(false);
  const [mergeStep, setMergeStep] = useState<number>(0);

  // Error details drawer state
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const selectedError = errors.find((e) => e.id === selectedErrorId);
  const [correctZipInput, setCorrectZipInput] = useState('44308');

  const startMergeVisualizer = async () => {
    setIsMerging(true);
    setMergeStep(1); // Keys connecting
    await new Promise((r) => setTimeout(r, 900));
    setMergeStep(2); // Rows sliding into merged table
    await new Promise((r) => setTimeout(r, 900));
    setMergeStep(3); // Orphans & duplicates falling into review tray
    await new Promise((r) => setTimeout(r, 800));
    runMerge();
    setIsMerging(false);
  };

  const skipMergeAnimation = () => {
    runMerge();
    setIsMerging(false);
    setMergeStep(3);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#1F2421] font-medium">
            Google Sheets Master Data Workspace
          </h1>
          <p className="text-xs text-[#7A817B] font-mono mt-0.5">
            Synchronized with Quillfold Master Sheet (Connected via Google Service Account)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={downloadSampleCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download sample-recipients.csv
          </Button>
        </div>
      </div>

      {/* Spreadsheet Tabs */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 overflow-hidden">
        <div className="px-4 pt-2 bg-[#FBFAF7] border-b border-[#E3DED5] flex items-center justify-between">
          <Tabs
            tabs={[
              { id: 'parameters', label: 'Customer Parameters', count: accounts.length },
              { id: 'csv', label: 'CSV Import', count: csvRows.length },
              { id: 'merge', label: 'Merged Output', count: mergedResult.stats.mergedCount },
              { id: 'errors', label: 'Error Log', count: errors.length },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
          />

          {/* Formula bar mock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#EFEBE4] rounded-xs text-[11px] font-mono text-[#4A524D] max-w-sm truncate">
            <span className="text-[#7A817B]">fx:</span>
            <span>{selectedCell ? selectedCell.value : '=VLOOKUP(A2, CustomerParams!A:G, 2, FALSE)'}</span>
          </div>
        </div>

        {/* TAB 1: CUSTOMER PARAMETERS SHEET */}
        {activeTab === 'parameters' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[800px] divide-y divide-[#E3DED5]">
              <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Account ID</th>
                  <th className="py-2.5 px-3">Company Name</th>
                  <th className="py-2.5 px-3">Primary Sender</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Billing</th>
                  <th className="py-2.5 px-3">Template</th>
                  <th className="py-2.5 px-3">Attributes</th>
                  <th className="py-2.5 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED5]">
                {accounts.map((acc, rowIdx) => {
                  const isNew = acc.isNew;
                  return (
                    <tr
                      key={acc.accountId}
                      className={`transition-colors duration-150 ${
                        isNew ? 'bg-[#E4ECE7]/50 font-medium' : 'hover:bg-[#FBFAF7]'
                      }`}
                    >
                      <td
                        onClick={() => setSelectedCell({ row: rowIdx, col: 'accountId', value: acc.accountId })}
                        className="py-2.5 px-3 font-mono font-bold text-[#24473B] cursor-pointer"
                      >
                        {acc.accountId}
                        {isNew && (
                          <span className="ml-2 text-[9px] font-sans font-semibold bg-[#B5654A] text-white px-1.5 py-0.2 rounded-xs">
                            NEW
                          </span>
                        )}
                      </td>
                      <td
                        onClick={() => setSelectedCell({ row: rowIdx, col: 'company', value: acc.company })}
                        className="py-2.5 px-3 font-medium text-[#1F2421] cursor-pointer"
                      >
                        {acc.company}
                      </td>
                      <td
                        onClick={() => setSelectedCell({ row: rowIdx, col: 'ownerName', value: `${acc.ownerName} (${acc.ownerTitle})` })}
                        className="py-2.5 px-3 text-[#4A524D] cursor-pointer"
                      >
                        {acc.ownerName} <span className="text-[#7A817B]">({acc.ownerTitle})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-[#EFEBE4] text-[#1F2421]">
                          {acc.plan}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#7A817B] font-mono">{acc.cadence}</td>
                      <td className="py-2.5 px-3 font-mono text-[#4A524D]">{acc.template}</td>
                      <td className="py-2.5 px-3 text-[11px] text-[#2F7D57]">
                        {[acc.attributes.includeLogo && 'Logo', acc.attributes.personalizeFirstName && 'Personalize', acc.attributes.addReferenceCode && 'RefCode'].filter(Boolean).join(' · ')}
                      </td>
                      <td className="py-2.5 px-3 text-[#7A817B] font-mono text-[11px]">{acc.submittedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: CSV IMPORT SHEET */}
        {activeTab === 'csv' && (
          <div className="p-6 flex flex-col gap-6">
            {/* Drop Zone per PRD §10.4 */}
            <div className="p-8 border-2 border-dashed border-[#CFC8BB] hover:border-[#24473B] rounded-md bg-[#FBFAF7] flex flex-col items-center justify-center gap-3 text-center transition-colors">
              <UploadCloud className="w-10 h-10 text-[#24473B]" />
              <div>
                <h3 className="font-display text-base text-[#1F2421] font-medium">
                  Drop a CSV file or paste a Drive link
                </h3>
                <p className="text-xs text-[#7A817B] max-w-sm mt-1">
                  We’ll validate RFC-4180 headers and cross-reference account keys before dispatching to Make.com.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button size="sm" variant="outline" onClick={downloadSampleCsv}>
                  Download sample CSV (24 rows)
                </Button>
                <Button size="sm" variant="primary" onClick={() => setActiveTab('merge')}>
                  Open Merge Visualizer
                </Button>
              </div>
            </div>

            {/* CSV Table Preview */}
            <div className="overflow-x-auto border border-[#E3DED5] rounded-md">
              <table className="w-full text-xs text-left min-w-[700px] divide-y divide-[#E3DED5]">
                <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Row #</th>
                    <th className="py-2.5 px-3">Account ID</th>
                    <th className="py-2.5 px-3">Recipient Name</th>
                    <th className="py-2.5 px-3">Address</th>
                    <th className="py-2.5 px-3">Postcode</th>
                    <th className="py-2.5 px-3">Ref Code</th>
                    <th className="py-2.5 px-3">Issue Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DED5]">
                  {csvRows.map((row) => {
                    const hasIssue = !!row.issueType;
                    return (
                      <tr
                        key={row.rowId}
                        className={hasIssue ? 'bg-[#F7E0DE]/40' : 'hover:bg-[#FBFAF7]'}
                      >
                        <td className="py-2.5 px-3 font-mono text-[#7A817B]">{row.rowId}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-[#24473B]">{row.accountId}</td>
                        <td className="py-2.5 px-3 font-medium text-[#1F2421]">{row.recipientName}</td>
                        <td className="py-2.5 px-3 text-[#4A524D]">{row.addressLine1}, {row.city}</td>
                        <td className="py-2.5 px-3 font-mono">
                          {row.postcode ? (
                            row.postcode
                          ) : (
                            <span className="text-[#B23A3A] font-bold underline decoration-dotted">
                              [EMPTY]
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#7A817B]">{row.referenceCode}</td>
                        <td className="py-2.5 px-3">
                          {row.issueType ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#F7E0DE] text-[#B23A3A] font-bold">
                              {row.issueType}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#2F7D57] font-mono">OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MERGED OUTPUT & MERGE VISUALIZER PER PRD §10.4 & §21 */}
        {activeTab === 'merge' && (
          <div className="p-6 flex flex-col gap-6">
            {/* Visualizer Control Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FBFAF7] border border-[#E3DED5] rounded-md">
              <div>
                <h3 className="font-display text-lg text-[#1F2421] font-medium">
                  Multi-Row CSV Key Merge Visualizer
                </h3>
                <p className="text-xs text-[#7A817B]">
                  Matches incoming CSV recipient records to customer sender profiles on unique Account ID.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isMerging && (
                  <Button size="sm" variant="ghost" onClick={skipMergeAnimation}>
                    Skip animation
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isMerging}
                  onClick={startMergeVisualizer}
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Merge on Account ID
                </Button>
              </div>
            </div>

            {/* Results Counters Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
              <div className="p-4 bg-[#E1F0E8] border border-[#2F7D57]/30 rounded-md">
                <div className="text-2xl font-bold text-[#2F7D57]">
                  {mergedResult.stats.mergedCount} Merged
                </div>
                <div className="text-xs text-[#2F7D57] mt-0.5">Matched with verified sender profiles</div>
              </div>

              <div className="p-4 bg-[#F8EBD2] border border-[#B7791F]/30 rounded-md">
                <div className="text-2xl font-bold text-[#B7791F]">
                  {mergedResult.stats.orphansCount} Orphaned
                </div>
                <div className="text-xs text-[#B7791F] mt-0.5">Account ID not registered in Google Sheets</div>
              </div>

              <div className="p-4 bg-[#F7E0DE] border border-[#B23A3A]/30 rounded-md">
                <div className="text-2xl font-bold text-[#B23A3A]">
                  {mergedResult.stats.duplicatesCount} Duplicate
                </div>
                <div className="text-xs text-[#B23A3A] mt-0.5">Collision: recipient exists under account</div>
              </div>
            </div>

            {/* Side-by-Side Merge Visualizer Animation State */}
            {isMerging && (
              <div className="p-6 bg-[#FFFFFF] border border-[#24473B] rounded-md shadow-2 flex flex-col items-center gap-4 animate-pulse">
                <div className="text-xs font-mono uppercase text-[#24473B] font-bold">
                  {mergeStep === 1 && 'Connecting unique keys: [Account ID + Recipient Name]…'}
                  {mergeStep === 2 && 'Merging sender return address and template attributes into output rows…'}
                  {mergeStep === 3 && 'Routing orphan and duplicate records into isolated review queue…'}
                </div>
                <div className="w-full max-w-md h-2 bg-[#EFEBE4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#24473B] transition-all duration-700 ease-out"
                    style={{ width: `${(mergeStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Merged Output Table & Review Tray */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Clean Merged Table (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-2">
                <span className="text-xs font-mono uppercase text-[#24473B] font-bold">
                  Clean Merged Payloads ({mergedResult.stats.mergedCount} records)
                </span>
                <div className="overflow-x-auto border border-[#E3DED5] rounded-md">
                  <table className="w-full text-xs text-left min-w-[600px] divide-y divide-[#E3DED5]">
                    <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Record ID</th>
                        <th className="py-2.5 px-3">Account</th>
                        <th className="py-2.5 px-3">Sender</th>
                        <th className="py-2.5 px-3">Recipient</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3DED5]">
                      {mergedResult.merged.slice(0, 10).map((m) => (
                        <tr key={m.recordId} className="hover:bg-[#FBFAF7]">
                          <td className="py-2.5 px-3 font-mono text-[#24473B] font-semibold">{m.recordId}</td>
                          <td className="py-2.5 px-3 font-mono text-[#1F2421]">{m.accountId}</td>
                          <td className="py-2.5 px-3 text-[#4A524D]">{m.senderName}</td>
                          <td className="py-2.5 px-3 font-medium text-[#1F2421]">{m.recipientName}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#E1F0E8] text-[#2F7D57] font-semibold">
                              READY
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Needs Review Tray (4 cols) per PRD §10.4 */}
              <div className="lg:col-span-4 bg-[#FBFAF7] border border-[#CFC8BB] rounded-md p-4 flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-[#B5654A] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Needs Review Tray ({mergedResult.orphans.length + mergedResult.duplicates.length})</span>
                </span>

                {mergedResult.orphans.map((o) => (
                  <div key={o.row.rowId} className="p-3 bg-[#FFFFFF] border border-[#E3DED5] rounded-xs text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#B7791F]">Row #{o.row.rowId} (Orphan)</span>
                      <span className="font-mono text-[#7A817B]">{o.row.accountId}</span>
                    </div>
                    <div className="text-[#1F2421] font-medium">{o.row.recipientName}</div>
                    <div className="text-[11px] text-[#B7791F] leading-tight">{o.reason}</div>
                  </div>
                ))}

                {mergedResult.duplicates.map((d) => (
                  <div key={d.row.rowId} className="p-3 bg-[#FFFFFF] border border-[#E3DED5] rounded-xs text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#B23A3A]">Row #{d.row.rowId} (Duplicate)</span>
                      <span className="font-mono text-[#7A817B]">{d.row.accountId}</span>
                    </div>
                    <div className="text-[#1F2421] font-medium">{d.row.recipientName}</div>
                    <div className="text-[11px] text-[#B23A3A] leading-tight">{d.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ERROR LOG SHEET */}
        {activeTab === 'errors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[750px] divide-y divide-[#E3DED5]">
              <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Run ID</th>
                  <th className="py-2.5 px-3">Row</th>
                  <th className="py-2.5 px-3">Account</th>
                  <th className="py-2.5 px-3">Error Type</th>
                  <th className="py-2.5 px-3">Message</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED5]">
                {errors.map((err) => (
                  <tr
                    key={err.id}
                    className="hover:bg-[#FBFAF7] cursor-pointer"
                    onClick={() => setSelectedErrorId(err.id)}
                  >
                    <td className="py-3 px-3 font-mono text-[#7A817B]">{err.timestamp}</td>
                    <td className="py-3 px-3 font-mono text-[#24473B] font-medium">{err.runId}</td>
                    <td className="py-3 px-3 font-mono text-[#7A817B]">#{err.rowNumber}</td>
                    <td className="py-3 px-3 font-mono text-[#1F2421]">{err.accountId}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[#F7E0DE] text-[#B23A3A] font-bold">
                        {err.errorType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#4A524D] max-w-xs truncate">{err.message}</td>
                    <td className="py-3 px-3">
                      <StatusPill status={err.status} />
                    </td>
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedErrorId(err.id)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error Details Drawer */}
      <Drawer
        isOpen={!!selectedErrorId}
        onClose={() => setSelectedErrorId(null)}
        title={selectedError ? `Error: ${selectedError.errorType}` : 'Error Details'}
      >
        {selectedError && (
          <div className="flex flex-col gap-6 text-xs font-sans">
            <div className="p-3 bg-[#F7E0DE] text-[#B23A3A] rounded-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{selectedError.failingField}: </span>
                {selectedError.message}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm">
              <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                <span className="text-[#7A817B]">Account ID:</span>
                <span className="font-mono font-bold text-[#1F2421]">{selectedError.accountId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                <span className="text-[#7A817B]">Company:</span>
                <span className="text-[#1F2421]">{selectedError.company}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                <span className="text-[#7A817B]">CSV Row Number:</span>
                <span className="font-mono text-[#1F2421]">#{selectedError.rowNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#7A817B]">Recipient:</span>
                <span className="font-medium text-[#1F2421]">{selectedError.rawRecord.recipientName}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-2">
              <span className="font-bold text-[#24473B]">Suggested Fix:</span>
              <p className="text-[#4A524D]">{selectedError.suggestedFix}</p>

              {selectedError.failingField === 'postcode' && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={correctZipInput}
                    onChange={(e) => setCorrectZipInput(e.target.value)}
                    className="h-8 px-2 border border-[#CFC8BB] rounded-sm font-mono text-xs w-28"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      resolveError(selectedError.id, { postcode: correctZipInput });
                      setSelectedErrorId(null);
                    }}
                  >
                    Apply Fix & Resolve
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
