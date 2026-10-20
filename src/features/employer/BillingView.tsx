import React, { useState } from 'react';
import { useDemo } from '../../state/demo-store';
import { SUBSCRIPTION_PLANS } from '../../data/seed-subscriptions';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === state.currentPlanId) || SUBSCRIPTION_PLANS[1];

  const mockInvoices = [
    {
      id: 'INV-SE-2026-1048',
      date: '2026-10-01',
      description: `${currentPlan.name} Subscription (Monthly)`,
      amountSEK: state.isAnnualBilling ? currentPlan.priceAnnualSEK : currentPlan.priceMonthlySEK,
      vatSEK: Math.round((state.isAnnualBilling ? currentPlan.priceAnnualSEK : currentPlan.priceMonthlySEK) * 0.25),
      status: 'Paid',
      paymentMethod: 'Corporate Invoice (30 Days)'
    },
    {
      id: 'INV-SE-2026-0941',
      date: '2026-09-01',
      description: 'Growth Scale Subscription (Monthly)',
      amountSEK: 11900,
      vatSEK: 2975,
      status: 'Paid',
      paymentMethod: 'Corporate Invoice (30 Days)'
    },
    {
      id: 'INV-SE-2026-0819',
      date: '2026-08-01',
      description: 'Growth Scale Subscription (Monthly)',
      amountSEK: 11900,
      vatSEK: 2975,
      status: 'Paid',
      paymentMethod: 'Corporate Invoice (30 Days)'
    }
  ];

  const handleSelectNewPlan = (planId: 'starter' | 'growth' | 'enterprise') => {
    dispatch({ type: 'UPDATE_SUBSCRIPTION_PLAN', payload: planId });
    setShowUpgradeModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
              <CreditCard className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">
              Subscription & Quota Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Manage your Nordic recruitment tier, candidate contact quotas, and billing invoices.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUpgradeModal(true)}
          icon={<Sparkles className="w-4 h-4" />}
        >
          Change Subscription Plan
        </Button>
      </div>

      {/* Plan Summary Card & Quota Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Plan Card */}
        <div className="lg:col-span-5 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777F79]">
                Current Active Plan
              </span>
              <h2 className="text-2xl font-bold text-[#28332F]">{currentPlan.name}</h2>
              <p className="text-xs text-[#356653] font-medium mt-0.5">
                Renews automatically on 2026-11-01
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#E7EEE7] text-[#24483D] text-xs font-bold rounded-full border border-[#C5D9C5]">
              Active Tier
            </span>
          </div>

          <div className="pt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#24483D]">
              {(state.isAnnualBilling ? currentPlan.priceAnnualSEK : currentPlan.priceMonthlySEK).toLocaleString()}
            </span>
            <span className="text-xs text-[#777F79] font-medium">SEK / month (Demo billing)</span>
          </div>

          <div className="pt-4 border-t border-[#E5E5DD] space-y-2 text-xs">
            <p className="font-semibold text-[#28332F]">Entitlements included:</p>
            {currentPlan.features.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[#777F79]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#24483D] shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quota Meters */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
            <h3 className="text-sm font-bold text-[#28332F]">Monthly Quota Consumption</h3>
            <span className="text-xs text-[#777F79]">Reset in 11 days</span>
          </div>

          <div className="space-y-4">
            {/* Contact Unlocks */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">Verified Candidate Contact Unlocks</span>
                <span className="text-[#24483D]">
                  {state.contactQuotaUsed} / {currentPlan.contactQuotaMonthly} Unlocks
                </span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#24483D] h-full rounded-full transition-all"
                  style={{ width: `${(state.contactQuotaUsed / currentPlan.contactQuotaMonthly) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#777F79] mt-1">
                {currentPlan.contactQuotaMonthly - state.contactQuotaUsed} candidate direct unlocks remaining
              </p>
            </div>

            {/* Active Requirements */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">Active Workforce Requirements</span>
                <span className="text-[#24483D]">
                  {state.requirements.length} / {currentPlan.activeRequirementLimit} Active Roles
                </span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#356653] h-full rounded-full transition-all"
                  style={{ width: `${(state.requirements.length / currentPlan.activeRequirementLimit) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#777F79] mt-1">
                Slots available for new automated match searches
              </p>
            </div>

            {/* Team Seats */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">Team Recruiter Seats</span>
                <span className="text-[#24483D]">4 / {currentPlan.seatLimit} Users Assigned</span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#356653]/80 h-full rounded-full transition-all"
                  style={{ width: `${(4 / currentPlan.seatLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
          <div>
            <h3 className="text-base font-bold text-[#28332F]">Billing & Invoice History</h3>
            <p className="text-xs text-[#777F79]">Downloadable VAT receipts (25% Swedish Moms)</p>
          </div>
          <span className="text-xs text-[#777F79]">Simulated B2B invoicing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#777F79] uppercase tracking-wider text-[10px] border-b border-[#E5E5DD]">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice No</th>
                <th className="py-3 px-4 font-semibold">Issue Date</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold">Amount (SEK)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DD]">
              {mockInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#24483D]">{inv.id}</td>
                  <td className="py-3.5 px-4 text-[#777F79]">{inv.date}</td>
                  <td className="py-3.5 px-4 text-[#28332F]">{inv.description}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#28332F]">
                    {inv.amountSEK.toLocaleString()} SEK (+25% VAT)
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#E7EEE7] text-[#24483D] font-bold text-[10px]">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Printer className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      View Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal (PRD Page 15) */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title="Swedish Tax Invoice (Faktura) Preview"
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="p-6 bg-white border border-[#E5E5DD] rounded-xl space-y-6 shadow-sm">
              <div className="flex justify-between items-start border-b border-[#E5E5DD] pb-4">
                <div>
                  <h4 className="text-xl font-bold text-[#24483D]">VERITY NORDIC AB</h4>
                  <p className="text-xs text-[#777F79]">Org nr: 559123-4412 · F-skatt godkänd</p>
                  <p className="text-xs text-[#777F79]">Kungsbroplan 1, 111 22 Stockholm</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#28332F] block">FAKTURA / INVOICE</span>
                  <span className="text-xs font-mono text-[#777F79]">{selectedInvoice.id}</span>
                  <span className="text-xs text-[#777F79] block">Datum: {selectedInvoice.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-[#777F79]">Billed to:</p>
                  <p className="font-bold text-[#28332F]">Nordic Industrial Solutions AB</p>
                  <p className="text-[#777F79]">Org nr: 556912-8491</p>
                  <p className="text-[#777F79]">Lindholmsallén 10, Gothenburg</p>
                </div>
                <div>
                  <p className="font-semibold text-[#777F79]">Payment Terms:</p>
                  <p className="text-[#28332F]">30 dagar netto</p>
                  <p className="text-[#28332F]">Bankgiro: 5122-9481 (Demo)</p>
                </div>
              </div>

              <div className="border border-[#E5E5DD] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF9F6] border-b border-[#E5E5DD] text-[#777F79]">
                    <tr>
                      <th className="p-2.5">Beskrivning</th>
                      <th className="p-2.5 text-right">Belopp (SEK)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5E5DD]">
                      <td className="p-2.5">{selectedInvoice.description}</td>
                      <td className="p-2.5 text-right">{selectedInvoice.amountSEK.toLocaleString()} SEK</td>
                    </tr>
                    <tr className="border-b border-[#E5E5DD]">
                      <td className="p-2.5 text-[#777F79]">Moms (25% Moms)</td>
                      <td className="p-2.5 text-right text-[#777F79]">{selectedInvoice.vatSEK.toLocaleString()} SEK</td>
                    </tr>
                    <tr className="font-bold bg-[#FAF9F6]">
                      <td className="p-2.5 text-[#24483D]">Totalt att betala</td>
                      <td className="p-2.5 text-right text-[#24483D]">
                        {(selectedInvoice.amountSEK + selectedInvoice.vatSEK).toLocaleString()} SEK
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#A87532]">
                * Fictional demo invoice for demonstration purposes.
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  Print Invoice
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Plan Upgrade Comparison Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Change Subscription Tier"
        subtitle="Select a demo plan to update quotas immediately"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUBSCRIPTION_PLANS.map(plan => {
              const isSelected = state.currentPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                    isSelected ? 'border-[#24483D] bg-[#E7EEE7]/40 ring-1 ring-[#24483D]' : 'border-[#E5E5DD] bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#28332F]">{plan.name}</h4>
                    <p className="text-lg font-bold text-[#24483D] mt-1">
                      {plan.priceMonthlySEK.toLocaleString()} SEK
                    </p>
                    <p className="text-[11px] text-[#777F79]">{plan.contactQuotaMonthly} unlocks / mo</p>
                  </div>
                  <Button
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleSelectNewPlan(plan.id)}
                  >
                    {isSelected ? 'Current' : 'Select'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
