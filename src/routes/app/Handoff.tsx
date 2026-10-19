import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Accordion } from '../../components/ui/Accordion';
import {
  Play,
  BookOpen,
  ShieldCheck,
  Lock,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { BRAND } from '../../config/brand.config';

export const Handoff: React.FC = () => {
  const navigate = useNavigate();
  const setInjectedFailure = useStore((s) => s.setInjectedFailure);

  const [activeChapter, setActiveChapter] = useState(1);
  const [isPlayingLoom, setIsPlayingLoom] = useState(false);

  const chapters = [
    {
      id: 1,
      title: '1. Architecture & Pipeline Overview',
      duration: '02:40',
      desc: 'High-level walkthrough of the Shopify storefront, Tally form redirect, and Google Sheets parameter database.',
      transcript: 'In this chapter, we trace the full lifecycle of an order from Shopify to the customer master sheet...',
      targetRoute: '/app/pipeline',
    },
    {
      id: 2,
      title: '2. Reading a Live Make.com Run',
      duration: '03:15',
      desc: 'How to monitor scenario execution, inspect active node counts, and read live bundle execution logs.',
      transcript: 'When the scenario triggers, each module processes incoming records. You can see node counters increment...',
      targetRoute: '/app/pipeline',
    },
    {
      id: 3,
      title: '3. Isolating & Fixing a Validation Error',
      duration: '04:05',
      desc: 'Step-by-step resolution of postal code errors and duplicate key collisions without re-running the full file.',
      transcript: 'Notice row 7 was caught by the Break router. We open the Error Log drawer, apply the 5-digit ZIP, and click retry...',
      targetRoute: '/app/errors',
    },
    {
      id: 4,
      title: '4. Adding a New Customer Profile',
      duration: '02:20',
      desc: 'How new Tally submissions append cleanly to Google Sheets and auto-assign unique Account IDs.',
      transcript: 'Every new onboarding submission creates a row at the top of Customer Parameters with all return address details...',
      targetRoute: '/app/data',
    },
    {
      id: 5,
      title: '5. Running Sandbox Verification',
      duration: '01:50',
      desc: 'Running the pre-flight verification checklist to confirm 0 unhandled errors before scheduled runs.',
      transcript: 'Before handing off to the ops team, we trigger the automated 8-step verification runner...',
      targetRoute: '/app/test',
    },
  ];

  const runbookItems = [
    {
      id: 'rb-1',
      title: 'A row failed validation (Missing ZIP / Invalid format)',
      content: (
        <div className="flex flex-col gap-2">
          <ol className="list-decimal pl-4 space-y-1 text-xs text-[#4A524D]">
            <li>Open the <strong>Errors</strong> screen in the Control Room.</li>
            <li>Select the failing row to view the original values and suggested correction.</li>
            <li>Input the verified postal code (e.g. 5-digit US ZIP) in the remediation input.</li>
            <li>Click <strong>Apply Fix & Retry Bundle</strong>. The Break queue will immediately dispatch the row to the API.</li>
          </ol>
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setInjectedFailure('bad_postcode');
                navigate('/app/errors');
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Try it in the demo (Jump to Errors)
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'rb-2',
      title: 'Upstream Fulfillment API returned HTTP 500 / 502',
      content: (
        <div className="flex flex-col gap-2">
          <ol className="list-decimal pl-4 space-y-1 text-xs text-[#4A524D]">
            <li>The Make.com <strong>Break directive</strong> automatically activates on 5xx status codes.</li>
            <li>The bundle is held in Incomplete Executions and automatically retries 3 times at 5-minute intervals.</li>
            <li>If all 3 attempts fail, an urgent email alert is dispatched to ops@quillfold-demo.com.</li>
            <li>Once the upstream service recovers, click <strong>Re-run failed only</strong> in the Runs screen.</li>
          </ol>
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setInjectedFailure('api_500');
                navigate('/app/pipeline');
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Try it in the demo (Inject API 500)
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'rb-3',
      title: 'Make.com scenario is paused or rate-limited',
      content: (
        <div className="flex flex-col gap-2">
          <ol className="list-decimal pl-4 space-y-1 text-xs text-[#4A524D]">
            <li>Check the <strong>Scenario Health</strong> indicator on the Overview dashboard.</li>
            <li>Verify Google Drive OAuth token expiration and Google Sheets service account credentials.</li>
            <li>Check the Make.com operations usage against your monthly tier quota.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'rb-4',
      title: 'A new customer onboards with custom branding requirements',
      content: (
        <div className="flex flex-col gap-2">
          <ol className="list-decimal pl-4 space-y-1 text-xs text-[#4A524D]">
            <li>Customer completes the post-purchase Tally onboarding form.</li>
            <li>Parameters automatically populate in Google Sheets Customer Parameters.</li>
            <li>Sender return addresses and attribute flags (Logo, Personalize) are automatically bound to outgoing payloads.</li>
          </ol>
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/onboarding')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Try it in the demo (Launch Onboarding)
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'rb-5',
      title: 'Rotating sandbox API keys & security credentials',
      content: (
        <div className="flex flex-col gap-2">
          <ol className="list-decimal pl-4 space-y-1 text-xs text-[#4A524D]">
            <li>Generate new sandbox key in your upstream fulfillment portal.</li>
            <li>Update Make.com HTTP module connection with the new Bearer token.</li>
            <li>Run a single test in the Sandbox Verification runner to confirm 201 Created.</li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-[#1F2421] font-medium">
          Handoff Runbook, Maintenance & Retainer
        </h1>
        <p className="text-xs text-[#7A817B] font-mono mt-0.5">
          Everything your operations team needs to maintain, monitor, and troubleshoot the pipeline independently
        </p>
      </div>

      {/* Loom Walkthrough Video Card per PRD §10.9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (7 cols): Video Screen Placeholder */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md overflow-hidden shadow-1 flex flex-col">
          <div className="relative aspect-video bg-[#1F2421] flex items-center justify-center text-[#F6F3EE] p-6 text-center">
            {!isPlayingLoom ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingLoom(true)}
                  className="w-16 h-16 rounded-full bg-[#24473B] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-2 border border-[#325A4C]"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
                <div className="font-display text-lg">Interactive Loom Walkthrough</div>
                <p className="text-xs text-[#C5D5CC] max-w-sm">
                  Click to play simulated video chapter: {chapters[activeChapter - 1].title}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="text-sm font-mono text-[#7BD4A8]">
                  PLAYING CHAPTER {activeChapter}: {chapters[activeChapter - 1].title}
                </div>
                <p className="text-xs text-[#E4ECE7] max-w-md">
                  "{chapters[activeChapter - 1].transcript}"
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlayingLoom(false)}
                  className="text-white border-white/40 hover:bg-white/10"
                >
                  Pause Video
                </Button>
              </div>
            )}

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#A3B8AD]">
              Recorded in 1080p · Loom Walkthrough Companion
            </div>
          </div>

          <div className="p-4 bg-[#FBFAF7] border-t border-[#E3DED5] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1F2421]">
              Current Chapter: {chapters[activeChapter - 1].title}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(chapters[activeChapter - 1].targetRoute)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Show in pipeline
            </Button>
          </div>
        </div>

        {/* Right (5 cols): Chapter List */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3DED5]">
            <span className="font-mono text-xs uppercase text-[#7A817B] font-semibold">
              Video Chapters
            </span>
            <span className="text-xs font-mono text-[#7A817B]">14:10 Total</span>
          </div>

          <div className="flex flex-col gap-2">
            {chapters.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setActiveChapter(ch.id);
                    setIsPlayingLoom(true);
                  }}
                  className={`p-3 text-left rounded-sm border transition-colors flex flex-col gap-1 text-xs ${
                    isActive
                      ? 'bg-[#E4ECE7] border-[#24473B] font-medium'
                      : 'bg-[#FBFAF7] border-[#E3DED5] hover:bg-[#EFEBE4]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1F2421]">{ch.title}</span>
                    <span className="font-mono text-[#7A817B]">{ch.duration}</span>
                  </div>
                  <p className="text-[11px] text-[#4A524D] line-clamp-2">{ch.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Maintenance Runbook Accordion per PRD §10.9 */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 sm:p-8 shadow-1 flex flex-col gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
            Standard Operating Procedures
          </span>
          <h2 className="font-display text-xl text-[#1F2421] font-medium mt-1">
            Maintenance Runbook & Troubleshooting Playbooks
          </h2>
          <p className="text-xs text-[#7A817B]">
            Clear, step-by-step resolution guides for every edge case your ops team might encounter.
          </p>
        </div>

        <div className="pt-2">
          <Accordion items={runbookItems} defaultOpenId="rb-1" />
        </div>
      </div>

      {/* Retainer Panel & 30-Day Health Strip per PRD §10.9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Retainer Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5]">
            <h3 className="font-display text-lg text-[#1F2421] font-medium">
              Monthly Retainer Status
            </h3>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-xs bg-[#E1F0E8] text-[#2F7D57] font-semibold">
              ACTIVE RETAINER · 99.8% UPTIME
            </span>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {/* 30-day health strip: 30 small bars, 1 red day per PRD §10.9 */}
            <div>
              <div className="flex justify-between items-center text-[#7A817B] font-mono text-[11px] mb-1.5">
                <span>30-DAY SCENARIO EXECUTION HEALTH</span>
                <span>1 incident resolved (Day 18)</span>
              </div>
              <div className="flex items-center gap-1 h-6">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    title={`Day ${i + 1}: ${i === 17 ? 'API 503 incident (auto-retried)' : 'Clean execution'}`}
                    className={`flex-1 h-full rounded-xs transition-colors ${
                      i === 17 ? 'bg-[#B23A3A]' : 'bg-[#2F7D57] hover:bg-[#24473B]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Change log */}
            <div className="pt-3 border-t border-[#E3DED5] flex flex-col gap-1.5">
              <span className="font-mono uppercase text-[10px] text-[#7A817B] font-semibold">
                Recent Pipeline Updates
              </span>
              <div className="p-2.5 bg-[#FBFAF7] rounded-xs border border-[#E3DED5] text-xs">
                <span className="font-mono font-bold text-[#24473B]">Oct 12: </span>
                <span>Added multi-country postal code regex validation for Canada (CA).</span>
              </div>
              <div className="p-2.5 bg-[#FBFAF7] rounded-xs border border-[#E3DED5] text-xs">
                <span className="font-mono font-bold text-[#24473B]">Sep 28: </span>
                <span>Configured Break directive 3x automated retry with 5-minute backoff.</span>
              </div>
            </div>

            {/* Minor updates queue */}
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="font-mono uppercase text-[10px] text-[#7A817B] font-semibold">
                Minor Updates Queue (3 items)
              </span>
              <div className="flex justify-between items-center p-2 bg-[#FBFAF7] rounded-xs border border-[#E3DED5]">
                <span>E.164 phone normalization module</span>
                <span className="font-mono text-[10px] text-[#B7791F] bg-[#F8EBD2] px-1.5 py-0.2 rounded-xs">Scheduled</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#FBFAF7] rounded-xs border border-[#E3DED5]">
                <span>Automated weekly digest email to client owner</span>
                <span className="font-mono text-[10px] text-[#2F7D57] bg-[#E1F0E8] px-1.5 py-0.2 rounded-xs">In Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Card (5 cols) per PRD §10.9 */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E3DED5]">
            <ShieldCheck className="w-5 h-5 text-[#2F7D57]" />
            <h3 className="font-display text-lg text-[#1F2421] font-medium">
              Security & Access Protocol
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-1">
              <span className="text-[#7A817B] font-mono text-[10px]">ENVIRONMENT KEYS</span>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[#1F2421]">{BRAND.maskedApiKey}</span>
                <span
                  title="Keys are never shown in the UI"
                  className="font-mono text-[10px] text-[#7A817B] bg-[#EFEBE4] px-2 py-0.5 rounded-xs cursor-not-allowed"
                >
                  Reveal Disabled
                </span>
              </div>
              <p className="text-[10px] text-[#7A817B] mt-1">
                Keys are never rendered in client code; stored securely in Make.com encrypted secrets.
              </p>
            </div>

            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-1">
              <span className="text-[#7A817B] font-mono text-[10px]">ACCESS DELEGATION</span>
              <div className="font-semibold text-[#1F2421]">Shopify Collaborator Access</div>
              <p className="text-[10px] text-[#4A524D] mt-0.5">
                Staff member accounts are avoided. Scoped permissions granted exclusively via Collaborator code.
              </p>
            </div>

            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-1">
              <span className="text-[#7A817B] font-mono text-[10px]">LEGAL SAFEGUARDS</span>
              <div className="font-semibold text-[#1F2421]">Mutual NDA Compliance</div>
              <p className="text-[10px] text-[#4A524D] mt-0.5">
                Strict confidentiality process observed before accessing staging or live client data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
