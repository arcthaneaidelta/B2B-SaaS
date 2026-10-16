import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast viewport: bottom on mobile, top-right on desktop */}
      <div
        aria-live="polite"
        className="fixed z-[100] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 sm:bottom-auto flex flex-col gap-2 pointer-events-none max-w-sm sm:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-ink-900 text-paper-0 p-4 rounded-md shadow-sh-3 border border-ink-700 flex items-start gap-3 transform transition-all duration-200 animate-slide-up"
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-status-success" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-gold-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-status-info" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-status-error" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight text-paper-0">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-paper-100/80 mt-1 leading-relaxed">
                  {toast.description}
                </p>
              )}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-xs font-semibold text-thread-600 hover:underline flex items-center gap-1"
                >
                  {toast.action.label} →
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="flex-shrink-0 text-paper-100/50 hover:text-paper-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
