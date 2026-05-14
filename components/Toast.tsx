import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToasts(prev => {
      const newToast = { id: Math.random().toString(36).substring(2, 9), message, type };
      const updated = [...prev, newToast];
      if (updated.length > 4) {
        return updated.slice(1);
      }
      return updated;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-3">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ToastItem: React.FC<{ toast: Toast, onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const borderColors = {
    error: 'border-red-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    info: 'border-cyan-500'
  };

  const bgColors = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500'
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-cyan-500" />
  };

  return (
    <div className={`relative bg-gray-900 border border-gray-800 border-l-4 ${borderColors[toast.type]} p-4 rounded shadow-2xl flex items-start gap-3 w-80 toast-enter`}>
      <div className="pt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 text-sm text-gray-200">{toast.message}</div>
      <button onClick={() => onRemove(toast.id)} className="text-gray-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-gray-800 w-full rounded-b overflow-hidden">
        <div 
          className={`h-full toast-progress ${bgColors[toast.type]}`} 
        />
      </div>
    </div>
  );
};
