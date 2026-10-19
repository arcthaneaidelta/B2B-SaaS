import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { GuidedTourPill } from './GuidedTourPill';
import { BRAND } from '../../config/brand.config';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F6F3EE] overflow-hidden text-[#1F2421]">
      {/* Desktop Sidebar (240px) */}
      <div className="hidden lg:block w-60 h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#1F2421]/30"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 h-full bg-white z-10">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Topbar onToggleMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-8 min-h-[calc(100vh-140px)] justify-between">
            <div>
              <Outlet />
            </div>

            {/* Honest micro-label in app footer per PRD §0 & §10.1 */}
            <div className="pt-8 pb-4 border-t border-[#E3DED5] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#7A817B]">
              <span>{BRAND.conceptDisclaimer}</span>
              <span>Collaborator Mode · SANDBOX_V1</span>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette />
      <GuidedTourPill />
    </div>
  );
};
