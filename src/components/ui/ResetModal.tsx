import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useDemo } from '../../state/demo-store';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose }) => {
  const { resetDemo } = useDemo();

  const handleConfirm = () => {
    resetDemo();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-[#A84F4B]">
          <AlertTriangle className="w-5 h-5" />
          <span>Reset Demo Sandbox</span>
        </div>
      }
      subtitle="Restore original Swedish candidate & requirement baseline"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-[#28332F] leading-relaxed">
          This will clear all session modifications (custom requirements, changed verification decisions,
          Kanban pipeline transitions, custom weights, and simulated e-signatures) and restore the original
          clean seeded demonstration data.
        </p>

        <div className="bg-[#FAF9F6] border border-[#E5E5DD] p-3 rounded-lg text-xs text-[#777F79] space-y-1">
          <p className="font-semibold text-[#28332F]">Baseline will reset to:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>12 Swedish verified candidates (Erik Lindström as lead)</li>
            <li>5 standard industrial requirements</li>
            <li>8 verification cases with real-time audit queue</li>
            <li>Growth Scale demo subscription</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleConfirm}
          >
            Reset All Data
          </Button>
        </div>
      </div>
    </Modal>
  );
};
