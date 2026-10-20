import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { VerificationCase } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DocumentPreviewModal } from '../../components/ui/DocumentPreviewModal';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  Search,
  Filter,
  FileText,
  PhoneCall,
  ArrowLeft,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Plus
} from 'lucide-react';

/* ----------------------------------------------------
   1. VERIFICATION QUEUE & OVERVIEW (PRD Page 12 & 13)
---------------------------------------------------- */
export const VerificationQueueView: React.FC = () => {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const pendingCount = state.verificationCases.filter(c => c.status === 'Pending').length;
  const inReviewCount = state.verificationCases.filter(c => c.status === 'In review').length;
  const moreInfoCount = state.verificationCases.filter(c => c.status === 'More info needed').length;
  const approvedCount = state.verificationCases.filter(c => c.status === 'Approved').length;

  const filteredCases = state.verificationCases.filter(c => {
    const matchesSearch =
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateRole.toLowerCase().includes(search.toLowerCase()) ||
      c.evidenceTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.reviewer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#777F79] block">
            VERIFICATION MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Review Queue</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Review qualifications and evidence with a clear, traceable workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#356653] font-semibold bg-[#E7EEE7] px-3 py-1 rounded-full border border-[#C5D9C5]">
            Officer: Sofia Berg
          </span>
        </div>
      </div>

      {/* 4 Metrics from PRD Page 13 Visual Reference */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs font-semibold text-[#777F79] block mb-1">Pending reviews</span>
          <span className="text-3xl font-bold text-[#28332F]">{pendingCount < 10 ? `0${pendingCount}` : pendingCount}</span>
          <p className="text-[11px] text-[#A87532] mt-1">Awaiting verification</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs font-semibold text-[#777F79] block mb-1">Reviewed today</span>
          <span className="text-3xl font-bold text-[#24483D]">12</span>
          <p className="text-[11px] text-[#356653] mt-1">Registry queries completed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs font-semibold text-[#777F79] block mb-1">More information</span>
          <span className="text-3xl font-bold text-[#A87532]">{moreInfoCount < 10 ? `0${moreInfoCount}` : moreInfoCount}</span>
          <p className="text-[11px] text-[#777F79] mt-1">Waiting on candidate scan</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E5DD] shadow-xs">
          <span className="text-xs font-semibold text-[#777F79] block mb-1">Expiring soon</span>
          <span className="text-3xl font-bold text-[#A84F4B]">07</span>
          <p className="text-[11px] text-[#777F79] mt-1">Within 45 days</p>
        </div>
      </div>

      {/* Queue Table with Search & Filter Controls */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E5DD]">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777F79]" />
            <input
              type="text"
              placeholder="Filter queue by candidate, title or reviewer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg focus:bg-white text-[#28332F]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#777F79]" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1 text-xs border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] text-[#28332F]"
            >
              <option value="All">All Review Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In review">In review</option>
              <option value="Approved">Approved</option>
              <option value="More info needed">More info needed</option>
            </select>
          </div>
        </div>

        {/* 1:1 REPLICATION OF VISUAL REFERENCE TABLE (PRD Page 13) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#777F79] uppercase tracking-wider text-[10px] border-b border-[#E5E5DD]">
              <tr>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Evidence</th>
                <th className="py-3 px-4 font-semibold">Submitted</th>
                <th className="py-3 px-4 font-semibold">Reviewer</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DD]">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#28332F]">
                    <p>{c.candidateName}</p>
                    <span className="text-[10px] text-[#777F79] font-normal">{c.candidateRole}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#28332F]">
                    <p className="font-semibold">{c.evidenceTitle}</p>
                    <span className="text-[10px] text-[#356653] font-mono">{c.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#777F79]">{c.submissionDate}</td>
                  <td className="py-3.5 px-4 text-[#28332F] font-medium">{c.reviewer}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status === 'Approved'
                          ? 'bg-[#E7EEE7] text-[#24483D]'
                          : c.status === 'In review'
                          ? 'bg-[#EBF1ED] text-[#356653]'
                          : c.status === 'More info needed'
                          ? 'bg-[#FAF3E8] text-[#A87532]'
                          : 'bg-[#FAF3E8] text-[#A87532]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/app/verification/cases/${c.id}`)}
                    >
                      Review case
                    </Button>
                  </td>
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
   2. CASE DETAIL WORKSPACE (PRD Page 12)
---------------------------------------------------- */
export const CaseDetailWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, showToast } = useDemo();
  const navigate = useNavigate();

  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [moreInfoReasonModal, setMoreInfoReasonModal] = useState(false);
  const [moreInfoReason, setMoreInfoReason] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [interviewNote, setInterviewNote] = useState('');
  const [showDocModal, setShowDocModal] = useState(false);

  const verificationCase = state.verificationCases.find(c => c.id === id) || state.verificationCases[0];
  const candidate = state.candidates.find(c => c.id === verificationCase.candidateId) || state.candidates[0];
  const targetDoc = candidate.documents.find(
    d => d.title.toLowerCase().includes(verificationCase.evidenceTitle.toLowerCase()) ||
         verificationCase.evidenceTitle.toLowerCase().includes(d.title.toLowerCase())
  ) || candidate.documents[0];

  const handleApprove = () => {
    dispatch({
      type: 'VERIFICATION_DECISION',
      payload: {
        caseId: verificationCase.id,
        status: 'Approved',
        officer: 'Sofia Berg',
        note: 'Holographic seal and national register validated.'
      }
    });
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'VERIFICATION_DECISION',
      payload: {
        caseId: verificationCase.id,
        status: 'Rejected',
        reason: rejectReason,
        officer: 'Sofia Berg'
      }
    });
    setRejectReasonModal(false);
    setRejectReason('');
  };

  const handleMoreInfoConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'VERIFICATION_DECISION',
      payload: {
        caseId: verificationCase.id,
        status: 'More info needed',
        reason: moreInfoReason,
        officer: 'Sofia Berg'
      }
    });
    setMoreInfoReasonModal(false);
    setMoreInfoReason('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    dispatch({
      type: 'ADD_CASE_NOTE',
      payload: {
        caseId: verificationCase.id,
        note: `[Sofia Berg] ${noteInput}`
      }
    });
    setNoteInput('');
  };

  const handleSaveInterviewOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewNote.trim()) return;
    dispatch({
      type: 'RECORD_INTERVIEW_OUTCOME',
      payload: {
        caseId: verificationCase.id,
        outcome: interviewNote
      }
    });
    setInterviewNote('');
  };

  const handleReassign = (newReviewer: string) => {
    dispatch({
      type: 'ASSIGN_CASE',
      payload: { caseId: verificationCase.id, reviewer: newReviewer }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/app/verification/queue')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#24483D]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verification Queue</span>
        </button>
      </div>

      {/* Case Header */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">Case {verificationCase.id}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E5E5DD]">
              Priority: {verificationCase.priority}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28332F] mt-1">
            {verificationCase.evidenceTitle}
          </h1>
          <p className="text-xs text-[#777F79]">
            Submitted by <strong>{verificationCase.candidateName}</strong> on {verificationCase.submissionDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase text-[#777F79] block">Case Status</span>
            <span className="text-sm font-bold text-[#24483D]">{verificationCase.status}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => setShowDocModal(true)}
          >
            Inspect Document PDF
          </Button>
        </div>
      </div>

      {/* 2-Column Case Workspace (PRD Page 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Candidate Summary, Document Preview & Submitted Metadata */}
        <div className="lg:col-span-6 space-y-6">
          {/* Candidate Summary */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#777F79]">
              Candidate Summary & Dossier
            </h3>
            <div className="flex items-center gap-3 pb-3 border-b border-[#E5E5DD]">
              <div className="w-10 h-10 rounded-lg bg-[#24483D] text-white font-bold text-sm flex items-center justify-center">
                {candidate.initials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#28332F]">{candidate.name}</h4>
                <p className="text-xs text-[#356653] font-medium">{candidate.title}</p>
                <p className="text-[11px] text-[#777F79]">{candidate.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#777F79]">
              <div>
                <span className="block font-semibold text-[#28332F]">Experience:</span>
                <span>{candidate.experienceYears} Years</span>
              </div>
              <div>
                <span className="block font-semibold text-[#28332F]">Notice Period:</span>
                <span>{candidate.availability}</span>
              </div>
            </div>
          </div>

          {/* Submitted Document Metadata */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#777F79]">
              Submitted Metadata & Audit Hashes
            </h3>
            <div className="space-y-2.5 text-xs text-[#28332F]">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5DD]">
                <span className="text-[#777F79]">Document Title:</span>
                <span className="font-semibold">{targetDoc.title}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5DD]">
                <span className="text-[#777F79]">Issuing Authority:</span>
                <span className="font-semibold">{targetDoc.issuer}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5DD]">
                <span className="text-[#777F79]">Certificate Serial:</span>
                <span className="font-mono text-[#356653] font-semibold">{targetDoc.documentNumber || 'SE-DOC-9921'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5DD]">
                <span className="text-[#777F79]">National Registry Check:</span>
                <span className="font-medium text-[#24483D]">Registry match confirmed (Simulated)</span>
              </div>
            </div>
          </div>

          {/* Review Notes Feed */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#777F79]">
              Internal Review Notes
            </h3>

            <div className="space-y-2">
              {verificationCase.notes.map((note, idx) => (
                <div key={idx} className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg text-xs text-[#28332F]">
                  {note}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="space-y-2 pt-2">
              <input
                type="text"
                placeholder="Add internal verification note..."
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
              />
              <Button variant="outline" size="sm" type="submit">
                Add Note
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Checklist, Decision Actions, Reference Check, Reassign */}
        <div className="lg:col-span-6 space-y-6">
          {/* Verification Checklist (PRD Page 12) */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DD]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
                Standard Verification Checklist
              </h3>
              <span className="text-[11px] text-[#356653] font-semibold">
                {verificationCase.checklist.filter(c => c.checked).length} / {verificationCase.checklist.length} Passed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {verificationCase.checklist.map((item, i) => (
                <label key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FAF9F6] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="accent-[#24483D] w-4 h-4 rounded"
                  />
                  <span className="text-[#28332F]">{item.item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reference & Interview Outcome Record (PRD Page 12) */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
              Reference & Screening Outcome
            </h3>

            {verificationCase.referenceCheckResult && (
              <div className="p-3 bg-[#E7EEE7] border border-[#C5D9C5] rounded-lg space-y-1">
                <span className="font-bold text-[#24483D]">Reference Check Result:</span>
                <p className="text-[#28332F]">{verificationCase.referenceCheckResult}</p>
              </div>
            )}

            {verificationCase.interviewOutcome && (
              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg space-y-1">
                <span className="font-bold text-[#28332F]">Interview / Screening Outcome:</span>
                <p className="text-[#777F79]">{verificationCase.interviewOutcome}</p>
              </div>
            )}

            <form onSubmit={handleSaveInterviewOutcome} className="space-y-2 pt-2">
              <label className="font-semibold text-[#28332F] block">Record Screening Outcome</label>
              <textarea
                rows={2}
                placeholder="Log supervisor reference call details or technical phone screening..."
                value={interviewNote}
                onChange={e => setInterviewNote(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
              />
              <Button variant="outline" size="sm" type="submit" icon={<PhoneCall className="w-3.5 h-3.5" />}>
                Save Screening Record
              </Button>
            </form>
          </div>

          {/* Supported Demo Decisions (PRD Page 12) */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#28332F]">
              Record Officer Decision
            </h3>
            <p className="text-xs text-[#777F79]">
              Recording a decision updates candidate profile, match scores, queue and platform audit feeds in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="primary"
                className="w-full sm:flex-1"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleApprove}
              >
                Approve Evidence
              </Button>
              <Button
                variant="outline"
                className="w-full sm:flex-1 text-[#A87532] border-[#EDD9B8] hover:bg-[#FAF3E8]"
                icon={<Clock className="w-4 h-4" />}
                onClick={() => setMoreInfoReasonModal(true)}
              >
                Request More Info
              </Button>
              <Button
                variant="danger"
                className="w-full sm:flex-1"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => setRejectReasonModal(true)}
              >
                Reject Evidence
              </Button>
            </div>

            {/* Reassign case */}
            <div className="pt-4 border-t border-[#E5E5DD] flex items-center justify-between text-xs">
              <span className="text-[#777F79]">Assigned Reviewer: <strong>{verificationCase.reviewer}</strong></span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleReassign('Sofia Berg')}
                  className="px-2 py-1 bg-[#FAF9F6] border border-[#E5E5DD] rounded hover:bg-[#E5E5DD]"
                >
                  Sofia Berg
                </button>
                <button
                  onClick={() => handleReassign('Robin Andersson')}
                  className="px-2 py-1 bg-[#FAF9F6] border border-[#E5E5DD] rounded hover:bg-[#E5E5DD]"
                >
                  Robin Andersson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Reason Modal (PRD: reason required) */}
      <Modal
        isOpen={rejectReasonModal}
        onClose={() => setRejectReasonModal(false)}
        title="Reject Evidence (Reason Required)"
        maxWidth="md"
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Rejection Reason</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Scanned credential expired or could not be validated against national registry..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setRejectReasonModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Request More Info Modal (PRD: reason required) */}
      <Modal
        isOpen={moreInfoReasonModal}
        onClose={() => setMoreInfoReasonModal(false)}
        title="Request Additional Information (Reason Required)"
        maxWidth="md"
      >
        <form onSubmit={handleMoreInfoConfirm} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Information Required from Candidate</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Serial badge clipped on scan; please upload uncompressed high-resolution PDF..."
              value={moreInfoReason}
              onChange={e => setMoreInfoReason(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setMoreInfoReasonModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Document Inspection Modal */}
      {showDocModal && (
        <DocumentPreviewModal
          document={targetDoc}
          candidateName={verificationCase.candidateName}
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
        />
      )}
    </div>
  );
};

/* ----------------------------------------------------
   3. EXPIRATION TRACKING (PRD Page 12)
---------------------------------------------------- */
export const ExpirationTrackingView: React.FC = () => {
  const { state } = useDemo();
  const navigate = useNavigate();

  const [filterWindow, setFilterWindow] = useState<'all' | '30' | '90' | 'valid'>('30');

  // Extract all certificates with expirations across candidates
  const expiringCerts = state.candidates.flatMap(cand =>
    cand.documents
      .filter(doc => doc.expiryDate)
      .map(doc => {
        const expiry = new Date(doc.expiryDate!);
        const now = new Date('2026-10-20');
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          candidate: cand,
          doc,
          diffDays
        };
      })
  );

  const filteredCerts = expiringCerts.filter(({ diffDays }) => {
    if (filterWindow === '30') return diffDays <= 45 && diffDays > 0;
    if (filterWindow === '90') return diffDays <= 90 && diffDays > 0;
    if (filterWindow === 'valid') return diffDays > 90;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Expiration & Renewal Tracking</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Monitor statutory license expirations. Expired or pending evidence is never silently treated as valid.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#E5E5DD]">
          <button
            onClick={() => setFilterWindow('30')}
            className={`px-3 py-1 text-xs font-semibold rounded-md ${
              filterWindow === '30' ? 'bg-[#24483D] text-white' : 'text-[#777F79]'
            }`}
          >
            Expiring within 30-45 Days
          </button>
          <button
            onClick={() => setFilterWindow('90')}
            className={`px-3 py-1 text-xs font-semibold rounded-md ${
              filterWindow === '90' ? 'bg-[#24483D] text-white' : 'text-[#777F79]'
            }`}
          >
            Within 90 Days
          </button>
          <button
            onClick={() => setFilterWindow('valid')}
            className={`px-3 py-1 text-xs font-semibold rounded-md ${
              filterWindow === 'valid' ? 'bg-[#24483D] text-white' : 'text-[#777F79]'
            }`}
          >
            Valid Long-Term
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map(({ candidate, doc, diffDays }) => (
          <div key={doc.id} className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xs text-[#28332F]">{doc.title}</h3>
                <p className="text-[11px] text-[#356653] font-medium">{candidate.name}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  diffDays <= 45 ? 'bg-[#FAF3E8] text-[#A87532]' : 'bg-[#E7EEE7] text-[#24483D]'
                }`}
              >
                {diffDays <= 45 ? `Expires in ${diffDays}d` : `Valid (${diffDays}d)`}
              </span>
            </div>

            <p className="text-xs text-[#777F79]">
              Issuer: {doc.issuer} · Serial: {doc.documentNumber || 'SE-CERT'}
            </p>
            <p className="text-xs text-[#28332F] font-mono">Expiration Date: {doc.expiryDate}</p>

            <div className="pt-2 border-t border-[#E5E5DD] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/app/employer/candidates/${candidate.id}`)}
              >
                Open Candidate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
