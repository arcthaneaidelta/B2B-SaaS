import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileCheck2,
  Users2,
  BookmarkCheck,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Briefcase,
  CheckCircle2,
  PlusCircle,
  Eye,
  Plus
} from 'lucide-react';

export const EmployerOverview: React.FC = () => {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();

  // Top 3 recommended candidates
  const recommendedCandidates = [
    { candidate: state.candidates[0], matchScore: 92, roleMatch: 'Industrial Electrician' },
    { candidate: state.candidates[1], matchScore: 88, roleMatch: 'Mechanical Technician' },
    { candidate: state.candidates[2], matchScore: 84, roleMatch: 'Automation Engineer' }
  ];

  const handleShortlistToggle = (candId: string) => {
    dispatch({
      type: 'TOGGLE_SHORTLIST_CANDIDATE',
      payload: { shortlistId: 'sl-1', candidateId: candId }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Greeting Header (PRD Page 5 & 9) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Good morning, Alex</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Here’s what’s happening across your Nordic recruitment workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/employer/matches')}
            icon={<Sparkles className="w-4 h-4 text-[#356653]" />}
          >
            Review Matches
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/app/employer/requirements?wizard=true')}
          >
            Create Requirement
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards (PRD Page 5 & 9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => navigate('/app/employer/requirements')}
          className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs hover:border-[#24483D] transition-colors cursor-pointer group"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-[#777F79] block mb-2">
            Active Requirements
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#28332F] group-hover:text-[#24483D] transition-colors">
              08
            </span>
            <span className="text-xs text-[#356653] font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2 this month
            </span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">Across Swedish manufacturing sites</p>
        </div>

        <div
          onClick={() => navigate('/app/employer/matches')}
          className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs hover:border-[#24483D] transition-colors cursor-pointer group"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-[#777F79] block mb-2">
            Matched Professionals
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#28332F] group-hover:text-[#24483D] transition-colors">
              124
            </span>
            <span className="text-xs text-[#777F79] font-medium">Across 8 roles</span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">Passed mandatory criteria checks</p>
        </div>

        <div
          onClick={() => navigate('/app/employer/shortlists')}
          className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs hover:border-[#24483D] transition-colors cursor-pointer group"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-[#777F79] block mb-2">
            Shortlisted Candidates
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#28332F] group-hover:text-[#24483D] transition-colors">
              32
            </span>
            <span className="text-xs text-[#356653] font-semibold">6 added this week</span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">Saved in project shortlists</p>
        </div>

        <div
          onClick={() => navigate('/app/employer/pipeline')}
          className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs hover:border-[#24483D] transition-colors cursor-pointer group"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-[#777F79] block mb-2">
            Pending Decisions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#28332F] group-hover:text-[#24483D] transition-colors">
              07
            </span>
            <span className="text-xs text-[#A87532] font-semibold">3 need attention</span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">In contract and interview stage</p>
        </div>
      </div>

      {/* Middle Section: Matching Overview Chart & Recent Activity Timeline (PRD Page 5 & 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matching Overview Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#E5E5DD] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
            <div>
              <h2 className="text-base font-bold text-[#28332F]">Matching Overview</h2>
              <p className="text-xs text-[#777F79]">Candidate fit percentage across active requirements</p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E5DD] text-[#356653]">
              Deterministic Ranking
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">Electrical Installation & Maintenance</span>
                <span className="text-[#24483D]">78% High Fit</span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-3 rounded-full overflow-hidden">
                <div className="bg-[#24483D] h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">Automation & Robotics Engineering</span>
                <span className="text-[#24483D]">62% Fit</span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-3 rounded-full overflow-hidden">
                <div className="bg-[#356653] h-full rounded-full transition-all duration-500" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">Mechanical Maintenance & Welding</span>
                <span className="text-[#24483D]">88% Exceptional Fit</span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-3 rounded-full overflow-hidden">
                <div className="bg-[#24483D] h-full rounded-full transition-all duration-500" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#28332F]">HVAC & Commercial Refrigeration</span>
                <span className="text-[#24483D]">49% Specialized</span>
              </div>
              <div className="w-full bg-[#FAF9F6] border border-[#E5E5DD] h-3 rounded-full overflow-hidden">
                <div className="bg-[#356653]/70 h-full rounded-full transition-all duration-500" style={{ width: '49%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => navigate('/app/employer/matches')}
              className="text-xs font-semibold text-[#24483D] hover:underline inline-flex items-center gap-1"
            >
              <span>Explore full explainable match breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E5E5DD] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
              <h2 className="text-base font-bold text-[#28332F]">Recent Activity</h2>
              <span className="text-xs text-[#777F79]">Real-time feed</span>
            </div>

            <div className="divide-y divide-[#E5E5DD]/60 pt-1">
              {state.activityFeed.slice(0, 4).map(event => (
                <div key={event.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#28332F]">{event.action}</span>
                    <span className="text-[11px] text-[#777F79]">{event.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#777F79] line-clamp-1">{event.details}</p>
                  <p className="text-[10px] text-[#356653] font-medium">Actor: {event.actor} ({event.actorRole})</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5DD]">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/app/admin/audit-log')}
            >
              View Full Audit Timeline
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended Professionals (PRD Page 5 & 9) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#28332F]">Recommended Professionals</h2>
            <p className="text-xs text-[#777F79]">Top ranked candidates matched to active Gothenburg & Skåne positions</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/employer/matches')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            View all 124 candidates
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCandidates.map(({ candidate: cand, matchScore, roleMatch }) => {
            const isShortlisted = state.shortlists.some(s => s.candidateIds.includes(cand.id));

            return (
              <div
                key={cand.id}
                className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#24483D] text-[#E7EEE7] font-bold text-sm flex items-center justify-center">
                        {cand.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#28332F]">{cand.name}</h4>
                        <p className="text-xs text-[#356653] font-medium">{cand.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#24483D]">{matchScore}%</span>
                      <span className="block text-[10px] text-[#777F79] uppercase">match</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#777F79]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#356653]" />
                      {cand.location.split(',')[0]}
                    </span>
                    <span className="font-medium text-[#24483D]">{cand.availability}</span>
                  </div>

                  <StatusBadge status={cand.verificationLevel} size="sm" />

                  <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#E5E5DD] text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block">
                      Target Role:
                    </span>
                    <p className="text-[#28332F] font-semibold truncate">{roleMatch}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E5DD] flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/app/employer/candidates/${cand.id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant={isShortlisted ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleShortlistToggle(cand.id)}
                    icon={<BookmarkCheck className="w-3.5 h-3.5" />}
                  >
                    {isShortlisted ? 'Saved' : 'Shortlist'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
