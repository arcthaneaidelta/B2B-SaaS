import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ToastContainer: React.FC = () => {
  const toasts = useStore((s) => s.toasts);
  const removeToast = useStore((s) => s.removeToast);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[80] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon =
            toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#B23A3A] shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-[#B7791F] shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-[#3F6C8F] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#2F7D57] shrink-0" />
            );

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex items-start gap-3 p-3.5 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md shadow-2 text-sm text-[#1F2421]"
            >
              <div className="pt-0.5">{icon}</div>
              <div className="flex-1 font-sans text-sm leading-snug">
                {toast.message}
                {toast.action && (
                  <button
                    type="button"
                    onClick={toast.action.onClick}
                    className="ml-2 font-semibold text-[#24473B] underline underline-offset-2 hover:text-[#1B382F]"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#7A817B] hover:text-[#1F2421] transition-colors p-0.5"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
