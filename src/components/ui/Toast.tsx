import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useDemo } from '../../state/demo-store';

export const ToastContainer: React.FC = () => {
  const { state, dispatch } = useDemo();
  const toast = state.toast;

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#24483D] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#A84F4B] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#A87532] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#356653] shrink-0" />
  };

  const borders = {
    success: 'border-[#C5D9C5] bg-[#FFFFFF]',
    error: 'border-[#F5C2C0] bg-[#FFFFFF]',
    warning: 'border-[#EDD9B8] bg-[#FFFFFF]',
    info: 'border-[#D1E0D6] bg-[#FFFFFF]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full pointer-events-auto animate-fade-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${borders[toast.type]}`}
        role="alert"
      >
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#28332F]">{toast.message}</p>
          {toast.subtitle && (
            <p className="text-xs text-[#777F79] mt-0.5 leading-relaxed">{toast.subtitle}</p>
          )}
        </div>
        <button
          onClick={() => dispatch({ type: 'HIDE_TOAST' })}
          className="text-[#777F79] hover:text-[#28332F] p-0.5 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
