import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDemoStore } from '../../data/store';
import { submitRegistration, checkDuplicate } from '../../mock/api';
import { useToast } from '../../components/ui/Toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { PatchArt } from '../../components/brand/PatchArt';
import {
  Lock,
  ArrowLeft,
  ChevronRight,
  Search,
  Check,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface RegisterFlowProps {
  embeddedInPhone?: boolean;
}

const GRAD_YEARS = ['2026', '2027', '2028', '2029', '2030'];

const PROGRAM_OPTIONS = [
  'Track & Field',
  'Soccer',
  'Basketball',
  'Academics & GPA',
  'National Honor Society',
  'AP Programs',
  'Student Council',
  'Peer Mentoring',
  'Community Service',
  'Other',
];

export const RegisterFlow: React.FC<RegisterFlowProps> = ({ embeddedInPhone = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { schools, patches, addSchool } = useDemoStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    show: boolean;
    ref?: string;
  }>({ show: false });

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [gradYear, setGradYear] = useState('2027');
  const [customGradYear, setCustomGradYear] = useState('');

  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || 'S01');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [isCustomSchool, setIsCustomSchool] = useState(false);
  const [customSchoolName, setCustomSchoolName] = useState('');

  const [sportOrProgram, setSportOrProgram] = useState('Track & Field');
  const [selectedPatchSku, setSelectedPatchSku] = useState(patches[0]?.sku || 'ACD-001');
  const [quantity, setQuantity] = useState(1);
  const [showQuantityPicker, setShowQuantityPicker] = useState(false);

  const [parentPermissionConfirmed, setParentPermissionConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter schools for search
  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      s.conference.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const selectedPatch = patches.find((p) => p.sku === selectedPatchSku) || patches[0];
  const selectedSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];
  const effectiveGradYear = gradYear === 'Other' ? customGradYear : gradYear;

  // Quick Demo Autofill
  const handleAutofill = () => {
    setFirstName('Marcus');
    setLastInitial('T');
    setGradYear('2027');
    setSelectedSchoolId('S01');
    setSportOrProgram('Track & Field');
    setSelectedPatchSku('ATH-001');
    setParentPermissionConfirmed(true);
    setErrors({});
    addToast({
      type: 'info',
      title: 'Demo data filled',
      description: 'Marcus T. · Lincoln-Marshall HS · Varsity Track Letter',
    });
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) {
      errs.firstName = 'First name is required.';
    }
    if (!lastInitial.trim()) {
      errs.lastInitial = 'Add the first letter of your last name.';
    } else if (lastInitial.trim().length > 1) {
      errs.lastInitial = 'Single initial only for privacy.';
    }
    if (gradYear === 'Other' && !customGradYear.trim()) {
      errs.gradYear = 'Please specify graduation year.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (isCustomSchool && !customSchoolName.trim()) {
      errs.school = 'Please enter your school name.';
    }
    if (!selectedPatchSku) {
      errs.patch = 'Please select the patch you earned.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        // If custom school added inline
        if (isCustomSchool && customSchoolName.trim()) {
          const newSchool = addSchool({
            name: customSchoolName.trim(),
            conference: 'Independent / Provisional',
            contact: 'School Administrator',
            contactEmail: 'admin@school.example',
          });
          setSelectedSchoolId(newSchool.id);
        }

        // Check duplicate
        const studentFormatted = `${firstName.trim()} ${lastInitial.trim().toUpperCase()}.`;
        const dupCheck = await checkDuplicate(
          studentFormatted,
          effectiveGradYear,
          selectedSchoolId,
          selectedPatchSku
        );

        if (dupCheck.isDuplicate) {
          setDuplicateWarning({ show: true, ref: dupCheck.existingRef });
        } else {
          setStep(3);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!parentPermissionConfirmed) {
      setErrors({ permission: 'Please confirm parent/guardian verification.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitRegistration({
        firstName,
        lastInitial,
        gradYear: effectiveGradYear,
        schoolId: selectedSchoolId,
        sportOrProgram,
        patchSku: selectedPatchSku,
        quantity,
      });

      addToast({
        type: 'success',
        title: 'Patch registered successfully',
        description: `${firstName} ${lastInitial.toUpperCase()}. recorded in the Registry (Ref: ${res.ref}).`,
      });

      navigate('/s/register/done', {
        state: {
          record: res.record,
          ref: res.ref,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Try again.';
      setErrors({ form: msg });
      addToast({
        type: 'error',
        title: 'Submission error',
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col justify-between ${embeddedInPhone ? 'p-4 sm:p-5' : 'max-w-md mx-auto p-5 sm:p-8 min-h-screen'}`}>
      <div>
        {/* Navigation / Progress Header */}
        <header className="flex items-center justify-between pb-4 border-b border-border">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep((s) => (s - 1) as 1 | 2);
              else navigate('/s');
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-text-2 hover:text-ink-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-2 font-ui">
              Step {step} of 3
            </span>
            {/* 3-segment progress indicator */}
            <div className="flex gap-1">
              <span
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  step >= 1 ? 'bg-thread-600' : 'bg-border-strong'
                }`}
              />
              <span
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  step >= 2 ? 'bg-thread-600' : 'bg-border-strong'
                }`}
              />
              <span
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  step >= 3 ? 'bg-thread-600' : 'bg-border-strong'
                }`}
              />
            </div>
          </div>
        </header>

        {/* Demo Helper Toolbar */}
        <div className="my-3 flex items-center justify-between bg-paper-100 px-3 py-1.5 rounded-md border border-border text-xs">
          <span className="text-[11px] text-text-3 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-thread-600" /> Demo Helper
          </span>
          <button
            type="button"
            onClick={handleAutofill}
            className="text-[11px] font-semibold text-thread-600 hover:underline"
          >
            Autofill demo data
          </button>
        </div>

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="mt-4 space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
                About the student
              </h2>
              <p className="text-xs text-text-2 mt-1 font-ui">
                We collect minimal student identity to safeguard privacy for minors.
              </p>
            </div>

            {/* First Name */}
            <Input
              label="Student's First Name"
              placeholder="e.g. Marcus"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
              }}
              error={errors.firstName}
              maxLength={30}
              autoComplete="off"
            />

            {/* Last Initial with Physical Constraint */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                Last Initial <span className="text-thread-600">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={1}
                  required
                  placeholder="T"
                  value={lastInitial}
                  onChange={(e) => {
                    const char = e.target.value.slice(-1).toUpperCase();
                    setLastInitial(char);
                    if (errors.lastInitial) setErrors((prev) => ({ ...prev, lastInitial: '' }));
                  }}
                  className={`w-14 h-12 text-center text-lg font-bold uppercase bg-paper-0 border rounded-md font-ui ${
                    errors.lastInitial
                      ? 'border-status-error focus:ring-status-error/20'
                      : 'border-border-strong focus:border-thread-600 focus:ring-2 focus:ring-thread-600/15'
                  }`}
                />
                <div className="text-xs text-text-2 font-ui leading-tight">
                  <p className="font-semibold text-ink-900">Single letter only</p>
                  <p className="text-text-3">Physical constraint prevents storing full last names.</p>
                </div>
              </div>
              {errors.lastInitial && (
                <p className="text-xs text-status-error mt-0.5">{errors.lastInitial}</p>
              )}
            </div>

            {/* Graduation Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                Graduation Year <span className="text-thread-600">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GRAD_YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setGradYear(year)}
                    className={`h-11 rounded-md text-sm font-semibold font-ui border transition-all ${
                      gradYear === year
                        ? 'bg-ink-900 text-paper-0 border-ink-900 shadow-sh-1'
                        : 'bg-paper-0 text-ink-900 border-border hover:bg-paper-100'
                    }`}
                  >
                    {year}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setGradYear('Other')}
                  className={`h-11 rounded-md text-sm font-semibold font-ui border transition-all ${
                    gradYear === 'Other'
                      ? 'bg-ink-900 text-paper-0 border-ink-900 shadow-sh-1'
                      : 'bg-paper-0 text-ink-900 border-border hover:bg-paper-100'
                  }`}
                >
                  Other
                </button>
              </div>

              {gradYear === 'Other' && (
                <div className="mt-2">
                  <Input
                    placeholder="Enter year (e.g. 2031)"
                    value={customGradYear}
                    onChange={(e) => setCustomGradYear(e.target.value)}
                    error={errors.gradYear}
                  />
                </div>
              )}
            </div>

            {/* Privacy Guard Note */}
            <div className="p-3.5 rounded-lg bg-moss-600/10 border border-moss-600/20 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-text-2 font-ui leading-relaxed">
                <span className="font-semibold text-ink-900">Student Privacy Pledge:</span> We only keep First Name, Last Initial, and Class Year. No emails, phone numbers, or addresses are collected from students.{' '}
                <Link to="/s/privacy" className="text-moss-600 underline font-semibold">
                  Read privacy policy
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Your Patch */}
        {step === 2 && (
          <div className="mt-4 space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
                Your patch &amp; school
              </h2>
              <p className="text-xs text-text-2 mt-1 font-ui">
                Connect your achievement to your high school athletic or academic program.
              </p>
            </div>

            {/* School Searchable Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                High School <span className="text-thread-600">*</span>
              </label>

              {!isCustomSchool ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-text-3 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Type to filter schools..."
                      value={schoolSearch}
                      onChange={(e) => setSchoolSearch(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 text-sm bg-paper-0 border border-border-strong rounded-md focus:outline-none focus:border-thread-600"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-border rounded-md bg-paper-0 divide-y divide-border">
                    {filteredSchools.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSchoolId(s.id)}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                          selectedSchoolId === s.id
                            ? 'bg-thread-600/10 text-ink-900 font-semibold'
                            : 'hover:bg-paper-100 text-text-2'
                        }`}
                      >
                        <div>
                          <div className="text-ink-900 font-medium">{s.name}</div>
                          <div className="text-[11px] text-text-3">{s.conference}</div>
                        </div>
                        {selectedSchoolId === s.id && (
                          <Check className="w-4 h-4 text-thread-600" />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCustomSchool(true)}
                    className="text-xs text-thread-600 hover:underline font-semibold"
                  >
                    + My school isn't listed here
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-paper-0 border border-border rounded-md space-y-2">
                  <Input
                    label="School Name"
                    placeholder="e.g. Oakridge High School"
                    value={customSchoolName}
                    onChange={(e) => setCustomSchoolName(e.target.value)}
                    error={errors.school}
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-text-3">We will automatically add this school to our directory.</span>
                    <button
                      type="button"
                      onClick={() => setIsCustomSchool(false)}
                      className="text-xs text-ink-700 hover:underline"
                    >
                      Pick from list
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sport / Program */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                Sport or Program <span className="text-thread-600">*</span>
              </label>
              <select
                value={sportOrProgram}
                onChange={(e) => setSportOrProgram(e.target.value)}
                className="w-full h-11 bg-paper-0 border border-border-strong rounded-md px-3 text-sm text-ink-900 focus:outline-none focus:border-thread-600 font-ui"
              >
                {PROGRAM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Visual Patch Tile Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-ink-900 tracking-wide font-ui">
                Select the Patch You Earned <span className="text-thread-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-border rounded-lg bg-paper-100">
                {patches.map((p) => {
                  const isSelected = selectedPatchSku === p.sku;
                  return (
                    <div
                      key={p.sku}
                      onClick={() => setSelectedPatchSku(p.sku)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedPatchSku(p.sku)}
                      className={`relative p-2.5 rounded-lg border-2 text-left cursor-pointer transition-all flex items-center gap-3 bg-paper-0 ${
                        isSelected
                          ? 'border-thread-600 ring-2 ring-thread-600/20 shadow-sh-2'
                          : 'border-border hover:border-ink-700'
                      }`}
                    >
                      <PatchArt
                        sku={p.sku}
                        category={p.category}
                        shape={p.shape}
                        size={40}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-ink-900 truncate font-display">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Chip label={p.category} category={p.category} size="sm" />
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-thread-600 text-paper-0 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Quantity Expander */}
            <div className="pt-1">
              {!showQuantityPicker ? (
                <button
                  type="button"
                  onClick={() => setShowQuantityPicker(true)}
                  className="text-xs text-text-3 hover:text-ink-900 underline"
                >
                  Received more than one copy?
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 bg-paper-0 border border-border rounded-md">
                  <span className="text-xs font-semibold text-ink-900">Total Patches Received:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-9 text-center border border-border-strong rounded font-semibold text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="mt-4 space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
                Review your entry
              </h2>
              <p className="text-xs text-text-2 mt-1 font-ui">
                Verify the details before recording your patch.
              </p>
            </div>

            {/* Summary Ticket Card */}
            <div className="bg-paper-0 border-2 border-border-strong rounded-lg p-5 shadow-sh-2 space-y-4 stitched-border">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <PatchArt
                    sku={selectedPatch.sku}
                    category={selectedPatch.category}
                    shape={selectedPatch.shape}
                    size={48}
                  />
                  <div>
                    <h3 className="text-base font-display font-semibold text-ink-900">
                      {selectedPatch.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip label={selectedPatch.category} category={selectedPatch.category} size="sm" />
                      <span className="text-xs text-text-3 font-mono">{selectedPatch.sku}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-thread-600 hover:underline font-semibold"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-ui">
                <div>
                  <span className="text-text-3 block">Student Name</span>
                  <span className="font-semibold text-ink-900">
                    {firstName} {lastInitial.toUpperCase()}.
                  </span>
                </div>
                <div>
                  <span className="text-text-3 block">Class of</span>
                  <span className="font-semibold text-ink-900">{effectiveGradYear}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-text-3 block">High School</span>
                  <span className="font-semibold text-ink-900">{selectedSchool.name}</span>
                  <span className="text-[11px] text-text-3 block">{selectedSchool.conference}</span>
                </div>
                <div>
                  <span className="text-text-3 block">Sport / Activity</span>
                  <span className="font-semibold text-ink-900">{sportOrProgram}</span>
                </div>
                <div>
                  <span className="text-text-3 block">Quantity</span>
                  <span className="font-semibold text-ink-900">{quantity}</span>
                </div>
              </div>
            </div>

            {/* Permission Checkbox */}
            <div className="p-4 bg-paper-100 rounded-lg border border-border">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={parentPermissionConfirmed}
                  onChange={(e) => {
                    setParentPermissionConfirmed(e.target.checked);
                    if (errors.permission) setErrors((prev) => ({ ...prev, permission: '' }));
                  }}
                  className="mt-1 w-4 h-4 rounded border-border-strong text-thread-600 focus:ring-thread-600"
                />
                <span className="text-xs text-ink-900 font-ui leading-relaxed">
                  I confirm that I am a high school student who earned this patch, or a parent/guardian submitting on their behalf.
                </span>
              </label>
              {errors.permission && (
                <p className="text-xs text-status-error mt-2 font-medium">{errors.permission}</p>
              )}
            </div>
          </div>
        )}

        {/* Duplicate Warning Modal */}
        {duplicateWarning.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40">
            <div className="bg-paper-0 rounded-lg border border-border max-w-sm w-full p-5 shadow-sh-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-display font-semibold text-ink-900">
                Possible duplicate registration
              </h4>
              <p className="text-xs text-text-2 mt-1 leading-relaxed">
                A registration for <strong>{firstName} {lastInitial.toUpperCase()}.</strong> with this patch at <strong>{selectedSchool.name}</strong> was already logged (Ref: {duplicateWarning.ref || 'AAP-R-0131'}).
              </p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDuplicateWarning({ show: false })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setDuplicateWarning({ show: false });
                    setStep(3);
                  }}
                >
                  Yes, it's a different patch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <footer className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-3 bg-paper-50 sticky bottom-0 z-10">
        {step < 3 ? (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (step === 2) setStep(1);
                else navigate('/s');
              }}
              className="flex-1"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button
              type="button"
              variant="accent"
              onClick={handleNext}
              className="flex-1"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="accent"
            size="lg"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            className="w-full text-base font-semibold"
          >
            Register this patch
          </Button>
        )}
      </footer>
    </div>
  );
};
