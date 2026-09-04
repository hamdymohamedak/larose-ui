import type { ShareAudience, SharePermission } from './types';

/** Succinct permission summary per Apple HIG collaboration guidance. */
export function formatSharePermissionSummary(
  audience: ShareAudience,
  permission: SharePermission,
): string {
  if (audience === 'invited' && permission === 'edit') {
    return 'Only invited people can edit';
  }
  if (audience === 'invited' && permission === 'view') {
    return 'Only invited people can view';
  }
  if (audience === 'everyone' && permission === 'edit') {
    return 'Everyone can make changes';
  }
  return 'Everyone can view';
}

export function collaboratorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}
