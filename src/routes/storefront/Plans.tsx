import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLANS, PLAN_FEATURE_MATRIX, PlanTier } from '../../config/plans';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { PlanCard } from '../../components/site/PlanCard';
import { Button } from '../../components/ui/Button';
import { ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const [cadence, setCadence] = useState<'monthly' | 'quarterly'>('monthly');
  const [matrixOpen, setMatrixOpen] = useState(false);

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
    <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-8 py-16 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
          Transparent Subscription Tiers
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1F2421] font-normal tracking-tight">
          Plans that scale with your volume.
        </h1>
        <p className="text-base text-[#4A524D] leading-relaxed">
          Pick a monthly allowance. Change or pause it at any time. Every tier includes our
          sandbox-verified reliability safeguards.
        </p>

        {/* Cadence switch */}
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

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cadence={cadence}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      {/* Compare feature matrix accordion */}
      <div className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-md overflow-hidden mt-6 shadow-1">
        <button
          type="button"
          onClick={() => setMatrixOpen(!matrixOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FBFAF7] transition-colors"
        >
          <div>
            <h3 className="font-display text-lg text-[#1F2421] font-medium">
              Compare Full Feature Matrix
            </h3>
            <p className="text-xs text-[#7A817B]">
              Side-by-side comparison of API limits, retry intervals, and support channels
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#4A524D] transition-transform duration-200 ${
              matrixOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {matrixOpen && (
          <div className="px-6 pb-6 pt-2 border-t border-[#E3DED5] overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-[#E3DED5] text-[#7A817B] font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Capability</th>
                  <th className="py-3 px-3">Starter</th>
                  <th className="py-3 px-3 font-semibold text-[#24473B]">Growth</th>
                  <th className="py-3 px-3">Scale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED5]">
                {PLAN_FEATURE_MATRIX.map((row) => (
                  <tr key={row.name} className="hover:bg-[#FBFAF7]">
                    <td className="py-3 px-3 font-medium text-[#1F2421]">{row.name}</td>
                    <td className="py-3 px-3 text-[#4A524D]">{row.starter}</td>
                    <td className="py-3 px-3 font-semibold text-[#24473B] bg-[#E4ECE7]/30">
                      {row.growth}
                    </td>
                    <td className="py-3 px-3 text-[#4A524D]">{row.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-6 bg-[#EFEBE4] border border-[#E3DED5] rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A524D]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#2F7D57] shrink-0" />
          <span>
            <strong>Zero lock-in guarantee:</strong> Upgrade, downgrade, or cancel directly from your
            account portal. All webhook payloads and customer sheets remain your property.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app')}
          className="whitespace-nowrap"
        >
          Test in sandbox first
        </Button>
      </div>
    </div>
  );
};
