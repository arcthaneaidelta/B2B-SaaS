import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
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
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-900/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel: side on desktop, bottom-sheet on mobile */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full sm:w-[440px] h-[85vh] sm:h-full mt-auto sm:mt-0 bg-paper-0 border-t sm:border-t-0 sm:border-l border-border rounded-t-2xl sm:rounded-none shadow-sh-3 flex flex-col overflow-hidden animate-slide-up sm:animate-slide-left"
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-border-strong rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between bg-paper-100">
          <div>
            {title && (
              <h3 className="text-lg font-display font-semibold text-ink-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-text-2 mt-0.5 font-ui">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 -mr-2 text-text-3 hover:text-ink-900 hover:bg-paper-50 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 font-ui text-ink-900">{children}</div>
      </div>
    </div>
  );
};
