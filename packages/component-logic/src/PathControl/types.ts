
export type PathControlVariant = 'standard' | 'popup';

export interface PathSegment {
  id: string;
  label: string;
  icon?: any;
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
  style?: Record<string, string | number>;
  'aria-label'?: string;
}
