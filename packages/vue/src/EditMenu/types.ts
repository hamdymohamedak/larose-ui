
/** Standard UIResponder-style edit actions. */
export type StandardEditActionId =
  | 'cut'
  | 'copy'
  | 'paste'
  | 'select'
  | 'selectAll'
  | 'delete'
  | 'translate'
  | 'lookUp';

export type EditMenuVariant = 'compact' | 'context' | 'auto';

export type EditMenuInputMode = 'touch' | 'pointer' | 'auto';

export type EditMenuContentType = 'text' | 'image' | 'address' | 'link' | 'file';

export interface EditMenuContext {
  /** Whether content is currently selected. */
  hasSelection: boolean;
  /** Whether pasteboard content can be pasted. */
  canPaste: boolean;
  /** Whether the target supports editing (cut/delete). */
  isEditable?: boolean;
  /** Allow copying noneditable static text (captions, labels excluded). */
  allowsCopy?: boolean;
  contentType?: EditMenuContentType;
}

export interface EditMenuItemConfig {
  id: string;
  label: string;
  icon?: unknown;
  /** Group with standard clipboard, selection, intelligence, or format commands. */
  group?: 'clipboard' | 'selection' | 'intelligence' | 'format' | 'other';
  destructive?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface EditMenuPosition {
  x: number;
  y: number;
  placement: 'above' | 'below';
  /** Horizontal offset for the pointer relative to menu left edge. */
  pointerOffset: number;
}

export interface EditMenuResolvedAction extends EditMenuItemConfig {
  standard?: boolean;
}
