import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF9F6] border-t border-[#E5E5DD] text-[#28332F] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#24483D] flex items-center justify-center text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#E7EEE7]" />
              </div>
              <span className="font-bold tracking-tight text-[#28332F] text-lg">VERITY</span>
            </Link>
            <p className="text-sm text-[#777F79] max-w-sm leading-relaxed mb-4">
              A high-trust Nordic professional verification infrastructure and explainable recruitment matching engine.
              Connecting verified Swedish skilled professionals with industrial employers.
            </p>
            <div className="flex flex-col space-y-1.5 text-xs text-[#777F79]">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#356653]" />
                Kungsbroplan 1, 111 22 Stockholm, Sweden (Fictional Demo Address)
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#356653]" />
                demo-inquiries@verity-nordic.example
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#24483D] mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[#777F79]">
              <li><Link to="/how-it-works" className="hover:text-[#24483D]">How It Works</Link></li>
              <li><Link to="/app/employer/requirements" className="hover:text-[#24483D]">Workforce Criteria</Link></li>
              <li><Link to="/app/employer/matches" className="hover:text-[#24483D]">Explainable Matching</Link></li>
              <li><Link to="/app/candidate/passport" className="hover:text-[#24483D]">Digital Passports</Link></li>
              <li><Link to="/app/verification/queue" className="hover:text-[#24483D]">Verification Queue</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#24483D] mb-3">Workspaces</h4>
            <ul className="space-y-2 text-sm text-[#777F79]">
              <li><Link to="/employers" className="hover:text-[#24483D]">For Employers</Link></li>
              <li><Link to="/professionals" className="hover:text-[#24483D]">For Professionals</Link></li>
              <li><Link to="/pricing" className="hover:text-[#24483D]">Subscription Plans</Link></li>
              <li><Link to="/app/employer/pipeline" className="hover:text-[#24483D]">Recruitment Kanban</Link></li>
              <li><Link to="/app/employer/contracts" className="hover:text-[#24483D]">Electronic Contracts</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#24483D] mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-sm text-[#777F79]">
              <li><Link to="/verification-standards" className="hover:text-[#24483D]">Verification Standards</Link></li>
              <li><Link to="/security" className="hover:text-[#24483D]">GDPR & Privacy Protocol</Link></li>
              <li><Link to="/security" className="hover:text-[#24483D]">Synthetic Data Notice</Link></li>
              <li><Link to="/demo" className="hover:text-[#24483D] flex items-center gap-1">Demo Boundaries <ExternalLink className="w-3 h-3" /></Link></li>
              <li><Link to="/contact" className="hover:text-[#24483D]">Contact Team</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-[#E5E5DD] flex flex-col md:flex-row items-center justify-between text-xs text-[#777F79] gap-4">
          <p>© 2026 VERITY Nordic AB. All candidate profiles, verification documents, and company records are fictional and illustrative.</p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532] rounded font-medium">
              Demo Prototype · Non-production
            </span>
            <span>Swedish Enterprise Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
