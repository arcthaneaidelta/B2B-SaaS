import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, Layers, Terminal } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { PLANS, PlanTier } from '../../config/plans';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { PipelineStrip } from '../../components/site/PipelineStrip';
import { StoryPinned } from '../../components/site/StoryPinned';
import { PlanCard } from '../../components/site/PlanCard';
import { MessyRowValidator } from '../../components/site/MessyRowValidator';
import { FAQ } from '../../components/site/FAQ';
import { useStore } from '../../store/useStore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const [cadence, setCadence] = useState<'monthly' | 'quarterly'>('monthly');

  const handleSelectPlan = (plan: PlanTier) => {
    const price = cadence === 'monthly' ? plan.monthlyPrice : plan.quarterlyMonthlyEquivalent;
    addToCart({
      id: `cart-${plan.id}`,
      planId: plan.id,
      planName: plan.name,
      cadence,
      price,
      seats: 1,
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-[1200px] px-6 sm:px-8 pt-12 pb-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E4ECE7] text-[#24473B] rounded-xs text-xs font-mono font-semibold uppercase tracking-wider">
              <span>{BRAND.tagline}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#1F2421] font-normal leading-[1.06] tracking-tight">
              {BRAND.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-[#4A524D] leading-relaxed max-w-xl">
              {BRAND.heroSub}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/plans')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Choose a plan
              </Button>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#46617A] hover:text-[#24473B] transition-colors py-2 px-3 hover:underline underline-offset-4"
              >
                <span>See the pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust line */}
            <div className="pt-4 border-t border-[#E3DED5] flex items-center gap-2 text-xs font-mono text-[#7A817B]">
              <ShieldCheck className="w-4 h-4 text-[#2F7D57]" />
              <span>{BRAND.trustLine}</span>
            </div>
          </div>

          {/* Right Column (6 cols): Live Pipeline Strip */}
          <div className="lg:col-span-6 w-full">
            <PipelineStrip />
          </div>
        </div>

        {/* Scroll cue per PRD §8.1 */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#7A817B] pt-8">
          <span>SCROLL</span>
          <div className="w-[1px] h-6 bg-[#CFC8BB] relative overflow-hidden">
            <div className="w-full h-2 bg-[#24473B] animate-bounce" />
          </div>
        </div>
      </section>

      {/* Proof Strip Section */}
      <section className="w-full bg-[#EFEBE4] border-y border-[#E3DED5] py-8">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl sm:text-3xl text-[#2F7D57] font-medium">
              0 errors
            </span>
            <span className="text-xs text-[#4A524D]">in sandbox verification</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl sm:text-3xl text-[#1F2421] font-medium">
              3 plan tiers
            </span>
            <span className="text-xs text-[#4A524D]">monthly or quarterly</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl sm:text-3xl text-[#1F2421] font-medium">
              5 connected apps
            </span>
            <span className="text-xs text-[#4A524D]">Shopify · Tally · Sheets · Make · API</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl sm:text-3xl text-[#B5654A] font-medium">
              100% logged
            </span>
            <span className="text-xs text-[#4A524D]">every failure caught & alerted</span>
          </div>
        </div>
      </section>

      {/* How it works pinned story */}
      <div className="w-full max-w-[1200px] px-6 sm:px-8">
        <StoryPinned />
      </div>

      {/* Plans Preview Section */}
      <section className="w-full max-w-[1200px] px-6 sm:px-8 py-20 border-t border-[#E3DED5]">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
            Predictable B2B Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1F2421] font-normal">
            Plans that scale with your volume.
          </h2>
          <p className="text-sm text-[#4A524D] max-w-md">
            Pick a monthly record allowance. Pause, scale up, or change cadence whenever you need.
          </p>

          <div className="pt-2">
            <SegmentedControl
              options={[
                { id: 'monthly', label: 'Monthly' },
                { id: 'quarterly', label: 'Quarterly', badge: 'Save 10%' },
              ]}
              value={cadence}
              onChange={(val) => setCadence(val as 'monthly' | 'quarterly')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cadence={cadence}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            to="/plans"
            className="text-sm font-semibold text-[#24473B] underline underline-offset-4 hover:text-[#1B382F]"
          >
            Compare full feature matrix & specifications →
          </Link>
        </div>
      </section>

      {/* Built for Clean Data Section (Messy row validator) */}
      <section className="w-full bg-[#FBFAF7] border-y border-[#E3DED5] py-20">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
              Data Integrity Safeguards
            </span>
            <h2 className="font-display text-3xl text-[#1F2421] font-normal leading-tight">
              Built for messy real-world CSV imports.
            </h2>
            <p className="text-sm text-[#4A524D] leading-relaxed">
              When client spreadsheets have missing ZIP codes, malformed headers, or duplicate rows,
              our pipeline doesn’t silently halt. It validates before HTTP dispatch, routes issues to
              an isolated Break queue, and triggers alerts immediately.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-[#1F2421] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F7D57]" />
                <span>Multi-country postal code regex validation (US / UK / CA)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F7D57]" />
                <span>Account ID cross-reference to eliminate orphan rows</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F7D57]" />
                <span>Make.com Break module auto-retry (3x attempts, 5m intervals)</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <MessyRowValidator />
          </div>
        </div>
      </section>

      {/* Control Room Teaser */}
      <section className="w-full max-w-[1200px] px-6 sm:px-8 py-20 text-center flex flex-col items-center gap-6">
        <div className="max-w-2xl flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#24473B] font-semibold">
            Full Operations Visibility
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1F2421] font-normal">
            Step inside the Control Room.
          </h2>
          <p className="text-sm text-[#4A524D]">
            Inspect live Make.com scenario modules, witness CSV key merging in action, inspect REST
            payloads, and test failure drills in our sandbox environment.
          </p>
        </div>

        <div className="w-full max-w-4xl p-6 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-2 text-left flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#4A524D]">
              <Terminal className="w-4 h-4 text-[#24473B]" />
              <span>quillfold-ops-console // sandbox-v1</span>
            </div>
            <span className="px-2 py-0.5 rounded-xs bg-[#E1F0E8] text-[#2F7D57] font-mono text-xs">
              HEALTHY · 0 UNHANDLED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <div className="text-[#7A817B]">Active Accounts</div>
              <div className="text-base font-semibold text-[#1F2421]">14 profiles</div>
            </div>
            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <div className="text-[#7A817B]">Last Run</div>
              <div className="text-base font-semibold text-[#2F7D57]">42s (Clean)</div>
            </div>
            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <div className="text-[#7A817B]">Incomplete Queue</div>
              <div className="text-base font-semibold text-[#B7791F]">1 pending fix</div>
            </div>
            <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
              <div className="text-[#7A817B]">Sandbox SLA</div>
              <div className="text-base font-semibold text-[#1F2421]">99.8%</div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/app')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Open the Control Room
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="w-full max-w-[1200px] px-6 sm:px-8">
        <FAQ />
      </div>
    </div>
  );
};
