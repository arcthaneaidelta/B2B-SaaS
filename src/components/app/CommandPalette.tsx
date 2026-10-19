import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Workflow, Table2, AlertTriangle, CheckCircle2, BookOpen, Clock, Code, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const isOpen = useStore((s) => s.isCommandPaletteOpen);
  const setOpen = useStore((s) => s.setCommandPaletteOpen);
  const accounts = useStore((s) => s.accounts);
  const runs = useStore((s) => s.runs);
  const resetDemo = useStore((s) => s.resetDemo);

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(
    (a) =>
      a.company.toLowerCase().includes(query.toLowerCase()) ||
      a.accountId.toLowerCase().includes(query.toLowerCase()) ||
      a.ownerName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredRuns = runs.filter((r) =>
    r.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-[#1F2421]/40"
        onClick={() => setOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#CFC8BB] rounded-lg shadow-3 overflow-hidden z-10 flex flex-col"
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E3DED5] gap-3">
          <Search className="w-4 h-4 text-[#7A817B]" />
          <input
            autoFocus
            type="text"
            placeholder="Type a screen name, account (ACCT-0417), or run ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-[#1F2421] placeholder-[#7A817B]"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-mono px-1.5 py-0.5 border border-[#CFC8BB] rounded-xs text-[#7A817B]"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1 text-xs">
          {/* Quick Screens */}
          <div className="px-3 py-1 font-mono uppercase text-[10px] text-[#7A817B] font-semibold">
            Navigation Destinations
          </div>
          <button
            type="button"
            onClick={() => handleSelect('/app/pipeline')}
            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#FBFAF7] text-[#1F2421] text-left"
          >
            <div className="flex items-center gap-2.5">
              <Workflow className="w-3.5 h-3.5 text-[#24473B]" />
              <span>Make.com Scenario Canvas & Live Run</span>
            </div>
            <span className="font-mono text-[#7A817B]">/app/pipeline</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect('/app/data')}
            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#FBFAF7] text-[#1F2421] text-left"
          >
            <div className="flex items-center gap-2.5">
              <Table2 className="w-3.5 h-3.5 text-[#24473B]" />
              <span>Google Sheets & CSV Key Merge</span>
            </div>
            <span className="font-mono text-[#7A817B]">/app/data</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect('/app/errors')}
            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#FBFAF7] text-[#1F2421] text-left"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B23A3A]" />
              <span>Error Queue & Alert Log</span>
            </div>
            <span className="font-mono text-[#7A817B]">/app/errors</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect('/app/test')}
            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#FBFAF7] text-[#1F2421] text-left"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D57]" />
              <span>Sandbox Verification Runner</span>
            </div>
            <span className="font-mono text-[#7A817B]">/app/test</span>
          </button>

          {/* Filtered Customer Accounts */}
          {filteredAccounts.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 font-mono uppercase text-[10px] text-[#7A817B] font-semibold border-t border-[#E3DED5] mt-1">
                Customer Accounts
              </div>
              {filteredAccounts.map((acc) => (
                <button
                  key={acc.accountId}
                  type="button"
                  onClick={() => handleSelect('/app/data')}
                  className="flex items-center justify-between p-2 rounded-sm hover:bg-[#FBFAF7] text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#24473B]">{acc.accountId}</span>
                    <span className="text-[#1F2421] font-medium">{acc.company}</span>
                    <span className="text-[#7A817B]">({acc.ownerName})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7A817B]">{acc.plan}</span>
                </button>
              ))}
            </>
          )}

          {/* Quick Actions */}
          <div className="px-3 pt-3 pb-1 font-mono uppercase text-[10px] text-[#7A817B] font-semibold border-t border-[#E3DED5] mt-1">
            Sandbox Utilities
          </div>
          <button
            type="button"
            onClick={() => {
              resetDemo();
              setOpen(false);
            }}
            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#FBFAF7] text-[#B23A3A] text-left"
          >
            <span>Reset Demo State to Baseline</span>
            <span className="font-mono text-[10px]">Clear cache & reseed</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
