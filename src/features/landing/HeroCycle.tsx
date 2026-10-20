import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  Calendar,
  Eye
} from 'lucide-react';

interface HeroCandidate {
  name: string;
  initials: string;
  role: string;
  location: string;
  availability: string;
  experienceYears: number;
  matchScore: number;
  matchRequirement: string;
  verificationLevel: 'Independently confirmed' | 'Document checked';
  topCerts: string[];
  whyMatch: string;
  candidateId: string;
}

const HERO_CANDIDATES: HeroCandidate[] = [
  {
    name: 'Erik Lindström',
    initials: 'EL',
    role: 'Industrial Electrician',
    location: 'Gothenburg, Sweden',
    availability: 'Immediate',
    experienceYears: 6,
    matchScore: 92,
    matchRequirement: 'Industrial Electrician · Torslanda Automation Plant',
    verificationLevel: 'Document checked',
    topCerts: ['ECY Electrician Certificate', 'SSG Entre Safety Passport', 'ID06 Competence Card'],
    whyMatch: '6 years high-voltage manufacturing experience & verified active SSG Entre license.',
    candidateId: 'cand-erik-lindstrom'
  },
  {
    name: 'Sofia Nilsson',
    initials: 'SN',
    role: 'Mechanical Technician',
    location: 'Malmö, Sweden',
    availability: '2 weeks notice',
    experienceYears: 5,
    matchScore: 88,
    matchRequirement: 'Mechanical Technician · Skåne Precision Packaging',
    verificationLevel: 'Independently confirmed',
    topCerts: ['YH Mechanical Diploma', 'Hydraulics Level II Specialist', 'Supervisor Reference 5/5'],
    whyMatch: 'Independently confirmed aseptic line maintenance record & Tetra Pak references.',
    candidateId: 'cand-sofia-nilsson'
  },
  {
    name: 'Johan Berg',
    initials: 'JB',
    role: 'Automation & Robotics Engineer',
    location: 'Stockholm, Sweden',
    availability: '1 month notice',
    experienceYears: 8,
    matchScore: 84,
    matchRequirement: 'Automation & Robotics · Scania Controls Q4',
    verificationLevel: 'Document checked',
    topCerts: ['KTH M.Sc. Mechatronics', 'ABB RobotStudio Certified', 'Siemens TIA Portal'],
    whyMatch: 'M.Sc. verified against Swedish Ladok registry & 8 years PLC cell commissioning.',
    candidateId: 'cand-johan-berg'
  }
];

export const HeroCycle: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const c = HERO_CANDIDATES[currentIndex];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % HERO_CANDIDATES.length);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Decorative Warm Sage Backdrop shape */}
      <div className="absolute -inset-3 bg-[#E7EEE7]/70 rounded-2xl -rotate-1 transition-transform duration-300" />

      {/* Main Glass/White Card */}
      <div className="relative bg-white border border-[#E5E5DD] rounded-xl shadow-lg p-6 space-y-5 animate-fade-in transition-all">
        {/* Card Header: Requirement Match Pill & Match Score */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block">
                Explainable Match
              </span>
              <span className="text-xs font-medium text-[#28332F] truncate max-w-[220px] block">
                {c.matchRequirement}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 bg-[#E7EEE7] px-3 py-1 rounded-lg border border-[#C5D9C5]">
            <span className="text-xl font-bold text-[#24483D]">{c.matchScore}%</span>
            <span className="text-[10px] text-[#356653] font-semibold uppercase">Match</span>
          </div>
        </div>

        {/* Candidate Identity */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#24483D] text-[#E7EEE7] font-bold text-lg flex items-center justify-center shrink-0 shadow-sm border border-[#356653]">
            {c.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#28332F]">{c.name}</h3>
              <StatusBadge status={c.verificationLevel} size="sm" />
            </div>
            <p className="text-sm font-medium text-[#356653]">{c.role}</p>
            <div className="flex items-center gap-4 text-xs text-[#777F79] mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#356653]" />
                {c.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#356653]" />
                {c.experienceYears} yrs experience
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#356653]" />
                {c.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Why this candidate matches (Explainable logic box) */}
        <div className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg p-3 text-xs space-y-1">
          <span className="font-semibold text-[#24483D] block text-[11px] uppercase tracking-wider">
            Deterministic Match Rationale:
          </span>
          <p className="text-[#28332F] leading-relaxed">{c.whyMatch}</p>
        </div>

        {/* Document verification chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79]">
            Audited Qualifications ({c.topCerts.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {c.topCerts.map((cert, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF9F6] border border-[#E5E5DD] rounded-md text-xs text-[#28332F]"
              >
                <CheckCircle2 className="w-3 h-3 text-[#24483D]" />
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Card Controls: Cycle Button & Profile Action */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E5DD]">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#356653] hover:text-[#24483D] transition-colors py-1 px-2 rounded-md hover:bg-[#FAF9F6] cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Next Candidate Profile ({currentIndex + 1}/3)</span>
          </button>

          <Button
            size="sm"
            variant="outline"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/app/employer/candidates/${c.candidateId}`)}
          >
            Inspect Evidence
          </Button>
        </div>
      </div>
    </div>
  );
};
