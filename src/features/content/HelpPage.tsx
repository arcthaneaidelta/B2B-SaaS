import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Search, ArrowRight } from 'lucide-react'
import { Accordion } from '../../components/ui/Accordion'

const FAQS = [
  {
    id: 'mid-market',
    q: 'What is the "Mid-Market" exchange rate?',
    a: 'The mid-market rate (also known as the interbank rate) is the midpoint between the "buy" and "sell" rates in global currency markets. It represents the actual, real-time value of a currency before banks or consumer transfer providers add hidden markups or retail spreads.',
  },
  {
    id: 'hidden-markups',
    q: 'How do providers hide fees in exchange rates?',
    a: 'Many traditional banks and high-street bureau de change outlets advertise "0% commission" or "fee-free exchanges". Instead of charging a visible flat fee, they give you an exchange rate 2% to 5% worse than the real mid-market rate. The difference is retained as undisclosed profit.',
  },
  {
    id: 'dcc-explained',
    q: 'What is Dynamic Currency Conversion (DCC) and how do I avoid it?',
    a: 'When paying with a card or withdrawing cash abroad, the terminal or ATM screen will often ask: "Would you like to be charged in GBP or local currency (e.g. EUR, JPY)?" Always choose the LOCAL currency. If you choose your home currency (GBP), the foreign merchant or ATM owner chooses their own exorbitant conversion rate, adding 4% to 10% in fees.',
  },
  {
    id: 'weekend-markup',
    q: 'Why do some providers charge a weekend fee?',
    a: 'Global foreign exchange markets close on Friday evenings (22:00 UTC) and reopen on Sunday evenings (22:00 UTC). During the weekend, currency prices can shift before trading resumes. Some providers (like Revolut standard accounts) add a 1.0% surcharge over the weekend to protect against rate volatility. You can avoid this by pre-converting money on weekdays.',
  },
  {
    id: 'atm-surplus',
    q: 'What are the rules for ATM withdrawals abroad?',
    a: 'Most digital cards (such as Wise and Revolut) provide a free monthly ATM allowance (e.g., £200 or 5 withdrawals per rolling 30 days). Once you exceed this threshold, a percentage fee (typically 1.75% to 2.0%) applies. Independent ATM operators may also levy a local convenience fee.',
  },
  {
    id: 'show-the-math',
    q: 'How does Relziwallet ensure calculation accuracy?',
    a: 'We use arbitrary-precision decimal arithmetic (Big.js) with 12 decimal places of intermediate precision, avoiding JavaScript floating point bugs. Every quote comes with a transparent mathematical receipt breaking down gross send, fixed fees, variable fees, and the exact applied rate.',
  },
]

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('')

  const filteredFaqs = FAQS.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-mono font-medium">
          <HelpCircle className="w-3.5 h-3.5" /> Knowledge Base & FX Glossary
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
          Everything you need to know about foreign exchange rates, card fees abroad, Dynamic Currency Conversion, and our calculation engine.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs, FX terms, fees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-pine-500 shadow-sm"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <Accordion
          items={filteredFaqs.map((faq) => ({
            id: faq.id,
            title: faq.q,
            content: <p className="text-xs text-text-secondary leading-relaxed pt-2">{faq.a}</p>,
          }))}
          allowMultiple
        />
      </div>

      {/* Contact / Proposal Author Note */}
      <div className="bg-sunken border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-display text-lg text-ink font-semibold">Have questions about the prototype or proposal?</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            This interactive demo was built by <strong>Shahzaib Akram</strong> for the Relziwallet freelance proposal pitch. You can inspect the architectural blueprint and PostgreSQL schema under Demo Notes.
          </p>
        </div>
        <Link
          to="/demo-notes"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-pine-600 text-white font-mono text-xs font-semibold hover:bg-pine-700 transition-colors shrink-0"
        >
          <span>View Proposal Notes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
