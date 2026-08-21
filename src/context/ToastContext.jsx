import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Global Fixed Bottom-Right Toast Stack */}
      <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[9999999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-2 sm:px-0">
        {toasts.map((toast) => {
          let bgClasses = 'from-emerald-800 to-teal-900 border-emerald-400 text-white';
          let icon = <CheckCircle2 size={19} className="text-[#FFD700] shrink-0" />;

          if (toast.type === 'error') {
            bgClasses = 'from-rose-900 to-red-950 border-rose-400 text-white';
            icon = <AlertCircle size={19} className="text-rose-200 shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClasses = 'from-amber-800 to-orange-950 border-amber-400 text-white';
            icon = <AlertTriangle size={19} className="text-amber-200 shrink-0" />;
          } else if (toast.type === 'info') {
            bgClasses = 'from-[#4A0E0E] to-[#681414] border-amber-400 text-white';
            icon = <Info size={19} className="text-[#FFD700] shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`bg-gradient-to-r ${bgClasses} font-black text-xs sm:text-sm px-4.5 py-3.5 rounded-2xl shadow-2xl border-2 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {icon}
                <span className="leading-snug break-words">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      showToast: (msg) => {
        console.log('[Toast Notification]:', msg);
      }
    };
  }
  return context;
};
