import React, { useState } from 'react';
import { useDemo } from '../../state/demo-store';
import { SUBSCRIPTION_PLANS, INTEGRATION_SLOTS } from '../../data/seed-subscriptions';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import {
  ShieldCheck,
  Sliders,
  CreditCard,
  FileText,
  History,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Users2,
  Building2,
  Search,
  Filter,
  Check
} from 'lucide-react';

/* ----------------------------------------------------
   1. ADMIN OVERVIEW
---------------------------------------------------- */
export const AdminOverview: React.FC = () => {
  const { state } = useDemo();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block">
            SUPERADMIN CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Platform Administration</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Configure matching weights, audit logs, verification rules, and subscription pricing.
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-[#E7EEE7] text-[#24483D] font-bold rounded-full border border-[#C5D9C5]">
          Administrator: Robin Andersson
        </span>
      </div>

      {/* Admin Stat Cards (PRD Page 16) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Total Candidates</span>
          <span className="text-3xl font-bold text-[#28332F]">{state.candidates.length}</span>
          <p className="text-[11px] text-[#356653] mt-1">100% Fictional Swedish cohort</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Verification Queue</span>
          <span className="text-3xl font-bold text-[#24483D]">{state.verificationCases.length}</span>
          <p className="text-[11px] text-[#A87532] mt-1">Cases in active pipeline</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Active Companies</span>
          <span className="text-3xl font-bold text-[#28332F]">3</span>
          <p className="text-[11px] text-[#777F79] mt-1">Industrial enterprises</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Active Requirements</span>
          <span className="text-3xl font-bold text-[#28332F]">{state.requirements.length}</span>
          <p className="text-[11px] text-[#356653] mt-1">Configured with rules</p>
        </div>
      </div>

      {/* Subscription Distribution & Provider Connectivity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#28332F]">Subscription Tier Distribution</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Growth Scale (Primary Demo Tier)</span>
                <span>62%</span>
              </div>
              <div className="w-full bg-[#FAF9F6] h-2.5 rounded-full overflow-hidden border border-[#E5E5DD]">
                <div className="bg-[#24483D] h-full" style={{ width: '62%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Enterprise Industrial</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-[#FAF9F6] h-2.5 rounded-full overflow-hidden border border-[#E5E5DD]">
                <div className="bg-[#356653] h-full" style={{ width: '28%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Starter Verification</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-[#FAF9F6] h-2.5 rounded-full overflow-hidden border border-[#E5E5DD]">
                <div className="bg-[#777F79] h-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#28332F]">System Integration Status</h2>
          <div className="space-y-2 text-xs">
            {INTEGRATION_SLOTS.slice(0, 3).map(slot => (
              <div key={slot.id} className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#28332F]">{slot.name}</p>
                  <p className="text-[11px] text-[#777F79]">{slot.provider}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532]">
                  {slot.badge}
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
   2. MATCHING CONFIGURATION (STRICT 100% WEIGHT RULE)
---------------------------------------------------- */
export const AdminMatchingRules: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();

  const [weights, setWeights] = useState(state.globalMatchingWeights);

  const totalWeight = weights.experience + weights.qualifications + weights.availability + weights.location;
  const isValid = totalWeight === 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      showToast('Validation Error', 'error', `Weights must total exactly 100% (currently ${totalWeight}%)`);
      return;
    }
    dispatch({ type: 'UPDATE_MATCHING_WEIGHTS', payload: weights });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
            <Sliders className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Global Matching Weights</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Configure default preference weights. Mandatory criteria remain separate and are applied prior to ranking.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-6 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
            Weights Calibration
          </span>
          <div
            className={`px-3 py-1 rounded-full font-bold text-xs ${
              isValid ? 'bg-[#E7EEE7] text-[#24483D]' : 'bg-[#FDF2F2] text-[#A84F4B]'
            }`}
          >
            Total: {totalWeight}% {isValid ? '(Valid 100%)' : '(Must Equal 100%)'}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Industrial Experience Weight</span>
              <span className="text-[#24483D]">{weights.experience}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.experience}
              onChange={e => setWeights({ ...weights, experience: Number(e.target.value) })}
              className="w-full accent-[#24483D]"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Qualification & Verification Status Weight</span>
              <span className="text-[#24483D]">{weights.qualifications}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.qualifications}
              onChange={e => setWeights({ ...weights, qualifications: Number(e.target.value) })}
              className="w-full accent-[#24483D]"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Availability Readiness Weight</span>
              <span className="text-[#24483D]">{weights.availability}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weights.availability}
              onChange={e => setWeights({ ...weights, availability: Number(e.target.value) })}
              className="w-full accent-[#24483D]"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Commute & Location Proximity Weight</span>
              <span className="text-[#24483D]">{weights.location}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weights.location}
              onChange={e => setWeights({ ...weights, location: Number(e.target.value) })}
              className="w-full accent-[#24483D]"
            />
          </div>
        </div>

        {!isValid && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F5C2C0] rounded-lg text-[#A84F4B] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Validation Error: Sliders must sum to exactly 100%. Adjust by {100 - totalWeight}%.</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="primary" type="submit" disabled={!isValid}>
            Save Global Weight Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

/* ----------------------------------------------------
   3. PLATFORM AUDIT LOG (PRD Page 16)
---------------------------------------------------- */
export const AdminAuditLog: React.FC = () => {
  const { state } = useDemo();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredLogs = state.activityFeed.filter(event => {
    const matchesSearch =
      event.action.toLowerCase().includes(search.toLowerCase()) ||
      event.details.toLowerCase().includes(search.toLowerCase()) ||
      event.actor.toLowerCase().includes(search.toLowerCase());

    const matchesCat = filterCategory === 'All' || event.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
              <History className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Platform Audit Trail</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Traceable log of verification approvals, match score runs, simulated contracts, and role access.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5DD] rounded-xl shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E5DD]">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777F79]" />
            <input
              type="text"
              placeholder="Search audit trail by actor, action, or details..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#777F79]" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-1 text-xs border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
            >
              <option value="All">All Categories</option>
              <option value="Verification">Verification</option>
              <option value="Matching">Matching</option>
              <option value="Pipeline">Pipeline</option>
              <option value="Contract">Contract</option>
              <option value="Subscription">Subscription</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#777F79] uppercase tracking-wider text-[10px] border-b border-[#E5E5DD]">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DD]">
              {filteredLogs.map(event => (
                <tr key={event.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#777F79] whitespace-nowrap">{event.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E5E5DD] text-[10px] font-semibold text-[#28332F]">
                      {event.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#28332F] font-semibold whitespace-nowrap">
                    {event.actor}
                    <span className="block text-[10px] text-[#777F79] font-normal">{event.actorRole}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#24483D]">{event.action}</td>
                  <td className="py-3.5 px-4 text-[#777F79] max-w-md">{event.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   4. CANDIDATE MANAGEMENT (ADMIN VIEW)
---------------------------------------------------- */
export const AdminCandidates: React.FC = () => {
  const { state } = useDemo();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Candidate Registry (Admin Directory)</h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Directory of all 12 fictional Swedish professional profiles with certificate counts.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5DD] rounded-xl shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF9F6] text-[#777F79] uppercase tracking-wider text-[10px] border-b border-[#E5E5DD]">
            <tr>
              <th className="py-3 px-4 font-semibold">Candidate</th>
              <th className="py-3 px-4 font-semibold">Location</th>
              <th className="py-3 px-4 font-semibold">Level</th>
              <th className="py-3 px-4 font-semibold">Experience</th>
              <th className="py-3 px-4 font-semibold">Certificates</th>
              <th className="py-3 px-4 font-semibold">Passport Token</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5DD]">
            {state.candidates.map(c => (
              <tr key={c.id} className="hover:bg-[#FAF9F6]">
                <td className="py-3 px-4 font-bold text-[#28332F]">{c.name}</td>
                <td className="py-3 px-4 text-[#777F79]">{c.location}</td>
                <td className="py-3 px-4"><StatusBadge status={c.verificationLevel} size="sm" /></td>
                <td className="py-3 px-4">{c.experienceYears} yrs</td>
                <td className="py-3 px-4 font-semibold text-[#24483D]">{c.documents.length} records</td>
                <td className="py-3 px-4 font-mono text-[#777F79]">{c.passportId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   5. PLATFORM SETTINGS (ADMIN VIEW)
---------------------------------------------------- */
export const AdminSettings: React.FC = () => {
  const { showToast } = useDemo();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform settings saved', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Platform & Localization Settings</h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Default language, timezone, expiration warning thresholds, and sandbox configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#28332F] mb-1">Platform Default Timezone</label>
          <input
            type="text"
            defaultValue="Europe/Stockholm (CET / CEST)"
            className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#28332F] mb-1">License Expiration Alert Threshold</label>
          <select defaultValue="45" className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]">
            <option value="30">30 Days Before Expiry</option>
            <option value="45">45 Days Before Expiry (Nordic Standard)</option>
            <option value="60">60 Days Before Expiry</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#28332F] mb-1">Simulated Session Persistence</label>
          <p className="text-[#777F79] text-[11px] mb-2">Browser localStorage enabled for client-side review</p>
          <input type="checkbox" defaultChecked className="accent-[#24483D] w-4 h-4" />
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
