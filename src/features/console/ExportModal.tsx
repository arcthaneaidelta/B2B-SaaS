import React, { useState } from 'react';
import { useDemoStore } from '../../data/store';
import { filterRecords } from '../../data/selectors';
import { exportToExcel } from '../../lib/xlsx';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  FileSpreadsheet,
  CheckSquare,
  HelpCircle,
  Download,
  Loader2,
  TableProperties,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { records, schools, patches, filters } = useDemoStore();
  const { addToast } = useToast();

  const [includeFlatData, setIncludeFlatData] = useState(true);
  const [includeSchools, setIncludeSchools] = useState(true);
  const [includeCatalog, setIncludeCatalog] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [scope, setScope] = useState<'all' | 'filtered'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showPivotTip, setShowPivotTip] = useState(false);

  const activeRecords =
    scope === 'filtered' ? filterRecords(records, filters) : records;

  const handleExport = async () => {
    setIsExporting(true);

    // 700ms simulated preparation per PRD §12.4
    await new Promise((r) => setTimeout(r, 700));

    try {
      const result = exportToExcel(activeRecords, schools, patches, {
        includeFlatData,
        includeSchools,
        includeCatalog,
        includeSummary,
        scope,
      });

      addToast({
        type: 'success',
        title: `Exported ${result.rowCount} rows to Excel`,
        description: `${result.filename} downloaded. Contains denormalized columns ready for instant Pivot Tables.`,
        action: {
          label: 'Pivot Table tip',
          onClick: () => setShowPivotTip(true),
        },
      });

      setIsExporting(false);
      onClose();
    } catch (e) {
      console.error(e);
      setIsExporting(false);
      addToast({
        type: 'error',
        title: 'Export failed',
        description: 'Unable to build workbook file.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export to Excel (.xlsx)"
      description="Client-side spreadsheet generation with zero server dependencies."
    >
      <div className="space-y-5 font-ui text-ink-900">
        {/* Scope Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-ink-900 uppercase tracking-wider">
            Export Scope
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`p-2.5 rounded-md border text-left text-xs transition-all ${
                scope === 'all'
                  ? 'border-ink-900 bg-paper-100 font-semibold'
                  : 'border-border bg-paper-0 text-text-2 hover:bg-paper-50'
              }`}
            >
              <div className="text-ink-900">All Database Records</div>
              <div className="text-[11px] text-text-3 mt-0.5">{records.length} total rows</div>
            </button>

            <button
              type="button"
              onClick={() => setScope('filtered')}
              className={`p-2.5 rounded-md border text-left text-xs transition-all ${
                scope === 'filtered'
                  ? 'border-ink-900 bg-paper-100 font-semibold'
                  : 'border-border bg-paper-0 text-text-2 hover:bg-paper-50'
              }`}
            >
              <div className="text-ink-900">Current Filtered View</div>
              <div className="text-[11px] text-text-3 mt-0.5">
                {filterRecords(records, filters).length} matching rows
              </div>
            </button>
          </div>
        </div>

        {/* Included Sheets */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-ink-900 uppercase tracking-wider">
            Included Sheets
          </label>
          <div className="space-y-2 bg-paper-100 p-3 rounded-lg border border-border text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFlatData}
                onChange={(e) => setIncludeFlatData(e.target.checked)}
                className="w-4 h-4 rounded text-thread-600 focus:ring-thread-600"
              />
              <span className="font-semibold text-ink-900">
                Registry &amp; Orders (Pivot-Ready Flat Data)
              </span>
            </label>
            <p className="text-[11px] text-text-3 ml-6">
              Denormalized with School, Conference, and Category columns for 1-click Pivot Tables.
            </p>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeSchools}
                onChange={(e) => setIncludeSchools(e.target.checked)}
                className="w-4 h-4 rounded text-thread-600 focus:ring-thread-600"
              />
              <span className="font-medium text-ink-900">Schools Directory &amp; Order Rollups</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeCatalog}
                onChange={(e) => setIncludeCatalog(e.target.checked)}
                className="w-4 h-4 rounded text-thread-600 focus:ring-thread-600"
              />
              <span className="font-medium text-ink-900">Patch Catalog &amp; Live Stock Levels</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
                className="w-4 h-4 rounded text-thread-600 focus:ring-thread-600"
              />
              <span className="font-medium text-ink-900">Summary &amp; Pivot Table Setup Guide</span>
            </label>
          </div>
        </div>

        {/* Pivot Table Quick Guide Accordion */}
        <div className="border border-dashed border-border rounded-lg p-3 bg-paper-0">
          <button
            type="button"
            onClick={() => setShowPivotTip(!showPivotTip)}
            className="w-full flex items-center justify-between text-xs font-semibold text-ink-900"
          >
            <span className="flex items-center gap-1.5">
              <TableProperties className="w-4 h-4 text-thread-600" />
              How Pivot Tables work with this export
            </span>
            <span className="text-[11px] text-thread-600">{showPivotTip ? 'Hide' : 'Show 3-step tip'}</span>
          </button>

          {showPivotTip && (
            <ol className="mt-3 text-xs text-text-2 space-y-1.5 list-decimal pl-4 pt-2 border-t border-border">
              <li>
                Open the downloaded file in Microsoft Excel or Google Sheets.
              </li>
              <li>
                Go to the sheet named <strong>"Registry &amp; Orders (Pivot)"</strong> and click <strong>Insert → PivotTable</strong>.
              </li>
              <li>
                Drag <strong>School Name</strong> to Rows, <strong>Category</strong> to Columns, and <strong>Quantity</strong> to Values.
              </li>
            </ol>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="accent"
            onClick={handleExport}
            disabled={isExporting || (!includeFlatData && !includeSchools && !includeCatalog)}
            leftIcon={
              isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )
            }
          >
            {isExporting ? 'Preparing Excel File…' : 'Download .xlsx'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
