import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { PlanTier } from '../../config/plans';
import { Button } from '../ui/Button';

export interface PlanCardProps {
  plan: PlanTier;
  cadence: 'monthly' | 'quarterly';
  onSelect: (plan: PlanTier) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, cadence, onSelect }) => {
  const price = cadence === 'monthly' ? plan.monthlyPrice : plan.quarterlyMonthlyEquivalent;
  const billedInterval = cadence === 'monthly' ? '/mo' : '/mo, billed quarterly';

  return (
    <div
      className={`relative bg-[#FFFFFF] rounded-md p-8 flex flex-col justify-between transition-all duration-180 hover:-translate-y-0.5 shadow-1 ${
        plan.isPopular
          ? 'border-2 border-[#24473B]'
          : 'border border-[#CFC8BB] hover:border-[#4A524D]'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-8 px-2.5 py-0.5 rounded-xs bg-[#B5654A] text-white text-[11px] font-mono uppercase font-semibold tracking-wider">
          {plan.badge}
        </div>
      )}

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-display text-2xl font-medium text-[#1F2421]">
            {plan.name}
          </h3>
          <span className="text-xs font-mono uppercase text-[#7A817B]">
            {plan.recordsPerMonth.toLocaleString()} records/mo
          </span>
        </div>

        <p className="text-sm text-[#4A524D] min-h-[40px] mb-6 leading-relaxed">
          {plan.description}
        </p>

        {/* Pricing display */}
        <div className="mb-6 pb-6 border-b border-[#E3DED5] flex items-baseline gap-1.5">
          <span className="font-display text-4xl font-normal text-[#1F2421] transition-all duration-200">
            ${price}
          </span>
          <span className="text-xs text-[#7A817B] font-mono">
            {billedInterval}
          </span>
        </div>

        {/* Feature bullets */}
        <ul className="flex flex-col gap-3 mb-8 text-sm">
          {plan.features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-[#1F2421]">
              <Check className="w-4 h-4 text-[#2F7D57] shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2.5 pt-4 border-t border-[#E3DED5]">
        <Button
          variant={plan.isPopular ? 'primary' : 'outline'}
          size="md"
          className="w-full"
          onClick={() => onSelect(plan)}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Subscribe
        </Button>
        <Link
          to={`/plans/${plan.id}`}
          className="text-center text-xs text-[#46617A] hover:underline font-medium py-1"
        >
          View plan details & specs
        </Link>
      </div>
    </div>
  );
};
