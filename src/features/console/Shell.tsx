import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDemoStore } from '../../data/store';
import { Wordmark } from '../../components/brand/Wordmark';
import { ExportModal } from './ExportModal';
import { CommandPalette } from './CommandPalette';
import {
  LayoutDashboard,
  School as SchoolIcon,
  Award,
  ListOrdered,
  QrCode,
  Search,
  Bell,
  HelpCircle,
  RotateCcw,
  Smartphone,
  Menu,
  X,
  ExternalLink,
  Check,
} from 'lucide-react';

export const ConsoleShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
  } = useDemoStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Schools', path: '/admin/schools', icon: SchoolIcon },
    { label: 'Patch Catalog', path: '/admin/catalog', icon: Award },
    { label: 'Registry & Orders', path: '/admin/records', icon: ListOrdered },
    { label: 'Universal QR', path: '/admin/qr', icon: QrCode },
  ];

  // Derive current page title for breadcrumb
  const currentPath = location.pathname;
  let pageTitle = 'Dashboard Overview';
  if (currentPath.includes('/admin/schools')) pageTitle = 'Schools Directory & Rollups';
  else if (currentPath.includes('/admin/catalog')) pageTitle = 'Patch Catalog & Stock';
  else if (currentPath.includes('/admin/records')) pageTitle = 'Student Registry & Orders';
  else if (currentPath.includes('/admin/qr')) pageTitle = 'Universal Packaging QR';

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col font-ui text-ink-900">
      {/* Modals & Command Palette */}
      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onTriggerExport={() => setExportModalOpen(true)}
      />

      <div className="flex flex-1 min-h-screen">
        {/* Left Sidebar - Desktop (240px) & Tablet (72px rail) */}
        <aside className="hidden md:flex flex-col w-18 lg:w-60 bg-paper-0 border-r border-border flex-shrink-0 justify-between p-4 z-30 select-none">
          <div className="space-y-6">
            {/* Brand Wordmark */}
            <div className="px-2">
              <div className="hidden lg:block">
                <Wordmark size="sm" linkTo="/admin" />
              </div>
              <div className="lg:hidden flex justify-center">
                <Link to="/admin">
                  <div className="w-10 h-10 rounded-lg bg-ink-900 text-paper-0 font-display font-bold flex items-center justify-center text-sm border border-border">
                    A&amp;A
                  </div>
                </Link>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-ink-900 text-paper-0 shadow-sh-1'
                        : 'text-text-2 hover:bg-paper-100 hover:text-ink-900'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Area */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Link
              to="/how-it-works"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-text-2 hover:bg-paper-100 hover:text-ink-900 transition-colors"
              title="How It's Built"
            >
              <HelpCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span className="hidden lg:inline">How It's Built</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset demo database to original seed state?')) {
                  resetDemoData();
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-text-3 hover:text-status-error hover:bg-status-error/5 transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" />
              <span className="hidden lg:inline">Reset Demo Data</span>
            </button>

            {/* Owner Chip */}
            <div className="px-3 py-2.5 rounded-lg bg-paper-100 border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-thread-600 text-paper-0 flex items-center justify-center font-display font-semibold text-xs flex-shrink-0">
                A
              </div>
              <div className="hidden lg:block min-w-0">
                <div className="text-xs font-semibold text-ink-900 truncate">Alex</div>
                <div className="text-[10px] text-text-3 font-medium">Business Owner</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-ink-900/50 backdrop-blur-[1px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 max-w-xs bg-paper-0 h-full p-5 flex flex-col justify-between shadow-sh-3">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <Wordmark size="sm" linkTo="/admin" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-text-3 hover:text-ink-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-md text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-ink-900 text-paper-0'
                            : 'text-text-2 hover:bg-paper-100 hover:text-ink-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-2"
                >
                  <HelpCircle className="w-4 h-4 text-gold-500" />
                  <span>How It's Built</span>
                </Link>
                <Link
                  to="/s"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-thread-600"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Open Scan Experience</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-16 px-4 sm:px-6 bg-paper-0 border-b border-border flex items-center justify-between gap-4 sticky top-0 z-20">
            {/* Left: Mobile Toggle & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 text-text-2 hover:text-ink-900 rounded-md"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-text-3 font-semibold hidden sm:block">
                  A&amp;A Patch Work · Owner Console
                </div>
                <h1 className="text-base sm:text-lg font-display font-semibold text-ink-900 truncate">
                  {pageTitle}
                </h1>
              </div>
            </div>

            {/* Right: Search, Notifications, Demo Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button (⌘K) */}
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 h-9 px-3 bg-paper-100 hover:bg-paper-0 border border-border rounded-md text-xs text-text-3 hover:text-ink-900 transition-colors shadow-sh-1"
                title="Search database (Ctrl+K or ⌘K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search database...</span>
                <kbd className="hidden lg:inline text-[10px] bg-paper-0 px-1.5 py-0.5 rounded border border-border font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Notification Bell with Dropdown Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
                  className="relative p-2 text-text-2 hover:text-ink-900 hover:bg-paper-100 rounded-md transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-thread-600 animate-pulse" />
                  )}
                </button>

                {notifPopoverOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-paper-0 border border-border rounded-lg shadow-sh-3 z-50 p-3 font-ui text-xs animate-slide-up">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="font-semibold text-ink-900">
                        Activity Alerts ({unreadCount} unread)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllNotificationsRead()}
                          className="text-[11px] text-thread-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-border/60 my-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-4 text-text-3">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              n.read ? 'opacity-70' : 'bg-paper-100 font-medium'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-ink-900">{n.title}</span>
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-thread-600 flex-shrink-0 mt-1" />}
                            </div>
                            <p className="text-[11px] text-text-3 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Link to Scan Experience */}
              <Link
                to="/s"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-thread-600 hover:text-thread-700 bg-thread-600/10 hover:bg-thread-600/15 border border-thread-600/30 px-3 py-1.5 rounded-md transition-colors"
                title="View mobile experience"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Test Mobile QR</span>
              </Link>
            </div>
          </header>

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1360px] w-full mx-auto">
            <Outlet context={{ openExportModal: () => setExportModalOpen(true) }} />
          </main>

          {/* Honest Footer Note per PRD §2 */}
          <footer className="px-6 py-4 border-t border-border bg-paper-100 text-center text-xs text-text-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Demo data. In production, this console binds directly to your Google Sheet or Airtable base.
            </span>
            <div className="flex items-center gap-3">
              <Link to="/how-it-works" className="underline hover:text-ink-900">
                Low-code architecture
              </Link>
              <span>·</span>
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="underline hover:text-ink-900 text-thread-600 font-semibold"
              >
                Export Excel file
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
