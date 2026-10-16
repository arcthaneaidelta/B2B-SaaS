import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../data/store';
import {
  Search,
  School as SchoolIcon,
  Award,
  User,
  Download,
  RotateCcw,
  QrCode,
  HelpCircle,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerExport: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onTriggerExport,
}) => {
  const navigate = useNavigate();
  const { schools, patches, records, resetDemoData } = useDemoStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingSchools = schools.filter(
    (s) => s.name.toLowerCase().includes(q) || s.conference.toLowerCase().includes(q)
  );
  const matchingPatches = patches.filter(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );
  const matchingStudents = Array.from(
    new Set(
      records
        .filter((r) => r.student && r.student !== '—' && r.student.toLowerCase().includes(q))
        .map((r) => `${r.student} (${r.schoolName})`)
    )
  ).slice(0, 5);

  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-16 sm:pt-24 p-4 font-ui">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Palette Panel */}
      <div className="relative z-10 w-full max-w-xl bg-paper-0 border border-border rounded-xl shadow-sh-3 overflow-hidden animate-scale-in">
        {/* Search Input Bar */}
        <div className="px-4 py-3.5 border-b border-border flex items-center gap-3 bg-paper-100">
          <Search className="w-5 h-5 text-text-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search schools, patches, students, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-ink-900 placeholder:text-text-3 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-3 hover:text-ink-900 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/60 text-xs">
          {/* Quick Actions */}
          <div className="py-2 space-y-1">
            <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-3 block">
              Quick Actions
            </span>
            <button
              type="button"
              onClick={() =>
                handleAction(() => {
                  onTriggerExport();
                })
              }
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center gap-2.5 text-ink-900"
            >
              <Download className="w-4 h-4 text-thread-600" />
              <span>Export to Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => navigate('/admin/qr'))}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center gap-2.5 text-ink-900"
            >
              <QrCode className="w-4 h-4 text-moss-600" />
              <span>Universal QR Code &amp; Printable Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => navigate('/how-it-works'))}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center gap-2.5 text-ink-900"
            >
              <HelpCircle className="w-4 h-4 text-gold-500" />
              <span>How It's Built &amp; Low-Code Cost Breakdown</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleAction(() => {
                  resetDemoData();
                })
              }
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center gap-2.5 text-status-error"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Seed Data</span>
            </button>
          </div>

          {/* Schools */}
          {matchingSchools.length > 0 && (
            <div className="py-2 space-y-1">
              <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-3 block">
                Schools ({matchingSchools.length})
              </span>
              {matchingSchools.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleAction(() => navigate('/admin/schools'))}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center justify-between text-ink-900"
                >
                  <span className="flex items-center gap-2">
                    <SchoolIcon className="w-3.5 h-3.5 text-text-3" />
                    <span className="font-medium">{s.name}</span>
                  </span>
                  <span className="text-[11px] text-text-3">{s.conference}</span>
                </button>
              ))}
            </div>
          )}

          {/* Patches */}
          {matchingPatches.length > 0 && (
            <div className="py-2 space-y-1">
              <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-3 block">
                Patches ({matchingPatches.length})
              </span>
              {matchingPatches.slice(0, 4).map((p) => (
                <button
                  key={p.sku}
                  type="button"
                  onClick={() => handleAction(() => navigate('/admin/catalog'))}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center justify-between text-ink-900"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-thread-600" />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-text-3 font-mono text-[10px]">{p.sku}</span>
                  </span>
                  <span className="text-[11px] font-semibold">Stock: {p.stock}</span>
                </button>
              ))}
            </div>
          )}

          {/* Students */}
          {matchingStudents.length > 0 && (
            <div className="py-2 space-y-1">
              <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-3 block">
                Students
              </span>
              {matchingStudents.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAction(() => navigate('/admin/records'))}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-paper-100 flex items-center gap-2 text-ink-900"
                >
                  <User className="w-3.5 h-3.5 text-moss-600" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-paper-100 border-t border-border flex items-center justify-between text-[11px] text-text-3">
          <span>Navigate with mouse or click</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
