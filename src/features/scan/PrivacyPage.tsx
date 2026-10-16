import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-5 sm:p-8 min-h-screen flex flex-col justify-between font-ui">
      <div>
        <header className="pb-4 border-b border-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-medium text-text-2 hover:text-ink-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-moss-600 font-semibold">
            <Lock className="w-3.5 h-3.5" /> Student Privacy Pledge
          </div>
        </header>

        <div className="mt-6 mb-6">
          <div className="w-12 h-12 rounded-full bg-moss-600/10 text-moss-600 flex items-center justify-center border border-moss-600/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
            Designed for Student Privacy
          </h1>
          <p className="text-xs text-text-2 mt-1.5 leading-relaxed">
            High school students earn these patches through hard work. We treat their data with the highest care and minimal footprint.
          </p>
        </div>

        <div className="bg-paper-0 border border-border rounded-lg p-5 space-y-4 shadow-sh-1 text-xs text-text-2 leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-900 block text-sm">Minimal Student Identity:</strong>
              We physically only store First Name, Last Initial, and Grad Year (e.g. "Marcus T. · Class of 2027"). Our forms physically constrain the last name input to a single character.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-900 block text-sm">Zero Contact Harvesting:</strong>
              We do not ask students for phone numbers, email addresses, social media accounts, or personal addresses.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-900 block text-sm">Verified School Purposes Only:</strong>
              Data is used solely to verify eligibility for athletic letters, academic honors, and varsity assemblies with verified athletic directors.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-900 block text-sm">Never Sold or Monetized:</strong>
              Student registry records are never rented, sold, or shared with marketing third parties.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-900 block text-sm">Transparent &amp; Owner Managed:</strong>
              The database resides in simple, auditable owner spreadsheets with clear record-level deletion rights upon request.
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          Return to previous screen
        </Button>
      </footer>
    </div>
  );
};
