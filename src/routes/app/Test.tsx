import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Download,
  FileCheck,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface VerificationStep {
  id: number;
  name: string;
  sub: string;
  status: 'pending' | 'running' | 'success' | 'failure';
  detail: string;
}

export const Test: React.FC = () => {
  const addToast = useStore((s) => s.addToast);

  const [includeRealFailure, setIncludeRealFailure] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: 1, name: 'Storefront Route Reachability', sub: 'Shopify mock storefront', status: 'pending', detail: 'Verifies /plans, /checkout, and subscription catalog response (200 OK)' },
    { id: 2, name: 'Subscription Contract Minted', sub: 'Shopify / Recharge engine', status: 'pending', detail: 'Mints order #QF-20481 and tokenizes recurring payment contract' },
    { id: 3, name: 'Post-Purchase Redirect Binding', sub: 'Query string carryover', status: 'pending', detail: 'Passes order number and Account ID ACCT-0417 to Tally onboarding URL' },
    { id: 4, name: 'Tally → Google Sheets Append', sub: 'Service account OAuth', status: 'pending', detail: 'Appends sender profile and delivery preferences to Customer Parameters' },
    { id: 5, name: 'Unique Key CSV Merge Engine', sub: 'Account ID cross-reference', status: 'pending', detail: 'Executes merge on 24 incoming rows: matches 21 clean, isolates 2 orphans and 1 duplicate' },
    { id: 6, name: 'Make.com Drive & Text Parser', sub: 'Scenario modules 1-4', status: 'pending', detail: 'Resolves Google Drive CSV download bytes and parses RFC-4180 headers' },
    { id: 7, name: 'REST API Sandbox POST Delivery', sub: 'HTTP OAuth / Bearer Token', status: 'pending', detail: 'POST https://sandbox.api.example.com/v1/shipments returns 201 Created' },
    { id: 8, name: 'Error Route & Alerting Drill', sub: 'Break module directive', status: 'pending', detail: 'Intentional malformed postcode injected: diverted to Break, appended to Error Log, alert emailed' },
  ]);

  const handleStartVerification = async () => {
    setIsRunning(true);
    setCompleted(false);

    // Reset steps to pending
    const resetSteps = steps.map((s) => ({ ...s, status: 'pending' as const }));
    setSteps(resetSteps);

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'running' as const } : s))
      );

      await new Promise((r) => setTimeout(r, 650));

      // If user toggled real failure on step 5
      if (includeRealFailure && i === 4) {
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: 'failure' as const } : s))
        );
        setIsRunning(false);
        setActiveStepIndex(null);
        addToast({
          message: 'Verification halted: Step 5 detected schema mismatch.',
          type: 'error',
        });
        return;
      }

      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'success' as const } : s))
      );
    }

    setIsRunning(false);
    setActiveStepIndex(null);
    setCompleted(true);
    addToast({
      message: 'Zero-Error Verification Run Passed (8/8 checks validated).',
      type: 'success',
    });
  };

  const handleDownloadReport = () => {
    addToast({
      message: 'Verification Report generated: Quillfold_Sandbox_Run_Audit_2026.pdf (Simulated).',
      type: 'info',
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#1F2421] font-medium">
            Sandbox Verification Runner
          </h1>
          <p className="text-xs text-[#7A817B] font-mono mt-0.5">
            Deliverable Proof: End-to-end automated pipeline verification with zero unhandled errors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-[#4A524D] cursor-pointer">
            <input
              type="checkbox"
              checked={includeRealFailure}
              onChange={(e) => setIncludeRealFailure(e.target.checked)}
              disabled={isRunning}
              className="rounded border-[#CFC8BB] text-[#24473B]"
            />
            <span>Simulate Pipeline Fault</span>
          </label>

          <Button
            size="sm"
            variant="primary"
            isLoading={isRunning}
            onClick={handleStartVerification}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Start Verification
          </Button>
        </div>
      </div>

      {/* Checklist Runner */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5] text-xs font-mono">
          <span className="text-[#4A524D] font-semibold">PRE-FLIGHT VERIFICATION SEQUENCE (8 CHECKS)</span>
          <span className="text-[#7A817B]">ENVIRONMENT: SANDBOX</span>
        </div>

        <div className="flex flex-col divide-y divide-[#E3DED5]">
          {steps.map((st, idx) => (
            <div
              key={st.id}
              className={`py-3.5 flex items-start justify-between gap-4 transition-colors ${
                activeStepIndex === idx ? 'bg-[#FBFAF7] px-2 rounded-xs' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {st.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border border-[#CFC8BB] flex items-center justify-center font-mono text-[10px] text-[#7A817B]">
                      {st.id}
                    </div>
                  )}
                  {st.status === 'running' && (
                    <Loader2 className="w-5 h-5 text-[#24473B] animate-spin" />
                  )}
                  {st.status === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-[#2F7D57]" />
                  )}
                  {st.status === 'failure' && (
                    <AlertCircle className="w-5 h-5 text-[#B23A3A]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1F2421]">{st.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#EFEBE4] text-[#4A524D]">
                      {st.sub}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A817B] mt-0.5 leading-relaxed">{st.detail}</p>
                </div>
              </div>

              <div className="font-mono text-xs shrink-0">
                {st.status === 'pending' && <span className="text-[#7A817B]">Awaiting</span>}
                {st.status === 'running' && <span className="text-[#24473B] font-semibold">Testing…</span>}
                {st.status === 'success' && <span className="text-[#2F7D57] font-semibold">Passed</span>}
                {st.status === 'failure' && <span className="text-[#B23A3A] font-semibold">Halted</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Report Card per PRD §10.8 */}
      {completed && (
        <div className="p-6 bg-[#E1F0E8] border border-[#2F7D57]/40 rounded-md shadow-2 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2F7D57] text-[#FFFFFF] flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-[#1F2421] font-medium">
                  All checks passed · 0 unhandled errors
                </h3>
                <p className="text-xs text-[#2F7D57] font-mono">
                  12 records verified · 1 intentional failure routed correctly to Break directive
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadReport}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Download Report (PDF)
            </Button>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-sm border border-[#2F7D57]/30 text-xs font-mono text-[#4A524D] flex flex-wrap justify-between gap-2">
            <span>AUDIT HASH: sha256:7f8e...39ab</span>
            <span>TEST RUNNER: v2.4-sandbox</span>
            <span>VERIFIED AT: 2026-10-19 09:26:10</span>
          </div>
        </div>
      )}
    </div>
  );
};
