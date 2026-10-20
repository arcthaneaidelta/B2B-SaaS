import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { calculateMatch, rankCandidatesForRequirement } from '../../lib/matching';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Briefcase,
  Calendar,
  Filter,
  Eye,
  BookmarkCheck,
  RotateCw,
  Search,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';

export const MatchingView: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedReqId, setSelectedReqId] = useState<string>(state.selectedRequirementId || 'req-got-elec');
  const [filterVerification, setFilterVerification] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'eligible' | 'excluded'>('eligible');

  const currentReq = state.requirements.find(r => r.id === selectedReqId) || state.requirements[0];

  // Run deterministic matching
  const { eligible, excluded } = rankCandidatesForRequirement(state.candidates, currentReq);

  // Focus candidate for deep explainability card (default to top eligible or Erik Lindström)
  const defaultFocusId = eligible.length > 0 ? eligible[0].candidate.id : state.candidates[0].id;
  const [focusCandidateId, setFocusCandidateId] = useState<string>(defaultFocusId);

  const focusCandidate = state.candidates.find(c => c.id === focusCandidateId) || state.candidates[0];
  const focusMatch = calculateMatch(focusCandidate, currentReq);

  // Filter candidates list based on verification and search
  const filterList = (items: typeof eligible) => {
    return items.filter(({ candidate }) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesVerif =
        filterVerification === 'All' || candidate.verificationLevel === filterVerification;

      return matchesSearch && matchesVerif;
    });
  };

  const filteredEligible = filterList(eligible);
  const filteredExcluded = filterList(excluded);

  const handleShortlistToggle = (candId: string) => {
    dispatch({
      type: 'TOGGLE_SHORTLIST_CANDIDATE',
      payload: { shortlistId: 'sl-1', candidateId: candId }
    });
  };

  const handleRunMatchingAgain = () => {
    showToast('Re-evaluated matching engine', 'info', `Calibrated criteria for "${currentReq.title}"`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Requirement Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">
              Explainable Matching Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Deterministic candidate ranking based on mandatory rules and weighted preferences.
          </p>
        </div>

        {/* Requirement Switcher */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#777F79] whitespace-nowrap">
            Target Role:
          </label>
          <select
            value={selectedReqId}
            onChange={e => {
              setSelectedReqId(e.target.value);
              dispatch({ type: 'SELECT_REQUIREMENT', payload: e.target.value });
            }}
            className="px-3 py-2 text-xs font-semibold bg-white border border-[#E5E5DD] rounded-lg shadow-xs focus:ring-1 focus:ring-[#24483D] text-[#28332F]"
          >
            {state.requirements.map(req => (
              <option key={req.id} value={req.id}>
                {req.title} ({req.location.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VISUAL REFERENCE 1:1 REPLICATION (PRD Page 10: Match Explanation + Requirement Criteria) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Match Explanation Card */}
        <div className="lg:col-span-6 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-[#E5E5DD]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777F79] block">
                Match Explanation
              </span>
              <h2 className="text-xl font-bold text-[#28332F]">{focusCandidate.name}</h2>
              <p className="text-xs text-[#777F79]">{focusCandidate.title} · {focusCandidate.location}</p>
            </div>
            <div className="bg-[#E7EEE7] border border-[#C5D9C5] px-4 py-2 rounded-xl text-center">
              <span className="text-2xl font-bold text-[#24483D] block">{focusMatch.score}%</span>
              <span className="text-[10px] uppercase font-bold text-[#356653] tracking-wider">
                {focusMatch.isEligible ? 'Match' : 'Ineligible'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
              Why this candidate matches
            </h3>

            {/* Criteria Match Rows */}
            <div className="space-y-2.5">
              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#24483D] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#28332F]">Industrial experience</p>
                  <p className="text-[11px] text-[#777F79]">{focusCandidate.experienceYears} years documented</p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#24483D] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#28332F]">Relevant qualifications</p>
                  <p className="text-[11px] text-[#777F79]">
                    {focusCandidate.documents.find(d => d.status === 'Independently confirmed' || d.status === 'Document checked')?.title || 'Required evidence checked'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#24483D] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#28332F]">Location & Availability</p>
                  <p className="text-[11px] text-[#777F79]">
                    {focusCandidate.location} ({focusCandidate.travelFlexibility}) · {focusCandidate.availability}
                  </p>
                </div>
              </div>

              {/* Warning or unconfirmed notice if any */}
              <div className="p-3 bg-[#FAF9F6] border border-[#EDD9B8] rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#A87532] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#28332F]">Swedish language credential</p>
                  <p className="text-[11px] text-[#A87532]">Native Swedish speaking; secondary written certification self-reported</p>
                </div>
              </div>

              {focusMatch.ineligibilityReasons.length > 0 && (
                <div className="p-3 bg-[#FDF2F2] border border-[#F5C2C0] rounded-lg text-xs space-y-1">
                  <span className="font-bold text-[#A84F4B]">Exclusion Criteria Triggered:</span>
                  <ul className="list-disc list-inside text-[#A84F4B] space-y-0.5 text-[11px]">
                    {focusMatch.ineligibilityReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E5E5DD]">
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/app/employer/candidates/${focusCandidate.id}`)}
            >
              Inspect Candidate Dossier
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<BookmarkCheck className="w-3.5 h-3.5" />}
              onClick={() => handleShortlistToggle(focusCandidate.id)}
            >
              Shortlist Candidate
            </Button>
          </div>
        </div>

        {/* Right Side: Requirement Criteria Breakdown */}
        <div className="lg:col-span-6 bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E5E5DD]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#777F79] block">
              Requirement Criteria
            </span>
            <h2 className="text-xl font-bold text-[#28332F]">{currentReq.title}</h2>
            <p className="text-xs text-[#777F79]">{currentReq.location} · {currentReq.employmentType} · {currentReq.workArrangement}</p>
          </div>

          {/* Mandatory Criteria */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
              Mandatory requirements
            </h3>
            <div className="space-y-2">
              {currentReq.mandatoryCriteria.map(mc => (
                <div key={mc.id} className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between text-xs">
                  <span className="font-medium text-[#28332F]">{mc.label}</span>
                  <span className="px-2 py-0.5 rounded bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532] text-[10px] font-semibold">
                    Required
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Criteria */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
              Weighted preferences (100% total)
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#28332F]">Relevant experience weight ({currentReq.preferenceWeights.experience}%)</span>
                <span className="text-[#356653] font-medium text-[11px]">Preferred</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#28332F]">Audited qualification status ({currentReq.preferenceWeights.qualifications}%)</span>
                <span className="text-[#356653] font-medium text-[11px]">Preferred</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#28332F]">Immediate availability readiness ({currentReq.preferenceWeights.availability}%)</span>
                <span className="text-[#356653] font-medium text-[11px]">Preferred</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#28332F]">Regional commute proximity ({currentReq.preferenceWeights.location}%)</span>
                <span className="text-[#356653] font-medium text-[11px]">Preferred</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              className="w-full"
              icon={<RotateCw className="w-4 h-4" />}
              onClick={handleRunMatchingAgain}
            >
              Run matching again
            </Button>
          </div>
        </div>
      </div>

      {/* Candidate Directory Ranking List */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
          {/* Tab Switcher: Eligible vs Excluded */}
          <div className="flex items-center gap-2 bg-[#FAF9F6] p-1 rounded-lg border border-[#E5E5DD]">
            <button
              onClick={() => setActiveTab('eligible')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'eligible'
                  ? 'bg-[#24483D] text-white shadow-xs'
                  : 'text-[#777F79] hover:text-[#28332F]'
              }`}
            >
              Eligible Matches ({eligible.length})
            </button>
            <button
              onClick={() => setActiveTab('excluded')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'excluded'
                  ? 'bg-[#A84F4B] text-white shadow-xs'
                  : 'text-[#777F79] hover:text-[#28332F]'
              }`}
            >
              Excluded by Mandatory Rules ({excluded.length})
            </button>
          </div>

          {/* Verification Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#777F79]" />
            <select
              value={filterVerification}
              onChange={e => setFilterVerification(e.target.value)}
              className="px-2.5 py-1 text-xs border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] text-[#28332F]"
            >
              <option value="All">All Verification Levels</option>
              <option value="Independently confirmed">Independently confirmed</option>
              <option value="Document checked">Document checked</option>
              <option value="Self-reported">Self-reported</option>
            </select>
          </div>
        </div>

        {/* Candidate Ranking Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] text-[#777F79] uppercase tracking-wider text-[10px] border-b border-[#E5E5DD]">
              <tr>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Verification Level</th>
                <th className="py-3 px-4 font-semibold">Availability</th>
                <th className="py-3 px-4 font-semibold text-center">Score</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DD]">
              {(activeTab === 'eligible' ? filteredEligible : filteredExcluded).map(({ candidate: cand, match }) => {
                const isFocused = cand.id === focusCandidateId;
                const isShortlisted = state.shortlists.some(s => s.candidateIds.includes(cand.id));

                return (
                  <tr
                    key={cand.id}
                    onClick={() => setFocusCandidateId(cand.id)}
                    className={`hover:bg-[#FAF9F6] transition-colors cursor-pointer ${
                      isFocused ? 'bg-[#E7EEE7]/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#24483D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {cand.initials}
                        </div>
                        <div>
                          <p className="font-bold text-[#28332F]">{cand.name}</p>
                          <p className="text-[11px] text-[#356653] font-medium">{cand.title}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#777F79]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#356653]" />
                        {cand.location}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={cand.verificationLevel} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#24483D]">
                      {cand.availability}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded-full ${
                          match.isEligible
                            ? 'bg-[#E7EEE7] text-[#24483D]'
                            : 'bg-[#FDF2F2] text-[#A84F4B]'
                        }`}
                      >
                        {match.score}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/app/employer/candidates/${cand.id}`)}
                        >
                          Profile
                        </Button>
                        <Button
                          variant={isShortlisted ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleShortlistToggle(cand.id)}
                        >
                          {isShortlisted ? 'Saved' : 'Shortlist'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
