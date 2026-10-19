import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const isOpen = useStore((s) => s.isCartDrawerOpen);
  const setIsOpen = useStore((s) => s.setCartDrawerOpen);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const subtotal = cart ? cart.price * cart.seats : 0;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Your Subscription Cart"
      width="w-full max-w-md"
    >
      <div className="flex flex-col h-full justify-between">
        {!cart ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFEBE4] flex items-center justify-center text-[#7A817B] mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg text-[#1F2421] mb-1">Your cart is empty</h3>
            <p className="text-sm text-[#7A817B] max-w-xs mb-6">
              Select a fulfillment tier to configure your recurring pipeline.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setIsOpen(false);
                navigate('/plans');
              }}
            >
              Browse plans
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {/* Line item card */}
              <div className="p-4 bg-[#FBFAF7] border border-[#CFC8BB] rounded-md relative flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#B5654A] font-semibold">
                      Subscription Plan
                    </span>
                    <h4 className="font-display text-lg text-[#1F2421] font-medium">
                      {cart.planName} Tier
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={removeFromCart}
                    className="p-1 text-[#7A817B] hover:text-[#B23A3A] transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 bg-[#E4ECE7] text-[#24473B] rounded-xs w-fit">
                  <span>
                    Billed {cart.cadence} · Renews Nov 19, 2026
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E3DED5] text-sm">
                  <span className="text-[#4A524D]">Qty: {cart.seats} seat(s)</span>
                  <span className="font-mono font-medium text-[#1F2421]">
                    ${cart.price.toFixed(2)} / {cart.cadence === 'quarterly' ? 'qtr' : 'mo'}
                  </span>
                </div>
              </div>

              {/* Pipeline Reassurance note */}
              <div className="p-3.5 bg-[#EFEBE4] rounded-sm border border-[#E3DED5] flex items-start gap-2.5 text-xs text-[#4A524D]">
                <ShieldCheck className="w-4 h-4 text-[#2F7D57] shrink-0 mt-0.5" />
                <span>
                  Immediate post-purchase redirect to custom Tally onboarding with auto-assigned Account ID.
                </span>
              </div>
            </div>

            {/* Bottom summary and action */}
            <div className="pt-6 border-t border-[#E3DED5] flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#4A524D]">Subtotal</span>
                <span className="font-mono text-base font-semibold text-[#1F2421]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#7A817B]">
                <span>Taxes & automated pipeline fees</span>
                <span>Calculated at checkout</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-2"
                onClick={handleCheckout}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Proceed to Checkout
              </Button>

              <p className="text-[11px] text-[#7A817B] text-center">
                Demo sandbox simulation · No credit card charge
              </p>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};
