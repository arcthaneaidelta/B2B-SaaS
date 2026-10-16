import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-900/50 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Dialog box: bottom sheet on mobile, centered modal on desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative z-10 w-full ${maxWidth} bg-paper-0 border border-border sm:rounded-lg rounded-t-2xl shadow-sh-3 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up sm:animate-scale-in`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between bg-paper-100">
          <div>
            {title && (
              <h3 id="modal-title" className="text-lg font-display font-semibold text-ink-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-text-2 mt-0.5 font-ui">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 -mr-2 text-text-3 hover:text-ink-900 hover:bg-paper-50 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto font-ui text-ink-900">{children}</div>
      </div>
    </div>
  );
};
