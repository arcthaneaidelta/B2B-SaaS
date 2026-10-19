import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, AlertCircle, Lock, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { validateEmail } from '../../mock/validators';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const generateNewOrder = useStore((s) => s.generateNewOrder);

  const [email, setEmail] = useState('priya@northgatedental.com');
  const [company, setCompany] = useState('Northgate Dental');
  const [name, setName] = useState('Priya Raman');
  const [address, setAddress] = useState('214 Elm Street');
  const [city, setCity] = useState('Columbus');
  const [state, setState] = useState('OH');
  const [zip, setZip] = useState('43215');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');

  const [emailError, setEmailError] = useState('');
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart ? cart.price * cart.seats : 149;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
    if (cardError) setCardError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid business email address');
      return;
    }
    setEmailError('');

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard === '4000000000000002') {
      setCardError('Your card was declined. Try another card.');
      return;
    }
    if (cleanCard.length < 16) {
      setCardError('Please enter a 16-digit card number (try 4242 4242 4242 4242)');
      return;
    }
    setCardError('');

    setIsProcessing(true);
    generateNewOrder();

    // 1.4s simulated checkout time
    await new Promise((r) => setTimeout(r, 1400));
    setIsProcessing(false);
    navigate('/thank-you');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
      {/* Prominent Demo label */}
      <div className="mb-8 p-3.5 bg-[#F8EBD2] border border-[#B7791F]/30 rounded-sm flex items-center justify-between text-xs text-[#B7791F] font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#B7791F]" />
          <span>Demo checkout. No real payment is processed. All data remains in sandbox.</span>
        </div>
        <span className="hidden sm:inline">Use 4242... for success, 4000 0000 0000 0002 for decline</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 sm:p-8 shadow-1">
          <div className="flex items-center justify-between pb-6 border-b border-[#E3DED5] mb-6">
            <div>
              <h1 className="font-display text-2xl text-[#1F2421] font-medium">
                Customer & Payment Details
              </h1>
              <p className="text-xs text-[#7A817B]">
                Shopify-style B2B checkout simulation
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#2F7D57]">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS 256-bit</span>
            </div>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-6">
            {/* Account section */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#4A524D] font-semibold">
                Account Information
              </span>
              <Input
                label="Work Email"
                type="email"
                required
                value={email}
                error={emailError}
                onChange={(e) => setEmail(e.target.value)}
                hint="We'll send order receipts and pipeline alerts here"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Input
                  label="Contact Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="flex flex-col gap-4 pt-4 border-t border-[#E3DED5]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#4A524D] font-semibold">
                Billing Address
              </span>
              <Input
                label="Street Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Input
                    label="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="State"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Postal Code"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-4 pt-4 border-t border-[#E3DED5]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-[#4A524D] font-semibold">
                  Payment Method
                </span>
                <span className="text-[11px] font-mono text-[#7A817B]">Card simulation</span>
              </div>

              <Input
                label="Card Number"
                required
                value={cardNumber}
                error={cardError}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                hint="Tip: Type 4000 0000 0000 0002 to test the card declined error state"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expires"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                />
                <Input
                  label="Security Code (CVC)"
                  required
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full relative overflow-hidden"
                isLoading={isProcessing}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Pay ${subtotal.toFixed(2)}
              </Button>
              {isProcessing && (
                <div className="w-full h-1 bg-[#EFEBE4] mt-2 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#24473B] animate-[shimmer_1.4s_infinite]" />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Summary Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
          <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
            <h3 className="font-display text-lg text-[#1F2421] font-medium pb-3 border-b border-[#E3DED5]">
              Subscription Summary
            </h3>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-sans font-semibold text-sm text-[#1F2421]">
                  {cart?.planName || 'Growth'} Plan
                </h4>
                <p className="text-xs text-[#7A817B]">
                  Billed {cart?.cadence || 'monthly'} · Recurring
                </p>
              </div>
              <span className="font-mono text-sm font-semibold text-[#1F2421]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-[#FBFAF7] rounded-sm border border-[#E3DED5] flex flex-col gap-1.5 text-xs text-[#4A524D]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax:</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-[#1F2421] pt-2 border-t border-[#E3DED5]">
                <span>Total Due Today:</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-[#E4ECE7] rounded-xs text-xs text-[#24473B] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Immediately upon payment, you will be redirected to custom Tally onboarding with your order key.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
