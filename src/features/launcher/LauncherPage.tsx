import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Wordmark } from '../../components/brand/Wordmark';
import { PatchArt } from '../../components/brand/PatchArt';
import { Button } from '../../components/ui/Button';
import { PhoneFrame } from './PhoneFrame';
import { Loader } from './Loader';
import { GuidedTour } from '../../components/ui/GuidedTour';
import { useDemoStore } from '../../data/store';
import {
  Smartphone,
  LayoutDashboard,
  HelpCircle,
  QrCode,
  ShieldCheck,
  Award,
  Package,
  Database,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Split,
  ChevronDown,
} from 'lucide-react';

export const LauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { records, patches, schools } = useDemoStore();

  const [isLoading, setIsLoading] = useState(true);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [showSplitConsole, setShowSplitConsole] = useState(false);

  // Generate QR for Hero
  useEffect(() => {
    const targetUrl = `${window.location.origin}/s`;
    QRCode.toDataURL(
      targetUrl,
      {
        width: 180,
        margin: 1,
        color: { dark: '#1C2B3A', light: '#FFFFFF' },
      },
      (err, url) => {
        if (!err && url) setQrSvg(url);
      }
    );
  }, []);

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const isFieldHighlighted = (f: string) => highlightedField === f;

  return (
    <div className="min-h-screen bg-paper-50 font-ui text-ink-900 select-none overflow-x-hidden">
      {/* Entry Stitched Monogram Loader */}
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      {/* Floating Guided Tour Pill */}
      <GuidedTour />

      {/* Navigation Bar */}
      <header className="border-b border-border bg-paper-0/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Wordmark size="sm" linkTo="/" />

          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <Link
              to="/s"
              className="hidden sm:inline-flex items-center gap-1.5 text-text-2 hover:text-ink-900 px-3 py-1.5 rounded-md hover:bg-paper-100 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-thread-600" />
              <span>Scan Experience</span>
            </Link>

            <Link
              to="/how-it-works"
              className="text-text-2 hover:text-ink-900 px-3 py-1.5 rounded-md hover:bg-paper-100 transition-colors"
            >
              How It's Built
            </Link>

            <Link to="/admin">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
                className="font-semibold shadow-sh-1"
              >
                Owner Console
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION (PRD §7) */}
      <section className="relative pt-8 pb-16 sm:py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            {/* Left Copy Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-100 border border-border text-xs font-semibold text-thread-600">
                <span className="w-2 h-2 rounded-full bg-thread-600 animate-pulse" />
                <span>Interactive Bid Proposal Demo</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-display font-semibold text-ink-900 tracking-tight leading-[1.08]">
                Scan. Register.
                <br />
                <span className="italic font-normal">Order. Report.</span>
              </h1>

              <p className="text-base sm:text-lg text-text-2 max-w-xl font-ui leading-relaxed">
                This is the interactive system behind your patch packaging's universal QR code: a mobile experience for students and schools, and a private owner console where every patch is counted.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={triggerScanAnimation}
                  leftIcon={<QrCode className="w-4 h-4" />}
                  className="font-semibold shadow-sh-2"
                >
                  Scan the QR code
                </Button>

                <Link to="/admin">
                  <Button variant="secondary" size="lg" className="font-semibold">
                    Open Owner Console
                  </Button>
                </Link>

                <Link
                  to="/how-it-works"
                  className="text-xs font-semibold text-text-3 hover:text-ink-900 ml-2 flex items-center gap-1 underline"
                >
                  <span>How it's built →</span>
                </Link>
              </div>

              {/* Trust Drivers Row */}
              <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-text-3 font-ui">
                <span className="flex items-center gap-1.5 text-ink-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-moss-600" />
                  3 Linked Tables
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-ink-900 font-medium">
                  <FileSpreadsheet className="w-4 h-4 text-thread-600" />
                  Real Excel Export (.xlsx)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-ink-900 font-medium">
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                  No monthly platform fees*
                </span>
              </div>

              {/* Desktop Split View Switcher */}
              <div className="hidden xl:flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSplitConsole(!showSplitConsole)}
                  className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
                    showSplitConsole
                      ? 'bg-ink-900 text-paper-0 border-ink-900'
                      : 'bg-paper-100 text-text-2 border-border hover:bg-paper-0'
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>
                    {showSplitConsole ? 'Hide Side-by-Side Console' : 'Show Console Alongside Phone'}
                  </span>
                </button>
                <span className="text-[11px] text-text-3">
                  (Simulate submitting on phone and watching records appear in real-time)
                </span>
              </div>
            </div>

            {/* Right Visual Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Universal QR with Sweeping Scan Line */}
              <div className="relative mb-6">
                <div
                  onClick={triggerScanAnimation}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && triggerScanAnimation()}
                  className={`p-3 bg-paper-0 rounded-2xl border-2 transition-all cursor-pointer shadow-sh-2 overflow-hidden relative ${
                    isScanning
                      ? 'border-thread-600 ring-4 ring-thread-600/30 scale-105'
                      : 'border-border hover:border-ink-900'
                  }`}
                  title="Click to trigger scan animation"
                >
                  {qrSvg && (
                    <img
                      src={qrSvg}
                      alt="Universal Packaging QR"
                      className="w-28 h-28 object-contain"
                    />
                  )}

                  {/* Animated laser scan line sweeping across */}
                  <div
                    className={`absolute left-0 right-0 h-1 bg-thread-600 shadow-[0_0_8px_#B5472F] transition-all duration-700 pointer-events-none ${
                      isScanning ? 'top-[90%]' : 'top-[10%]'
                    }`}
                  />
                </div>

                {/* Stitched Varsity Patch Accents around QR */}
                <div className="absolute -left-12 -bottom-2 -rotate-12 pointer-events-none drop-shadow-md">
                  <PatchArt
                    sku="ATH-001"
                    category="Athletic"
                    shape="shield"
                    size={48}
                  />
                </div>
                <div className="absolute -right-12 -top-2 rotate-12 pointer-events-none drop-shadow-md">
                  <PatchArt
                    sku="ACD-001"
                    category="Academic"
                    shape="circle"
                    size={48}
                  />
                </div>
              </div>

              {/* Sized Interactive Phone Frame */}
              <div className="w-full flex justify-center">
                <PhoneFrame onScanClick={triggerScanAnimation} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ONE QR CODE, TWO PATHS (PRD §8.2) */}
      <section className="py-16 sm:py-24 border-b border-border bg-paper-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 md:sticky md:top-24 space-y-3">
              <span className="text-xs font-semibold text-thread-600 uppercase tracking-wider">
                Mobile-First Scan Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink-900 tracking-tight">
                One universal QR code.
                <br />
                Two distinct paths.
              </h2>
              <p className="text-sm text-text-2 font-ui leading-relaxed">
                Whether scanned by a high school student unboxing their varsity letter or an athletic director ordering for the spring track team, the universal destination branches cleanly without confusing either audience.
              </p>
            </div>

            <div className="md:col-span-7 space-y-5">
              {/* Path 1: Register */}
              <div className="bg-paper-0 p-6 rounded-xl border-2 border-border shadow-sh-1 stitched-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-moss-600/10 text-moss-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-semibold text-ink-900">
                      Path 1: Student Patch Registration
                    </h3>
                    <span className="text-xs text-text-3">For students receiving a merit patch</span>
                  </div>
                </div>
                <p className="text-xs text-text-2 leading-relaxed">
                  A 3-step progressive mobile form built with minor privacy guardrails (First Name + Last Initial only). Physically prevents collecting full last names, verifies high school and sport, and issues an official record ticket.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-moss-600 font-semibold">
                    ✓ Direct entry into Registry table
                  </span>
                  <Link
                    to="/s/register"
                    className="font-semibold text-thread-600 hover:underline flex items-center gap-1"
                  >
                    <span>Test student form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Path 2: Order */}
              <div className="bg-paper-0 p-6 rounded-xl border-2 border-border shadow-sh-1 stitched-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-thread-600/10 text-thread-600 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-semibold text-ink-900">
                      Path 2: School Bulk Ordering
                    </h3>
                    <span className="text-xs text-text-3">For coaches, ADs, and booster parents</span>
                  </div>
                </div>
                <p className="text-xs text-text-2 leading-relaxed">
                  Fast multi-line quote requester with school directory selection, quantity steppers, live stock awareness, and automatic backorder handling.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-thread-600 font-semibold">
                    ✓ Automatically increments school order rollups
                  </span>
                  <Link
                    to="/s/order"
                    className="font-semibold text-thread-600 hover:underline flex items-center gap-1"
                  >
                    <span>Test order form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EVERY RECORD LANDS IN ONE PLACE (PRD §8.3) */}
      <section className="py-16 sm:py-24 border-b border-border bg-paper-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-thread-600 uppercase tracking-wider">
              Relational Data Integrity
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink-900 tracking-tight">
              Every record lands in one connected place.
            </h2>
            <p className="text-xs sm:text-sm text-text-2 leading-relaxed">
              Hover over any linked key (like <strong>School</strong> or <strong>Patch SKU</strong>) to see how submissions update the catalog inventory and school tallies automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Table 1: Schools */}
            <div className="bg-paper-0 p-5 rounded-xl border border-border shadow-sh-1 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-ink-900 font-display">
                    Table 1: Schools
                  </h3>
                  <span className="text-[11px] text-text-3">8 High Schools</span>
                </div>
                <span className="text-[10px] font-mono bg-paper-100 px-1.5 py-0.5 rounded border">
                  Directory
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div
                  onMouseEnter={() => setHighlightedField('school')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isFieldHighlighted('school')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'bg-paper-100 text-ink-900'
                  }`}
                >
                  ⇄ School ID &amp; Name (Key)
                </div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">Conference / Division</div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">Athletic Director Contact</div>
                <div
                  onMouseEnter={() => setHighlightedField('qty')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isFieldHighlighted('qty')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'bg-moss-600/10 text-moss-700 font-semibold'
                  }`}
                >
                  Σ Total Patches Ordered (Rollup)
                </div>
              </div>
            </div>

            {/* Table 2: Master Flat Ledger */}
            <div className="bg-paper-0 p-5 rounded-xl border-2 border-border-strong shadow-sh-2 space-y-4 stitched-border">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-ink-900 font-display">
                    Table 2: Registry &amp; Orders
                  </h3>
                  <span className="text-[11px] text-thread-600 font-semibold">
                    Master Flat Ledger
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-thread-600 text-paper-0 px-1.5 py-0.5 rounded">
                  Pivot-Ready
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 text-text-3 bg-paper-100 rounded">Timestamp &amp; Ref #</div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">Record Type (Reg / Order)</div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">Student (First + Initial)</div>
                <div
                  onMouseEnter={() => setHighlightedField('school')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isFieldHighlighted('school')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'bg-paper-100 text-ink-900 font-semibold'
                  }`}
                >
                  ⇄ School (Linked)
                </div>
                <div
                  onMouseEnter={() => setHighlightedField('sku')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isFieldHighlighted('sku')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'bg-paper-100 text-ink-900 font-semibold'
                  }`}
                >
                  ⇄ Patch SKU (Linked)
                </div>
                <div
                  onMouseEnter={() => setHighlightedField('qty')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isFieldHighlighted('qty')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'bg-paper-100 text-ink-900 font-semibold'
                  }`}
                >
                  Quantity Counted
                </div>
              </div>
            </div>

            {/* Table 3: Patch Catalog */}
            <div className="bg-paper-0 p-5 rounded-xl border border-border shadow-sh-1 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-ink-900 font-display">
                    Table 3: Patch Catalog
                  </h3>
                  <span className="text-[11px] text-text-3">12 Merit SKUs</span>
                </div>
                <span className="text-[10px] font-mono bg-paper-100 px-1.5 py-0.5 rounded border">
                  Inventory
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div
                  onMouseEnter={() => setHighlightedField('sku')}
                  onMouseLeave={() => setHighlightedField(null)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isFieldHighlighted('sku')
                      ? 'bg-thread-600 text-paper-0 font-bold'
                      : 'bg-paper-100 text-ink-900'
                  }`}
                >
                  ⇄ Patch SKU (Key)
                </div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">Patch Name &amp; Description</div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">Category (Academic / Athletic / Lead)</div>
                <div className="p-2 text-text-2 bg-paper-100 rounded">In-Stock Count (&lt;50 Alert)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT THE OWNER SEES (PRD §8.4) */}
      <section className="py-16 sm:py-24 border-b border-border bg-paper-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-paper-0 p-6 sm:p-10 rounded-2xl border-2 border-border shadow-sh-2 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <span className="text-xs font-semibold text-thread-600 uppercase tracking-wider">
                  Real-Time Reporting Widget
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-semibold text-ink-900">
                  What the owner sees at a glance
                </h3>
                <p className="text-xs sm:text-sm text-text-2 mt-1">
                  Live metrics computed directly from database entries.
                </p>
              </div>

              <Link to="/admin">
                <Button variant="accent" size="md">
                  Open full console →
                </Button>
              </Link>
            </div>

            {/* Live Mini KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-paper-100 rounded-lg border border-border">
                <span className="text-xs text-text-3 font-medium">Patches Registered</span>
                <div className="text-2xl font-bold font-display text-ink-900 mt-1 tabular-nums">
                  {records.filter((r) => r.recordType === 'Registration').reduce((s, r) => s + r.quantity, 0)}
                </div>
              </div>

              <div className="p-4 bg-paper-100 rounded-lg border border-border">
                <span className="text-xs text-text-3 font-medium">Patches Ordered</span>
                <div className="text-2xl font-bold font-display text-thread-600 mt-1 tabular-nums">
                  {records.filter((r) => r.recordType === 'Order').reduce((s, r) => s + r.quantity, 0)}
                </div>
              </div>

              <div className="p-4 bg-paper-100 rounded-lg border border-border">
                <span className="text-xs text-text-3 font-medium">Active High Schools</span>
                <div className="text-2xl font-bold font-display text-moss-600 mt-1 tabular-nums">
                  {new Set(records.map((r) => r.schoolId)).size} of {schools.length}
                </div>
              </div>

              <div className="p-4 bg-paper-100 rounded-lg border border-border">
                <span className="text-xs text-text-3 font-medium">Low Stock Alerts</span>
                <div className="text-2xl font-bold font-display text-gold-500 mt-1 tabular-nums">
                  {patches.filter((p) => p.stock < 50).length} SKUs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CLOSING CTA / FOOTER (PRD §20) */}
      <footer className="bg-ink-900 text-paper-0 pt-16 pb-12 font-ui select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-ink-700 pb-12">
            <div className="lg:col-span-8 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-paper-0 tracking-tight">
                Ready to see your patches counted?
              </h2>
              <p className="text-sm text-paper-100/75 max-w-xl leading-relaxed">
                This demo mirrors the proposal: the same 3 linked tables, the same student privacy guarantees, and genuine Pivot Table-ready Excel exports.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/admin" className="flex-1">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full text-sm font-semibold"
                >
                  Open Owner Console
                </Button>
              </Link>
              <Link to="/how-it-works" className="flex-1">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-sm font-semibold text-paper-0 border-ink-700 bg-ink-950 hover:bg-ink-700"
                >
                  Read Proposal
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer Directory Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs text-paper-100/75">
            <div className="space-y-2">
              <span className="font-semibold text-paper-0 uppercase tracking-wider block">
                Interactive Demos
              </span>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/s" className="hover:text-paper-0">
                    Mobile QR Destination (/s)
                  </Link>
                </li>
                <li>
                  <Link to="/s/register" className="hover:text-paper-0">
                    Student Registration Flow
                  </Link>
                </li>
                <li>
                  <Link to="/s/order" className="hover:text-paper-0">
                    School Bulk Ordering Flow
                  </Link>
                </li>
                <li>
                  <Link to="/s/privacy" className="hover:text-paper-0">
                    Minor Student Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-paper-0 uppercase tracking-wider block">
                Owner Console
              </span>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/admin" className="hover:text-paper-0">
                    Dashboard &amp; KPI Rollups
                  </Link>
                </li>
                <li>
                  <Link to="/admin/schools" className="hover:text-paper-0">
                    Schools Directory &amp; Orders Rollup
                  </Link>
                </li>
                <li>
                  <Link to="/admin/catalog" className="hover:text-paper-0">
                    Patch Catalog &amp; Live Stock
                  </Link>
                </li>
                <li>
                  <Link to="/admin/records" className="hover:text-paper-0">
                    Student Registry &amp; Orders Ledger
                  </Link>
                </li>
                <li>
                  <Link to="/admin/qr" className="hover:text-paper-0">
                    Printable QR Label Sheet
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-paper-0 uppercase tracking-wider block">
                Proposal Notes &amp; Contact
              </span>
              <p className="text-[11px] text-paper-100/60 leading-relaxed">
                Demo data is fictional for illustration. The live production system connects directly to your own Google Sheet or Airtable database.
              </p>
              <div className="pt-1">
                <span className="text-[11px] text-paper-100/90 font-medium block">
                  Freelance Partner: Upwork Applicant
                </span>
                <span className="text-[11px] text-thread-600 block">
                  Proposal: "Patches QR Code Data"
                </span>
              </div>
            </div>
          </div>

          {/* Stitched Bottom Line */}
          <div className="pt-6 border-t border-dashed border-ink-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-paper-100/50">
            <span>© 2026 A&amp;A Patch Work · Interactive Concept Demo</span>
            <span>Crafted with restraint: warm paper, deep ink, and stitched thread.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
