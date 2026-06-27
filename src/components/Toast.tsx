import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-bottom-2 duration-300 pointer-events-auto min-w-[300px]",
              t.type === 'success' && "bg-surface border-success/30 text-text",
              t.type === 'error' && "bg-surface border-error/30 text-text",
              t.type === 'info' && "bg-surface border-border text-text"
            )}
          >
            {t.type === 'success' && <CheckCircle2 className="text-success h-5 w-5 shrink-0" />}
            {t.type === 'error' && <XCircle className="text-error h-5 w-5 shrink-0" />}
            <span className="flex-1 text-sm font-medium">{t.message}</span>
            <button 
              onClick={() => removeToast(t.id)}
              className="text-textMuted hover:text-text transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
