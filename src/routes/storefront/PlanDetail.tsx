import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PLANS } from '../../config/plans';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Check, ShieldCheck, ArrowRight, Minus, Plus, FileText, Layers, Mail } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const PlanDetail: React.FC = () => {
  const { tier } = useParams<{ tier: string }>();
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);

  const plan = PLANS.find((p) => p.id === tier) || PLANS[1]; // default Growth

  const [cadence, setCadence] = useState<'monthly' | 'quarterly'>('monthly');
  const [deliveryFrequency, setDeliveryFrequency] = useState('1 month');
  const [seats, setSeats] = useState(1);
  const [galleryTab, setGalleryTab] = useState<'envelope' | 'stationery' | 'card'>('envelope');
  const [bottomTab, setBottomTab] = useState('included');

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const unitPrice = cadence === 'monthly' ? plan.monthlyPrice : plan.quarterlyMonthlyEquivalent;
  const totalPrice = unitPrice * seats;

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSubscribing(false);
    setIsSuccess(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSuccess(false);

    addToCart({
      id: `cart-${plan.id}`,
      planId: plan.id,
      planName: plan.name,
      cadence,
      price: unitPrice,
      seats,
    });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-8 py-12 flex flex-col gap-12">
      {/* 2-Column Hero: 7 cols Visual, 5 cols Sticky Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left (7 cols): Editorial Paper Composition Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full h-[440px] bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-1">
            {/* SVG Composition of Folded Paper & Envelopes */}
            {galleryTab === 'envelope' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                <rect x="50" y="50" width="300" height="200" rx="8" fill="#FBFAF7" stroke="#CFC8BB" strokeWidth="2" />
                <path d="M 50 50 L 200 170 L 350 50" fill="none" stroke="#24473B" strokeWidth="2" />
                <path d="M 50 250 L 150 140" fill="none" stroke="#E3DED5" strokeWidth="1.5" />
                <path d="M 350 250 L 250 140" fill="none" stroke="#E3DED5" strokeWidth="1.5" />
                <circle cx="200" cy="170" r="16" fill="#B5654A" />
                <text x="200" y="174" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                  QF
                </text>
              </svg>
            )}

            {galleryTab === 'stationery' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                <rect x="70" y="30" width="260" height="240" rx="4" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5" />
                <line x1="100" y1="70" x2="220" y2="70" stroke="#24473B" strokeWidth="3" />
                <line x1="100" y1="100" x2="300" y2="100" stroke="#E3DED5" strokeWidth="1.5" />
                <line x1="100" y1="120" x2="290" y2="120" stroke="#E3DED5" strokeWidth="1.5" />
                <line x1="100" y1="140" x2="300" y2="140" stroke="#E3DED5" strokeWidth="1.5" />
                <line x1="100" y1="160" x2="260" y2="160" stroke="#E3DED5" strokeWidth="1.5" />
                <rect x="230" y="210" width="70" height="30" rx="4" fill="#E4ECE7" stroke="#24473B" strokeWidth="1" />
              </svg>
            )}

            {galleryTab === 'card' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                <rect x="60" y="70" width="280" height="160" rx="6" fill="#FBFAF7" stroke="#24473B" strokeWidth="2" strokeDasharray="4 4" />
                <rect x="80" y="90" width="40" height="40" rx="4" fill="#24473B" />
                <text x="100" y="115" textAnchor="middle" fill="#F6F3EE" fontSize="14" fontWeight="bold">
                  B2B
                </text>
                <text x="140" y="105" fill="#1F2421" fontSize="13" fontWeight="bold">
                  VERIFIED SENDER PROFILE
                </text>
                <text x="140" y="125" fill="#7A817B" fontSize="11" fontFamily="monospace">
                  ACCT-0417 · NORTHGATE DENTAL
                </text>
                <line x1="80" y1="160" x2="320" y2="160" stroke="#E3DED5" strokeWidth="1.5" />
                <circle cx="290" cy="190" r="12" fill="#2F7D57" />
                <path d="M 285 190 L 289 194 L 296 186" fill="none" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            )}

            <span className="absolute bottom-4 left-6 text-xs font-mono text-[#7A817B]">
              Fulfillment Asset Simulation
            </span>
          </div>

          {/* Gallery Selector Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setGalleryTab('envelope')}
              className={`p-3 text-xs rounded-sm border flex items-center justify-center gap-2 transition-colors ${
                galleryTab === 'envelope'
                  ? 'bg-[#E4ECE7] border-[#24473B] text-[#24473B] font-semibold'
                  : 'bg-[#FFFFFF] border-[#CFC8BB] text-[#4A524D] hover:bg-[#FBFAF7]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Physical Envelope</span>
            </button>
            <button
              type="button"
              onClick={() => setGalleryTab('stationery')}
              className={`p-3 text-xs rounded-sm border flex items-center justify-center gap-2 transition-colors ${
                galleryTab === 'stationery'
                  ? 'bg-[#E4ECE7] border-[#24473B] text-[#24473B] font-semibold'
                  : 'bg-[#FFFFFF] border-[#CFC8BB] text-[#4A524D] hover:bg-[#FBFAF7]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Printed Note</span>
            </button>
            <button
              type="button"
              onClick={() => setGalleryTab('card')}
              className={`p-3 text-xs rounded-sm border flex items-center justify-center gap-2 transition-colors ${
                galleryTab === 'card'
                  ? 'bg-[#E4ECE7] border-[#24473B] text-[#24473B] font-semibold'
                  : 'bg-[#FFFFFF] border-[#CFC8BB] text-[#4A524D] hover:bg-[#FBFAF7]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Account Profile</span>
            </button>
          </div>
        </div>

        {/* Right (5 cols, sticky): Configurator */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 sm:p-8 shadow-1">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#B5654A] font-semibold">
                Shopify Subscription Plan
              </span>
              <span className="text-xs font-mono text-[#2F7D57] bg-[#E1F0E8] px-2 py-0.5 rounded-xs">
                In Stock · Sandbox Ready
              </span>
            </div>
            <h1 className="font-display text-3xl text-[#1F2421] font-medium">{plan.name} Tier</h1>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-display text-4xl text-[#1F2421]">${totalPrice}</span>
              <span className="text-xs font-mono text-[#7A817B]">
                / {cadence === 'monthly' ? 'month' : 'quarter'}
              </span>
            </div>
          </div>

          {/* Cadence Radio Cards */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#4A524D]">
              Billing Interval
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCadence('monthly')}
                className={`p-3 rounded-sm border text-left flex flex-col gap-0.5 transition-colors ${
                  cadence === 'monthly'
                    ? 'border-[#24473B] bg-[#FBFAF7]'
                    : 'border-[#CFC8BB] hover:bg-[#FBFAF7]'
                }`}
              >
                <span className="text-xs font-semibold text-[#1F2421]">Monthly</span>
                <span className="text-xs text-[#7A817B] font-mono">${plan.monthlyPrice}/mo</span>
              </button>
              <button
                type="button"
                onClick={() => setCadence('quarterly')}
                className={`p-3 rounded-sm border text-left flex flex-col gap-0.5 transition-colors relative ${
                  cadence === 'quarterly'
                    ? 'border-[#24473B] bg-[#FBFAF7]'
                    : 'border-[#CFC8BB] hover:bg-[#FBFAF7]'
                }`}
              >
                <span className="text-xs font-semibold text-[#1F2421]">Quarterly</span>
                <span className="text-xs text-[#B5654A] font-mono">
                  ${plan.quarterlyMonthlyEquivalent}/mo (-10%)
                </span>
              </button>
            </div>
          </div>

          {/* Delivery Cadence Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#4A524D]">
              Fulfillment Batch Cycle
            </label>
            <select
              value={deliveryFrequency}
              onChange={(e) => setDeliveryFrequency(e.target.value)}
              className="w-full h-11 px-3 text-sm bg-[#FFFFFF] border border-[#CFC8BB] rounded-sm text-[#1F2421]"
            >
              <option value="1 month">Run scenario every month</option>
              <option value="3 months">Run scenario every quarter</option>
              <option value="continuous">Continuous automated watch (Make.com polling)</option>
            </select>
          </div>

          {/* Seats Stepper */}
          <div className="flex items-center justify-between py-2 border-y border-[#E3DED5]">
            <div>
              <div className="text-sm font-medium text-[#1F2421]">Sender Accounts</div>
              <div className="text-xs text-[#7A817B]">Number of distinct billing profiles</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-sm border border-[#CFC8BB] flex items-center justify-center hover:bg-[#EFEBE4]"
                disabled={seats <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-sm font-semibold w-4 text-center">{seats}</span>
              <button
                type="button"
                onClick={() => setSeats((s) => Math.min(10, s + 1))}
                className="w-8 h-8 rounded-sm border border-[#CFC8BB] flex items-center justify-center hover:bg-[#EFEBE4]"
                disabled={seats >= 10}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subscribe Action Button */}
          <Button
            size="lg"
            variant="primary"
            className="w-full"
            isLoading={isSubscribing}
            isSuccess={isSuccess}
            successText="Added to Cart"
            onClick={handleSubscribe}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Subscribe Now — ${totalPrice}
          </Button>

          {/* Reassurance notes */}
          <div className="flex flex-col gap-2 text-xs text-[#7A817B] pt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2F7D57]" />
              <span>Cancel anytime · Auto-redirects to Tally onboarding</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2F7D57]" />
              <span>Full CSV key merge and Break module error isolation included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs under: What's included, Onboarding, FAQ */}
      <div className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 sm:p-8 mt-4 shadow-1">
        <Tabs
          tabs={[
            { id: 'included', label: "What's Included" },
            { id: 'onboarding', label: 'Onboarding Flow' },
            { id: 'specs', label: 'Technical Specifications' },
          ]}
          activeTab={bottomTab}
          onChange={setBottomTab}
        />

        <div className="pt-6">
          {bottomTab === 'included' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#4A524D]">
              <div>
                <h4 className="font-display text-base text-[#1F2421] font-medium mb-2">
                  Complete Fulfillment Stack
                </h4>
                <p className="leading-relaxed">
                  Every subscription provision includes an automated pipeline chain connecting
                  Shopify recurring orders to customer parameters and your target delivery API.
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#1F2421]">
                    <Check className="w-4 h-4 text-[#2F7D57]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bottomTab === 'onboarding' && (
            <div className="text-sm text-[#4A524D] flex flex-col gap-3">
              <h4 className="font-display text-base text-[#1F2421] font-medium">
                Post-Purchase Handoff Procedure
              </h4>
              <p>
                After checkout, the user is redirected via a 5-second countdown to the branded Tally
                form. The account ID is assigned deterministically from the Shopify order number.
              </p>
              <div className="p-4 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs font-mono text-xs text-[#24473B]">
                URL: /onboarding?order=QF-20481&account=ACCT-0417&tier={plan.id}
              </div>
            </div>
          )}

          {bottomTab === 'specs' && (
            <div className="text-xs font-mono text-[#4A524D] grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
                <div className="text-[#7A817B]">RECORDS / MO</div>
                <div className="text-sm text-[#1F2421] font-bold">{plan.recordsPerMonth}</div>
              </div>
              <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
                <div className="text-[#7A817B]">SENDER PROFILES</div>
                <div className="text-sm text-[#1F2421] font-bold">{plan.senderProfiles}</div>
              </div>
              <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-xs">
                <div className="text-[#7A817B]">RETRY INTERVAL</div>
                <div className="text-sm text-[#1F2421] font-bold">5 minutes (3 attempts)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
