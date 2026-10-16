import React from 'react';
import { Monogram } from './Monogram';
import { Link } from 'react-router-dom';

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  linkTo?: string;
  className?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  size = 'md',
  showSubtitle = true,
  linkTo = '/',
  className = '',
}) => {
  const monogramSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <Monogram size={monogramSize} />
      <div className="flex flex-col leading-tight">
        <span className={`font-display font-semibold tracking-tight text-ink-900 ${titleSize}`}>
          A&amp;A Patch Work
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium tracking-wide uppercase text-text-3 font-ui">
            Custom Merit Patches
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
