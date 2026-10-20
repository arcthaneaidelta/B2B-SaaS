import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useDemo } from '../../state/demo-store';
import { DEMO_PERSONAS } from '../../data/personas';
import { PersonaRole } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  UserCheck,
  Building2,
  FileBadge,
  Sliders,
  AlertTriangle
} from 'lucide-react';

export const PublicDemoGuide: React.FC = () => {
  const { dispatch, resetDemo } = useDemo();
  const navigate = useNavigate();

  const handleLaunchPersona = (role: PersonaRole, defaultPath: string) => {
    dispatch({ type: 'SWITCH_PERSONA', payload: role });
    navigate(defaultPath);
  };

  const walkthroughSteps = [
    {
      step: '1',
      title: 'Explore Employer Workspace',
      desc: 'Start as Alex Morgan. Inspect metrics, recent verification activity, and recommended candidates.',
      actionLabel: 'Launch Employer Overview',
      role: 'employer' as PersonaRole,
      route: '/app/employer/overview'
    },
    {
      step: '2',
      title: 'Requirement Wizard & Explainable Matching',
      desc: 'Create or inspect "Industrial Electrician (Gothenburg)". Review deterministic criteria generation and 100% weight validation.',
      actionLabel: 'Run Explainable Matching',
      role: 'employer' as PersonaRole,
      route: '/app/employer/matches'
    },
    {
      step: '3',
      title: 'Inspect Candidate Evidence & Pipeline',
      desc: 'Open Erik Lindström. View verified ECY certificate and ID06 card. Add to "Gothenburg Electrical Team" shortlist and move in Kanban.',
      actionLabel: 'View Erik Lindström Dossier',
      role: 'employer' as PersonaRole,
      route: '/app/employer/candidates/cand-erik-lindstrom'
    },
    {
      step: '4',
      title: 'Switch to Verification Officer (Sofia Berg)',
      desc: 'Open verification queue. Approve a pending document or record an interview outcome. Watch status propagate live across the app!',
      actionLabel: 'Enter Verification Desk',
      role: 'verifier' as PersonaRole,
      route: '/app/verification/queue'
    },
    {
      step: '5',
      title: 'Simulate Electronic Contract Signing',
      desc: 'Review placement contract terms for candidate Erik Lindström. Execute simulated e-signature and inspect updated audit history.',
      actionLabel: 'Open Contract Management',
      role: 'employer' as PersonaRole,
      route: '/app/employer/contracts'
    },
    {
      step: '6',
      title: 'Platform Administration & Rule Calibration',
      desc: 'Switch to Robin Andersson. Modify matching weight allocations and verify that non-100% totals are blocked with validation alerts.',
      actionLabel: 'Open Matching Rules Config',
      role: 'admin' as PersonaRole,
      route: '/app/admin/matching-rules'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />

      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EEE7] border border-[#C5D9C5] text-[#24483D] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Prototype Guide</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
              VERITY Product Demonstration
            </h1>
            <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
              This frontend demonstration prototype illustrates the complete end-to-end recruitment,
              credential auditing, and explainable matching experience for the Swedish industrial market.
            </p>
          </div>

          {/* Persona Launchpad Cards */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E5DD]">
              <h2 className="text-lg font-bold text-[#28332F]">Select a Demo Persona</h2>
              <span className="text-xs text-[#777F79]">Switch anytime using top right menu</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DEMO_PERSONAS.map(p => (
                <div
                  key={p.id}
                  className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#24483D] text-[#E7EEE7] font-bold text-sm flex items-center justify-center">
                        {p.avatarInitials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#28332F]">{p.name}</h3>
                        <p className="text-xs font-medium text-[#356653]">{p.roleTitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#777F79] leading-relaxed">{p.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5DD] mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleLaunchPersona(p.id, p.defaultPath)}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                    >
                      Enter as {p.name.split(' ')[0]}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical End-to-End Walkthrough (Page 22) */}
          <div className="bg-white border border-[#E5E5DD] rounded-2xl p-8 shadow-xs">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
                Evaluator Roadmap
              </span>
              <h2 className="text-2xl font-bold text-[#28332F] mt-1">
                Critical End-to-End Walkthrough Steps
              </h2>
              <p className="text-xs text-[#777F79] mt-1">
                Follow these recommended steps to review state synchronization, matching explainability, and verification propagation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walkthroughSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-full bg-[#24483D] text-white font-bold text-xs flex items-center justify-center">
                      {step.step}
                    </div>
                    <h3 className="text-sm font-bold text-[#28332F]">{step.title}</h3>
                    <p className="text-xs text-[#777F79] leading-relaxed">{step.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleLaunchPersona(step.role, step.route)}
                  >
                    {step.actionLabel}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Boundaries & Safety Box (Page 3 & 19) */}
          <div className="bg-[#FAF3E8] border border-[#EDD9B8] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#A87532]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Demonstration Boundaries & Local Simulation Protocol</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#A87532]">
              <div className="bg-white/80 p-3.5 rounded-lg border border-[#EDD9B8]">
                <p className="font-semibold text-[#28332F] mb-1">Simulated Data & Candidates</p>
                <p className="text-[#777F79]">
                  All Swedish candidate names, certificates, employers, and IDs are synthetic test records.
                </p>
              </div>
              <div className="bg-white/80 p-3.5 rounded-lg border border-[#EDD9B8]">
                <p className="font-semibold text-[#28332F] mb-1">Simulated Integrations</p>
                <p className="text-[#777F79]">
                  BankID, ID06 registry sync, Oneflow e-signatures, and Stripe billing are simulated locally.
                </p>
              </div>
              <div className="bg-white/80 p-3.5 rounded-lg border border-[#EDD9B8]">
                <p className="font-semibold text-[#28332F] mb-1">Deterministic Matching</p>
                <p className="text-[#777F79]">
                  Matching algorithm runs deterministic client-side weighted scoring without paid external AI APIs.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#A87532]">
                Need to start fresh? Reset all simulated state with one click:
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => resetDemo()}
              >
                Reset Demo to Seed Baseline
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
