import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { EmployerRequirement, MandatoryRequirement } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { rankCandidatesForRequirement } from '../../lib/matching';
import {
  FileCheck2,
  PlusCircle,
  Sparkles,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  MapPin,
  Building2,
  Clock,
  RotateCw
} from 'lucide-react';

export const RequirementsView: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isWizardOpen = searchParams.get('wizard') === 'true';

  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('Senior Industrial Electrician');
  const [department, setDepartment] = useState('Powertrain & Automation');
  const [location, setLocation] = useState('Gothenburg, Sweden');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Part-time'>('Full-time');
  const [workArrangement, setWorkArrangement] = useState<'On-site' | 'Hybrid' | 'Remote'>('On-site');
  const [description, setDescription] = useState(
    'Seeking an experienced Swedish certified industrial electrician with ECY competence, SSG Entre safety passport, and minimum 3 years documented high-voltage manufacturing experience.'
  );

  // Generated Criteria
  const [mandatoryCriteria, setMandatoryCriteria] = useState<MandatoryRequirement[]>([
    { id: 'mc-gen-1', label: 'Minimum 3 years documented industrial electrical experience', type: 'min_experience', targetValue: 3 },
    { id: 'mc-gen-2', label: 'Verified Electrical qualification (ECY or Elsäkerhetsverket AL)', type: 'required_doc', targetValue: 'Electrical Certificate' },
    { id: 'mc-gen-3', label: 'Current availability within 30 days', type: 'availability', targetValue: 'Immediate' }
  ]);

  // Preference Weights (must sum to 100)
  const [weights, setWeights] = useState({
    experience: 35,
    qualifications: 35,
    availability: 15,
    location: 15
  });

  const [matchingLoading, setMatchingLoading] = useState(false);
  const [mockResults, setMockResults] = useState<{ eligibleCount: number; excludedCount: number } | null>(null);

  const totalWeight = weights.experience + weights.qualifications + weights.availability + weights.location;
  const isWeightsValid = totalWeight === 100;

  const handleOpenWizard = () => {
    setStep(1);
    setMockResults(null);
    setSearchParams({ wizard: 'true' });
  };

  const handleCloseWizard = () => {
    setSearchParams({});
  };

  const handleGenerateCriteria = () => {
    // Deterministic parsing based on description keywords
    const descLower = description.toLowerCase();
    const newMandatory: MandatoryRequirement[] = [];

    // Experience check
    if (descLower.includes('5 year') || descLower.includes('senior')) {
      newMandatory.push({ id: `mc-${Date.now()}-1`, label: 'Minimum 5 years industrial experience', type: 'min_experience', targetValue: 5 });
    } else {
      newMandatory.push({ id: `mc-${Date.now()}-1`, label: 'Minimum 3 years industrial experience', type: 'min_experience', targetValue: 3 });
    }

    // Qualification check
    if (descLower.includes('electric') || descLower.includes('ecy')) {
      newMandatory.push({ id: `mc-${Date.now()}-2`, label: 'Verified Electrical qualification (ECY or Elsäkerhetsverket AL)', type: 'required_doc', targetValue: 'Electrical Certificate' });
    } else if (descLower.includes('hvac') || descLower.includes('f-gas')) {
      newMandatory.push({ id: `mc-${Date.now()}-2`, label: 'Certified F-Gas Refrigerant Certificate Cat 1', type: 'required_doc', targetValue: 'Equipment Operation' });
    } else if (descLower.includes('robot') || descLower.includes('plc') || descLower.includes('automation')) {
      newMandatory.push({ id: `mc-${Date.now()}-2`, label: 'Verified Automation or Mechatronics Engineering Degree', type: 'required_doc', targetValue: 'Degree / Vocational' });
    } else {
      newMandatory.push({ id: `mc-${Date.now()}-2`, label: 'Documented Equipment / Vocational Qualification', type: 'required_doc', targetValue: 'Equipment Operation' });
    }

    newMandatory.push({ id: `mc-${Date.now()}-3`, label: 'Available within 30 days notice', type: 'availability', targetValue: 'Immediate' });

    setMandatoryCriteria(newMandatory);
    showToast('Deterministic workforce criteria generated', 'success', 'Identified required certificates and experience threshold');
    setStep(2);
  };

  const handleRunMockMatching = () => {
    if (!isWeightsValid) {
      showToast('Validation Error', 'error', 'Weights must sum exactly to 100%');
      return;
    }

    setMatchingLoading(true);

    const tempReq: EmployerRequirement = {
      id: `req-custom-${Date.now()}`,
      title,
      department,
      location,
      employmentType,
      workArrangement,
      description,
      status: 'Active',
      createdAt: '2026-10-20',
      mandatoryCriteria,
      preferenceWeights: weights
    };

    setTimeout(() => {
      const { eligible, excluded } = rankCandidatesForRequirement(state.candidates, tempReq);
      setMockResults({ eligibleCount: eligible.length, excludedCount: excluded.length });
      setMatchingLoading(false);
      setStep(4);
    }, 700);
  };

  const handleFinishSave = () => {
    const newReq: EmployerRequirement = {
      id: `req-${Date.now()}`,
      title,
      department,
      location,
      employmentType,
      workArrangement,
      description,
      status: 'Active',
      createdAt: '2026-10-20',
      mandatoryCriteria,
      preferenceWeights: weights
    };

    dispatch({ type: 'CREATE_REQUIREMENT', payload: newReq });
    handleCloseWizard();
    navigate('/app/employer/matches');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Workforce Requirements</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Structured workforce job requirements with mandatory verification rules & custom scoring weights.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={handleOpenWizard}
        >
          Create Requirement
        </Button>
      </div>

      {/* Active Requirements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.requirements.map(req => {
          const isSelected = req.id === state.selectedRequirementId;
          const { eligible, excluded } = rankCandidatesForRequirement(state.candidates, req);

          return (
            <div
              key={req.id}
              className={`bg-white rounded-xl p-6 border shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-[#24483D] ring-1 ring-[#24483D]/20'
                  : 'border-[#E5E5DD] hover:border-[#D5D5CB]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block">
                      {req.department}
                    </span>
                    <h3 className="text-base font-bold text-[#28332F]">{req.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-[#E7EEE7] text-[#24483D] rounded-full text-[11px] font-semibold">
                    {req.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#777F79]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#356653]" />
                    {req.location}
                  </span>
                  <span>•</span>
                  <span>{req.employmentType} ({req.workArrangement})</span>
                </div>

                <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                {/* Criteria tags */}
                <div className="bg-[#FAF9F6] p-3 rounded-lg border border-[#E5E5DD] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#28332F]">Mandatory Filters:</span>
                    <span className="text-[#356653] font-medium">{req.mandatoryCriteria.length} rules</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#777F79]">Eligible Candidates:</span>
                    <span className="font-bold text-[#24483D]">{eligible.length} matched</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#777F79]">Excluded:</span>
                    <span className="text-[#A84F4B]">{excluded.length} failed criteria</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5DD] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    dispatch({ type: 'SELECT_REQUIREMENT', payload: req.id });
                    navigate('/app/employer/matches');
                  }}
                  icon={<Sparkles className="w-3.5 h-3.5 text-[#356653]" />}
                >
                  View Matches
                </Button>
                <Button
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    dispatch({ type: 'SELECT_REQUIREMENT', payload: req.id });
                    showToast(`Active requirement set to "${req.title}"`, 'info');
                  }}
                >
                  {isSelected ? 'Active' : 'Select'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4-Step Requirement Wizard Modal (PRD Page 9) */}
      <Modal
        isOpen={isWizardOpen}
        onClose={handleCloseWizard}
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#24483D]" />
            <span>Create Structured Workforce Requirement</span>
          </div>
        }
        subtitle={`Step ${step} of 4: ${
          step === 1 ? 'Job Details' : step === 2 ? 'Criteria Generator' : step === 3 ? 'Weights & Rules' : 'Matching Simulation'
        }`}
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Step Progress Dots */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    step === s
                      ? 'bg-[#24483D] text-white'
                      : step > s
                      ? 'bg-[#E7EEE7] text-[#24483D]'
                      : 'bg-[#FAF9F6] text-[#777F79] border border-[#E5E5DD]'
                  }`}
                >
                  {s}
                </div>
                <span className="text-xs font-medium hidden sm:inline text-[#28332F]">
                  {s === 1 ? 'Job Details' : s === 2 ? 'Generate Criteria' : s === 3 ? 'Review Weights' : 'Simulation'}
                </span>
                {s < 4 && <ChevronRight className="w-4 h-4 text-[#E5E5DD] hidden sm:inline" />}
              </div>
            ))}
          </div>

          {/* STEP 1: Job Details */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#28332F] mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#28332F] mb-1">Department / Plant</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#28332F] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#28332F] mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={e => setEmploymentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#28332F] mb-1">Work Arrangement</label>
                  <select
                    value={workArrangement}
                    onChange={e => setWorkArrangement(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#28332F] mb-1">
                  Job Description & Scope (Used for deterministic criteria extraction)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white focus:ring-1 focus:ring-[#24483D]"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  variant="primary"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={handleGenerateCriteria}
                >
                  Generate Criteria (Deterministic)
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Criteria Review */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#FAF3E8] border border-[#EDD9B8] p-3 rounded-lg text-[#A87532]">
                <p className="font-semibold">Deterministic Extraction Completed (Simulated logic)</p>
                <p className="text-[11px] mt-0.5">
                  Extracted statutory Swedish requirements without external AI APIs. Review or edit below.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-[#28332F] block">Mandatory Criteria (Must pass before ranking)</label>
                {mandatoryCriteria.map((mc, idx) => (
                  <div key={mc.id} className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#24483D] text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-[#28332F]">{mc.label}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FAF3E8] text-[#A87532] text-[10px] font-semibold rounded">
                      Required
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DD]">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="sm" onClick={() => setStep(3)}>
                  Configure Weights →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review Weights (Strict 100% total rule) */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DD]">
                <span className="font-semibold text-[#28332F]">Preference Weighting Calibration</span>
                <div className={`px-3 py-1 rounded-full font-bold ${isWeightsValid ? 'bg-[#E7EEE7] text-[#24483D]' : 'bg-[#FDF2F2] text-[#A84F4B]'}`}>
                  Total: {totalWeight}% {isWeightsValid ? '(Valid 100%)' : '(Must equal 100%)'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Experience Weight</span>
                    <span className="font-bold">{weights.experience}%</span>
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
                  <div className="flex justify-between font-medium mb-1">
                    <span>Qualifications & Verification Status Weight</span>
                    <span className="font-bold">{weights.qualifications}%</span>
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
                  <div className="flex justify-between font-medium mb-1">
                    <span>Availability Readiness Weight</span>
                    <span className="font-bold">{weights.availability}%</span>
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
                  <div className="flex justify-between font-medium mb-1">
                    <span>Location Proximity Weight</span>
                    <span className="font-bold">{weights.location}%</span>
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

              {!isWeightsValid && (
                <p className="text-xs text-[#A84F4B] flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Please adjust sliders so the sum equals exactly 100% (difference: {100 - totalWeight}%).
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DD]">
                <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!isWeightsValid}
                  isLoading={matchingLoading}
                  onClick={handleRunMockMatching}
                >
                  Run Mock Matching →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Simulation Results */}
          {step === 4 && mockResults && (
            <div className="space-y-4 text-xs animate-fade-in">
              <div className="p-4 bg-[#E7EEE7] border border-[#C5D9C5] rounded-xl text-[#24483D] space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matching Run Finished (Simulated)</span>
                </div>
                <p className="text-xs">
                  Mandatory criteria evaluated against 12 Swedish candidate profiles in directory.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#E5E5DD] rounded-xl text-center space-y-1">
                  <span className="text-2xl font-bold text-[#24483D]">{mockResults.eligibleCount}</span>
                  <p className="text-xs font-semibold text-[#28332F]">Eligible Candidates</p>
                  <p className="text-[11px] text-[#777F79]">Passed all mandatory requirements</p>
                </div>
                <div className="p-4 bg-white border border-[#E5E5DD] rounded-xl text-center space-y-1">
                  <span className="text-2xl font-bold text-[#A84F4B]">{mockResults.excludedCount}</span>
                  <p className="text-xs font-semibold text-[#28332F]">Excluded</p>
                  <p className="text-[11px] text-[#777F79]">Failed experience or credential rules</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DD]">
                <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button variant="primary" size="sm" onClick={handleFinishSave}>
                  Save Requirement & View Matches
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
