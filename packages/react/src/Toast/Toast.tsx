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
import { Presence } from '../Motion/Presence';
import motionStyles from '../Motion/motion.module.css';
import styles from './Toast.module.css';

export type ToastVariant = AlertVariant;

export interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export type ToastPlacement =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';

interface ToastRecord extends ToastInput {
  id: string;
  exiting?: boolean;
}

/** @internal persisted toast shape */
export type ToastItem = ToastRecord;

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  placement?: ToastPlacement;
}

export function ToastProvider({
  children,
  placement = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    );
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
            <Toast
              key={item.id}
              item={item}
              placement={placement}
              onDismiss={() => dismiss(item.id)}
              onExitComplete={() => removeToast(item.id)}
            />
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
  item: ToastRecord;
  placement: ToastPlacement;
  onDismiss: () => void;
  onExitComplete: () => void;
}

function Toast({ item, placement, onDismiss, onExitComplete }: ToastProps) {
  const variant = item.variant ?? 'info';

  return (
    <Presence
      present={!item.exiting}
      variant="toast"
      placement={placement}
      onExitComplete={onExitComplete}
    >
      <div
        className={[styles.toast, motionStyles.layoutItem].filter(Boolean).join(' ')}
        data-variant={variant}
        data-placement={placement}
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
    </Presence>
  );
}
