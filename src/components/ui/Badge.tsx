import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, AlertTriangle, XCircle, FileQuestion } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface BadgeProps {
  status?: VerificationStatus | string;
  variant?: 'status' | 'neutral' | 'accent' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const s = status as VerificationStatus;

  switch (s) {
    case 'Independently confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#E7EEE7] text-[#24483D] border border-[#C5D9C5] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-[#24483D]' : 'w-4 h-4 text-[#24483D]'} />
          <span>Independently confirmed</span>
        </span>
      );

    case 'Document checked':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#EBF1ED] text-[#356653] border border-[#D1E0D6] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5 text-[#356653]' : 'w-4 h-4 text-[#356653]'} />
          <span>Document checked</span>
        </span>
      );

    case 'Submitted for review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#FAF3E8] text-[#A87532] border border-[#EDD9B8] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          <Clock className={size === 'sm' ? 'w-3.5 h-3.5 text-[#A87532]' : 'w-4 h-4 text-[#A87532]'} />
          <span>Submitted for review</span>
        </span>
      );

    case 'Self-reported':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#F0EFEB] text-[#777F79] border border-[#DDDCD4] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          <FileQuestion className={size === 'sm' ? 'w-3.5 h-3.5 text-[#777F79]' : 'w-4 h-4 text-[#777F79]'} />
          <span>Self-reported</span>
        </span>
      );

    case 'Expired':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#F9ECEB] text-[#A84F4B] border border-[#E9CBC9] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          <AlertTriangle className={size === 'sm' ? 'w-3.5 h-3.5 text-[#A84F4B]' : 'w-4 h-4 text-[#A84F4B]'} />
          <span>Expired</span>
        </span>
      );

    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#FDF2F2] text-[#A84F4B] border border-[#F5C2C0] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          <XCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-[#A84F4B]' : 'w-4 h-4 text-[#A84F4B]'} />
          <span>Rejected</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-[#F0EFEB] text-[#777F79] border border-[#DDDCD4] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } ${className}`}
        >
          {status}
        </span>
      );
  }
};
