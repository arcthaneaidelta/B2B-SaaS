import React, { useState } from 'react';
import { ShoppingBag, ClipboardList, Table2, Send, Check } from 'lucide-react';

interface StoryStep {
  id: number;
  label: string;
  title: string;
  description: string;
  badge: string;
  snippet: React.ReactNode;
}

export const StoryPinned: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: StoryStep[] = [
    {
      id: 0,
      label: 'Step 01',
      title: 'Subscribe on Shopify Storefront',
      badge: 'Shopify Subscription',
      description:
        'Buyer selects their volume tier (Starter, Growth, or Scale) and completes checkout. An order number is minted (e.g. QF-20481) and passed seamlessly to onboarding.',
      snippet: (
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col gap-3 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3DED5]">
            <span className="font-mono text-xs uppercase text-[#B5654A] font-semibold">
              Checkout Confirmation
            </span>
            <span className="font-mono text-xs text-[#2F7D57] bg-[#E1F0E8] px-2 py-0.5 rounded-xs">
              Order #QF-20481
            </span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-sm bg-[#E4ECE7] flex items-center justify-center text-[#24473B]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1F2421]">Growth Tier Subscription</div>
              <div className="text-xs text-[#7A817B]">500 records/mo · Billed monthly</div>
            </div>
          </div>
          <div className="p-3 bg-[#FBFAF7] rounded-sm border border-[#E3DED5] text-xs text-[#4A524D]">
            ✓ Payment tokenized · Redirect trigger armed
          </div>
        </div>
      ),
    },
    {
      id: 1,
      label: 'Step 02',
      title: 'Tally Onboarding & Parameter Sync',
      badge: 'Tally Form → Sheets',
      description:
        'A 5-step form captures sender profiles, address standards, and Google Drive links. On submit, parameters land in Google Sheets as an active customer record.',
      snippet: (
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col gap-3 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3DED5]">
            <span className="font-mono text-xs uppercase text-[#46617A] font-semibold">
              Tally Submission
            </span>
            <span className="font-mono text-xs text-[#4A524D]">Account: ACCT-0417</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <span className="text-[#7A817B]">Company:</span>
              <span className="font-medium text-[#1F2421]">Northgate Dental</span>
            </div>
            <div className="flex justify-between p-2 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <span className="text-[#7A817B]">Sender:</span>
              <span className="font-medium text-[#1F2421]">Priya Raman (Practice Manager)</span>
            </div>
            <div className="flex justify-between p-2 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <span className="text-[#7A817B]">Drive Link:</span>
              <span className="font-mono text-[#24473B]">drive.google.com/recipients.csv</span>
            </div>
          </div>
          <div className="text-xs text-[#2F7D57] flex items-center gap-1 font-medium pt-1">
            <Check className="w-4 h-4" /> Row appended to Customer Parameters Sheet
          </div>
        </div>
      ),
    },
    {
      id: 2,
      label: 'Step 03',
      title: 'Unique Key CSV Merge & Validation',
      badge: 'Account ID Matching',
      description:
        'The engine matches incoming CSV recipient rows to customer sender profiles on Account ID. Missing postcodes, duplicate rows, and orphan keys are flagged.',
      snippet: (
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col gap-3 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3DED5]">
            <span className="font-mono text-xs uppercase text-[#24473B] font-semibold">
              Merge Visualizer Output
            </span>
            <span className="font-mono text-xs bg-[#E4ECE7] text-[#24473B] px-2 py-0.5 rounded-xs">
              21 / 24 Clean
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-2">
            <div className="p-2 bg-[#E1F0E8] text-[#2F7D57] rounded-xs font-semibold">
              21 Merged
            </div>
            <div className="p-2 bg-[#F8EBD2] text-[#B7791F] rounded-xs font-semibold">
              2 Orphaned
            </div>
            <div className="p-2 bg-[#F7E0DE] text-[#B23A3A] rounded-xs font-semibold">
              1 Duplicate
            </div>
          </div>
          <div className="p-2 bg-[#FBFAF7] rounded-xs border border-[#E3DED5] text-xs text-[#7A817B] font-mono">
            Key: [Account ID + Recipient Full Name]
          </div>
        </div>
      ),
    },
    {
      id: 3,
      label: 'Step 04',
      title: 'Make.com Scenario & REST API Delivery',
      badge: 'HTTP POST & Break Routes',
      description:
        'Valid bundles are mapped to sender/recipient REST payloads and delivered to the sandbox API (201 Created). Failures divert to Break and trigger email alerts.',
      snippet: (
        <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col gap-3 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3DED5]">
            <span className="font-mono text-xs uppercase text-[#2F7D57] font-semibold">
              Sandbox Endpoint Delivery
            </span>
            <span className="font-mono text-xs text-[#2F7D57]">HTTP 201 Created</span>
          </div>
          <pre className="p-3 bg-[#EFEBE4] rounded-xs text-[11px] font-mono text-[#1F2421] overflow-x-auto leading-relaxed">
{`{
  "request_id": "req_8H2K1Q",
  "status": "ACCEPTED",
  "sender": "Priya Raman",
  "recipient": "Daniel Ortiz",
  "route": "standard_delivery"
}`}
          </pre>
          <div className="flex items-center justify-between text-xs text-[#7A817B]">
            <span>Break module: 3 retries</span>
            <span className="text-[#2F7D57] font-medium">Alerts: ops@quillfold-demo.com</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left pinned column on desktop */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
              The Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1F2421] font-normal mt-2 leading-tight">
              Four steps. Zero blind spots.
            </h2>
            <p className="text-base text-[#4A524D] mt-3 leading-relaxed">
              Every stage is observable: from the customer-facing Shopify storefront to the final API payload receipt.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 text-left rounded-sm transition-all duration-150 border flex items-center justify-between ${
                  activeStep === idx
                    ? 'bg-[#FFFFFF] border-[#24473B] shadow-1'
                    : 'bg-transparent border-transparent hover:bg-[#EFEBE4]'
                }`}
              >
                <div>
                  <div className="text-xs font-mono text-[#7A817B]">{s.label}</div>
                  <div className="text-sm font-semibold text-[#1F2421]">{s.title}</div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeStep === idx ? 'bg-[#24473B]' : 'bg-[#CFC8BB]'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Active step visual & full details */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-[#FBFAF7] border border-[#CFC8BB] rounded-md p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs px-2.5 py-1 bg-[#E4ECE7] text-[#24473B] font-semibold rounded-xs uppercase">
                {steps[activeStep].badge}
              </span>
              <span className="font-mono text-xs text-[#7A817B]">
                {steps[activeStep].label} / 04
              </span>
            </div>

            <h3 className="font-display text-2xl text-[#1F2421] font-medium">
              {steps[activeStep].title}
            </h3>

            <p className="text-sm text-[#4A524D] leading-relaxed">
              {steps[activeStep].description}
            </p>

            <div className="pt-2">{steps[activeStep].snippet}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
