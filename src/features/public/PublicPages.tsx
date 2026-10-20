import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useDemo } from '../../state/demo-store';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileCheck2,
  Building2,
  Users2,
  Clock,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  AlertTriangle,
  Award,
  Layers,
  Search,
  Check
} from 'lucide-react';

/* ----------------------------------------------------
   1. HOW IT WORKS
---------------------------------------------------- */
export const PublicHowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
            Operational Workflow
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
            How VERITY replaces unverified resumes
          </h1>
          <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
            Conventional recruitment relies on unverified resumes and keyword keyword-matching.
            VERITY introduces structured credential ingestion, human-led verification audits,
            and deterministic explainable matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-[#E5E5DD] space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E7EEE7] text-[#24483D] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-[#28332F]">Structured Data Intake</h3>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Candidates enter specific Swedish qualifications—such as ECY electrician certifications,
              SSG Entre safety passports, and ID06 cards—with issue dates and certificate serials.
            </p>
            <ul className="text-xs text-[#28332F] space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#24483D]" /> Normalized credential taxonomy</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#24483D]" /> No keyword resume stuffing</li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#E5E5DD] space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E7EEE7] text-[#24483D] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-[#28332F]">Multi-Tier Human Audit</h3>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Trained verification officers validate documents against national registries like
              Elsäkerhetsverket or Ladok, logging every verification timestamp into an audit history.
            </p>
            <ul className="text-xs text-[#28332F] space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#24483D]" /> Direct registrar checks</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#24483D]" /> Document expiration alerts</li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#E5E5DD] space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E7EEE7] text-[#24483D] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-[#28332F]">Explainable Matching</h3>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Employers specify hard eligibility filters and weighted preference criteria.
              Candidates are scored deterministically, showing exactly why they matched.
            </p>
            <ul className="text-xs text-[#28332F] space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#24483D]" /> Hard exclusion of ineligible candidates</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#24483D]" /> Transparent 0-100% scoring weights</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/app/employer/matches')}
          >
            Test Explainable Matching in Demo
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ----------------------------------------------------
   2. FOR EMPLOYERS
---------------------------------------------------- */
export const PublicEmployers: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
            Workforce Intelligence
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
            Recruit Swedish technical talent with verified proof
          </h1>
          <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
            Eliminate credential fraud and shorten hiring turnaround from weeks to days.
            VERITY provides instant access to pre-audited electricians, automation engineers, and technicians.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/app/employer/overview')}
            >
              Enter Employer Workspace Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E5E5DD] space-y-3">
            <h3 className="text-lg font-bold text-[#28332F]">Deterministic Requirement Builder</h3>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Describe your workforce need in plain Swedish or English. Our criteria generator extracts
              statutory licenses (ECY, ID06, BAS-P/U, F-Gas) and formats them into strict rules.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#E5E5DD] space-y-3">
            <h3 className="text-lg font-bold text-[#28332F]">Integrated Recruitment Kanban</h3>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Move candidates seamlessly from New Match to Shortlist, Contact Requested, Interview,
              and Contract Decision with drag-and-drop or single-click stage controls.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ----------------------------------------------------
   3. FOR PROFESSIONALS
---------------------------------------------------- */
export const PublicProfessionals: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
            Digital Professional Passport
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
            Your verified career dossier in one secure passport
          </h1>
          <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
            Stop sending unverified CVs into black-box portals. Put your audited certificates,
            safety cards, and trade licenses into a cryptographic, shareable digital credential.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/app/candidate/passport')}
            >
              Preview Candidate Digital Passport
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-2">
            <h4 className="text-sm font-bold text-[#28332F]">Instant Trust from Employers</h4>
            <p className="text-xs text-[#777F79]">
              Verified badges mean hiring managers can make interview and offer decisions without days of background checks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-2">
            <h4 className="text-sm font-bold text-[#28332F]">Autonomous Privacy Control</h4>
            <p className="text-xs text-[#777F79]">
              You choose when to share contact details. Generate time-limited QR codes and revoke access whenever you want.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-2">
            <h4 className="text-sm font-bold text-[#28332F]">Automatic Expiration Tracking</h4>
            <p className="text-xs text-[#777F79]">
              Never let a safety permit or electrical card lapse. Get alerts 60 and 30 days before statutory renewals.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ----------------------------------------------------
   4. VERIFICATION STANDARDS
---------------------------------------------------- */
export const PublicVerificationStandards: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
            Audit Framework
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
            Swedish Verification Standards & Protocols
          </h1>
          <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
            VERITY operates an evidence hierarchy aligned with Swedish vocational bodies,
            statutory safety authorities, and national educational registries.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7EEE7] text-[#24483D]">
                Level 3: Independently Confirmed
              </span>
              <span className="text-xs text-[#777F79]">Highest Trust Assurance</span>
            </div>
            <p className="text-xs text-[#28332F] leading-relaxed">
              A verification officer directly queries the issuing registry (e.g. Elsäkerhetsverket AL register,
              ID06 competence database, Ladok higher education, or GWO WINDA).
              Includes recorded reference checks directly conducted with past supervisors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF1ED] text-[#356653]">
                Level 2: Document Checked
              </span>
              <span className="text-xs text-[#777F79]">Inspected Scans & Holograms</span>
            </div>
            <p className="text-xs text-[#28332F] leading-relaxed">
              Verification officer performs cryptographic signature checks, seal examination,
              and validity window verification on original high-resolution scans.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0EFEB] text-[#777F79]">
                Level 1: Self-Reported
              </span>
              <span className="text-xs text-[#777F79]">Unverified Candidate Declaration</span>
            </div>
            <p className="text-xs text-[#28332F] leading-relaxed">
              Data input directly by the candidate without verified documentary proof.
              Explicitly labeled to ensure hiring managers are never misled.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ----------------------------------------------------
   5. SECURITY & PRIVACY
---------------------------------------------------- */
export const PublicSecurity: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
            Security & Governance
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
            Security, GDPR & Demo Boundary Notice
          </h1>
          <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
            Data privacy and strict boundary separation are core architectural tenets of VERITY.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-3">
            <div className="flex items-center gap-2 text-[#24483D]">
              <Lock className="w-5 h-5" />
              <h3 className="text-sm font-bold">GDPR Compliance Architecture</h3>
            </div>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Designed around Swedish and EU General Data Protection Regulation requirements:
              right to erasure, purpose limitation, anonymous preliminary matching, and granular data processing consents.
            </p>
          </div>

          <div className="bg-[#FAF3E8] border border-[#EDD9B8] p-6 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[#A87532]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Synthetic Demo Prototype Boundary</h3>
            </div>
            <p className="text-xs text-[#A87532] leading-relaxed">
              This interactive application is a frontend demonstration prototype for product evaluation.
              All Swedish candidate records, company profiles, documents, and pricing are fictional.
              Do not enter real personal identity or confidential data.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ----------------------------------------------------
   6. CONTACT
---------------------------------------------------- */
export const PublicContact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useDemo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Demo inquiry dispatched successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
            Contact VERITY Partnership Team
          </h1>
          <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
            Interested in deploying verified workforce infrastructure for your industrial enterprise?
            Schedule a personalized technical consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-[#E5E5DD] shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E7EEE7] text-[#24483D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#28332F]">Inquiry Dispatched (Simulated)</h3>
                <p className="text-xs text-[#777F79] max-w-md mx-auto">
                  Thank you! In this demonstration prototype, form submissions are handled locally.
                  Our partnership team will be delighted to connect during live discovery.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#28332F] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      defaultValue="Lars Östlund"
                      className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#28332F] mb-1">Company / Organization</label>
                    <input
                      type="text"
                      required
                      defaultValue="Scania CV AB"
                      className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#28332F] mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    defaultValue="lars.ostlund@scania.example"
                    className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#28332F] mb-1">Inquiry Details</label>
                  <textarea
                    rows={4}
                    defaultValue="We are exploring verification integration for 80+ seasonal electrical and automation contractors in Södertälje."
                    className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Send Inquiry (Demo Mode)
                </Button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E5E5DD] space-y-4 text-xs">
              <h4 className="text-sm font-bold text-[#28332F]">Nordic Operations Headquarters</h4>
              <p className="flex items-center gap-2 text-[#777F79]">
                <MapPin className="w-4 h-4 text-[#356653] shrink-0" />
                <span>Kungsbroplan 1, 111 22 Stockholm, Sweden</span>
              </p>
              <p className="flex items-center gap-2 text-[#777F79]">
                <Mail className="w-4 h-4 text-[#356653] shrink-0" />
                <span>contact@verity-demo.se</span>
              </p>
              <p className="flex items-center gap-2 text-[#777F79]">
                <Phone className="w-4 h-4 text-[#356653] shrink-0" />
                <span>+46 (0)8 555 019 20 (Illustrative)</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
