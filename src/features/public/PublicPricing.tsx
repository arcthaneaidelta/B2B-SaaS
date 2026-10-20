import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useDemo } from '../../state/demo-store';
import { SUBSCRIPTION_PLANS, INTEGRATION_SLOTS } from '../../data/seed-subscriptions';
import { Check, ShieldCheck, ArrowRight, Sparkles, Building2, HelpCircle } from 'lucide-react';

export const PublicPricing: React.FC = () => {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: 'starter' | 'growth' | 'enterprise') => {
    dispatch({ type: 'UPDATE_SUBSCRIPTION_PLAN', payload: planId });
    navigate('/app/employer/billing');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      <Navbar />

      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Pricing · Illustrative commercial terms</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#28332F] tracking-tight">
              Predictable pricing for verified hiring
            </h1>
            <p className="text-sm sm:text-base text-[#777F79] leading-relaxed">
              Transparent tiers for Nordic manufacturers, utilities, and engineering contractors.
              No hidden placement commissions on direct hires.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-3 bg-white p-1 rounded-xl border border-[#E5E5DD] shadow-xs mt-4">
              <button
                onClick={() => { if (state.isAnnualBilling) dispatch({ type: 'TOGGLE_ANNUAL_BILLING' }); }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  !state.isAnnualBilling
                    ? 'bg-[#24483D] text-white shadow-xs'
                    : 'text-[#777F79] hover:text-[#28332F]'
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => { if (!state.isAnnualBilling) dispatch({ type: 'TOGGLE_ANNUAL_BILLING' }); }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  state.isAnnualBilling
                    ? 'bg-[#24483D] text-white shadow-xs'
                    : 'text-[#777F79] hover:text-[#28332F]'
                }`}
              >
                <span>Annual billing</span>
                <span className="text-[10px] bg-[#E7EEE7] text-[#24483D] font-bold px-1.5 py-0.2 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
            {SUBSCRIPTION_PLANS.map(plan => {
              const isCurrent = state.currentPlanId === plan.id;
              const price = state.isAnnualBilling ? plan.priceAnnualSEK : plan.priceMonthlySEK;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-7 border flex flex-col justify-between transition-all duration-200 relative ${
                    plan.popular
                      ? 'border-[#24483D] shadow-lg ring-1 ring-[#24483D]/20'
                      : 'border-[#E5E5DD] shadow-xs hover:border-[#D5D5CB]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#24483D] text-[#E7EEE7] text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                      Most Selected Plan
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#28332F]">{plan.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#E7EEE7] text-[#24483D] rounded-full">
                            Active in demo
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-bold text-[#24483D]">
                          {price.toLocaleString()}
                        </span>
                        <span className="text-xs font-medium text-[#777F79]">SEK / month</span>
                      </div>
                      <p className="text-xs text-[#777F79] mt-1">
                        {state.isAnnualBilling ? 'Billed annually in SEK' : 'Billed monthly, cancel anytime'}
                      </p>
                    </div>

                    {/* Quota Highlights */}
                    <div className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl p-3 text-xs space-y-1.5">
                      <div className="flex justify-between text-[#28332F]">
                        <span className="text-[#777F79]">Active requirements:</span>
                        <span className="font-semibold">{plan.activeRequirementLimit} roles</span>
                      </div>
                      <div className="flex justify-between text-[#28332F]">
                        <span className="text-[#777F79]">Verified contact unlocks:</span>
                        <span className="font-semibold">{plan.contactQuotaMonthly} / mo</span>
                      </div>
                      <div className="flex justify-between text-[#28332F]">
                        <span className="text-[#777F79]">Team seats:</span>
                        <span className="font-semibold">{plan.seatLimit} users</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#777F79]">
                        Included Capabilities
                      </p>
                      <ul className="space-y-2 text-xs">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#28332F]">
                            <Check className="w-3.5 h-3.5 text-[#24483D] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E5E5DD] mt-6">
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {isCurrent ? 'Manage Plan in Workspace' : `Select ${plan.name} (Simulate)`}
                    </Button>
                    <p className="text-[10px] text-center text-[#777F79] mt-2">
                      Instant demo activation · No credit card required
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Provider Readiness Slots */}
          <div className="bg-white border border-[#E5E5DD] rounded-2xl p-8 shadow-xs">
            <div className="max-w-2xl mb-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[#356653]">
                Infrastructure & Integrations
              </span>
              <h3 className="text-xl font-bold text-[#28332F] mt-1">Enterprise Provider Readiness</h3>
              <p className="text-xs text-[#777F79] mt-1">
                VERITY connects with Swedish e-ID, e-signing, and accounting platforms. All integration slots below are pre-architected for direct production API wiring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INTEGRATION_SLOTS.map(slot => (
                <div key={slot.id} className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#28332F]">{slot.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532]">
                      {slot.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#777F79] leading-relaxed">{slot.description}</p>
                  <p className="text-[11px] text-[#356653] font-medium pt-1">Provider: {slot.provider}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
