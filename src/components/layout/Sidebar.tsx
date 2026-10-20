import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  RefreshCw,
  Sliders,
  Landmark,
  Table2,
  MapPin,
  FileClock,
  FlaskConical,
  Users,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { LogoMark } from './Navbar'
import { useStore } from '../../mock/store'

export interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenNotifications?: () => void
  unreadNotificationsCount?: number
}

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  end?: boolean
  disabled?: boolean
  badge?: string
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenNotifications,
  unreadNotificationsCount = 0,
}) => {
  const { prefs, setPrefs } = useStore()

  const navGroups: NavGroup[] = [
    {
      title: 'DATA',
      items: [
        { label: 'Overview', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
        { label: 'FX Cache', to: '/admin/fx-cache', icon: <RefreshCw className="w-4 h-4" /> },
        { label: 'Rate Overrides', to: '/admin/overrides', icon: <Sliders className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PRICING',
      items: [
        { label: 'Providers', to: '/admin/providers', icon: <Landmark className="w-4 h-4" /> },
        { label: 'Fee Matrix', to: '/admin/fee-matrix', icon: <Table2 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { label: 'Regional Assumptions', to: '/admin/regions', icon: <MapPin className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Audit Log', to: '/admin/audit', icon: <FileClock className="w-4 h-4" /> },
        { label: 'Calculation Sandbox', to: '/admin/sandbox', icon: <FlaskConical className="w-4 h-4" /> },
        {
          label: 'Team & roles',
          to: '#',
          icon: <Users className="w-4 h-4" />,
          disabled: true,
          badge: 'In full build',
        },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-surface border-r border-border transition-all duration-200 flex flex-col z-sticky shrink-0 select-none overflow-x-hidden',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Top Header */}
      <div className="h-14 border-b border-divider flex items-center justify-between px-4 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark />
          {!collapsed && (
            <span className="font-display font-medium text-lg text-text-primary">
              Relziwallet
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-sunken transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Staging warning badge */}
      <div className={cn('px-3 py-1.5 bg-warning-50/80 border-b border-warning/20 text-[10px] font-mono text-warning-text flex items-center justify-between', collapsed && 'justify-center')}>
        {!collapsed && <span>ENV: STAGING (DEMO)</span>}
        <Shield className="w-3 h-3 text-warning shrink-0" />
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <h5 className="px-2 text-[10px] font-mono font-semibold tracking-wider text-text-muted uppercase mb-1.5">
                {group.title}
              </h5>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-text-disabled cursor-not-allowed',
                        collapsed && 'justify-center px-0'
                      )}
                      title={`${item.label} (${item.badge})`}
                    >
                      {item.icon}
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-mono text-text-muted bg-sunken px-1 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors group',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-pine-100/70 text-pine-800 font-semibold shadow-xs'
                          : 'text-text-secondary hover:text-text-primary hover:bg-sunken'
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom User & Role Section */}
      <div className="p-3 border-t border-divider shrink-0 space-y-2 bg-surface">
        {/* Switch to Public Site */}
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2 text-xs text-pine-700 hover:text-pine-800 font-medium px-2 py-1.5 rounded hover:bg-sunken transition-colors',
            collapsed && 'justify-center px-0'
          )}
          title="Back to public site"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {!collapsed && <span>View public site</span>}
        </Link>

        {/* User Badge */}
        <div className={cn('p-2 bg-sunken rounded-lg flex items-center gap-2.5', collapsed && 'justify-center p-1.5')}>
          <div className="w-7 h-7 rounded-full bg-pine-600 text-text-on-dark font-display font-medium text-xs flex items-center justify-center shrink-0">
            {prefs.adminUser.name.split(' ').map((n) => n[0]).join('')}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="font-medium text-xs text-text-primary block truncate leading-tight">
                {prefs.adminUser.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-text-muted">{prefs.adminRole}</span>
                <span className="text-[9px] bg-pine-100 text-pine-800 px-1 rounded font-mono">
                  Demo
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
