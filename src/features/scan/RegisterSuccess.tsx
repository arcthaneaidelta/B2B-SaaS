import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PatchRecord } from '../../data/schema';
import { PatchArt } from '../../components/brand/PatchArt';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { ArrowRight, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface SuccessProps {
  embeddedInPhone?: boolean;
}

export const RegisterSuccess: React.FC<SuccessProps> = ({ embeddedInPhone = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const record = (location.state?.record as PatchRecord) || {
    ref: 'AAP-R-0148',
    student: 'Marcus T.',
    gradYear: '2027',
    schoolName: 'Lincoln-Marshall High School',
    sportOrProgram: 'Track & Field',
    patchName: 'Varsity Letter: Track',
    patchSku: 'ATH-001',
    patchCategory: 'Athletic',
    timestamp: new Date().toISOString(),
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
          <div className="w-14 h-14 mx-auto rounded-full bg-moss-600/10 text-moss-600 flex items-center justify-center border border-moss-600/30 mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-moss-600 uppercase tracking-wider bg-moss-600/10 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified &amp; Recorded
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink-900 tracking-tight">
            You're registered!
          </h1>
          <p className="text-xs sm:text-sm text-text-2 mt-1 font-ui">
            Your patch has been logged into the high school achievement ledger.
          </p>
        </div>

        {/* The Embroidered Ticket Card */}
        <div className="relative bg-paper-0 border-2 border-border-strong rounded-xl p-5 shadow-sh-2 stitched-border font-ui space-y-4">
          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-text-3">
                Official Reference
              </span>
              <div className="text-base font-mono font-bold text-thread-600">
                {record.ref}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-text-3">
                Date Recorded
              </span>
              <div className="text-xs text-ink-900 font-medium">
                {new Date(record.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Patch Display */}
          <div className="flex items-center gap-4 py-1">
            <PatchArt
              sku={record.patchSku}
              category={record.patchCategory}
              size={54}
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-display font-semibold text-ink-900 truncate">
                {record.patchName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Chip label={record.patchCategory} category={record.patchCategory} size="sm" />
                <span className="text-xs text-text-3 font-mono">{record.patchSku}</span>
              </div>
            </div>
          </div>

          {/* Student & School Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-paper-100 p-3 rounded-lg border border-border">
            <div>
              <span className="text-text-3 block text-[11px]">Recipient</span>
              <span className="font-semibold text-ink-900">{record.student}</span>
            </div>
            <div>
              <span className="text-text-3 block text-[11px]">Graduating Class</span>
              <span className="font-semibold text-ink-900">{record.gradYear}</span>
            </div>
            <div className="col-span-2">
              <span className="text-text-3 block text-[11px]">School</span>
              <span className="font-semibold text-ink-900">{record.schoolName}</span>
            </div>
            <div className="col-span-2">
              <span className="text-text-3 block text-[11px]">Program</span>
              <span className="font-semibold text-ink-900">{record.sportOrProgram}</span>
            </div>
          </div>

          {/* What Happens Next Note */}
          <div className="text-[11px] text-text-3 leading-relaxed border-t border-dashed border-border pt-3">
            <span className="font-semibold text-ink-900">What happens next:</span> This record is synchronized with your athletic director's season roster and counts toward school award assemblies.
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <footer className="mt-8 pt-4 space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-sm font-semibold"
          onClick={() => navigate('/s/register')}
        >
          Register another patch
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
