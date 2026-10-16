import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wordmark } from '../../components/brand/Wordmark';
import { Button } from '../../components/ui/Button';
import {
  QrCode,
  Smartphone,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const isFieldHighlighted = (field: string) => {
    if (!highlightedField) return false;
    return highlightedField === field;
  };

  return (
    <div className="min-h-screen bg-paper-50 font-ui text-ink-900 pb-16">
      {/* Top Header */}
      <header className="border-b border-border bg-paper-0 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Wordmark size="sm" linkTo="/" />
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-xs font-semibold text-text-2 hover:text-ink-900 px-3 py-1.5 rounded-md hover:bg-paper-100"
            >
              Open Console
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-thread-600 bg-thread-600/10 hover:bg-thread-600/20 px-3 py-1.5 rounded-md border border-thread-600/30"
            >
              Demo Launcher
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Headline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-100 border border-border text-xs font-semibold text-thread-600 mb-3">
          <Layers className="w-3.5 h-3.5" /> Proposal Architecture &amp; Delivery Blueprint
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold text-ink-900 tracking-tight leading-[1.12]">
          How it's built: Low-code, durable, and owner-manageable.
        </h1>
        <p className="text-sm sm:text-base text-text-2 mt-3 max-w-2xl font-ui leading-relaxed">
          The goal of this solution is to give A&amp;A Patch Work a professional mobile QR experience and rock-solid reporting <strong>without monthly platform subscription fees or complex code you can't edit yourself</strong>.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section 1: The System at a Glance Diagram */}
        <section className="bg-paper-0 p-6 sm:p-8 rounded-xl border border-border shadow-sh-1 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-display font-semibold text-ink-900">
              1. The System Architecture at a Glance
            </h2>
            <p className="text-xs text-text-2 mt-0.5">
              One universal QR code on your patch packaging powers the entire workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 bg-paper-100 rounded-lg border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-ink-900 text-paper-0 flex items-center justify-center font-bold">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">Universal QR</h3>
              <p className="text-text-3 leading-relaxed">
                One permanent code printed on backing cards. Redirects to your clean mobile landing page.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-paper-100 rounded-lg border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-thread-600 text-paper-0 flex items-center justify-center font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">Mobile Landing &amp; Forms</h3>
              <p className="text-text-3 leading-relaxed">
                Fork with 2 paths: Student Patch Registration (3 simple steps) and School Bulk Ordering.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-paper-100 rounded-lg border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-moss-600 text-paper-0 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">3-Table Relational Base</h3>
              <p className="text-text-3 leading-relaxed">
                Schools, Patch Catalog, and Student Registry/Orders connected with automated rollup formulas.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-paper-100 rounded-lg border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-gold-500 text-paper-0 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">Reports &amp; Excel Export</h3>
              <p className="text-text-3 leading-relaxed">
                Live dashboard plus 1-click real .xlsx download prepared for Pivot Table generation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Recommended Tooling & Cost Comparison */}
        <section className="bg-paper-0 p-6 sm:p-8 rounded-xl border border-border shadow-sh-1 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-display font-semibold text-ink-900">
              2. Recommended Low-Code Tool Stack vs Custom App
            </h2>
            <p className="text-xs text-text-2 mt-0.5">
              Why we propose Google Sheets / Airtable instead of building a heavy proprietary database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            {/* Recommended Stack */}
            <div className="p-5 rounded-lg bg-moss-600/10 border-2 border-moss-600/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-moss-700 uppercase tracking-wide">
                  Recommended Architecture
                </span>
                <span className="font-bold font-mono text-base text-moss-700">$0 – $19 / mo</span>
              </div>
              <p className="text-text-2">
                <strong>Google Sheets / Airtable + Form Layer:</strong>
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-text-2">
                <li>You own 100% of the data in spreadsheets you already know how to open.</li>
                <li>Zero ongoing maintenance fees or developer retainers.</li>
                <li>Native Pivot Tables and real .xlsx downloads work right out of the box.</li>
                <li>Forms automatically pull the latest school dropdowns and catalog options.</li>
              </ul>
            </div>

            {/* Custom App Overkill */}
            <div className="p-5 rounded-lg bg-paper-100 border border-border space-y-3 opacity-80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-3 uppercase tracking-wide">
                  Proprietary Custom App (Avoid)
                </span>
                <span className="font-bold font-mono text-base text-status-error">$150 – $350 / mo</span>
              </div>
              <p className="text-text-2">
                <strong>Custom Web App with SQL Server &amp; Node Backend:</strong>
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-text-3">
                <li>Expensive monthly cloud hosting, database servers, and security updates.</li>
                <li>You cannot easily edit fields, add schools, or adjust stock without hiring a developer.</li>
                <li>Over-engineered for a startup merit patch business.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive 3-Table Relational Schema */}
        <section className="bg-paper-0 p-6 sm:p-8 rounded-xl border border-border shadow-sh-1 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-display font-semibold text-ink-900">
              3. The 3 Tables &amp; How They Link
            </h2>
            <p className="text-xs text-text-2 mt-0.5">
              Hover or click any linked field (e.g. <strong>School</strong> or <strong>Patch SKU</strong>) to see how data flows automatically between tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-ui">
            {/* Table 1: Schools */}
            <div className="border border-border rounded-lg p-4 bg-paper-100 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-ink-900">Table 1: Schools</span>
                <span className="text-[10px] font-mono text-text-3">8 Rows</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div
                  onMouseEnter={() => setHighlightedField('school')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isFieldHighlighted('school')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'hover:bg-paper-0 text-ink-900'
                  }`}
                >
                  ⇄ School ID &amp; Name (Key)
                </div>
                <div className="p-1.5 text-text-2">Conference / League</div>
                <div className="p-1.5 text-text-2">Athletic Director Contact</div>
                <div
                  onMouseEnter={() => setHighlightedField('orders')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isFieldHighlighted('orders')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'hover:bg-paper-0 text-moss-600 font-semibold'
                  }`}
                >
                  Σ Total Patches Ordered (Rollup)
                </div>
              </div>
            </div>

            {/* Table 2: Student Registry & Orders */}
            <div className="border-2 border-border-strong rounded-lg p-4 bg-paper-0 shadow-sh-1 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-ink-900">Table 2: Registry &amp; Orders</span>
                <span className="text-[10px] font-mono text-thread-600 font-semibold">Master Flat Ledger</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-1.5 text-text-3">Timestamp &amp; Ref #</div>
                <div className="p-1.5 text-text-2">Record Type (Reg / Order)</div>
                <div className="p-1.5 text-text-2">Student (First + Initial)</div>
                <div className="p-1.5 text-text-2">Graduation Year</div>
                <div
                  onMouseEnter={() => setHighlightedField('school')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isFieldHighlighted('school')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'hover:bg-paper-100 text-ink-900 font-semibold'
                  }`}
                >
                  ⇄ School (Linked to Schools)
                </div>
                <div
                  onMouseEnter={() => setHighlightedField('patch')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isFieldHighlighted('patch')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'hover:bg-paper-100 text-ink-900 font-semibold'
                  }`}
                >
                  ⇄ Patch SKU (Linked to Catalog)
                </div>
                <div
                  onMouseEnter={() => setHighlightedField('orders')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isFieldHighlighted('orders')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'hover:bg-paper-100 text-ink-900 font-semibold'
                  }`}
                >
                  Quantity Counted
                </div>
              </div>
            </div>

            {/* Table 3: Patch Catalog */}
            <div className="border border-border rounded-lg p-4 bg-paper-100 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-ink-900">Table 3: Patch Catalog</span>
                <span className="text-[10px] font-mono text-text-3">12 SKUs</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div
                  onMouseEnter={() => setHighlightedField('patch')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isFieldHighlighted('patch')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'hover:bg-paper-0 text-ink-900'
                  }`}
                >
                  ⇄ Patch SKU (Key)
                </div>
                <div className="p-1.5 text-text-2">Patch Name &amp; Description</div>
                <div className="p-1.5 text-text-2">Category (Academic / Athletic / Leadership)</div>
                <div className="p-1.5 text-text-2">Stock Count (With &lt;50 Reorder Alert)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Implementation Timeline & Delivery */}
        <section className="bg-paper-0 p-6 sm:p-8 rounded-xl border border-border shadow-sh-1 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-display font-semibold text-ink-900">
              4. 5-Day Delivery Timeline
            </h2>
            <p className="text-xs text-text-2 mt-0.5">
              Clear milestone progression from spreadsheet setup to verified packaging print run.
            </p>
          </div>

          <div className="space-y-3 text-xs font-ui">
            {[
              {
                day: 'Day 1',
                title: 'Data Architecture & Form Setup',
                desc: 'Build the 3 tables in Google Sheets, link the fields, and build the mobile forms with minor privacy constraints.',
              },
              {
                day: 'Day 2',
                title: 'Automated Linking & Rollups',
                desc: 'Configure the dynamic formulas so schools automatically rollup patch order counts and stock decrements.',
              },
              {
                day: 'Day 3',
                title: 'Dashboard & Pivot Table Configuration',
                desc: 'Build the summary tab with Pivot Tables for breakdown by School, Student, and Category with 1-click Excel export.',
              },
              {
                day: 'Day 4',
                title: 'Packaging QR Testing & Mobile Field Trial',
                desc: 'Generate universal redirect QR codes and test on iOS and Android devices across sample high schools.',
              },
              {
                day: 'Day 5',
                title: 'Handover Video & Owner Documentation',
                desc: 'Record a personalized 10-minute video walkthrough showing how to add schools, edit stock, and run Excel reports.',
              },
            ].map((item) => (
              <div
                key={item.day}
                className="p-3.5 bg-paper-100 rounded-lg border border-border flex items-start gap-4"
              >
                <span className="font-mono font-bold text-thread-600 bg-paper-0 px-2 py-1 rounded border border-border flex-shrink-0">
                  {item.day}
                </span>
                <div>
                  <h4 className="font-semibold text-ink-900 text-sm">{item.title}</h4>
                  <p className="text-text-2 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Owner Autonomy Summary */}
        <section className="bg-ink-900 text-paper-0 p-6 sm:p-8 rounded-xl border border-ink-700 shadow-sh-3 space-y-4">
          <h2 className="text-xl font-display font-semibold text-paper-0">
            What you can manage yourself as the owner:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
              <span>
                <strong>Add new high schools</strong> directly in your spreadsheet; they appear immediately in forms.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
              <span>
                <strong>Adjust stock numbers</strong> any time you receive a shipment from the embroidery mill.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
              <span>
                <strong>Download fresh Excel exports</strong> ready for your accountant or school board meetings.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
              <span>
                <strong>Permanent packaging QR code</strong> that never breaks, even if you update links down the road.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-paper-100/70">
              Ready to explore the live demo?
            </span>
            <div className="flex items-center gap-3">
              <Link to="/s">
                <Button variant="secondary" size="md">
                  Test Scan Flow
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="accent" size="md">
                  Open Owner Console
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
