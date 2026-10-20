import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DocumentPreviewModal } from '../../components/ui/DocumentPreviewModal';
import { CandidateDocument } from '../../types';
import {
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  BookmarkCheck,
  QrCode,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowLeft,
  Share2,
  Plus,
  Kanban
} from 'lucide-react';

export const CandidateDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, showToast } = useDemo();
  const navigate = useNavigate();

  const [selectedDoc, setSelectedDoc] = useState<CandidateDocument | null>(null);

  const candidate = state.candidates.find(c => c.id === id) || state.candidates[0];
  const isShortlisted = state.shortlists.some(s => s.candidateIds.includes(candidate.id));

  const handleShortlistToggle = () => {
    dispatch({
      type: 'TOGGLE_SHORTLIST_CANDIDATE',
      payload: { shortlistId: 'sl-1', candidateId: candidate.id }
    });
  };

  const handleAddToPipeline = () => {
    dispatch({
      type: 'ADD_TO_PIPELINE',
      payload: {
        candidateId: candidate.id,
        requirementId: state.selectedRequirementId || 'req-got-elec',
        stage: 'Shortlisted'
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#24483D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Candidate Matches</span>
        </button>
      </div>

      {/* Candidate Dossier Header (PRD Page 11) */}
      <div className="bg-white border border-[#E5E5DD] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E5E5DD]">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#24483D] text-[#E7EEE7] font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#356653]">
              {candidate.initials}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">{candidate.name}</h1>
                <StatusBadge status={candidate.verificationLevel} size="md" />
              </div>
              <p className="text-base font-semibold text-[#356653]">{candidate.title}</p>
              <div className="flex items-center gap-4 text-xs text-[#777F79] pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#356653]" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#356653]" />
                  {candidate.experienceYears} Years Documented Experience
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#24483D]">
                  <Calendar className="w-3.5 h-3.5" />
                  Availability: {candidate.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant={isShortlisted ? 'secondary' : 'outline'}
              size="sm"
              icon={<BookmarkCheck className="w-4 h-4" />}
              onClick={handleShortlistToggle}
            >
              {isShortlisted ? 'Saved to Shortlist' : 'Add to Shortlist'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Kanban className="w-4 h-4" />}
              onClick={handleAddToPipeline}
            >
              Move to Pipeline
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<QrCode className="w-4 h-4" />}
              onClick={() => navigate('/app/candidate/passport')}
            >
              View Digital Passport
            </Button>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#777F79]">
            Professional Overview
          </h2>
          <p className="text-sm text-[#28332F] leading-relaxed max-w-4xl">
            {candidate.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Qualifications, Work History, Skills */}
        <div className="lg:col-span-8 space-y-8">
          {/* Audited Documents & Certificates (PRD Page 11) */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
              <div>
                <h3 className="text-base font-bold text-[#28332F]">
                  Audited Documents & Certificates
                </h3>
                <p className="text-xs text-[#777F79]">
                  Inspected certifications with issuing registry verification logs
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#E5E5DD] text-[#24483D]">
                {candidate.documents.length} Records
              </span>
            </div>

            <div className="space-y-3">
              {candidate.documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D5D5CB] transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-[#28332F]">{doc.title}</h4>
                      <StatusBadge status={doc.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-[#777F79]">
                      Issued by <strong className="text-[#28332F]">{doc.issuer}</strong> on {doc.issueDate}
                      {doc.expiryDate && ` · Expires ${doc.expiryDate}`}
                    </p>
                    {doc.notes && (
                      <p className="text-[11px] text-[#356653] italic font-medium">
                        Verification Note: {doc.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileText className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      Inspect Evidence
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employment History */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E5E5DD]">
              <h3 className="text-base font-bold text-[#28332F]">Employment History</h3>
              <p className="text-xs text-[#777F79]">Documented industrial tenures and plant roles</p>
            </div>

            <div className="space-y-4">
              {candidate.employmentHistory.map((job, idx) => (
                <div key={idx} className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#28332F]">{job.role}</h4>
                      <p className="text-xs text-[#356653] font-medium">{job.company} · {job.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#777F79] font-mono">{job.period}</span>
                      {job.verified && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7EEE7] text-[#24483D] font-bold border border-[#C5D9C5] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Tenured
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#777F79] leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Technical Competencies */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#28332F]">Technical Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg text-xs font-medium text-[#28332F]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Verification Audit Timeline & Travel Preferences */}
        <div className="lg:col-span-4 space-y-8">
          {/* Verification Audit History */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
              <h3 className="text-sm font-bold text-[#28332F]">Verification History</h3>
              <Clock className="w-4 h-4 text-[#777F79]" />
            </div>

            <div className="relative pl-4 border-l-2 border-[#E5E5DD] space-y-4 text-xs">
              {candidate.verificationHistory.map(vh => (
                <div key={vh.id} className="relative space-y-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#24483D] absolute -left-[21px] top-1" />
                  <p className="font-semibold text-[#28332F]">{vh.action}</p>
                  <p className="text-[11px] text-[#777F79]">{vh.date} by {vh.by}</p>
                  {vh.note && (
                    <p className="text-[11px] text-[#356653] italic">{vh.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Availability & Commute Preferences */}
          <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#28332F] pb-2 border-b border-[#E5E5DD]">
              Availability & Work Preferences
            </h3>
            <div className="space-y-2 text-[#777F79]">
              <div className="flex justify-between">
                <span>Notice period:</span>
                <span className="font-bold text-[#24483D]">{candidate.availability}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel radius:</span>
                <span className="font-semibold text-[#28332F]">{candidate.travelFlexibility}</span>
              </div>
              <div className="flex justify-between">
                <span>Languages:</span>
                <span className="font-semibold text-[#28332F]">
                  {candidate.languages.map(l => l.language).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Sharing Status */}
          <div className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#28332F]">
              <ShieldCheck className="w-4 h-4 text-[#24483D]" />
              <span>Candidate Privacy Protocol</span>
            </div>
            <p className="text-[#777F79] leading-relaxed">
              Candidate has granted direct employer contact permission. Personal identification number is masked until formal interview agreement.
            </p>
          </div>
        </div>
      </div>

      {/* Document Inspection Modal */}
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
