import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Shield, KeyRound, ArrowRight, UserCheck, Lock, Sparkles } from 'lucide-react'
import { useStore } from '../../mock/store'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPrefs } = useStore()
  const [email, setEmail] = useState('amara@relziwallet.example')
  const [password, setPassword] = useState('••••••••••••')

  const from = (location.state as any)?.from || '/admin'

  const handleLogin = (role: 'Admin' | 'Editor' | 'Viewer') => {
    sessionStorage.setItem('rw-admin-auth', 'true')
    const user = {
      name: role === 'Admin' ? 'Amara Qureshi' : role === 'Editor' ? 'Daniel Okafor' : 'Priya Menon',
      email: `${role.toLowerCase()}@relziwallet.example`,
      role,
    }
    setPrefs({ adminRole: role, adminUser: user })
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 shadow-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-pine-600 text-text-on-dark flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Operator Admin Console</h1>
          <p className="text-xs text-text-secondary">
            Relziwallet FX rate cache, fee matrix versioning, and administrative override portal.
          </p>
        </div>

        {/* Quick Simulated Role Access (1-Click) */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono uppercase text-text-muted text-center">
            One-Click Quick Login
          </div>
          <div className="grid grid-cols-1 gap-2.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleLogin('Admin')}
              className="p-3 rounded-xl border border-pine-500 bg-pine-50/60 hover:bg-pine-100/60 text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <strong className="block text-pine-900 font-bold">Amara Qureshi</strong>
                <span className="text-[11px] text-pine-700">Role: Admin (Full Publish & Override Rights)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-pine-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleLogin('Editor')}
              className="p-3 rounded-xl border border-border hover:border-pine-400 bg-sunken hover:bg-surface text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <strong className="block text-text-primary font-bold">Daniel Okafor</strong>
                <span className="text-[11px] text-text-secondary">Role: Editor (Draft & CMS Updates)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleLogin('Viewer')}
              className="p-3 rounded-xl border border-border hover:border-pine-400 bg-sunken hover:bg-surface text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <strong className="block text-text-primary font-bold">Priya Menon</strong>
                <span className="text-[11px] text-text-secondary">Role: Viewer (Read-only Audit Log)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Traditional Form Mock */}
        <div className="border-t border-divider pt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-muted uppercase">Operator Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-sunken border border-divider rounded-xl p-2.5 text-xs font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-pine-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-muted uppercase">Hardware Token / Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sunken border border-divider rounded-xl p-2.5 text-xs font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-pine-500"
            />
          </div>

          <Button
            variant="primary"
            onClick={() => handleLogin('Admin')}
            className="w-full font-mono text-xs py-2.5"
          >
            Authenticate Session
          </Button>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs font-mono text-pine-700 hover:underline">
            ← Return to Public Application
          </Link>
        </div>
      </div>
    </div>
  )
}
