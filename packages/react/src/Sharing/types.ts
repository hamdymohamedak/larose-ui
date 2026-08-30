import type { ReactNode } from 'react';

export type SharePermission = 'view' | 'edit';

export type ShareAudience = 'invited' | 'everyone';

export type ActivityKind = 'app' | 'share' | 'action';

export type SystemActivityId =
  | 'copy'
  | 'print'
  | 'add-to-files'
  | 'markup'
  | 'airplay'
  | 'save-to-photos'
  | 'assign-to-contact';

export type ActivityPresentation = 'sheet' | 'popover';

export interface Collaborator {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
}

export interface ShareDestination {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
}

export interface SharePermissionOption {
  id: string;
  audience: ShareAudience;
  permission: SharePermission;
  label: string;
  description?: string;
}

export interface CollaborationAction {
  id: string;
  label: string;
  description?: string;
  onSelect?: () => void;
}

export interface ShareSettings {
  audience: ShareAudience;
  permission: SharePermission;
  allowInvites?: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  /** Share destinations show a subtitle (e.g. app or service name) below the icon. */
  subtitle?: string;
  icon?: ReactNode;
  kind: ActivityKind;
  /** Marks built-in system activities that can be excluded per context. */
  system?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  onSelect?: () => void;
}
