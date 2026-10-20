import React from 'react'
import { Calculator, ShieldCheck, CheckCircle2, Database } from 'lucide-react'

const WATERFALL_STEPS = [
  { step: 1, title: 'Input Parse & Minor Unit Normalisation', desc: 'Inputs are validated and cast into arbitrary-precision Big.js objects. Currency decimal rules (e.g. JPY has 0 decimals, GBP has 2) are enforced.' },
  { step: 2, title: 'Reference Rate Ingestion', desc: 'Real-time or cached mid-market exchange rates are retrieved from verified central bank and interbank feeds (e.g. ECB, open interbank).' },
  { step: 3, title: 'Provider Status & Availability Verification', desc: 'The provider fee schedule version is verified against active system status. Paused or deprecated providers are flagged.' },
  { step: 4, title: 'Administrative Override Evaluation', desc: 'Active administrative spreads and promotional overrides are queried and merged into the rate pipeline.' },
  { step: 5, title: 'Time-Window & Weekend Surcharge Detection', desc: 'If the simulated transaction falls between Friday 22:00 UTC and Sunday 22:00 UTC, provider weekend markups (typically 1.0%) are applied.' },
  { step: 6, title: 'Applied FX Rate Derivation', desc: 'Applied Rate = MidMarket × (1 - SpreadPct - WeekendMarkupPct). Retained to 12 decimal places.' },
  { step: 7, title: 'Percentage Fee Calculation', desc: 'PctFee = GrossHome × ProviderPercentFee. Deducted from home currency before conversion.' },
  { step: 8, title: 'Fixed Fee & Allowance Netting', desc: 'If a monthly free allowance is configured, transactions under the limit pay £0 fixed fee. Above the limit, standard fixed fees are assessed.' },
  { step: 9, title: 'Chargeable Net Amount Calculation', desc: 'NetHome = GrossHome - PctFee - FixedFee. (If NetHome ≤ 0, calculation halts with an insufficient amount error).' },
  { step: 10, title: 'Destination Delivery Conversion', desc: 'ReceivedDest = NetHome × AppliedRate. Intermediate values are rounded only at terminal display.' },
  { step: 11, title: 'Total Effective Cost & Loss Summation', desc: 'Loss is calculated as the pure interbank parity value minus actual received destination value, converted back to home currency.' },
  { step: 12, title: 'Competitive Ranking & Baseline Delta', desc: 'Providers are sorted by lowest net home cost or highest received amount. Savings are computed against the traditional bank baseline.' },
]

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 border-b border-divider pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-mono font-medium">
          <Calculator className="w-3.5 h-3.5" /> Mathematical Transparency Manifesto
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
          Calculation Engine & Methodology
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Relziwallet is built on a single core principle: <strong>"Show the math."</strong> We believe travelers and businesses deserve complete transparency into foreign exchange spreads, hidden transaction fees, and fee rules.
        </p>
      </div>

      {/* Zero Float Arithmetic Guarantee */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pine-100 rounded-xl text-pine-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl text-ink font-semibold">Zero Native Float Arithmetic</h2>
            <div className="text-xs font-mono text-text-muted">Strict Financial Standard (IEEE 754 Avoidance)</div>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          JavaScript's native <code>Number</code> type suffers from binary floating point inaccuracies (e.g., <code>0.1 + 0.2 === 0.30000000000000004</code>). In financial systems handling multi-currency conversion, float rounding errors accumulate across fee tiers and distort rankings.
        </p>

        <div className="p-4 bg-sunken rounded-xl border border-divider font-mono text-xs text-text-primary space-y-1">
          <div><span className="text-pine-700 font-bold">Standard:</span> Big.js arbitrary-precision decimal arithmetic.</div>
          <div><span className="text-pine-700 font-bold">Intermediate Precision:</span> 12 decimal places maintained through all waterfall steps.</div>
          <div><span className="text-pine-700 font-bold">Rounding:</span> Half-up rounding occurs only once at the terminal display layer.</div>
        </div>
      </div>

      {/* 12-Step Waterfall */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl text-ink font-semibold">The 12-Step Fee Calculation Waterfall</h2>
          <p className="text-sm text-text-secondary mt-1">
            Every quote generated across Relziwallet executes through this deterministic 12-step sequence.
          </p>
        </div>

        <div className="space-y-3">
          {WATERFALL_STEPS.map((s) => (
            <div
              key={s.step}
              className="bg-surface border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4 hover:border-pine-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-pine-50 border border-pine-200 text-pine-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-sm text-ink">{s.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sourcing & Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-pine-700" />
            <h3 className="font-display text-lg text-ink font-semibold">Data Sources & Rate Cadence</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Mid-market interbank exchange rates are refreshed continuously from the European Central Bank (ECB) and interbank feeds with a 60-second cache TTL. Provider fee schedules are audited weekly against publicly disclosed regulatory tariff documents.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display text-lg text-ink font-semibold">Test Vector Compliance</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            The calculation engine is continuously tested against 12 formal test vectors (T1–T12) verifying weekend markups, tiered ATM allowances, multi-currency parity, and edge boundary values.
          </p>
        </div>
      </div>
    </div>
  )
}
