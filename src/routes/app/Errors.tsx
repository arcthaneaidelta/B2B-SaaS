import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import {
  AlertTriangle,
  Mail,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Eye,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ErrorLogItem } from '../../mock/seed';

export const Errors: React.FC = () => {
  const errors = useStore((s) => s.errors);
  const resolveError = useStore((s) => s.resolveErrorItem);
  const dismissError = useStore((s) => s.dismissErrorItem);

  const [selectedError, setSelectedError] = useState<ErrorLogItem | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [targetEmailError, setTargetEmailError] = useState<ErrorLogItem | null>(null);

  // Edit & retry state
  const [editValue, setEditValue] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const handleOpenDetail = (err: ErrorLogItem) => {
    setSelectedError(err);
    if (err.failingField === 'postcode') setEditValue('44308');
    else if (err.failingField.includes('recipient')) setEditValue(err.rawRecord.recipientName || '');
    else setEditValue(err.rawRecord.addressLine1 || '');
  };

  const handleRetrySubmit = async () => {
    if (!selectedError) return;
    setIsRetrying(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRetrying(false);

    if (selectedError.failingField === 'postcode') {
      resolveError(selectedError.id, { postcode: editValue });
    } else {
      resolveError(selectedError.id, { addressLine1: editValue });
    }

    setSelectedError(null);
  };

  const handleOpenEmailAlert = (err: ErrorLogItem) => {
    setTargetEmailError(err);
    setEmailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#1F2421] font-medium">
            Incomplete Executions & Error Queue
          </h1>
          <p className="text-xs text-[#7A817B] font-mono mt-0.5">
            Diverted by Make.com Break module · Stored for diagnostic inspection & automated email alerting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenEmailAlert(errors[0])}
            icon={<Mail className="w-3.5 h-3.5" />}
          >
            Preview Alert Email
          </Button>
        </div>
      </div>

      {/* Errors List */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[750px] divide-y divide-[#E3DED5]">
            <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Error ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Run Reference</th>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Failing Field</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DED5]">
              {errors.map((err) => (
                <tr
                  key={err.id}
                  onClick={() => handleOpenDetail(err)}
                  className="hover:bg-[#FBFAF7] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#B23A3A]">{err.id}</td>
                  <td className="py-3 px-4 text-[#7A817B] font-mono">{err.timestamp}</td>
                  <td className="py-3 px-4 font-mono text-[#24473B] font-medium">{err.runId}</td>
                  <td className="py-3 px-4 font-mono font-medium text-[#1F2421]">{err.accountId}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs bg-[#F7E0DE] text-[#B23A3A] font-bold">
                      {err.errorType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#4A524D]">{err.failingField}</td>
                  <td className="py-3 px-4">
                    <StatusPill status={err.status} />
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEmailAlert(err)}
                        icon={<Mail className="w-3 h-3" />}
                        title="View alert email"
                      >
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenDetail(err)}
                        icon={<RefreshCw className="w-3 h-3" />}
                      >
                        Inspect & Fix
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Detail & Inline Fix Drawer per PRD §10.6 */}
      <Drawer
        isOpen={!!selectedError}
        onClose={() => setSelectedError(null)}
        title={selectedError ? `Resolve Item: ${selectedError.id}` : 'Error Detail'}
      >
        {selectedError && (
          <div className="flex flex-col gap-6 text-xs font-sans">
            <div className="p-3.5 bg-[#F7E0DE] text-[#B23A3A] rounded-sm flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{selectedError.errorType}: </span>
                <span>{selectedError.message}</span>
              </div>
            </div>

            {/* Context parameters */}
            <div className="p-3.5 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-2">
              <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                <span className="text-[#7A817B]">Account ID:</span>
                <span className="font-mono font-bold text-[#24473B]">{selectedError.accountId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                <span className="text-[#7A817B]">Company:</span>
                <span className="font-medium text-[#1F2421]">{selectedError.company}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E3DED5]">
                <span className="text-[#7A817B]">Run Reference:</span>
                <span className="font-mono text-[#1F2421]">{selectedError.runId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#7A817B]">Failing Field:</span>
                <span className="font-mono font-bold text-[#B23A3A]">{selectedError.failingField}</span>
              </div>
            </div>

            {/* Suggested Fix and Inline Edit */}
            <div className="p-4 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col gap-3">
              <span className="font-display text-sm font-medium text-[#1F2421]">
                Recommended Remediation
              </span>
              <p className="text-[#4A524D] leading-relaxed">
                {selectedError.suggestedFix}
              </p>

              <div className="pt-2">
                <label className="text-xs font-semibold uppercase text-[#4A524D] block mb-1">
                  Corrected Value for [{selectedError.failingField}]
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full h-10 px-3 bg-[#FBFAF7] border border-[#CFC8BB] rounded-sm font-mono text-xs text-[#1F2421]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="md"
                  variant="primary"
                  className="w-full"
                  isLoading={isRetrying}
                  onClick={handleRetrySubmit}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Apply Fix & Retry Bundle
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => {
                    dismissError(selectedError.id);
                    setSelectedError(null);
                  }}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  title="Dismiss error"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Alert Email Preview Modal per PRD §10.6 */}
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Email Alert Preview (Triggered by Make.com)"
      >
        {targetEmailError && (
          <div className="flex flex-col gap-4 text-xs font-sans">
            {/* Header / To / Subject */}
            <div className="p-3.5 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#7A817B] font-mono">FROM:</span>
                <span className="font-mono text-[#1F2421]">alerts@quillfold-pipeline.internal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#7A817B] font-mono">TO:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono px-2 py-0.5 rounded-xs bg-[#E4ECE7] text-[#24473B]">
                    ops@quillfold-demo.com
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded-xs bg-[#EFEBE4] text-[#4A524D]">
                    owner@quillfold-demo.com
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[#E3DED5]">
                <span className="text-[#7A817B] font-mono">SUBJECT:</span>
                <span className="font-bold text-[#1F2421]">
                  [Quillfold · Sandbox] 1 row needs attention in {targetEmailError.runId}
                </span>
              </div>
            </div>

            {/* Email Body Rendering */}
            <div className="p-5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F7E0DE] text-[#B23A3A] flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h4 className="font-display text-base text-[#1F2421] font-medium">
                    Automated Error Directive Report
                  </h4>
                  <div className="text-[11px] text-[#7A817B]">
                    Dispatched from Make.com Scenario node #10 (Email Alert)
                  </div>
                </div>
              </div>

              <p className="text-[#4A524D] leading-relaxed">
                During scenario execution <strong className="font-mono text-[#1F2421]">{targetEmailError.runId}</strong>,
                one incoming record for account <strong className="font-mono text-[#24473B]">{targetEmailError.accountId}</strong> ({targetEmailError.company}) failed postal validation and was caught by the Break router.
              </p>

              <div className="p-3 bg-[#FBFAF7] border-l-4 border-[#B23A3A] text-xs">
                <div className="font-bold text-[#B23A3A]">{targetEmailError.message}</div>
                <div className="text-[#7A817B] mt-1">Suggested remedy: {targetEmailError.suggestedFix}</div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-[#7A817B]">Incomplete execution saved for 72 hours.</span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setEmailModalOpen(false)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
