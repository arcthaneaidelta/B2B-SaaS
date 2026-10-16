import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../data/store';
import { submitOrder } from '../../mock/api';
import { useToast } from '../../components/ui/Toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Stepper } from '../../components/ui/Stepper';
import { Chip } from '../../components/ui/Chip';
import { PatchArt } from '../../components/brand/PatchArt';
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Package,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface OrderItemState {
  id: string;
  patchSku: string;
  quantity: number;
  acceptBackorder?: boolean;
}

interface OrderFlowProps {
  embeddedInPhone?: boolean;
}

export const OrderFlow: React.FC<OrderFlowProps> = ({ embeddedInPhone = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { schools, patches } = useDemoStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Group 1: Contact
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRole, setContactRole] = useState('AD');
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || 'S01');

  // Group 2: Items
  const [items, setItems] = useState<OrderItemState[]>([
    { id: 'item-1', patchSku: 'ATH-002', quantity: 25 },
    { id: 'item-2', patchSku: 'ACD-001', quantity: 50 },
  ]);

  // Group 3: Details
  const [neededByDate, setNeededByDate] = useState('2026-11-15');
  const [notes, setNotes] = useState('');

  // Quick Demo Autofill
  const handleAutofill = () => {
    setContactName('Coach Ray Okafor');
    setContactEmail('rokafor@ridgeview.example');
    setContactRole('Coach');
    setSelectedSchoolId('S02');
    setItems([
      { id: 'item-1', patchSku: 'ATH-003', quantity: 45, acceptBackorder: true }, // Basketball has 38 stock -> tests backorder logic!
      { id: 'item-2', patchSku: 'ACD-001', quantity: 30 },
    ]);
    setNeededByDate('2026-11-20');
    setNotes('Order for winter varsity roster awards ceremony.');
    setErrors({});
    addToast({
      type: 'info',
      title: 'Demo order filled',
      description: 'Coach Ray Okafor · Ridgeview Academy · 2 patch lines',
    });
  };

  const handleAddItem = () => {
    // pick an unused patch or next available
    const usedSkus = items.map((i) => i.patchSku);
    const available = patches.find((p) => !usedSkus.includes(p.sku)) || patches[0];
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        patchSku: available.sku,
        quantity: 20,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<OrderItemState>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const totalPatchesCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!contactName.trim()) errs.contactName = 'Contact name is required.';
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      errs.contactEmail = 'Valid email is required to send your quote.';
    }
    if (items.length === 0) {
      errs.items = 'Please add at least one patch item.';
    }

    // Check if any item exceeds stock and hasn't accepted backorder
    items.forEach((item, index) => {
      const patch = patches.find((p) => p.sku === item.patchSku);
      if (patch && item.quantity > patch.stock && !item.acceptBackorder) {
        errs[`stock_${item.id}`] = `Only ${patch.stock} units currently in stock for ${patch.name}.`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitOrder({
        schoolId: selectedSchoolId,
        contactName,
        contactEmail,
        contactRole,
        notes,
        items: items.map((i) => ({ patchSku: i.patchSku, quantity: i.quantity })),
      });

      addToast({
        type: 'success',
        title: 'Order request submitted',
        description: `Ref ${res.ref} · ${res.totalQuantity} patches · School totals and stock updated live!`,
      });

      navigate('/s/order/done', {
        state: {
          ref: res.ref,
          totalQuantity: res.totalQuantity,
          schoolName: schools.find((s) => s.id === selectedSchoolId)?.name,
          contactEmail,
          itemsCount: items.length,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order submission failed.';
      setErrors({ form: msg });
      addToast({
        type: 'error',
        title: 'Order failed',
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-full flex flex-col justify-between ${
        embeddedInPhone ? 'p-4 sm:p-5' : 'max-w-xl mx-auto p-5 sm:p-8 min-h-screen'
      }`}
    >
      <div>
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-border">
          <button
            type="button"
            onClick={() => navigate('/s')}
            className="flex items-center gap-1.5 text-xs font-medium text-text-2 hover:text-ink-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-text-3 font-ui font-medium">
            <Package className="w-3.5 h-3.5 text-thread-600" /> Bulk School Ordering
          </div>
        </header>

        {/* Demo Helper Toolbar */}
        <div className="my-3 flex items-center justify-between bg-paper-100 px-3 py-1.5 rounded-md border border-border text-xs">
          <span className="text-[11px] text-text-3 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-thread-600" /> Demo Helper
          </span>
          <button
            type="button"
            onClick={handleAutofill}
            className="text-[11px] font-semibold text-thread-600 hover:underline"
          >
            Autofill demo order
          </button>
        </div>

        {/* Title */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink-900 tracking-tight">
            Order Patches
          </h1>
          <p className="text-xs sm:text-sm text-text-2 mt-1 font-ui">
            Request an official quote for your athletic department, student council, or academic team. No upfront payment required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Who's Ordering */}
          <section className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border space-y-4">
            <h2 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ink-900 text-paper-0 text-[10px] flex items-center justify-center font-mono">
                1
              </span>
              Who's ordering
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Your Name"
                placeholder="e.g. Dana Whitfield"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                error={errors.contactName}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                  Your Role <span className="text-thread-600">*</span>
                </label>
                <select
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  className="w-full h-12 bg-paper-0 border border-border-strong rounded-md px-3 text-sm text-ink-900 focus:outline-none focus:border-thread-600 font-ui"
                >
                  <option value="AD">Athletic Director (AD)</option>
                  <option value="Coach">Varsity / JV Coach</option>
                  <option value="Advisor">Club / Activity Advisor</option>
                  <option value="Parent">Parent Booster / Officer</option>
                  <option value="Other">Other School Staff</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Email for Quote"
                  type="email"
                  placeholder="name@school.example"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  error={errors.contactEmail}
                  helperText="We'll send the itemized quote and invoice directly here."
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                  Select School <span className="text-thread-600">*</span>
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full h-12 bg-paper-0 border border-border-strong rounded-md px-3 text-sm text-ink-900 focus:outline-none focus:border-thread-600 font-ui"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.conference})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Group 2: Patch Line Items */}
          <section className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-ink-900 text-paper-0 text-[10px] flex items-center justify-center font-mono">
                  2
                </span>
                What you need
              </h2>
              <span className="text-xs font-semibold text-text-3 font-mono">
                {items.length} patch {items.length === 1 ? 'type' : 'types'}
              </span>
            </div>

            <div className="space-y-3.5">
              {items.map((item, index) => {
                const patch = patches.find((p) => p.sku === item.patchSku) || patches[0];
                const isOverStock = item.quantity > patch.stock;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-paper-100 rounded-lg border border-border space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <PatchArt
                          sku={patch.sku}
                          category={patch.category}
                          shape={patch.shape}
                          size={44}
                        />
                        <div className="min-w-0">
                          <select
                            value={item.patchSku}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { patchSku: e.target.value })
                            }
                            className="text-xs sm:text-sm font-semibold text-ink-900 bg-paper-0 border border-border-strong rounded px-2 py-1 max-w-[210px] sm:max-w-xs focus:outline-none"
                          >
                            {patches.map((p) => (
                              <option key={p.sku} value={p.sku}>
                                {p.name} ({p.sku})
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip label={patch.category} category={patch.category} size="sm" />
                            <span className="text-[11px] text-text-3 font-mono">
                              Stock: {patch.stock} units
                            </span>
                          </div>
                        </div>
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove patch line"
                          className="text-text-3 hover:text-status-error p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Quantity Stepper Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/60">
                      <span className="text-xs font-medium text-text-2">Quantity:</span>
                      <Stepper
                        value={item.quantity}
                        min={1}
                        max={500}
                        onChange={(qty) => handleUpdateItem(item.id, { quantity: qty })}
                      />
                    </div>

                    {/* Stock Alert / Backorder Logic */}
                    {isOverStock && (
                      <div className="p-2.5 rounded bg-gold-500/10 border border-gold-500/30 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-gold-600 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            Only {patch.stock} currently in stock ({item.quantity - patch.stock} on backorder)
                          </span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer pt-0.5 text-ink-900 select-none">
                          <input
                            type="checkbox"
                            checked={item.acceptBackorder || false}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { acceptBackorder: e.target.checked })
                            }
                            className="rounded text-thread-600 focus:ring-thread-600 w-3.5 h-3.5"
                          />
                          <span className="text-[11px]">
                            Accept backorder shipment (adds 4-6 business days)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 border-2 border-dashed border-border-strong hover:border-ink-900 rounded-lg text-xs font-semibold text-ink-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add another patch type</span>
              </button>
            </div>
          </section>

          {/* Group 3: Timeline & Notes */}
          <section className="bg-paper-0 p-4 sm:p-5 rounded-lg border border-border space-y-4">
            <h2 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ink-900 text-paper-0 text-[10px] flex items-center justify-center font-mono">
                3
              </span>
              Order details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-3" />
                  Needed-by Date
                </label>
                <input
                  type="date"
                  value={neededByDate}
                  onChange={(e) => setNeededByDate(e.target.value)}
                  className="w-full h-12 bg-paper-0 border border-border-strong rounded-md px-3 text-sm text-ink-900 focus:outline-none focus:border-thread-600 font-ui"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                  Notes or Custom Delivery Instructions (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please deliver to Athletic Department office, attention Dana."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-paper-0 border border-border-strong rounded-md text-sm text-ink-900 focus:outline-none focus:border-thread-600 font-ui"
                />
              </div>
            </div>
          </section>

          {/* Group 4: Sticky Summary & Submit */}
          <footer className="bg-paper-100 p-4 rounded-lg border border-border-strong flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-2 z-10 shadow-sh-2">
            <div>
              <div className="text-xs text-text-3 font-ui">Estimated order size:</div>
              <div className="text-base font-display font-bold text-ink-900">
                {items.length} patch {items.length === 1 ? 'type' : 'types'} ·{' '}
                <span className="text-thread-600">{totalPatchesCount} total patches</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8 font-semibold"
            >
              Request quote
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};
