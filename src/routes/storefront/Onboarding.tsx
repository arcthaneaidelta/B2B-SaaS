import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Check, ArrowRight, ArrowLeft, UploadCloud, Download, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { downloadSampleCsv } from '../../mock/api';
import { validateEmail, validatePostcode, validateDriveUrl } from '../../mock/validators';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const orderNumber = useStore((s) => s.orderNumber);
  const cart = useStore((s) => s.cart);
  const addCustomerAccount = useStore((s) => s.addCustomerAccount);
  const resetDemo = useStore((s) => s.resetDemo);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [company, setCompany] = useState('Northgate Dental');
  const [ownerName, setOwnerName] = useState('Priya Raman');
  const [ownerTitle, setOwnerTitle] = useState('Practice Manager');
  const [email, setEmail] = useState('priya@northgatedental.com');
  const accountId = 'ACCT-0417';

  // Step 2: Sender Profile
  const [line1, setLine1] = useState('214 Elm Street');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Columbus');
  const [state, setState] = useState('OH');
  const [postcode, setPostcode] = useState('43215');
  const [country, setCountry] = useState('US');

  // Step 3: Preferences
  const [template, setTemplate] = useState('welcome_v2');
  const [message, setMessage] = useState('Welcome to our practice. We are delighted to partner with your team.');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [personalizeFirstName, setPersonalizeFirstName] = useState(true);
  const [addReferenceCode, setAddReferenceCode] = useState(true);

  // Step 4: Data Upload
  const [driveUrl, setDriveUrl] = useState('https://drive.google.com/file/d/1A8zX_recipients_2026/view');
  const [uploadedFile, setUploadedFile] = useState<string | null>('recipients-master.csv');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCurrentStep = () => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!company.trim()) errs.company = 'Company legal name is required';
      if (!ownerName.trim()) errs.ownerName = 'Contact name is required';
      if (!validateEmail(email)) errs.email = 'Valid work email required';
    } else if (step === 2) {
      if (!line1.trim()) errs.line1 = 'Street address is required';
      if (!city.trim()) errs.city = 'City is required';
      if (!validatePostcode(postcode, country)) {
        errs.postcode = `Postal code invalid for ${country}`;
      }
    } else if (step === 4) {
      if (!driveUrl && !uploadedFile) {
        errs.data = 'Please supply either a Google Drive URL or drop a CSV file';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(s + 1, 5));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Save newly created customer account to Zustand store (will appear top of Google Sheets!)
    addCustomerAccount({
      accountId,
      company,
      ownerName,
      ownerTitle,
      email,
      plan: (cart?.planName as 'Starter' | 'Growth' | 'Scale') || 'Growth',
      cadence: (cart?.cadence === 'quarterly' ? 'Quarterly' : 'Monthly'),
      template,
      address: {
        line1,
        line2: line2 || undefined,
        city,
        state,
        postcode,
        country,
      },
      attributes: {
        includeLogo,
        personalizeFirstName,
        addReferenceCode,
      },
      submittedAt: 'Just now (New)',
      isNew: true,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto px-6 py-12 flex flex-col gap-6">
      {/* Top Bar with Tally-style brand micro-label and reset */}
      <div className="flex items-center justify-between text-xs text-[#7A817B]">
        <span className="font-mono uppercase tracking-wider">
          Powered by a form builder · Tally style
        </span>
        <button
          type="button"
          onClick={resetDemo}
          className="text-[#7A817B] hover:text-[#1F2421] flex items-center gap-1 font-mono hover:underline"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset demo</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#EFEBE4] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#24473B]"
          initial={{ width: '20%' }}
          animate={{ width: `${(step / 5) * 100}%` }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {!isSubmitted ? (
        <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 sm:p-10 shadow-2 flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#7A817B] pb-2 border-b border-[#E3DED5]">
            <span>STEP {step} OF 5</span>
            <span className="text-[#24473B] font-semibold">
              KEY: {accountId}
            </span>
          </div>

          <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              {/* STEP 1: ACCOUNT */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="font-display text-2xl text-[#1F2421] font-medium">
                      Account & Primary Sender
                    </h2>
                    <p className="text-sm text-[#7A817B] mt-1">
                      This information pairs with your Shopify order #{orderNumber}.
                    </p>
                  </div>

                  <div className="p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm text-xs font-mono text-[#4A524D] flex justify-between">
                    <span>UNIQUE ACCOUNT KEY:</span>
                    <span className="font-bold text-[#24473B]">{accountId} (Read-only)</span>
                  </div>

                  <Input
                    label="Company Legal Name"
                    required
                    value={company}
                    error={errors.company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Person Name"
                      required
                      value={ownerName}
                      error={errors.ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                    <Input
                      label="Professional Title"
                      value={ownerTitle}
                      onChange={(e) => setOwnerTitle(e.target.value)}
                    />
                  </div>
                  <Input
                    label="Work Email"
                    type="email"
                    required
                    value={email}
                    error={errors.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>
              )}

              {/* STEP 2: SENDER PROFILE ADDRESS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="font-display text-2xl text-[#1F2421] font-medium">
                      Sender Return Address
                    </h2>
                    <p className="text-sm text-[#7A817B] mt-1">
                      Physical address printed on envelopes and sent in the REST API payload.
                    </p>
                  </div>

                  <Input
                    label="Address Line 1"
                    required
                    value={line1}
                    error={errors.line1}
                    onChange={(e) => setLine1(e.target.value)}
                  />
                  <Input
                    label="Address Line 2 (Optional)"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="City"
                      required
                      value={city}
                      error={errors.city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      label="State / Province"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <Input
                      label="Postal Code"
                      required
                      value={postcode}
                      error={errors.postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  </div>

                  <Select
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    options={[
                      { label: 'United States (US)', value: 'US' },
                      { label: 'United Kingdom (UK)', value: 'UK' },
                      { label: 'Canada (CA)', value: 'CA' },
                    ]}
                  />
                </motion.div>
              )}

              {/* STEP 3: PREFERENCES & ATTRIBUTES */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="font-display text-2xl text-[#1F2421] font-medium">
                      Fulfillment Attributes & Template
                    </h2>
                    <p className="text-sm text-[#7A817B] mt-1">
                      Configure dynamic payload parameters applied during Make.com scenario processing.
                    </p>
                  </div>

                  <Select
                    label="Template Identifier"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    options={[
                      { label: 'welcome_v2 (Standard Greeting)', value: 'welcome_v2' },
                      { label: 'closing_gift_v3 (Client Milestones)', value: 'closing_gift_v3' },
                      { label: 'quarterly_review (Executive Summary)', value: 'quarterly_review' },
                    ]}
                  />

                  <Textarea
                    label="Default Message Note"
                    value={message}
                    maxChars={280}
                    onChange={(e) => setMessage(e.target.value)}
                    hint="Printed in the body of note cards (280 max characters)"
                  />

                  <div className="pt-2 flex flex-col gap-3 border-t border-[#E3DED5]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#4A524D]">
                      Dynamic Payload Flags
                    </span>

                    <label className="flex items-center gap-3 p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm cursor-pointer hover:bg-[#EFEBE4]">
                      <input
                        type="checkbox"
                        checked={includeLogo}
                        onChange={(e) => setIncludeLogo(e.target.checked)}
                        className="rounded border-[#CFC8BB] text-[#24473B]"
                      />
                      <span className="text-xs text-[#1F2421] font-medium">
                        Include high-res company logo on stationery
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm cursor-pointer hover:bg-[#EFEBE4]">
                      <input
                        type="checkbox"
                        checked={personalizeFirstName}
                        onChange={(e) => setPersonalizeFirstName(e.target.checked)}
                        className="rounded border-[#CFC8BB] text-[#24473B]"
                      />
                      <span className="text-xs text-[#1F2421] font-medium">
                        Personalize note with recipient first name (titleCase)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm cursor-pointer hover:bg-[#EFEBE4]">
                      <input
                        type="checkbox"
                        checked={addReferenceCode}
                        onChange={(e) => setAddReferenceCode(e.target.checked)}
                        className="rounded border-[#CFC8BB] text-[#24473B]"
                      />
                      <span className="text-xs text-[#1F2421] font-medium">
                        Attach trackable reference code (e.g. ND-0417-0091)
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: DATA UPLOAD */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="font-display text-2xl text-[#1F2421] font-medium">
                      Recipient Data Link
                    </h2>
                    <p className="text-sm text-[#7A817B] mt-1">
                      Supply a Google Drive link or verify with our preloaded sample CSV.
                    </p>
                  </div>

                  <Input
                    label="Google Drive Link (Public or Shared)"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    hint="Make scenario Parse Drive module will download and parse this file"
                  />

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E3DED5]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#FFFFFF] px-2 text-[#7A817B] font-mono">Or test with file</span>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-dashed border-[#CFC8BB] hover:border-[#24473B] rounded-md bg-[#FBFAF7] flex flex-col items-center justify-center gap-2 text-center transition-colors">
                    <UploadCloud className="w-8 h-8 text-[#24473B]" />
                    <div className="text-xs text-[#1F2421] font-medium">
                      {uploadedFile ? uploadedFile : 'Drag and drop recipient CSV here'}
                    </div>
                    <span className="text-[11px] text-[#7A817B]">
                      Verified RFC-4180 headers: recipient_name, address, city, postcode, account_id
                    </span>

                    <button
                      type="button"
                      onClick={downloadSampleCsv}
                      className="mt-2 text-xs font-mono text-[#24473B] bg-[#E4ECE7] px-3 py-1.5 rounded-sm hover:bg-[#d4e4db] flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download sample-recipients.csv</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: REVIEW & SUBMIT */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="flex flex-col gap-4 text-xs font-sans"
                >
                  <div>
                    <h2 className="font-display text-2xl text-[#1F2421] font-medium">
                      Review Parameters
                    </h2>
                    <p className="text-sm text-[#7A817B] mt-1">
                      Check parameters before syncing to the Google Sheets master tab.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FBFAF7] border border-[#E3DED5] rounded-md flex flex-col gap-2.5">
                    <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                      <span className="text-[#7A817B]">Account ID:</span>
                      <span className="font-mono font-bold text-[#24473B]">{accountId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                      <span className="text-[#7A817B]">Company:</span>
                      <span className="font-medium text-[#1F2421]">{company}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                      <span className="text-[#7A817B]">Sender:</span>
                      <span className="font-medium text-[#1F2421]">{ownerName} ({ownerTitle})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                      <span className="text-[#7A817B]">Return Address:</span>
                      <span className="text-[#1F2421]">{line1}, {city}, {state} {postcode}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#7A817B]">Attributes:</span>
                      <span className="text-[#2F7D57] font-medium">
                        {[includeLogo && 'Logo', personalizeFirstName && 'Personalize', addReferenceCode && 'RefCode'].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#E4ECE7] text-[#24473B] rounded-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Parameters will be appended as an active row in Customer Parameters.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E3DED5] mt-6">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  size="md"
                  variant="primary"
                  onClick={handleNext}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  isLoading={isSubmitting}
                  icon={<Check className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Submit Parameters
                </Button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* SUCCESS SCREEN PER PRD §9.6 */
        <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-8 sm:p-10 shadow-2 flex flex-col items-center text-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#E1F0E8] text-[#2F7D57] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-display text-2xl text-[#1F2421] font-medium">
              Received. Your data is on its way to the pipeline.
            </h2>
            <p className="text-sm text-[#4A524D] mt-2">
              Parameters for <strong className="text-[#1F2421]">{company}</strong> have been written to
              Google Sheets.
            </p>
          </div>

          {/* Mini Timeline: Received -> Written to Sheet -> Merge pending */}
          <div className="w-full p-4 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm text-left flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#2F7D57]">
              <span className="w-2 h-2 rounded-full bg-[#2F7D57]" />
              <span>1. Tally Form Data Received (200 OK)</span>
            </div>
            <div className="flex items-center gap-2 text-[#2F7D57]">
              <span className="w-2 h-2 rounded-full bg-[#2F7D57]" />
              <span>2. Written to Customer Parameters Sheet</span>
            </div>
            <div className="flex items-center gap-2 text-[#B7791F]">
              <span className="w-2 h-2 rounded-full bg-[#B7791F] animate-pulse" />
              <span>3. Ready for CSV Key Merge on Account ID</span>
            </div>
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/app/data')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Watch it in the Control Room
          </Button>
        </div>
      )}
    </div>
  );
};
