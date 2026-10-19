import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu, RefreshCw, ArrowLeft, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { EnvBadge } from '../ui/Badge';
import { useStore } from '../../store/useStore';

export const Topbar: React.FC<{ onToggleMobileMenu: () => void }> = ({
  onToggleMobileMenu,
}) => {
  const location = useLocation();
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);
  const resetDemo = useStore((s) => s.resetDemo);
  const errors = useStore((s) => s.errors);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // Generate breadcrumb path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageName =
    pathParts.length > 1
      ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
      : 'Overview';

  const notifications = [
    { id: 1, title: 'Break directive triggered for row 7', time: '12m ago', isError: true },
    { id: 2, title: 'New onboarding parameters for Northgate Dental', time: '44m ago', isError: false },
    { id: 3, title: 'Execution RUN-2026-1019-006 completed clean', time: '2h ago', isError: false },
    { id: 4, title: 'CA postal code validation rule enabled', time: '1d ago', isError: false },
    { id: 5, title: 'Upstream fulfillment API sandbox healthy', time: '1d ago', isError: false },
  ];

  return (
    <header className="h-16 px-6 bg-[#FFFFFF] border-b border-[#E3DED5] flex items-center justify-between select-none relative z-30">
      {/* Left: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 text-[#4A524D] hover:bg-[#EFEBE4] rounded-sm"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#7A817B]">
          <Link to="/app" className="hover:text-[#1F2421]">
            Control Room
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#1F2421]">{pageName}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Cmd+K Search trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FBFAF7] hover:bg-[#EFEBE4] border border-[#CFC8BB] rounded-sm text-xs text-[#7A817B] transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[#4A524D]" />
          <span>Search accounts, runs…</span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.2 bg-[#FFFFFF] border border-[#CFC8BB] rounded-xs text-[#4A524D]">
            ⌘K
          </kbd>
        </button>

        {/* Persistent Environment Badge */}
        <EnvBadge />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-sm text-[#4A524D] hover:bg-[#EFEBE4] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {errors.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B23A3A]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-2 p-3 text-xs z-50 flex flex-col gap-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3DED5] font-semibold text-[#1F2421]">
                <span>Activity & Alerts</span>
                <span className="font-mono text-[10px] text-[#7A817B]">5 items</span>
              </div>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 bg-[#FBFAF7] hover:bg-[#EFEBE4] rounded-xs flex items-start gap-2 text-left"
                  >
                    {n.isError ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B23A3A] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D57] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-[#1F2421] leading-snug">{n.title}</div>
                      <div className="font-mono text-[10px] text-[#7A817B] mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="flex items-center gap-1.5 p-1 rounded-sm hover:bg-[#EFEBE4] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#24473B] text-[#F6F3EE] flex items-center justify-center font-mono text-xs font-semibold">
              A
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A817B]" />
          </button>

          {avatarMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-2 p-2 text-xs z-50 flex flex-col gap-1">
              <div className="px-2 py-1.5 border-b border-[#E3DED5]">
                <div className="font-semibold text-[#1F2421]">Amina R.</div>
                <div className="text-[#7A817B] font-mono text-[10px]">ops@quillfold-demo.com</div>
              </div>

              <Link
                to="/"
                onClick={() => setAvatarMenuOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-[#FBFAF7] text-[#1F2421]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#7A817B]" />
                <span>Back to Storefront</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  resetDemo();
                  setAvatarMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-[#FBFAF7] text-[#B23A3A] text-left"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
