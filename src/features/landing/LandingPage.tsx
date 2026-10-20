import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { HeroCycle } from './HeroCycle';
import { LoadingExperience } from './LoadingExperience';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { DocumentPreviewModal } from '../../components/ui/DocumentPreviewModal';
import { useDemo } from '../../state/demo-store';
import { Candidate, CandidateDocument } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sliders,
  FileCheck2,
  Lock,
  ChevronDown,
  Building2,
  Users2,
  Award,
  Search,
  ExternalLink,
  Eye,
  BookmarkCheck,
  Check,
  Briefcase
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [previewCandidate, setPreviewCandidate] = useState<Candidate | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CandidateDocument | null>(null);
  const [filterCity, setFilterCity] = useState<string>('All');

  const { state } = useDemo();
  const navigate = useNavigate();

  const metrics = [
    { value: '840+', label: 'Verified Skilled Profiles', sub: 'Active in Sweden' },
    { value: '142', label: 'Registered Employers', sub: 'Industrial & Tech' },
    { value: '1,980+', label: 'Human Audited Credentials', sub: 'Certificates checked' },
    { value: '94.6%', label: 'Placement Retention', sub: '90-day success rate' }
  ];

  const howItWorksSteps = [
    {
      num: '01',
      title: 'Structured Skill & Evidence Ingestion',
      short: 'Candidates provide structured qualifications, licenses, and employment credentials.',
      detail:
        'Instead of unstructured text resumes, professionals input exact qualification categories: ECY electrical licenses, ID06 site competence cards, SSG Entre passports, and accredited university diplomas.',
      features: ['Structured data schema', 'Direct ID06 verification slot', 'Zero keyword hallucination']
    },
    {
      num: '02',
      title: 'Human-Led Multi-Tier Verification',
      short: 'Verification officers inspect institutional registries, seal authenticity, and references.',
      detail:
        'Every tier of evidence is explicitly tagged. Officers validate against national authorities like Elsäkerhetsverket, Incert, or Ladok before granting confirmed status.',
      features: ['Three rigorous verification tiers', 'Audit trail on every claim', 'Document expiration monitoring']
    },
    {
      num: '03',
      title: 'Explainable, Weighted Matching',
      short: 'Employers define hard mandatory requirements and weighted preferences.',
      detail:
        'Mandatory eligibility filters run before candidate ranking. Employers see precisely why a professional scored 92% vs 84%, which evidence was confirmed, and any upcoming expirations.',
      features: ['100% deterministic scoring', 'Mandatory vs preference separation', 'Elimination of black-box AI bias']
    }
  ];

  const verificationLevels = [
    {
      level: 'Self-reported' as const,
      desc: 'Candidate declaration without third-party proof.',
      confidence: 'Baseline entry',
      badgeClass: 'bg-[#F0EFEB] text-[#777F79]',
      points: ['Declared work history & skills', 'Subject to initial platform review', 'Marked clearly to prevent false trust']
    },
    {
      level: 'Document checked' as const,
      desc: 'Officer verified original certificate scans and serials.',
      confidence: 'Medium-High',
      badgeClass: 'bg-[#EBF1ED] text-[#356653]',
      points: ['Official PDF / physical scan inspected', 'Issuer authority verified', 'Document expiry dates recorded']
    },
    {
      level: 'Independently confirmed' as const,
      desc: 'Direct query to government or institutional registry.',
      confidence: 'Gold standard',
      badgeClass: 'bg-[#E7EEE7] text-[#24483D]',
      points: ['Direct Elsäkerhetsverket / ID06 check', 'Direct supervisor reference call', 'Tamper-evident verification log']
    }
  ];

  // Candidates for preview drawer
  const filteredCandidates = state.candidates.filter(c => {
    if (filterCity === 'All') return true;
    return c.location.toLowerCase().includes(filterCity.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      {/* Premium Loading Screen (Only on first load per session) */}
      {showLoading && <LoadingExperience onComplete={() => setShowLoading(false)} />}

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION (Page 6) */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines & Actions */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EEE7] border border-[#C5D9C5] text-[#24483D] text-xs font-semibold tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trusted Professional Network · Built for Sweden</span>
                </div>

                {/* Headline with optional restrained editorial serif */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#28332F] leading-[1.12]">
                  The right people.{' '}
                  <span className="font-editorial italic font-normal text-[#24483D]">Verified.</span>{' '}
                  Ready.
                </h1>

                {/* Supporting copy */}
                <p className="text-base sm:text-lg text-[#777F79] max-w-xl leading-relaxed">
                  Connect with Swedish industrial professionals whose qualifications, licenses, and availability
                  have been rigorously audited. Make confident hiring decisions with transparent matching and evidence you can trust.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    onClick={() => navigate('/app/employer/overview')}
                  >
                    Explore the Platform
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById('how-it-works');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    See How It Works
                  </Button>
                </div>

                {/* Trust Line */}
                <div className="pt-4 border-t border-[#E5E5DD]/80 flex items-center gap-3 text-xs text-[#777F79] flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-[#28332F]">
                    <CheckCircle2 className="w-4 h-4 text-[#24483D]" />
                    Structured profiles
                  </span>
                  <span className="text-[#E5E5DD]">•</span>
                  <span className="flex items-center gap-1.5 font-medium text-[#28332F]">
                    <CheckCircle2 className="w-4 h-4 text-[#24483D]" />
                    Human-led verification
                  </span>
                  <span className="text-[#E5E5DD]">•</span>
                  <span className="flex items-center gap-1.5 font-medium text-[#28332F]">
                    <CheckCircle2 className="w-4 h-4 text-[#24483D]" />
                    Explainable matching
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Hero Composition */}
              <div className="lg:col-span-5 flex justify-center">
                <HeroCycle />
              </div>
            </div>
          </div>
        </section>

        {/* ILLUSTRATIVE METRICS SECTION (Page 6) */}
        <section className="border-y border-[#E5E5DD] bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5DD]">
              <span className="text-xs uppercase tracking-wider font-bold text-[#777F79]">
                Platform Scale & Verification Activity
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532] font-medium">
                Demo benchmark data
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {metrics.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-bold text-[#24483D] tracking-tight">{m.value}</p>
                  <p className="text-sm font-semibold text-[#28332F]">{m.label}</p>
                  <p className="text-xs text-[#777F79]">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (Page 6) */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
              Deterministic Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#28332F]">
              How verification creates hiring certainty
            </h2>
            <p className="text-sm sm:text-base text-[#777F79]">
              Every step is designed to replace unverified CV assertions with structured, auditable evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksSteps.map((step, idx) => {
              const isSelected = expandedStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedStep(idx)}
                  className={`bg-white rounded-xl p-6 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#24483D] shadow-md ring-1 ring-[#24483D]/20'
                      : 'border-[#E5E5DD] hover:border-[#D5D5CB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-bold text-[#356653]">{step.num}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E5DD] text-[#777F79]">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#28332F] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#777F79] leading-relaxed mb-4">{step.short}</p>

                  <div className={`space-y-3 pt-3 border-t border-[#E5E5DD] ${isSelected ? 'block' : 'hidden'}`}>
                    <p className="text-xs text-[#28332F] leading-relaxed">{step.detail}</p>
                    <ul className="space-y-1.5 pt-1">
                      {step.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-[#356653] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#24483D]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* VERIFICATION STANDARDS BREAKDOWN (Page 6) */}
        <section className="bg-white border-y border-[#E5E5DD] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
                Verification Framework
              </span>
              <h2 className="text-3xl font-bold text-[#28332F] mt-1 mb-2">
                Clear multi-level evidence standards
              </h2>
              <p className="text-sm text-[#777F79]">
                VERITY never treats missing evidence as confirmed. Every claim is strictly designated across three unambiguous trust levels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verificationLevels.map((vl, idx) => (
                <div key={idx} className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vl.badgeClass}`}>
                      {vl.level}
                    </span>
                    <span className="text-[11px] text-[#777F79] font-medium">Trust: {vl.confidence}</span>
                  </div>
                  <p className="text-sm text-[#28332F] font-medium">{vl.desc}</p>
                  <div className="pt-2 border-t border-[#E5E5DD] space-y-2">
                    {vl.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#777F79]">
                        <Check className="w-3.5 h-3.5 text-[#24483D] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/verification-standards"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#24483D] hover:underline"
              >
                <span>Read our complete Swedish verification protocol & audit methodology</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* INTERACTIVE EMPLOYER PREVIEW SECTION (Page 6) */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
                Live Candidate Preview
              </span>
              <h2 className="text-3xl font-bold text-[#28332F] mt-1">
                Explore audited Swedish talent
              </h2>
              <p className="text-sm text-[#777F79]">
                Filter by regional cluster and inspect credentials directly.
              </p>
            </div>

            {/* City filter tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#E5E5DD]">
              {['All', 'Gothenburg', 'Stockholm', 'Malmö', 'Uppsala'].map(city => (
                <button
                  key={city}
                  onClick={() => setFilterCity(city)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterCity === city
                      ? 'bg-[#24483D] text-white shadow-xs'
                      : 'text-[#777F79] hover:text-[#28332F]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCandidates.slice(0, 6).map(cand => (
              <div
                key={cand.id}
                className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#E5E5DD] text-[#24483D] font-bold text-sm flex items-center justify-center">
                        {cand.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#28332F]">{cand.name}</h4>
                        <p className="text-xs text-[#356653] font-medium">{cand.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#777F79]">
                    <span>{cand.location}</span>
                    <span className="font-medium text-[#24483D]">{cand.availability}</span>
                  </div>

                  <StatusBadge status={cand.verificationLevel} size="sm" />

                  <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed">
                    {cand.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E5DD] flex items-center justify-between mt-4">
                  <span className="text-[11px] text-[#777F79] font-medium">
                    {cand.documents.length} audited records
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setPreviewCandidate(cand)}
                  >
                    Inspect Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="md"
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/app/employer/matches')}
            >
              Open Full Candidate Matching Engine
            </Button>
          </div>
        </section>

        {/* PRIVACY & CANDIDATE CONTROLS (Page 6) */}
        <section className="bg-white border-y border-[#E5E5DD] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
                  Privacy by Design
                </span>
                <h2 className="text-3xl font-bold text-[#28332F]">
                  Complete control over professional identity
                </h2>
                <p className="text-sm text-[#777F79] leading-relaxed">
                  Candidate trust is foundational. Professionals govern exactly when their full contact details
                  and personal identification numbers are shared, with time-limited digital tokens and instant revocation.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-[#28332F]">
                    <CheckCircle2 className="w-4 h-4 text-[#24483D] shrink-0" />
                    <span>Anonymous initial qualification matching to prevent hiring bias</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#28332F]">
                    <CheckCircle2 className="w-4 h-4 text-[#24483D] shrink-0" />
                    <span>Granular document sharing permissions per employer requirement</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#28332F]">
                    <CheckCircle2 className="w-4 h-4 text-[#24483D] shrink-0" />
                    <span>Time-bound QR code sharing with instant one-click revocation</span>
                  </div>
                </div>
              </div>

              {/* Mock candidate privacy control widget */}
              <div className="lg:col-span-6 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#24483D]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
                      Candidate Privacy Settings (Preview)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#356653] font-semibold bg-[#E7EEE7] px-2 py-0.5 rounded">
                    GDPR Aligned
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5DD]">
                    <div>
                      <p className="font-semibold text-[#28332F]">Anonymous Initial Review</p>
                      <p className="text-[#777F79] text-[11px]">Hide name and personal ID until mutual shortlist match</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#24483D] w-4 h-4 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5DD]">
                    <div>
                      <p className="font-semibold text-[#28332F]">Direct Employer Contact</p>
                      <p className="text-[#777F79] text-[11px]">Allow verified companies to request phone conversation</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#24483D] w-4 h-4 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5DD]">
                    <div>
                      <p className="font-semibold text-[#28332F]">Digital Passport QR Token</p>
                      <p className="text-[#777F79] text-[11px]">Allow verification officers to generate verifiable badges</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#24483D] w-4 h-4 rounded" />
                  </div>
                </div>

                <p className="text-[11px] text-[#777F79] italic pt-1">
                  * Note: In this frontend demo prototype, privacy settings save locally to simulate production workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION (Page 6) */}
        <section className="py-20 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#24483D] text-white rounded-2xl p-10 sm:p-14 shadow-xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Make every hiring decision more informed.
            </h2>
            <p className="text-sm sm:text-base text-[#E7EEE7] max-w-xl mx-auto leading-relaxed">
              Explore the full interactive prototype with fictional Swedish professionals, explainable matching algorithms, and realistic verification workflows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[#24483D] hover:bg-[#F7F6F2] border-white w-full sm:w-auto"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => navigate('/app/employer/overview')}
              >
                Launch Employer Workspace
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={() => navigate('/demo')}
              >
                Explore Demo Roles & Guide
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Candidate Inspection Drawer */}
      {previewCandidate && (
        <Drawer
          isOpen={!!previewCandidate}
          onClose={() => setPreviewCandidate(null)}
          title={previewCandidate.name}
          subtitle={`${previewCandidate.title} · ${previewCandidate.location}`}
          width="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
              <StatusBadge status={previewCandidate.verificationLevel} size="md" />
              <span className="text-xs text-[#777F79] font-medium">Availability: {previewCandidate.availability}</span>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#777F79] mb-1.5">Professional Summary</h5>
              <p className="text-xs text-[#28332F] leading-relaxed">{previewCandidate.summary}</p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#777F79] mb-2">Audited Documents & Certificates</h5>
              <div className="space-y-2">
                {previewCandidate.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#28332F]">{doc.title}</p>
                      <p className="text-[11px] text-[#777F79]">{doc.issuer} · {doc.issueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={doc.status} size="sm" />
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="text-xs text-[#24483D] font-semibold hover:underline"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5DD] flex items-center justify-between">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setPreviewCandidate(null);
                  navigate(`/app/employer/candidates/${previewCandidate.id}`);
                }}
              >
                Open Full Candidate Dossier
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewCandidate(null)}>
                Close
              </Button>
            </div>
          </div>
        </Drawer>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          candidateName={previewCandidate?.name || 'Verified Professional'}
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
