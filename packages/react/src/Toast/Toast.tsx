import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { AlertVariant } from '../Alert/Alert';
import styles from './Toast.module.css';

export type ToastVariant = AlertVariant;

export interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastItem extends ToastInput {
  id: string;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function ToastProvider({
  children,
  placement = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...input, id }]);
      window.setTimeout(() => dismiss(id), input.duration ?? 5000);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className={styles.viewport}
          data-placement={placement}
          aria-live="polite"
          aria-relevant="additions"
        >
          {toasts.map((item) => (
            <Toast key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProps {
  item: ToastItem;
  onDismiss: () => void;
}

function Toast({ item, onDismiss }: ToastProps) {
  const variant = item.variant ?? 'info';

  return (
    <div
      className={styles.toast}
      data-variant={variant}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <div className={styles.content}>
        {item.title && <strong className={styles.title}>{item.title}</strong>}
        <span className={styles.message}>{item.message}</span>
      </div>
      <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
