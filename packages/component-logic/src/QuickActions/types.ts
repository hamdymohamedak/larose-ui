
export type QuickActionIconPlacement = 'leading' | 'trailing';

export interface QuickActionItem {
  id: string;
  /** Succinct action title (HIG: avoid app name or extraneous info). */
  label: string;
  subtitle?: string;
  icon?: any;
  destructive?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  /** System-provided actions like Remove App or Edit Home Screen. */
  system?: boolean;
  onSelect?: () => void;
}

export interface QuickActionMenuPosition {
  x: number;
  y: number;
}
