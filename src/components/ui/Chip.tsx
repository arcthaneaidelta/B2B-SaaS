import React from 'react';
import { PatchCategory, RecordType } from '../../data/schema';

interface ChipProps {
  label: string;
  variant?: 'category' | 'recordType' | 'status' | 'default';
  category?: PatchCategory;
  recordType?: RecordType;
  status?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  category,
  recordType,
  status,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (variant === 'category' || category) {
    const cat = category || (label as PatchCategory);
    let colorStyles = 'bg-paper-100 text-ink-900 border-border';

    if (cat === 'Academic') {
      colorStyles = 'bg-[#4F6B52]/10 text-[#365039] border-[#4F6B52]/30';
    } else if (cat === 'Athletic') {
      colorStyles = 'bg-[#B5472F]/10 text-[#8C2C16] border-[#B5472F]/30';
    } else if (cat === 'Leadership') {
      colorStyles = 'bg-[#B8892B]/10 text-[#7A5510] border-[#B8892B]/30';
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorStyles} ${sizeClasses} ${className}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor:
              cat === 'Academic'
                ? '#4F6B52'
                : cat === 'Athletic'
                ? '#B5472F'
                : '#B8892B',
          }}
        />
        {label}
      </span>
    );
  }

  if (variant === 'recordType' || recordType) {
    const type = recordType || label;
    const isReg = type === 'Registration';
    return (
      <span
        className={`inline-flex items-center font-medium rounded-sm border ${
          isReg
            ? 'bg-paper-100 text-ink-900 border-border'
            : 'bg-ink-900 text-paper-0 border-ink-900'
        } ${sizeClasses} ${className}`}
      >
        {label}
      </span>
    );
  }

  if (variant === 'status' || status) {
    const s = status || label;
    let badgeColor = 'bg-paper-100 text-text-2 border-border';
    if (s === 'Registered' || s === 'Fulfilled') {
      badgeColor = 'bg-status-success/10 text-status-success border-status-success/30';
    } else if (s === 'Awaiting Quote' || s === 'Low Stock') {
      badgeColor = 'bg-status-warning/10 text-status-warning border-status-warning/30';
    } else if (s === 'Quoted') {
      badgeColor = 'bg-status-info/10 text-status-info border-status-info/30';
    }

    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-sm border ${badgeColor} ${sizeClasses} ${className}`}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-sm bg-paper-100 text-ink-700 border border-border ${sizeClasses} ${className}`}
    >
      {label}
    </span>
  );
};
