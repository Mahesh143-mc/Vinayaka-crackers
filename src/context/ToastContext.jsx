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

      {/* Global Fixed Bottom-Right Toast Stack with Breathing Room & Floating Padding */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999999] flex flex-col items-end gap-3 pointer-events-none max-w-sm sm:max-w-md w-full p-2">
        {toasts.map((toast) => {
          let bgClasses = 'from-emerald-900 via-teal-900 to-emerald-950 border-emerald-400/80 text-white';
          let icon = <CheckCircle2 size={20} className="text-[#FFD700] shrink-0" />;

          if (toast.type === 'error') {
            bgClasses = 'from-rose-950 via-red-900 to-rose-950 border-rose-400/80 text-white';
            icon = <AlertCircle size={20} className="text-rose-300 shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClasses = 'from-amber-950 via-amber-900 to-orange-950 border-amber-400/80 text-white';
            icon = <AlertTriangle size={20} className="text-amber-300 shrink-0" />;
          } else if (toast.type === 'info') {
            bgClasses = 'from-[#4A0E0E] via-[#681414] to-[#380808] border-amber-400/80 text-white';
            icon = <Info size={20} className="text-[#FFD700] shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`bg-gradient-to-r ${bgClasses} font-black text-xs sm:text-sm px-5 py-4 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.4)] border-2 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto w-full backdrop-blur-md`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {icon}
                <span className="leading-snug break-words font-sans tracking-wide">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-75 hover:opacity-100 transition-opacity p-1 rounded-xl hover:bg-white/15 shrink-0 cursor-pointer ml-1"
                title="Dismiss"
              >
                <X size={16} />
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
