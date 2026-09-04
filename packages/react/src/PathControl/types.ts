import type { CSSProperties, ReactNode } from 'react';

export type PathControlVariant = 'standard' | 'popup';

export interface PathSegment {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface PathControlProps {
  segments: PathSegment[];
  selectedId?: string;
  variant?: PathControlVariant;
  /** macOS: allow drag-and-drop to select a new path item. */
  editable?: boolean;
  onSegmentSelect?: (segment: PathSegment) => void;
  onChoose?: () => void;
  onDropPath?: (segments: PathSegment[]) => void;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}
