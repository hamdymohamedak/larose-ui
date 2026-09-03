import { inject, type CSSProperties, type InjectionKey } from 'vue';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  class?: string;
  style?: CSSProperties;
}

export type ToastPlacement = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

export const toastInjectionKey: InjectionKey<ToastContextValue> = Symbol('larose.toast');

export function useToast(): ToastContextValue {
  const context = inject(toastInjectionKey, null);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
