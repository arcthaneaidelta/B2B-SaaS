import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wordmark } from '../../components/brand/Wordmark';
import { Award, Package, ShieldCheck, ChevronRight, Lock } from 'lucide-react';

interface LandingProps {
  embeddedInPhone?: boolean;
}

export const Landing: React.FC<LandingProps> = ({ embeddedInPhone = false }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-full flex flex-col justify-between ${embeddedInPhone ? 'p-4 sm:p-5' : 'max-w-md mx-auto p-5 sm:p-8 min-h-screen'}`}>
      {/* Top Header */}
      <div>
        <header className="flex items-center justify-between pb-6 pt-1">
          <Wordmark size="sm" showSubtitle={false} linkTo={embeddedInPhone ? undefined : '/'} />
          <Link
            to="/s/privacy"
            className="text-xs font-medium text-text-3 hover:text-ink-900 flex items-center gap-1 bg-paper-100 hover:bg-paper-0 px-2.5 py-1 rounded-full border border-border transition-colors font-ui"
          >
            <Lock className="w-3 h-3 text-thread-600" />
            <span>Privacy</span>
          </Link>
        </header>

        {/* Hero Pitch */}
        <div className="mt-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-thread-600/10 border border-thread-600/20 text-thread-700 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3 h-3" />
            Official Patch Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink-900 tracking-tight leading-[1.12]">
            You earned it.
            <br />
            <span className="italic font-normal">Make it count.</span>
          </h1>
          <p className="text-sm text-text-2 mt-2.5 font-ui leading-relaxed">
            Register the patch you just received to record your accomplishment, or request a bulk order for your school or team.
          </p>
        </div>

        {/* The Two Main Action Paths */}
        <div className="space-y-4">
          {/* Path 1: Register a Patch */}
          <div
            onClick={() => navigate('/s/register')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/s/register')}
            className="group relative bg-paper-0 border-2 border-border hover:border-ink-900 focus:border-thread-600 rounded-lg p-5 cursor-pointer shadow-sh-1 hover:shadow-sh-2 transition-all duration-200 active:scale-[0.99] focus:outline-none"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-moss-600/10 border border-moss-600/30 flex items-center justify-center text-moss-600 flex-shrink-0 group-hover:bg-moss-600 group-hover:text-paper-0 transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-display font-semibold text-ink-900 group-hover:text-thread-600 transition-colors">
                    Register a Patch
                  </h2>
                  <ChevronRight className="w-5 h-5 text-text-3 group-hover:translate-x-1 group-hover:text-ink-900 transition-all" />
                </div>
                <p className="text-xs text-text-2 mt-1 font-ui leading-normal">
                  For students: log your academic, athletic, or leadership merit patch.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-text-3 font-medium bg-paper-100 px-2 py-0.5 rounded border border-border">
                    ⏱ About 1 minute
                  </span>
                  <span className="text-[11px] text-moss-600 font-semibold">
                    Student verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Path 2: Order Patches */}
          <div
            onClick={() => navigate('/s/order')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/s/order')}
            className="group relative bg-paper-0 border-2 border-border hover:border-ink-900 focus:border-thread-600 rounded-lg p-5 cursor-pointer shadow-sh-1 hover:shadow-sh-2 transition-all duration-200 active:scale-[0.99] focus:outline-none"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-thread-600/10 border border-thread-600/30 flex items-center justify-center text-thread-600 flex-shrink-0 group-hover:bg-thread-600 group-hover:text-paper-0 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-display font-semibold text-ink-900 group-hover:text-thread-600 transition-colors">
                    Order Patches
                  </h2>
                  <ChevronRight className="w-5 h-5 text-text-3 group-hover:translate-x-1 group-hover:text-ink-900 transition-all" />
                </div>
                <p className="text-xs text-text-2 mt-1 font-ui leading-normal">
                  For athletic directors, coaches, and parents: request extra team patches.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-text-3 font-medium bg-paper-100 px-2 py-0.5 rounded border border-border">
                    ⏱ Takes 2 minutes
                  </span>
                  <span className="text-[11px] text-ink-700 font-semibold">
                    Bulk quotes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Note */}
      <footer className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-[11px] text-text-3 font-ui">
          A&amp;A Patch Work · Universal QR Mobile Destination
        </p>
        <p className="text-[10px] text-text-3/80 mt-1">
          Questions?{' '}
          <a
            href="mailto:hello@aapatchwork.example"
            className="underline hover:text-ink-900"
          >
            hello@aapatchwork.example
          </a>
        </p>
      </footer>
    </div>
  );
};
