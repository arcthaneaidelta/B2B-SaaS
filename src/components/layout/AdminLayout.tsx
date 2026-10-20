import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Bell, Command, Search, ExternalLink, LogOut, Shield, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { RateFreshness } from '../domain/RateFreshness'
import { DemoControls } from '../domain/DemoControls'
import { TourCoach } from '../domain/TourCoach'
import { useStore } from '../../mock/store'
import { cn } from '../../lib/cn'

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { prefs, setPrefs, notifications, markNotificationRead } = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  // Simulated admin authentication guard
  const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('rw-admin-auth') === 'true'

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/admin/login') {
      navigate('/admin/login', { replace: true, state: { from: location.pathname } })
    }
  }, [isAuthenticated, location.pathname, navigate])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSignOut = () => {
    sessionStorage.removeItem('rw-admin-auth')
    navigate('/admin/login')
  }

  const breadcrumbs = (() => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments.map((seg, i) => {
      const url = `/${segments.slice(0, i + 1).join('/')}`
      const name = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
      return { url, name }
    })
  })()

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return null
  }

  return (
    <div className="min-h-screen flex bg-paper text-text-primary">
      {/* Collapsible Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (56px) */}
        <header className="h-14 bg-surface border-b border-divider flex items-center justify-between px-4 sm:px-6 sticky top-0 z-nav">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <Link to="/admin" className="hover:text-text-primary">Admin</Link>
            {breadcrumbs.slice(1).map((b) => (
              <React.Fragment key={b.url}>
                <span>/</span>
                <span className="font-semibold text-text-primary capitalize">{b.name}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            <RateFreshness variant="inline" />

            {/* Command search */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-text-muted bg-sunken hover:bg-border/60 border border-border rounded-md transition-colors cursor-pointer"
            >
              <Command className="w-3 h-3" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-sunken transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-clay-500" />
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-elevated border border-border shadow-lg rounded-xl p-3 font-sans text-xs space-y-2 z-popover animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-divider">
                    <span className="font-mono font-semibold uppercase text-[10px] tracking-wider text-text-muted">
                      Admin Notifications ({unreadCount} unread)
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-text-muted hover:text-text-primary text-[10px]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="divide-y divide-divider/60 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id)
                          if (n.actionUrl) {
                            navigate(n.actionUrl)
                            setNotificationsOpen(false)
                          }
                        }}
                        className={cn(
                          'py-2 px-1 hover:bg-surface rounded cursor-pointer transition-colors space-y-1',
                          !n.read && 'bg-pine-50/40 font-medium'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-text-primary text-xs">{n.title}</span>
                          <span className="text-[10px] font-mono text-text-muted">{n.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-snug">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-sunken transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-pine-600 text-text-on-dark font-display text-[11px] font-medium flex items-center justify-center">
                  {prefs.adminUser.name.charAt(0)}
                </div>
                <span className="text-xs font-mono font-semibold text-text-secondary hidden sm:inline">
                  {prefs.adminRole}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-elevated border border-border shadow-lg rounded-xl p-2 font-sans text-xs space-y-1 z-popover">
                  <div className="px-2 py-1.5 border-b border-divider">
                    <span className="font-semibold text-text-primary block">{prefs.adminUser.name}</span>
                    <span className="text-[10px] font-mono text-text-muted">{prefs.adminUser.email}</span>
                  </div>

                  <div className="py-1">
                    <span className="px-2 text-[10px] font-mono text-text-muted uppercase">Switch Role</span>
                    {(['Admin', 'Editor', 'Viewer'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setPrefs({
                            adminRole: r,
                            adminUser: {
                              name: r === 'Admin' ? 'Amara Qureshi' : r === 'Editor' ? 'Daniel Okafor' : 'Priya Menon',
                              email: `${r.toLowerCase()}@relziwallet.example`,
                              role: r,
                            },
                          })
                          setUserMenuOpen(false)
                        }}
                        className={cn(
                          'w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between',
                          prefs.adminRole === r ? 'bg-pine-100/70 font-semibold text-pine-800' : 'hover:bg-sunken text-text-secondary'
                        )}
                      >
                        <span>{r}</span>
                        {prefs.adminRole === r && <CheckCircle2 className="w-3 h-3 text-pine-700" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-divider pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-2 py-1.5 rounded text-xs text-error hover:bg-error-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-admin mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Aids */}
      <DemoControls />
      <TourCoach />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  )
}
