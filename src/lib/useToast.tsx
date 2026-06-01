import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

const TOAST_MS = 2500;

interface ToastEntry {
  id: number;
  message: string;
}

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((entry) => entry.id !== id)), TOAST_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[2147483647] flex flex-col gap-1">
        {toasts.map((entry) => (
          <div key={entry.id} className="rounded bg-neutral-900 px-3 py-1.5 text-xs text-white shadow-lg">
            {entry.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
