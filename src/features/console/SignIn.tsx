import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../data/store';
import { Monogram } from '../../components/brand/Monogram';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setOwnerSignedIn } = useDemoStore();

  const handleSignIn = () => {
    setOwnerSignedIn(true);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-paper-50 flex items-center justify-center p-4 font-ui">
      <div className="max-w-md w-full bg-paper-0 border-2 border-border-strong rounded-xl p-6 sm:p-8 shadow-sh-2 stitched-border space-y-6">
        <div className="text-center space-y-2">
          <Monogram size={56} className="mx-auto" />
          <h1 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
            Owner Console Sign-in
          </h1>
          <p className="text-xs text-text-2">
            A&amp;A Patch Work Central Reporting &amp; Catalog Management
          </p>
        </div>

        <div className="p-4 bg-paper-100 rounded-lg border border-border text-xs text-text-2 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-ink-900">
            <ShieldCheck className="w-4 h-4 text-moss-600" />
            <span>Interactive Demo Mode</span>
          </div>
          <p>
            In production, this console is protected by Google Workspace or Airtable single sign-on with zero monthly software licensing overhead.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full text-sm font-semibold py-3"
          onClick={handleSignIn}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue as Owner (Alex)
        </Button>

        <div className="text-center pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-text-3 hover:text-ink-900 underline"
          >
            ← Return to public launcher
          </button>
        </div>
      </div>
    </div>
  );
};
