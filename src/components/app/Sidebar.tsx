import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Workflow,
  Table2,
  Clock,
  AlertTriangle,
  Code,
  CheckCircle2,
  BookOpen,
  Shield,
  User,
  ArrowLeft,
} from 'lucide-react';
import { APP_NAV_ITEMS } from '../../config/nav';
import { BRAND } from '../../config/brand.config';
import { useStore } from '../../store/useStore';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Workflow: <Workflow className="w-4 h-4" />,
  Table2: <Table2 className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
};

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const errors = useStore((s) => s.errors);
  const openErrorsCount = errors.filter((e) => e.status !== 'Resolved').length;

  return (
    <aside className="w-full h-full bg-[#FFFFFF] border-r border-[#E3DED5] flex flex-col justify-between select-none">
      {/* Top: Wordmark & Back to Storefront */}
      <div className="flex flex-col">
        <div className="h-16 px-5 border-b border-[#E3DED5] flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2 text-[#1F2421]">
            <svg
              className="w-5 h-5 text-[#24473B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
            </svg>
            <span className="font-display text-lg font-semibold tracking-tight text-[#1F2421]">
              {BRAND.name}
            </span>
          </Link>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-[#EFEBE4] text-[#4A524D]">
            OPS
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-3 flex flex-col gap-1">
          {APP_NAV_ITEMS.map((item) => {
            const icon = item.icon ? iconMap[item.icon] : null;
            const badgeCount = item.badge === 'errorsCount' ? openErrorsCount : undefined;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/app'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all duration-140 ${
                    isActive
                      ? 'bg-[#E4ECE7] text-[#24473B] font-semibold border-l-2 border-[#24473B]'
                      : 'text-[#4A524D] hover:bg-[#FBFAF7] hover:text-[#1F2421]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-current">{icon}</span>
                  <span>{item.label}</span>
                </div>
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-[#F7E0DE] text-[#B23A3A] font-bold">
                    {badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Environment Card & User Profile */}
      <div className="p-3 border-t border-[#E3DED5] flex flex-col gap-2 bg-[#FBFAF7]">
        {/* Environment Card per PRD §10.1 */}
        <div className="p-2.5 bg-[#F8EBD2] border border-[#E3DED5] rounded-sm text-[11px] font-mono text-[#B7791F] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#B7791F] animate-pulse" />
            <span>SANDBOX ENV</span>
          </div>
          <div className="text-[10px] text-[#4A524D]">Shopify Collaborator Access</div>
        </div>

        {/* User Chip */}
        <div className="flex items-center justify-between px-2 py-1.5 text-xs text-[#4A524D]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#EFEBE4] text-[#1F2421] flex items-center justify-center font-mono font-medium text-[10px]">
              AR
            </div>
            <span className="font-medium">Amina R. (Ops)</span>
          </div>
          <Link
            to="/"
            title="Back to storefront"
            className="text-[#7A817B] hover:text-[#24473B] p-1 hover:bg-[#EFEBE4] rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
