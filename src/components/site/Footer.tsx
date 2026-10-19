import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand.config';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#24473B] text-[#F6F3EE] pt-20 pb-12 mt-20">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex flex-col gap-16">
        {/* Closing Banner CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-16 border-b border-[#325A4C]">
          <div className="max-w-xl flex flex-col gap-3">
            <h2 className="font-display text-3xl sm:text-4xl text-[#F6F3EE] font-normal leading-tight">
              Let’s see it run on your data.
            </h2>
            <p className="text-[#C5D5CC] text-base leading-relaxed">
              A scoped build, a sandbox-verified launch, and a walkthrough you can hand to your team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="px-5 py-3 rounded-sm bg-[#F6F3EE] text-[#24473B] font-medium text-sm hover:bg-[#FFFFFF] transition-colors flex items-center gap-2 shadow-1"
            >
              <span>Open the Control Room</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/plans"
              className="px-5 py-3 rounded-sm border border-[#4A7263] text-[#F6F3EE] font-medium text-sm hover:bg-[#1B382F] transition-colors"
            >
              Review the plans
            </Link>
          </div>
        </div>

        {/* 4-column footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A3B8AD]">
              Product
            </span>
            <Link to="/plans" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Subscription Tiers
            </Link>
            <Link to="/how-it-works" className="text-[#E4ECE7] hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link to="/onboarding" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Tally Onboarding
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A3B8AD]">
              Pipeline
            </span>
            <Link to="/app/pipeline" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Scenario Canvas
            </Link>
            <Link to="/app/data" className="text-[#E4ECE7] hover:underline underline-offset-4">
              CSV Key Merge
            </Link>
            <Link to="/app/errors" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Error Logging & Alerts
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A3B8AD]">
              Company
            </span>
            <Link to="/app/handoff" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Loom Runbook
            </Link>
            <Link to="/app/handoff" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Monthly Retainer
            </Link>
            <Link to="/app/test" className="text-[#E4ECE7] hover:underline underline-offset-4">
              Zero-Error Verification
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A3B8AD]">
              Security
            </span>
            <div className="flex items-center gap-2 text-xs text-[#C5D5CC]">
              <ShieldCheck className="w-4 h-4 text-[#7BD4A8]" />
              <span>Sandbox keys only</span>
            </div>
            <span className="text-xs text-[#A3B8AD]">Shopify Collaborator access</span>
            <span className="text-xs text-[#A3B8AD]">NDA process compliance</span>
          </div>
        </div>

        {/* Bottom bar with status, disclaimer, and back-to-top */}
        <div className="pt-8 border-t border-[#325A4C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B8AD]">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B382F] text-[#7BD4A8] font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7BD4A8] animate-pulse" />
              <span>All systems normal (sandbox)</span>
            </div>
            <span>{BRAND.conceptDisclaimer}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} {BRAND.name} Demo</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-sm border border-[#4A7263] text-[#F6F3EE] hover:bg-[#1B382F] transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
