import { getContext, setContext } from 'svelte';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type { Permission } from '@larose-ui/core';
import {
  evaluateAbac,
  hasPermission,
  type AbacContext,
} from '@larose-ui/permissions-core';

export const PERMISSIONS_CONTEXT = 'larose-permissions';

export interface PermissionState {
  permissions: string[];
  loading: boolean;
  context: AbacContext;
}

export interface PermissionContextValue {
  subscribe: Writable<PermissionState>['subscribe'];
  check: (action: string, resource?: string) => Permission;
  set: (next: Partial<PermissionState>) => void;
}

const fallbackState: PermissionState = {
  permissions: [],
  loading: false,
  context: {},
};

export function createPermissionsContext(
  initial: Partial<PermissionState> = {},
): PermissionContextValue {
  const store = writable<PermissionState>({
    ...fallbackState,
    ...initial,
  });

  return {
    subscribe: store.subscribe,
    check(action, resource) {
      let snapshot = fallbackState;
      const unsub = store.subscribe((s) => {
        snapshot = s;
      });
      unsub();
      return evaluateAbac(snapshot.permissions, { action, resource }, snapshot.context);
    },
    set(next) {
      store.update((s) => ({ ...s, ...next }));
    },
  };
}

export function setPermissionsContext(value: PermissionContextValue): void {
  setContext(PERMISSIONS_CONTEXT, value);
}

export function getPermissionsContext(): PermissionContextValue {
  return (
    getContext<PermissionContextValue | undefined>(PERMISSIONS_CONTEXT) ?? {
      subscribe: writable(fallbackState).subscribe,
      check: (action, resource) => hasPermission([], action, resource),
      set: () => undefined,
    }
  );
}

export function permissionStore(
  action: string,
  resource?: string,
): Readable<Permission> {
  const ctx = getPermissionsContext();
  return derived(ctx, ($state) =>
    evaluateAbac($state.permissions, { action, resource }, $state.context),
  );
}
