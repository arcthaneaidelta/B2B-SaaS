import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records match these filters',
  description = 'Registrations and orders will appear here as soon as someone scans the QR code or orders patches.',
  actionLabel = 'Reset filters',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-paper-100 border border-dashed border-border-strong rounded-lg ${className}`}
    >
      {/* Blank stitched patch outline */}
      <div className="w-16 h-16 mb-4 text-border-strong">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <path d="M50 38 V62 M38 50 H62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h3 className="text-base font-display font-semibold text-ink-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-text-2 max-w-sm mb-5 font-ui leading-relaxed">
        {description}
      </p>

      {onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
