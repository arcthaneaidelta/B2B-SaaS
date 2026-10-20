import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { DEMO_PERSONAS } from '../../data/personas';
import { PersonaSwitcher } from './PersonaSwitcher';
import { ResetModal } from '../ui/ResetModal';
import {
  ShieldCheck,
  LayoutDashboard,
  FileCheck2,
  Users2,
  BookmarkCheck,
  Kanban,
  FileText,
  CreditCard,
  Settings,
  Building2,
  QrCode,
  UserCheck,
  FileBadge,
  Sliders,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  Sparkles,
  Menu,
  X,
  History,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { state } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const currentPersona = DEMO_PERSONAS.find(p => p.id === state.currentPersona) || DEMO_PERSONAS[0];

  // Dynamic Navigation Items based on active persona
  const getNavSections = () => {
    switch (state.currentPersona) {
      case 'candidate':
        return [
          {
            title: 'Candidate Portal',
            items: [
              { label: 'Overview', href: '/app/candidate/overview', icon: LayoutDashboard },
              { label: 'Profile Editor', href: '/app/candidate/profile', icon: Users2 },
              { label: 'Qualifications & Docs', href: '/app/candidate/documents', icon: FileCheck2 },
              { label: 'Digital Passport', href: '/app/candidate/passport', icon: QrCode },
              { label: 'Privacy & Sharing', href: '/app/candidate/privacy', icon: Settings }
            ]
          }
        ];

      case 'verifier':
        return [
          {
            title: 'Verification Desk',
            items: [
              { label: 'Overview', href: '/app/verification/overview', icon: LayoutDashboard },
              { label: 'Verification Queue', href: '/app/verification/queue', icon: FileCheck2, badge: state.verificationCases.filter(c => c.status === 'Pending').length },
              { label: 'Expiration Tracking', href: '/app/verification/expiration', icon: Clock },
              { label: 'Audit History', href: '/app/verification/audit', icon: History }
            ]
          }
        ];

      case 'admin':
        return [
          {
            title: 'Administration',
            items: [
              { label: 'Overview', href: '/app/admin/overview', icon: LayoutDashboard },
              { label: 'Candidate Directory', href: '/app/admin/candidates', icon: Users2 },
              { label: 'Matching Weights', href: '/app/admin/matching-rules', icon: Sliders },
              { label: 'Subscriptions Admin', href: '/app/admin/subscriptions', icon: CreditCard },
              { label: 'Contracts Admin', href: '/app/admin/contracts', icon: FileText },
              { label: 'System Audit Log', href: '/app/admin/audit-log', icon: History },
              { label: 'Platform Settings', href: '/app/admin/settings', icon: Settings }
            ]
          }
        ];

      case 'employer':
      default:
        return [
          {
            title: 'Workforce',
            items: [
              { label: 'Overview', href: '/app/employer/overview', icon: LayoutDashboard },
              { label: 'Requirements', href: '/app/employer/requirements', icon: FileCheck2, badge: state.requirements.length },
              { label: 'Explainable Matches', href: '/app/employer/matches', icon: Sparkles },
              { label: 'Shortlists', href: '/app/employer/shortlists', icon: BookmarkCheck },
              { label: 'Recruitment Pipeline', href: '/app/employer/pipeline', icon: Kanban },
              { label: 'Digital Passports', href: '/app/employer/passports', icon: QrCode }
            ]
          },
          {
            title: 'Management',
            items: [
              { label: 'Company & Team', href: '/app/employer/company', icon: Building2 },
              { label: 'Subscription & Billing', href: '/app/employer/billing', icon: CreditCard },
              { label: 'Contracts', href: '/app/employer/contracts', icon: FileText },
              { label: 'Settings', href: '/app/employer/settings', icon: Settings }
            ]
          }
        ];
    }
  };

  const navSections = getNavSections();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (state.currentPersona === 'verifier') {
      navigate(`/app/verification/queue?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/app/employer/matches?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      {/* Desktop Sidebar (248px or 72px collapsed) */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#E5E5DD] bg-white transition-all duration-200 shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-18' : 'w-62'
        }`}
      >
        {/* Brand header */}
        <div className="h-17 px-4 border-b border-[#E5E5DD] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#24483D] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#E7EEE7]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-[#28332F] text-base leading-tight tracking-tight">VERITY</span>
                <span className="text-[9px] uppercase tracking-wider text-[#777F79] font-medium">Verified Talent</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-[#777F79] hover:text-[#28332F] hover:bg-[#FAF9F6] transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Persona Indicator Badge */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-[#FAF9F6] border-b border-[#E5E5DD]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">Active Demo Workspace</p>
            <p className="text-xs font-semibold text-[#24483D] truncate">{currentPersona.organization}</p>
          </div>
        )}

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#777F79] mb-1.5">
                  {section.title}
                </p>
              )}
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E7EEE7] text-[#24483D] font-semibold'
                        : 'text-[#28332F]/80 hover:bg-[#FAF9F6] hover:text-[#24483D]'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#24483D]' : 'text-[#777F79]'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 bg-[#24483D]/10 text-[#24483D] text-[10px] font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E5E5DD] space-y-2">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Link
                to="/"
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#777F79] hover:text-[#24483D] rounded-md hover:bg-[#FAF9F6] transition-colors"
              >
                <span>Public Landing Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#A84F4B] hover:bg-[#FDF2F2] rounded-md transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Reset Demo State</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowResetModal(true)}
                title="Reset Demo State"
                className="p-2 text-[#A84F4B] hover:bg-[#FDF2F2] rounded-md"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (68px) */}
        <header className="h-17 bg-white border-b border-[#E5E5DD] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          {/* Mobile hamburger + search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1.5 rounded-lg text-[#28332F] hover:bg-[#FAF9F6] md:hidden"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777F79]" />
              <input
                type="text"
                placeholder={
                  state.currentPersona === 'verifier'
                    ? 'Search verification queue by candidate or credential...'
                    : 'Search candidates by role, city (e.g. Gothenburg), skill...'
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24483D] focus:bg-white text-[#28332F] placeholder:text-[#777F79]"
              />
            </form>
          </div>

          {/* Right Controls: Notifications, Persona, Reset */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Public Site Link */}
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1 text-xs text-[#777F79] hover:text-[#24483D] px-2.5 py-1 rounded-md hover:bg-[#FAF9F6]"
            >
              <span>Landing Page</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-[#777F79] hover:text-[#28332F] hover:bg-[#FAF9F6] relative transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#A87532] absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-84 bg-white border border-[#E5E5DD] rounded-xl shadow-xl z-50 p-3 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DD]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#777F79]">Recent Activity</span>
                      <span className="text-[10px] text-[#24483D] font-semibold">{state.activityFeed.length} events</span>
                    </div>
                    <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                      {state.activityFeed.slice(0, 5).map(event => (
                        <div key={event.id} className="p-2 rounded-lg hover:bg-[#FAF9F6] text-xs space-y-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-[#28332F]">{event.action}</span>
                            <span className="text-[#777F79]">{event.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-[#777F79] line-clamp-2">{event.details}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-[#E5E5DD] text-center">
                      <Link
                        to="/app/admin/audit-log"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#24483D] font-semibold hover:underline"
                      >
                        View Full Platform Audit Log →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Persona Switcher */}
            <PersonaSwitcher />
          </div>
        </header>

        {/* Dynamic Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-[#28332F]/40 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-5 flex flex-col justify-between border-r border-[#E5E5DD]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5DD]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#24483D] flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4 text-[#E7EEE7]" />
                  </div>
                  <span className="font-bold text-[#28332F]">VERITY Workspace</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-md text-[#777F79]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {navSections.map((sec, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                      {sec.title}
                    </p>
                    {sec.items.map(item => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                            isActive
                              ? 'bg-[#E7EEE7] text-[#24483D] font-semibold'
                              : 'text-[#28332F] hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-[#777F79]" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="px-1.5 py-0.2 bg-[#24483D]/10 text-[#24483D] text-xs font-bold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5DD] space-y-2">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowResetModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#A84F4B] hover:bg-[#FDF2F2] rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (PRD page 9) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-[#E5E5DD] py-2 px-4 flex items-center justify-around z-30 md:hidden shadow-lg">
        {state.currentPersona === 'employer' ? (
          <>
            <Link
              to="/app/employer/overview"
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                location.pathname === '/app/employer/overview' ? 'text-[#24483D] font-bold' : 'text-[#777F79]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link
              to="/app/employer/matches"
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                location.pathname.startsWith('/app/employer/matches') ? 'text-[#24483D] font-bold' : 'text-[#777F79]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Matches</span>
            </Link>
            <Link
              to="/app/employer/requirements"
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                location.pathname.startsWith('/app/employer/requirements') ? 'text-[#24483D] font-bold' : 'text-[#777F79]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Requirements</span>
            </Link>
            <Link
              to="/app/employer/pipeline"
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                location.pathname.startsWith('/app/employer/pipeline') ? 'text-[#24483D] font-bold' : 'text-[#777F79]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Pipeline</span>
            </Link>
          </>
        ) : state.currentPersona === 'verifier' ? (
          <>
            <Link
              to="/app/verification/overview"
              className="flex flex-col items-center gap-0.5 text-[10px] text-[#24483D] font-bold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link
              to="/app/verification/queue"
              className="flex flex-col items-center gap-0.5 text-[10px] text-[#777F79]"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Queue</span>
            </Link>
          </>
        ) : state.currentPersona === 'candidate' ? (
          <>
            <Link
              to="/app/candidate/overview"
              className="flex flex-col items-center gap-0.5 text-[10px] text-[#24483D] font-bold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link
              to="/app/candidate/passport"
              className="flex flex-col items-center gap-0.5 text-[10px] text-[#777F79]"
            >
              <QrCode className="w-4 h-4" />
              <span>Passport</span>
            </Link>
          </>
        ) : (
          <Link
            to="/app/admin/overview"
            className="flex flex-col items-center gap-0.5 text-[10px] text-[#24483D] font-bold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      {/* Reset Confirmation Modal */}
      <ResetModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
    </div>
  );
};
