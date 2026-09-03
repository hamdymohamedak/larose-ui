import type { CSSProperties, ReactNode } from 'react';
import type { MenuEntry } from '../Menu/types';

export type ToolbarPlatform = 'ios' | 'ipados' | 'macos' | 'visionos' | 'watchos';

export type ToolbarPlacement = 'top' | 'bottom';

export type ToolbarSectionPlacement = 'leading' | 'center' | 'trailing';

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: ReactNode;
  showLabel?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface ToolbarProps {
  /** Concise view title — aim for under 15 characters. */
  title?: string;
  platform?: ToolbarPlatform;
  /** iOS large title that collapses when scrolling. */
  largeTitle?: boolean;
  /** visionOS and watchOS placement. */
  placement?: ToolbarPlacement;
  /** Hide toolbar for distraction-free experience. */
  hidden?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  'aria-label'?: string;
}

export interface ToolbarSectionProps {
  placement: ToolbarSectionPlacement;
  /** Center items collapse into the system overflow menu when space is tight. */
  collapsible?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface ToolbarItemProps {
  id?: string;
  label: string;
  icon?: ReactNode;
  showLabel?: boolean;
  prominent?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  collapsible?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ToolbarGroupProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface ToolbarTitleProps {
  children: string;
  large?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ToolbarSearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

export interface ToolbarMoreButtonProps {
  entries: MenuEntry[];
  'aria-label'?: string;
  onAction?: (entryId: string) => void;
  disabled?: boolean;
}

export interface ToolbarDocumentMenuProps {
  entries: MenuEntry[];
  label?: string;
  onAction?: (entryId: string) => void;
  disabled?: boolean;
}

export interface ToolbarProminentButtonProps {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ToolbarBackButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  /** visionOS reveals label on look — optional visible companion text. */
  companionLabel?: string;
}

export interface ToolbarCloseButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
