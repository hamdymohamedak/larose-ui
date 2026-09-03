export {
  hasPermission,
  evaluateAbac,
  resolvePermissionFallback,
} from '@larose-ui/permissions-core';
export type { PermissionCheck, AbacContext } from '@larose-ui/permissions-core';

export {
  PERMISSIONS_KEY,
  createPermissionStore,
  providePermissions,
  usePermissions,
  usePermission,
} from './context';
export type { PermissionContextValue } from './context';

export { default as PermissionProvider } from './PermissionProvider.vue';
export { default as Can } from './Can.vue';
export { default as Permission } from './Permission.vue';
