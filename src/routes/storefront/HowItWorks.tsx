import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ShoppingBag, ClipboardList, Table2, Workflow, Server, ShieldAlert } from 'lucide-react';
import { StoryPinned } from '../../components/site/StoryPinned';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const architectureNodes = [
    {
      step: '01',
      title: 'Shopify Checkout',
      icon: ShoppingBag,
      role: 'Buyer entry point',
      detail: 'Recurring B2B subscriptions via Shopify native subscriptions or Recharge/Appstle integration. Mints unique Order #.',
    },
    {
      step: '02',
      title: 'Tally Onboarding',
      icon: ClipboardList,
      role: 'Post-purchase redirect',
      detail: 'Custom branded multi-step form capturing company legal name, sender address profile, and recipient CSV drive links.',
    },
    {
      step: '03',
      title: 'Google Sheets Storage',
      icon: Table2,
      role: 'Customer parameters DB',
      detail: 'Master spreadsheet storing account profiles, sender addresses, and validation status per account.',
    },
    {
      step: '04',
      title: 'Make.com Scenario',
      icon: Workflow,
      role: 'Data parser & router',
      detail: 'Fetches CSV from Drive, iterates rows, validates postcodes, merges sender return addresses, and dispatches HTTP requests.',
    },
    {
      step: '05',
      title: 'REST API Delivery',
      icon: Server,
      role: 'Downstream fulfillment',
      detail: 'Delivers unified JSON payload with sender, recipient, and dynamic customer attributes. 201 Created acknowledgment.',
    },
    {
      step: '06',
      title: 'Break & Error Router',
      icon: ShieldAlert,
      role: 'Safeguard & alerting',
      detail: 'Incomplete executions diverted to Break directive. Diagnostic row logged and immediate email sent to ops team.',
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-8 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
          System Architecture
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1F2421] font-normal leading-tight">
          How the Quillfold pipeline works.
        </h1>
        <p className="text-base text-[#4A524D] leading-relaxed">
          From the moment a business customer clicks subscribe to the final REST API fulfillment confirmation,
          every transition is validated, logged, and inspectable.
        </p>
      </div>

      {/* Grid of the 6 core architectural stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {architectureNodes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.step}
              className="p-6 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col justify-between gap-4 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-sm bg-[#E4ECE7] text-[#24473B] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-[#7A817B]">
                    STAGE {node.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#1F2421] font-medium">
                    {node.title}
                  </h3>
                  <div className="text-xs font-mono uppercase text-[#B5654A] font-semibold mt-0.5">
                    {node.role}
                  </div>
                </div>
                <p className="text-sm text-[#4A524D] leading-relaxed">
                  {node.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E3DED5] text-xs font-mono text-[#7A817B]">
                Sandbox verified
              </div>
            </div>
          );
        })}
      </div>

      {/* Story pinned interactive section */}
      <StoryPinned />

      {/* Bottom CTA to see it in action */}
      <div className="p-8 sm:p-12 bg-[#FBFAF7] border border-[#CFC8BB] rounded-md text-center flex flex-col items-center gap-6 shadow-1">
        <h2 className="font-display text-3xl text-[#1F2421] font-normal">
          Ready to test the scenario canvas?
        </h2>
        <p className="text-sm text-[#4A524D] max-w-xl">
          You can inject simulated failures, view real-time node counters, inspect JSON payloads, and test
          automated retry directives directly in the Control Room.
        </p>
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/app/pipeline')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Launch Scenario Canvas
          </Button>
          <Link
            to="/plans"
            className="text-sm font-semibold text-[#24473B] underline underline-offset-4"
          >
            Review Subscription Plans
          </Link>
        </div>
      </div>
    </div>
  );
};
