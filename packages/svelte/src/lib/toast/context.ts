import { getContext, setContext } from 'svelte';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastPlacement = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  class?: string;
  style?: string;
}

export interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const toastKey = Symbol('larose-toast');

export function setToast(value: ToastContextValue): ToastContextValue {
  setContext(toastKey, value);
  return value;
}

export function getToast(): ToastContextValue {
  const context = getContext<ToastContextValue>(toastKey);
  if (!context) {
    throw new Error('getToast must be used within ToastProvider');
  }
  return context;
}
