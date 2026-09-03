import type { CSSProperties, ReactNode } from 'react';

/** Visual and interaction preset for modal alerts. */
export type AlertDialogPresentation =
  | 'compact'
  | 'tablet'
  | 'desktop'
  | 'spatial'
  | 'tv'
  | 'wearable';

export type AlertDialogActionRole = 'default' | 'cancel' | 'destructive';

export interface AlertDialogAction {
  id: string;
  label: string;
  role?: AlertDialogActionRole;
  /** Deliberate destructive actions omit emphasized destructive styling. */
  deliberate?: boolean;
  onSelect?: () => void;
}

export interface AlertDialogTextField {
  label?: string;
  placeholder?: string;
  secure?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface AlertDialogSuppression {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string;
  actions: AlertDialogAction[];
  presentation?: AlertDialogPresentation;
  icon?: ReactNode;
  /** Use sparingly for unexpected data loss. */
  showCautionIcon?: boolean;
  textField?: AlertDialogTextField;
  suppression?: AlertDialogSuppression;
  helpUrl?: string;
  accessory?: ReactNode;
  /** When unset, no button receives default keyboard focus styling. */
  defaultActionId?: string;
  className?: string;
  style?: CSSProperties;
}

export interface AlertDialogButtonLayout {
  ordered: AlertDialogAction[];
  layout: 'row' | 'stack';
}
