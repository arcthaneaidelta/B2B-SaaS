import React, { useState } from 'react';
import { useDemo } from '../../state/demo-store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DocumentPreviewModal } from '../../components/ui/DocumentPreviewModal';
import { CandidateDocument } from '../../types';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Printer,
  Lock,
  Calendar,
  Briefcase,
  MapPin,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  UploadCloud,
  Check
} from 'lucide-react';

/* ----------------------------------------------------
   1. CANDIDATE OVERVIEW
---------------------------------------------------- */
export const CandidateOverview: React.FC = () => {
  const { state, showToast } = useDemo();
  // Erik Lindström is candidate 0
  const candidate = state.candidates[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">
            Welcome back, {candidate.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Your verified career credentials and digital identity portal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={candidate.verificationLevel} size="md" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Dossier Strength</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#24483D]">96%</span>
            <span className="text-xs text-[#356653] font-semibold">Verified High</span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">All primary licenses confirmed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Audited Documents</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#28332F]">{candidate.documents.length}</span>
            <span className="text-xs text-[#356653] font-semibold">Active & Valid</span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">ECY, SSG Entre & ID06</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Employer Views</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#28332F]">28</span>
            <span className="text-xs text-[#356653] font-semibold">+6 this week</span>
          </div>
          <p className="text-[11px] text-[#777F79] mt-2">Matched to Gothenburg roles</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs uppercase font-bold text-[#777F79] block mb-1">Digital Passport</span>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-[#24483D]">
              {candidate.isPassportShared ? 'Active (Shared)' : 'Private'}
            </span>
            <QrCode className="w-5 h-5 text-[#356653]" />
          </div>
          <p className="text-[11px] text-[#777F79] mt-2 font-mono">{candidate.passportId}</p>
        </div>
      </div>

      {/* Quick passport preview snippet */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#28332F]">Digital Professional Passport</h3>
          <p className="text-xs text-[#777F79]">
            Share your cryptographic credentials with hiring contractors without exposing your Swedish personal number.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => window.location.href = '#/app/candidate/passport'}>
          Open Digital Passport View
        </Button>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   2. DIGITAL PROFESSIONAL PASSPORT (PRD Page 11 Visual Reference)
---------------------------------------------------- */
export const CandidatePassport: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const candidate = state.candidates[0];

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCompany, setShareCompany] = useState('Volvo Cars Torslanda Plant');
  const [shareDays, setShareDays] = useState('14');

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SHARE_PASSPORT', payload: candidate.id });
    setShowShareModal(false);
    showToast(`Shared digital passport token with ${shareCompany}`, 'success');
  };

  const handleRevoke = () => {
    dispatch({ type: 'REVOKE_PASSPORT_ACCESS', payload: candidate.id });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Digital Professional Passport</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Tamper-evident professional credential card and verifiable QR access token.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print Credential
          </Button>

          {candidate.isPassportShared ? (
            <Button
              variant="outline"
              size="sm"
              className="text-[#A84F4B] hover:bg-[#FDF2F2]"
              onClick={handleRevoke}
            >
              Revoke Access
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={<Share2 className="w-4 h-4" />}
              onClick={() => setShowShareModal(true)}
            >
              Share Passport
            </Button>
          )}
        </div>
      </div>

      {/* 1:1 REPLICATION OF DIGITAL PASSPORT (PRD Page 11 Visual Reference) */}
      <div className="bg-white border-2 border-[#E5E5DD] rounded-2xl p-8 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-[#E7EEE7]/40 pointer-events-none" />

        {/* Card Top Branding */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E5DD]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#24483D] flex items-center justify-center text-white font-bold text-sm">
              <ShieldCheck className="w-6 h-6 text-[#E7EEE7]" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-[#28332F] text-base leading-tight block">VERITY</span>
              <span className="text-[9px] uppercase tracking-wider text-[#777F79] font-semibold">
                Digital Professional Passport
              </span>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#FAF3E8] border border-[#EDD9B8] text-[#A87532] text-xs font-mono font-semibold rounded-md">
            DEMO CREDENTIAL
          </span>
        </div>

        {/* Candidate Identity Header with QR Layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#24483D] text-[#E7EEE7] font-bold text-2xl flex items-center justify-center shrink-0 border border-[#356653] shadow-xs">
              {candidate.initials}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#28332F]">{candidate.name}</h2>
              <p className="text-sm font-semibold text-[#356653]">{candidate.title}</p>
              <p className="text-xs text-[#777F79]">{candidate.location} · {candidate.availability}</p>
            </div>
          </div>

          {/* QR Code Module (PRD Page 11: Locally generated decorative QR / sample code) */}
          <div className="flex flex-col items-center p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl text-center self-start md:self-auto">
            {/* SVG Decorative QR Representation */}
            <svg className="w-24 h-24 text-[#24483D]" viewBox="0 0 100 100" fill="currentColor">
              {/* Corner position markers */}
              <rect x="5" y="5" width="26" height="26" rx="3" fill="#24483D" />
              <rect x="9" y="9" width="18" height="18" fill="white" />
              <rect x="13" y="13" width="10" height="10" fill="#24483D" />

              <rect x="69" y="5" width="26" height="26" rx="3" fill="#24483D" />
              <rect x="73" y="9" width="18" height="18" fill="white" />
              <rect x="77" y="13" width="10" height="10" fill="#24483D" />

              <rect x="5" y="69" width="26" height="26" rx="3" fill="#24483D" />
              <rect x="9" y="73" width="18" height="18" fill="white" />
              <rect x="13" y="77" width="10" height="10" fill="#24483D" />

              {/* Data pixel matrix simulation */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="46" y="8" width="6" height="6" />
              <rect x="56" y="14" width="6" height="6" />
              <rect x="36" y="24" width="6" height="6" />
              <rect x="48" y="24" width="6" height="6" />

              <rect x="14" y="38" width="6" height="6" />
              <rect x="24" y="44" width="6" height="6" />
              <rect x="36" y="40" width="8" height="8" />
              <rect x="50" y="40" width="6" height="6" />
              <rect x="62" y="38" width="6" height="6" />
              <rect x="76" y="44" width="6" height="6" />

              <rect x="40" y="56" width="6" height="6" />
              <rect x="54" y="54" width="6" height="6" />
              <rect x="68" y="56" width="6" height="6" />
              <rect x="80" y="60" width="6" height="6" />

              <rect x="36" y="72" width="6" height="6" />
              <rect x="48" y="78" width="6" height="6" />
              <rect x="60" y="72" width="6" height="6" />
              <rect x="74" y="76" width="6" height="6" />
            </svg>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#777F79] mt-1.5 font-bold">
              SAMPLE QR · NOT SCANNABLE
            </span>
            <span className="text-[8px] text-[#777F79] font-mono">TOKEN: SE-VERITY-7849</span>
          </div>
        </div>

        {/* 3 Metric Summary Boxes (PRD Page 11: Experience, Qualifications, Verification Level) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block mb-1">
              Professional Experience
            </span>
            <span className="text-xl font-bold text-[#28332F]">{candidate.experienceYears} years</span>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block mb-1">
              Qualifications
            </span>
            <span className="text-xl font-bold text-[#28332F]">
              {candidate.documents.length} reviewed records
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79] block mb-1">
              Verification Level
            </span>
            <StatusBadge status={candidate.verificationLevel} size="md" />
          </div>
        </div>

        {/* Verification History (PRD Page 11) */}
        <div className="space-y-4 pt-4 border-t border-[#E5E5DD]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
            Verification History
          </h3>

          <div className="space-y-2 text-xs">
            {candidate.verificationHistory.map(vh => (
              <div key={vh.id} className="flex items-center gap-3 text-[#28332F]">
                <span className="w-2 h-2 rounded-full bg-[#24483D] shrink-0" />
                <span className="font-mono text-[#777F79] text-[11px] w-24 shrink-0">{vh.date}</span>
                <span className="font-semibold">{vh.action}</span>
                <span className="text-[#777F79]">· {vh.by}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer Disclaimer */}
        <div className="pt-4 border-t border-[#E5E5DD] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#777F79] gap-2">
          <span>Official VERITY Digital Credential · Issued in the Kingdom of Sweden</span>
          <span className="font-semibold text-[#A87532]">Not a real government identity card</span>
        </div>
      </div>

      {/* Simulated Sharing Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Digital Professional Passport"
        subtitle="Generate time-limited verification token for employer"
        maxWidth="md"
      >
        <form onSubmit={handleShareSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Employer / Company Name</label>
            <input
              type="text"
              required
              value={shareCompany}
              onChange={e => setShareCompany(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Token Validity Duration</label>
            <select
              value={shareDays}
              onChange={e => setShareDays(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days (Standard)</option>
              <option value="30">30 Days</option>
            </select>
          </div>

          <div className="p-3 bg-[#E7EEE7] border border-[#C5D9C5] rounded-lg text-[#24483D] space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Privacy Protected
            </span>
            <p className="text-[11px]">
              The employer receives read-only access to your verified licenses. You can revoke access at any time.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5DD]">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowShareModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Generate & Share Token
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ----------------------------------------------------
   3. QUALIFICATIONS & DOCUMENTS VIEW
---------------------------------------------------- */
export const CandidateDocuments: React.FC = () => {
  const { state, showToast } = useDemo();
  const candidate = state.candidates[0];
  const [selectedDoc, setSelectedDoc] = useState<CandidateDocument | null>(null);

  const handleSimulateUpload = () => {
    showToast('Simulated document upload: "Elsäkerhetsverket AL License Certificate (PDF)" received for officer review', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Qualifications & Evidence</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Manage your uploaded certificates, trade credentials, and safety passports.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UploadCloud className="w-4 h-4" />}
          onClick={handleSimulateUpload}
        >
          Upload New Document (Simulate)
        </Button>
      </div>

      <div className="space-y-4">
        {candidate.documents.map(doc => (
          <div
            key={doc.id}
            className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#28332F]">{doc.title}</h3>
                <StatusBadge status={doc.status} size="sm" />
              </div>
              <p className="text-xs text-[#777F79]">
                Issued by <strong className="text-[#28332F]">{doc.issuer}</strong> on {doc.issueDate}
                {doc.expiryDate && ` · Valid until ${doc.expiryDate}`}
              </p>
              {doc.notes && (
                <p className="text-[11px] text-[#356653] font-medium">Audit Note: {doc.notes}</p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => setSelectedDoc(doc)}
            >
              Inspect Document
            </Button>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <DocumentPreviewModal
          document={selectedDoc}
          candidateName={candidate.name}
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};

/* ----------------------------------------------------
   4. PROFILE EDITOR
---------------------------------------------------- */
export const CandidateProfile: React.FC = () => {
  const { state, showToast } = useDemo();
  const candidate = state.candidates[0];

  const [title, setTitle] = useState(candidate.title);
  const [summary, setSummary] = useState(candidate.summary);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile saved successfully', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Professional Profile</h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Edit your technical headline, experience summary, and trade competencies.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#28332F] mb-1">Professional Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#28332F] mb-1">Executive Summary</label>
          <textarea
            rows={5}
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" type="submit">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

/* ----------------------------------------------------
   5. PRIVACY & VISIBILITY CONTROLS
---------------------------------------------------- */
export const CandidatePrivacy: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const candidate = state.candidates[0];

  const [privacy, setPrivacy] = useState(candidate.privacy);

  const handleToggle = (key: keyof typeof privacy) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    dispatch({
      type: 'UPDATE_CANDIDATE_PRIVACY',
      payload: { candidateId: candidate.id, privacy: updated }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="pb-4 border-b border-[#E5E5DD]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
            <Lock className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Privacy & Visibility Controls</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
          Control how your professional data and contact details are shown to verified employers.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-lg border border-[#E5E5DD]">
            <div>
              <p className="font-semibold text-[#28332F]">Anonymous Initial Matching</p>
              <p className="text-[#777F79] text-[11px]">
                Employers see your qualifications and match score, but your name and photo remain hidden until mutually approved.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.anonymousInitialReview}
              onChange={() => handleToggle('anonymousInitialReview')}
              className="accent-[#24483D] w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-lg border border-[#E5E5DD]">
            <div>
              <p className="font-semibold text-[#28332F]">Direct Employer Contact Requests</p>
              <p className="text-[#777F79] text-[11px]">
                Allow verified employers with 80%+ match to send direct interview invitations to your inbox.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.directContactAllowed}
              onChange={() => handleToggle('directContactAllowed')}
              className="accent-[#24483D] w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-lg border border-[#E5E5DD]">
            <div>
              <p className="font-semibold text-[#28332F]">Share Full Audited Credentials on Match</p>
              <p className="text-[#777F79] text-[11px]">
                Automatically disclose verified certificate numbers to employers when shortlisted.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.shareFullDocumentsOnMatch}
              onChange={() => handleToggle('shareFullDocumentsOnMatch')}
              className="accent-[#24483D] w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
