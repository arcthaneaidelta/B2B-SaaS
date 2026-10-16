import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight, PackageCheck, Mail, Printer } from 'lucide-react';

interface OrderSuccessProps {
  embeddedInPhone?: boolean;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ embeddedInPhone = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {
    ref: 'AAP-O-0058',
    totalQuantity: 75,
    schoolName: 'Lincoln-Marshall High School',
    contactEmail: 'dwhitfield@lincolnmarshall.example',
    itemsCount: 2,
  };

  return (
    <div
      className={`min-h-full flex flex-col justify-between ${
        embeddedInPhone ? 'p-4 sm:p-5' : 'max-w-md mx-auto p-5 sm:p-8 min-h-screen'
      }`}
    >
      <div className="space-y-6">
        {/* Verification Icon Header */}
        <div className="text-center pt-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-thread-600/10 text-thread-600 flex items-center justify-center border border-thread-600/30 mb-3">
            <PackageCheck className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-thread-600 uppercase tracking-wider bg-thread-600/10 px-2.5 py-0.5 rounded-full mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Quote Request Received
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink-900 tracking-tight">
            Order Submitted!
          </h1>
          <p className="text-xs sm:text-sm text-text-2 mt-1 font-ui">
            We received your bulk patch request and are preparing your official school quote.
          </p>
        </div>

        {/* The Stitched Order Ticket Card */}
        <div className="relative bg-paper-0 border-2 border-border-strong rounded-xl p-5 shadow-sh-2 stitched-border font-ui space-y-4">
          <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-text-3">
                Order Quote Ref
              </span>
              <div className="text-base font-mono font-bold text-thread-600">{state.ref}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-text-3">
                Status
              </span>
              <div className="text-xs text-status-warning font-semibold">Awaiting Quote</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-paper-100 p-3 rounded-lg border border-border">
            <div>
              <span className="text-text-3 block text-[11px]">School Organization</span>
              <span className="font-semibold text-ink-900">{state.schoolName}</span>
            </div>
            <div>
              <span className="text-text-3 block text-[11px]">Total Patches</span>
              <span className="font-semibold text-ink-900">{state.totalQuantity} units</span>
            </div>
            <div className="col-span-2">
              <span className="text-text-3 block text-[11px]">Confirmation Email</span>
              <span className="font-semibold text-ink-900 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3 h-3 text-thread-600" />
                {state.contactEmail}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-text-3 leading-relaxed border-t border-dashed border-border pt-3">
            <span className="font-semibold text-ink-900">What happens next:</span> Alex at A&amp;A Patch Work will review inventory and send a formal PDF quote with school PO terms within 1 business day.
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <footer className="mt-8 pt-4 space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-sm font-semibold"
          onClick={() => navigate('/s/order')}
        >
          Submit another request
        </Button>

        <div className="flex items-center justify-between gap-3">
          <Link
            to="/admin"
            className="flex-1 text-center py-2 text-xs font-semibold text-thread-600 hover:underline flex items-center justify-center gap-1"
          >
            <span>See live in owner console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs text-text-3 hover:text-ink-900 flex items-center gap-1 py-2 px-3 rounded hover:bg-paper-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ticket</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
