import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Building2,
  Users2,
  ShieldCheck,
  QrCode,
  Share2,
  Lock,
  Bell,
  Settings,
  Mail,
  CheckCircle2,
  Eye,
  Key
} from 'lucide-react';

/* ----------------------------------------------------
   1. COMPANY & TEAM VIEW
---------------------------------------------------- */
export const CompanyTeamView: React.FC = () => {
  const { state, showToast } = useDemo();

  const teamMembers = [
    { name: 'Alex Morgan', role: 'Head of Industrial Talent', email: 'alex.morgan@nordicindustrial.se', permission: 'Owner / Admin' },
    { name: 'Elsa Lind', role: 'Technical Recruitment Specialist', email: 'elsa.lind@nordicindustrial.se', permission: 'Full Recruiter' },
    { name: 'Carl Sundin', role: 'Plant Operations Manager', email: 'carl.sundin@nordicindustrial.se', permission: 'Reviewer (Interviews only)' },
    { name: 'Astrid Varg', role: 'Site Safety Inspector', email: 'astrid.varg@nordicindustrial.se', permission: 'Compliance Read-Only' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
            <Building2 className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Company & Team Management</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Enterprise organization settings, seat allocations, and role-based permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company Profile Details */}
        <div className="lg:col-span-5 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#28332F] pb-2 border-b border-[#E5E5DD]">
            Enterprise Profile
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#777F79] block">Legal Entity Name:</span>
              <span className="font-bold text-[#28332F]">Nordic Industrial Solutions AB</span>
            </div>
            <div>
              <span className="text-[#777F79] block">Swedish Organisation Number:</span>
              <span className="font-mono text-[#28332F]">556912-8491</span>
            </div>
            <div>
              <span className="text-[#777F79] block">Primary Operational Site:</span>
              <span className="text-[#28332F]">Lindholmsallén 10, 417 55 Gothenburg, Sweden</span>
            </div>
            <div>
              <span className="text-[#777F79] block">Industry Domain:</span>
              <span className="text-[#28332F]">Heavy Manufacturing & Industrial Automation</span>
            </div>
            <div className="pt-2">
              <span className="px-2 py-0.5 bg-[#E7EEE7] text-[#24483D] text-[10px] font-bold rounded-full">
                Verified Swedish Employer
              </span>
            </div>
          </div>
        </div>

        {/* Team Seats */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DD]">
            <h2 className="text-base font-bold text-[#28332F]">Team Members ({teamMembers.length} Seats)</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Invite link generated for new team member', 'info')}
            >
              + Invite Team Member
            </Button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member, i) => (
              <div key={i} className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#28332F]">{member.name}</p>
                  <p className="text-[11px] text-[#356653] font-medium">{member.role}</p>
                  <p className="text-[10px] text-[#777F79]">{member.email}</p>
                </div>
                <span className="px-2.5 py-1 bg-white border border-[#E5E5DD] rounded text-[11px] font-semibold text-[#28332F]">
                  {member.permission}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   2. DIGITAL PASSPORTS OVERVIEW (EMPLOYER VIEW)
---------------------------------------------------- */
export const PassportsOverview: React.FC = () => {
  const { state, navigateCandidate = () => {} } = useDemo() as any;
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
            <QrCode className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Digital Professional Passports</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Audited cryptographic passports shared by Swedish technicians for site access and compliance checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.candidates.filter((c: any) => c.isPassportShared).map((cand: any) => (
          <div key={cand.id} className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#28332F]">{cand.name}</h3>
                <p className="text-xs text-[#356653] font-medium">{cand.title}</p>
                <p className="text-[10px] text-[#777F79] font-mono mt-0.5">{cand.passportId}</p>
              </div>
              <StatusBadge status={cand.verificationLevel} size="sm" />
            </div>

            <div className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg p-3 text-xs space-y-1">
              <span className="font-semibold text-[#28332F] block text-[11px]">Active Credentials:</span>
              <p className="text-[#777F79]">{cand.documents.length} verified records in digital passport</p>
            </div>

            <div className="pt-2 border-t border-[#E5E5DD] flex items-center justify-between">
              <span className="text-[10px] text-[#356653] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Token active
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => navigate(`/app/employer/candidates/${cand.id}`)}
              >
                Inspect Passport
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   3. EMPLOYER SETTINGS
---------------------------------------------------- */
export const EmployerSettings: React.FC = () => {
  const { showToast } = useDemo();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Employer workspace settings updated', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
            <Settings className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Workspace Preferences & Security</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Notification channels, match threshold sensitivity, and security access policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#28332F] pb-2 border-b border-[#E5E5DD]">
            Matching Alerts & Dispatch
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#28332F]">Daily Verification Digest</p>
                <p className="text-[#777F79] text-[11px]">Receive summary of newly confirmed candidates matching active requirements</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#24483D] w-4 h-4" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#28332F]">Expiring Certificate Alerts</p>
                <p className="text-[#777F79] text-[11px]">Notify when a shortlisted candidate has a license expiring within 45 days</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#24483D] w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" type="submit">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
