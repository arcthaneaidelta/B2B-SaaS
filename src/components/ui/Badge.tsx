import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variantStyles = {
    default: 'bg-[#EFEBE4] text-[#4A524D]',
    primary: 'bg-[#E4ECE7] text-[#24473B] font-medium',
    secondary: 'bg-[#E1ECF4] text-[#3F6C8F]',
    accent: 'bg-[#F4E6DF] text-[#B5654A] font-semibold',
    success: 'bg-[#E1F0E8] text-[#2F7D57] font-medium',
    warning: 'bg-[#F8EBD2] text-[#B7791F] font-medium',
    error: 'bg-[#F7E0DE] text-[#B23A3A] font-medium',
    outline: 'border border-[#CFC8BB] text-[#4A524D] bg-transparent',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs tracking-wide uppercase select-none font-mono ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const EnvBadge: React.FC<{ expanded?: boolean; className?: string }> = ({
  expanded = false,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#F8EBD2] border border-[#E3DED5] text-[#B7791F] text-xs font-mono font-medium ${className}`}
      title="Running in Sandbox simulation mode. Live APIs and billing disabled."
    >
      <span className="w-2 h-2 rounded-full bg-[#B7791F] animate-pulse" />
      <span>SANDBOX</span>
      {expanded && <span className="text-[#4A524D] font-sans font-normal border-l border-[#CFC8BB] pl-2">Collaborator access</span>}
    </div>
  );
};

export interface StatusPillProps {
  status:
    | 'READY'
    | 'PROCESSED'
    | 'FAILED'
    | 'RETRYING'
    | 'Retrying'
    | 'Success'
    | 'Partial Failure'
    | 'Break / Retry'
    | 'Running'
    | 'Open'
    | 'Resolved'
    | 'Needs data fix';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  let color = 'bg-[#EFEBE4] text-[#4A524D]';
  let dotColor = 'bg-[#7A817B]';

  if (status === 'READY' || status === 'Success' || status === 'Resolved' || status === 'PROCESSED') {
    color = 'bg-[#E1F0E8] text-[#2F7D57]';
    dotColor = 'bg-[#2F7D57]';
  } else if (status === 'Break / Retry' || status === 'RETRYING' || status === 'Retrying' || status === 'Open') {
    color = 'bg-[#F8EBD2] text-[#B7791F]';
    dotColor = 'bg-[#B7791F]';
  } else if (status === 'Running') {
    color = 'bg-[#E4ECE7] text-[#24473B]';
    dotColor = 'bg-[#24473B] animate-pulse';
  } else if (status === 'FAILED' || status === 'Partial Failure' || status === 'Needs data fix') {
    color = 'bg-[#F7E0DE] text-[#B23A3A]';
    dotColor = 'bg-[#B23A3A]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
