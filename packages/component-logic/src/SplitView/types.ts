export type SplitOrientation = 'horizontal' | 'vertical';

export type SplitCompactMode = 'side-by-side' | 'stack';

export interface SplitPaneConfig {
  id: string;
  label?: string;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  collapsible: boolean;
  defaultVisible: boolean;
}
