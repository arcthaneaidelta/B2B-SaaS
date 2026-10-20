import React from 'react';
import { Modal } from './Modal';
import { StatusBadge } from './Badge';
import { Button } from './Button';
import { CandidateDocument } from '../../types';
import { ShieldCheck, Calendar, Building2, Hash, FileText, Printer, Download } from 'lucide-react';

interface DocumentPreviewModalProps {
  document: CandidateDocument | null;
  candidateName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  candidateName,
  isOpen,
  onClose
}) => {
  if (!doc) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#24483D]" />
          <span>Professional Document Evidence Preview</span>
        </div>
      }
      subtitle="Fictional mock record for demonstration purposes"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Prominent Demo Watermark Alert */}
        <div className="bg-[#FAF3E8] border border-[#EDD9B8] rounded-lg p-3 flex items-center justify-between text-xs text-[#A87532]">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-[#A87532] text-white rounded text-[10px]">
              Demo Credential
            </span>
            <span>Simulated professional document. Not a legal or production identity check.</span>
          </div>
          <span className="font-mono text-[11px] opacity-75">ID: {doc.documentNumber || 'DOC-SE-MOCK'}</span>
        </div>

        {/* Certificate Certificate Sheet Mockup */}
        <div className="bg-[#FAF9F6] border-2 border-dashed border-[#D5D5CB] rounded-xl p-8 shadow-inner relative overflow-hidden">
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span className="text-8xl font-black uppercase text-[#24483D]">VERITY DEMO</span>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Header / Authority */}
            <div className="flex items-start justify-between border-b border-[#E5E5DD] pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#777F79] font-medium">Issuing Authority</p>
                <h4 className="text-lg font-bold text-[#24483D] flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4 text-[#356653]" />
                  {doc.issuer}
                </h4>
                <p className="text-xs text-[#777F79] mt-0.5">Kingdom of Sweden · Accredited Registry</p>
              </div>
              <div className="text-right">
                <StatusBadge status={doc.status} size="md" />
                <p className="text-[11px] text-[#777F79] mt-1 font-mono">{doc.category}</p>
              </div>
            </div>

            {/* Document Body */}
            <div className="py-2 text-center">
              <p className="text-xs uppercase tracking-wider text-[#777F79]">This document certifies competence of</p>
              <h3 className="text-2xl font-serif font-bold text-[#28332F] mt-1">{candidateName}</h3>
              <div className="inline-block mt-3 px-4 py-2 bg-white rounded-lg border border-[#E5E5DD] shadow-xs">
                <p className="text-sm font-semibold text-[#24483D]">{doc.title}</p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-lg border border-[#E5E5DD] text-xs">
              <div>
                <span className="text-[#777F79] block">Certificate No:</span>
                <span className="font-mono font-medium text-[#28332F]">{doc.documentNumber || 'SE-2026-X88'}</span>
              </div>
              <div>
                <span className="text-[#777F79] block">Issue Date:</span>
                <span className="font-medium text-[#28332F]">{doc.issueDate}</span>
              </div>
              <div>
                <span className="text-[#777F79] block">Expiry Date:</span>
                <span className="font-medium text-[#28332F]">{doc.expiryDate || 'Permanent / No Expiry'}</span>
              </div>
              <div>
                <span className="text-[#777F79] block">Last Reviewed:</span>
                <span className="font-medium text-[#28332F]">{doc.lastReviewedDate || 'Pending review'}</span>
              </div>
            </div>

            {/* Verification Seal & Notes */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5DD]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E7EEE7] flex items-center justify-center border border-[#C5D9C5] text-[#24483D]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#28332F]">
                    {doc.verifiedBy ? `Verified by ${doc.verifiedBy}` : 'Verification Bureau'}
                  </p>
                  <p className="text-[11px] text-[#777F79]">
                    {doc.notes || 'Holographic seal and institutional registry verification intact.'}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="inline-block p-2 bg-white border border-[#E5E5DD] rounded text-[10px] font-mono text-[#777F79]">
                  SHA-256: 7f8a...3b9e (DEMO)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#777F79] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            File format: {doc.fileSize || '1.2 MB PDF'}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print Record
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => {
                alert('Demo Action: Download mock synthetic verification certificate');
              }}
            >
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
