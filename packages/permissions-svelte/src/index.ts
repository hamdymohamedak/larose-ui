export {
  hasPermission,
  evaluateAbac,
  resolvePermissionFallback,
} from '@larose-ui/permissions-core';
export type { PermissionCheck, AbacContext } from '@larose-ui/permissions-core';

export {
  PERMISSIONS_CONTEXT,
  createPermissionsContext,
  setPermissionsContext,
  getPermissionsContext,
  permissionStore,
} from './context';
export type { PermissionContextValue, PermissionState } from './context';

export { default as PermissionProvider } from './PermissionProvider.svelte';
export { default as Can } from './Can.svelte';
export { default as Permission } from './Permission.svelte';
