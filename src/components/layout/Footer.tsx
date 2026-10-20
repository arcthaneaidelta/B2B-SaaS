import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { LogoMark } from './Navbar'
import { StatusDot } from '../ui/Chip'
import { useStore } from '../../mock/store'
import { demoConfig } from '../../config/demoConfig'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const { demo } = useStore()

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || message.length < 5) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 800)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* 20.1 Closing CTA Band (Ink surface, text white) */}
      <section className="bg-ink text-white py-20 md:py-28 relative overflow-hidden border-t border-white/10">
        <div className="container-landing relative z-10">
          <div className="max-w-2xl space-y-4">
            <span className="eyebrow text-white/60 font-mono text-xs tracking-wider uppercase">START WITH ONE NUMBER</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white text-balance">
              Know the cost before you spend.
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-lg">
              Build a trip budget in about a minute. No account, no booking, no card details.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link to="/trip/new">
                <Button variant="inverse" size="lg">
                  <span>Plan a trip budget</span>
                  <ArrowRight className="w-4 h-4 btn-arrow" />
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="ghost-inverse" size="lg">
                  <span>Compare providers</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient rate line motif in ink background */}
        <svg
          className="absolute -bottom-8 left-0 right-0 w-full h-24 overflow-visible opacity-10 pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,40 Q 300,10 600,30 T 1200,20 T 1800,50"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      </section>

      {/* 20.2 Editorial Footer */}
      <footer className="bg-ink text-white/80 pt-16 pb-12 border-t border-white/10 text-xs font-sans">
        <div className="container-landing space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Col 1: Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LogoMark inverted />
                <span className="font-display text-lg font-medium tracking-tight text-white">
                  Relziwallet
                </span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed max-w-xs">
                An independent spend-abroad cost simulator and provider fee comparison utility.
              </p>
              <p className="text-white/45 text-[11px] leading-relaxed">
                Estimates use illustrative demo data. Not financial advice.
              </p>
            </div>

            {/* Col 2: Use it */}
            <div className="space-y-3">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Use it
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/convert" className="text-white/75 hover:text-white transition-colors">Quick Converter</Link></li>
                <li><Link to="/compare" className="text-white/75 hover:text-white transition-colors">Compare providers</Link></li>
                <li><Link to="/trip/new" className="text-white/75 hover:text-white transition-colors">Plan a trip budget</Link></li>
                <li><Link to="/destinations" className="text-white/75 hover:text-white transition-colors">Destinations index</Link></li>
                <li><Link to="/rates" className="text-white/75 hover:text-white transition-colors">Live rate insights</Link></li>
              </ul>
            </div>

            {/* Col 3: Understand it */}
            <div className="space-y-3">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Understand it
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/methodology" className="text-white/75 hover:text-white transition-colors">Methodology &amp; formulas</Link></li>
                <li><Link to="/help" className="text-white/75 hover:text-white transition-colors">Help &amp; FAQ</Link></li>
                <li><Link to="/demo-notes" className="text-clay-400 hover:text-clay-300 font-semibold transition-colors">Demo notes (Architecture)</Link></li>
                <li><Link to="/admin" className="text-white/75 hover:text-white transition-colors">Admin panel (Demo)</Link></li>
              </ul>
            </div>

            {/* Col 4: Mini contact form */}
            <div className="space-y-3">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Ask us
              </h4>
              {sent ? (
                <div className="bg-white/10 p-3 rounded-lg border border-white/15 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thanks for getting in touch.</span>
                  </div>
                  <p className="text-[11px] text-white/70">
                    We reply within two working days at {demoConfig.CONTACT_EMAIL}.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSent(false); setMessage('') }}
                    className="text-[11px] text-white underline pt-1 block"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full h-8 px-2.5 rounded bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/50 focus:outline-none focus:border-white focus:bg-white/15"
                  />
                  <textarea
                    rows={2}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your question..."
                    className="w-full px-2.5 py-1.5 rounded bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/50 focus:outline-none focus:border-white focus:bg-white/15 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full h-8 rounded bg-white text-pine-900 font-bold text-xs hover:bg-white/90 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                  >
                    {sending ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/60">
            <div className="flex flex-wrap items-center gap-4">
              <span>© 2026 Relziwallet</span>
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms
              </button>
              <span className="font-mono text-white/50">
                Prepared by {demoConfig.PROPOSAL_AUTHOR}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Live status line */}
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/80">
                <StatusDot status={demo.staleFeed ? 'stale' : 'fresh'} pulse />
                <span>Rates fresh • All systems normal</span>
              </div>

              {/* Back to top */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer group"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Notice (Demo)"
      >
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            In this interactive demo, nothing you type leaves your device. All calculations, trip simulations, and setting customizations are performed directly in your browser using pure client-side logic.
          </p>
          <p>
            Saved trips and overrides persist locally in your browser storage (<code className="font-mono text-xs bg-sunken px-1 rounded">localStorage</code>) and can be cleared at any time via Settings or the Demo Controls pill.
          </p>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms of Use (Demo)"
      >
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Relziwallet is an interactive prototype simulation utility built to demonstrate fintech comparison architecture, complex fee rule calculation, and admin state management.
          </p>
          <p>
            All provider pricing, fee matrices, and foreign exchange conversion rates displayed in this demo are illustrative mock data and do not represent binding financial quotes or advice.
          </p>
        </div>
      </Modal>
    </>
  )
}
