import React, { useState } from 'react';
import { useDemo } from '../../state/demo-store';
import { ContractAgreement } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { INTEGRATION_SLOTS } from '../../data/seed-subscriptions';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PenTool,
  Send,
  Eye,
  Plus,
  ShieldAlert,
  Sparkles,
  Building2,
  Calendar,
  XCircle
} from 'lucide-react';

export const ContractsView: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();

  const [selectedContract, setSelectedContract] = useState<ContractAgreement | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signatoryName, setSignatoryName] = useState('Erik Lindström');
  const [signatoryEmail, setSignatoryEmail] = useState('erik.lindstrom@nordicelectric.se');
  const [signingSuccess, setSigningSuccess] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContractName, setNewContractName] = useState('Standard Placement Framework – Swedish Electrician');
  const [newTemplate, setNewTemplate] = useState<ContractAgreement['template']>('Standard Placement Framework');

  const handleOpenSignModal = (contract: ContractAgreement) => {
    setSelectedContract(contract);
    setSignatoryName(contract.candidateName || 'Erik Lindström');
    setSigningSuccess(false);
    setShowSignModal(true);
  };

  const handleExecuteSimulatedSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;

    setSigningSuccess(true);
    setTimeout(() => {
      dispatch({
        type: 'SIGN_CONTRACT',
        payload: {
          contractId: selectedContract.id,
          signatoryName,
          signatoryEmail
        }
      });
      setSigningSuccess(false);
      setShowSignModal(false);
      setSelectedContract(null);
    }, 1400);
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: ContractAgreement = {
      id: `ctr-${Date.now()}`,
      name: newContractName,
      companyName: 'Nordic Industrial Solutions AB',
      candidateName: 'Erik Lindström',
      template: newTemplate,
      createdAt: '2026-10-20',
      expiryDate: '2027-10-20',
      status: 'Draft',
      signatoryEmail: 'erik.lindstrom@nordicelectric.se',
      signatoryName: 'Erik Lindström',
      valueSEK: 125000,
      isSimulated: true,
      history: [
        { date: '2026-10-20 16:30', action: 'Created from agreement template', actor: 'Alex Morgan' }
      ]
    };
    dispatch({ type: 'CREATE_CONTRACT', payload: newContract });
    setShowCreateModal(false);
  };

  const getStatusBadge = (status: ContractAgreement['status']) => {
    switch (status) {
      case 'Signed':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#E7EEE7] text-[#24483D] font-bold text-xs border border-[#C5D9C5]">Signed</span>;
      case 'Sent':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#FAF3E8] text-[#A87532] font-semibold text-xs border border-[#EDD9B8]">Sent</span>;
      case 'Viewed':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#EBF1ED] text-[#356653] font-semibold text-xs border border-[#D1E0D6]">Viewed</span>;
      case 'Draft':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#F0EFEB] text-[#777F79] font-semibold text-xs border border-[#DDDCD4]">Draft</span>;
      case 'Expired':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#F9ECEB] text-[#A84F4B] font-semibold text-xs">Expired</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F2] text-[#A84F4B] font-semibold text-xs">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
              <FileText className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">
              Electronic Contracts & Placements
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Simulated B2B recruitment agreements, electronic signatures, and audit logs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Draft New Agreement
        </Button>
      </div>

      {/* Mandatory PRD Non-Binding Watermark Banner (PRD Page 15) */}
      <div className="bg-[#FAF3E8] border border-[#EDD9B8] rounded-xl p-4 flex items-center gap-3 text-xs text-[#A87532]">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider block">
            Simulated E-Signature Environment
          </span>
          <p className="mt-0.5">
            All contracts, signatories, and digital stamps are demonstration artifacts. They are not legally binding
            and do not connect to production Scrive or Oneflow APIs.
          </p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DD]">
          <h2 className="text-base font-bold text-[#28332F]">Active Contracts & Placement Terms</h2>
          <span className="text-xs text-[#777F79]">{state.contracts.length} Agreements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#777F79] uppercase tracking-wider text-[10px] border-b border-[#E5E5DD]">
              <tr>
                <th className="py-3 px-4 font-semibold">Agreement Title</th>
                <th className="py-3 px-4 font-semibold">Counterparty</th>
                <th className="py-3 px-4 font-semibold">Template</th>
                <th className="py-3 px-4 font-semibold">Created / Expiry</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DD]">
              {state.contracts.map(contract => (
                <tr key={contract.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#28332F] max-w-xs">
                    <p className="truncate">{contract.name}</p>
                    <span className="text-[10px] text-[#777F79] font-mono">{contract.id}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#28332F]">
                    <p className="font-medium">{contract.candidateName || contract.companyName}</p>
                    <span className="text-[11px] text-[#777F79]">{contract.signatoryEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#777F79]">{contract.template}</td>
                  <td className="py-3.5 px-4 text-[#777F79]">
                    <p>{contract.createdAt}</p>
                    <span className="text-[10px] text-[#356653]">Exp: {contract.expiryDate}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedContract(contract)}
                      >
                        Inspect
                      </Button>
                      {contract.status !== 'Signed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<PenTool className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenSignModal(contract)}
                        >
                          Simulate Sign
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Readiness Cards */}
      <div className="bg-white border border-[#E5E5DD] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#28332F]">Integration Provider Readiness</h3>
        <p className="text-xs text-[#777F79]">
          Configured sandbox connection slots for Swedish signature & identity verification services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {INTEGRATION_SLOTS.map(slot => (
            <div key={slot.id} className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#28332F]">{slot.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF3E8] text-[#A87532] border border-[#EDD9B8]">
                  {slot.badge}
                </span>
              </div>
              <p className="text-xs text-[#777F79]">{slot.description}</p>
              <p className="text-[11px] text-[#356653] font-semibold">{slot.provider}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Detail / Inspection Modal */}
      {selectedContract && !showSignModal && (
        <Modal
          isOpen={!!selectedContract}
          onClose={() => setSelectedContract(null)}
          title="Contract Agreement Details & Audit History"
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            <div className="p-4 bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-[#28332F]">{selectedContract.name}</h4>
                  <p className="text-[11px] text-[#777F79]">Template: {selectedContract.template}</p>
                </div>
                {getStatusBadge(selectedContract.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-[#777F79] pt-2 border-t border-[#E5E5DD]">
                <div>
                  <span className="block font-semibold text-[#28332F]">Counterparty:</span>
                  <span>{selectedContract.candidateName}</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#28332F]">Signatory:</span>
                  <span>{selectedContract.signatoryName} ({selectedContract.signatoryEmail})</span>
                </div>
              </div>
            </div>

            {/* Timeline history */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#28332F] uppercase text-[11px] tracking-wider">
                Agreement Lifecycle Timeline
              </h5>
              <div className="pl-4 border-l-2 border-[#E5E5DD] space-y-3">
                {selectedContract.history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#24483D] absolute -left-[21px] top-1" />
                    <p className="font-semibold text-[#28332F]">{h.action}</p>
                    <p className="text-[11px] text-[#777F79]">{h.date} by {h.actor}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5DD]">
              <Button variant="outline" size="sm" onClick={() => setSelectedContract(null)}>
                Close
              </Button>
              {selectedContract.status !== 'Signed' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleOpenSignModal(selectedContract);
                  }}
                >
                  Proceed to Simulated Signature
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Simulated Signing Modal (PRD Page 15) */}
      {showSignModal && selectedContract && (
        <Modal
          isOpen={showSignModal}
          onClose={() => setShowSignModal(false)}
          title="Simulated Digital E-Signature"
          subtitle="Demo execution workflow (Not legally binding)"
          maxWidth="md"
        >
          {signingSuccess ? (
            <div className="text-center py-8 space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#E7EEE7] text-[#24483D] flex items-center justify-center mx-auto border border-[#C5D9C5]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#28332F]">Contract Signed Successfully!</h4>
              <p className="text-xs text-[#777F79]">
                Status updated to Signed across all employer overview widgets and platform audit timelines.
              </p>
            </div>
          ) : (
            <form onSubmit={handleExecuteSimulatedSign} className="space-y-4 text-xs">
              <div className="bg-[#FAF3E8] border border-[#EDD9B8] p-3 rounded-lg text-[#A87532]">
                <span className="font-semibold block">Demonstration Signature Notice</span>
                <p className="text-[11px] mt-0.5">
                  Clicking below stamps the document with a synthetic SHA-256 hash. No legal obligation is created.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#28332F] mb-1">Signatory Full Name</label>
                <input
                  type="text"
                  required
                  value={signatoryName}
                  onChange={e => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#28332F] mb-1">Signatory Email</label>
                <input
                  type="email"
                  required
                  value={signatoryEmail}
                  onChange={e => setSignatoryEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
                />
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#E5E5DD] rounded-lg space-y-1">
                <span className="font-semibold text-[#28332F] block">Signing Method</span>
                <p className="text-[11px] text-[#777F79]">Swedish BankID Sandbox Simulation (Tillitsnivå 3)</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5DD]">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowSignModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={<PenTool className="w-3.5 h-3.5" />}>
                  Simulate Signature
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Create Contract Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Draft Placement Agreement"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Agreement Name</label>
            <input
              type="text"
              required
              value={newContractName}
              onChange={e => setNewContractName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Template</label>
            <select
              value={newTemplate}
              onChange={e => setNewTemplate(e.target.value as any)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6]"
            >
              <option value="Standard Placement Framework">Standard Placement Framework</option>
              <option value="Master Services Subcontract">Master Services Subcontract</option>
              <option value="Direct Hire Guarantee">Direct Hire Guarantee</option>
              <option value="NDA & Verification Protocol">NDA & Verification Protocol</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Draft
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
