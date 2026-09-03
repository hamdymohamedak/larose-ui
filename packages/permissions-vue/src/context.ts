import { computed, inject, provide, reactive, watch, type InjectionKey, type Ref } from 'vue';
import type { Permission } from '@larose-ui/core';
import {
  evaluateAbac,
  hasPermission,
  type AbacContext,
} from '@larose-ui/permissions-core';

export interface PermissionContextValue {
  permissions: string[];
  loading: boolean;
  context: AbacContext;
  check: (action: string, resource?: string) => Permission;
}

export const PERMISSIONS_KEY: InjectionKey<PermissionContextValue> = Symbol('larose-permissions');

const fallback: PermissionContextValue = {
  permissions: [],
  loading: false,
  context: {},
  check: (action, resource) => hasPermission([], action, resource),
};

export function createPermissionStore(initial?: {
  permissions?: string[];
  loading?: boolean;
  context?: AbacContext;
}): PermissionContextValue {
  const state = reactive({
    permissions: initial?.permissions ?? [],
    loading: initial?.loading ?? false,
    context: initial?.context ?? ({} as AbacContext),
  });

  const value: PermissionContextValue = {
    get permissions() {
      return state.permissions;
    },
    get loading() {
      return state.loading;
    },
    get context() {
      return state.context;
    },
    check(action, resource) {
      return evaluateAbac(state.permissions, { action, resource }, state.context);
    },
  };

  Object.assign(value, {
    /** @internal */
    __update(next: { permissions?: string[]; loading?: boolean; context?: AbacContext }) {
      if (next.permissions !== undefined) state.permissions = next.permissions;
      if (next.loading !== undefined) state.loading = next.loading;
      if (next.context !== undefined) state.context = next.context;
    },
  });

  return value;
}

type UpdatableStore = PermissionContextValue & {
  __update: (next: {
    permissions?: string[];
    loading?: boolean;
    context?: AbacContext;
  }) => void;
};

export function providePermissions(store: PermissionContextValue): void {
  provide(PERMISSIONS_KEY, store);
}

export function usePermissions(): PermissionContextValue {
  return inject(PERMISSIONS_KEY, fallback) ?? fallback;
}

export function usePermission(action: string | Ref<string>, resource?: string | Ref<string | undefined>): Ref<Permission> {
  const { check } = usePermissions();
  return computed(() => {
    const a = typeof action === 'string' ? action : action.value;
    const r = resource === undefined
      ? undefined
      : typeof resource === 'string'
        ? resource
        : resource.value;
    return check(a, r);
  });
}

export function syncPermissionStore(
  store: PermissionContextValue,
  props: { permissions?: string[]; loading?: boolean; context?: AbacContext },
): void {
  const updatable = store as UpdatableStore;
  if (typeof updatable.__update === 'function') {
    updatable.__update(props);
  }
}

export { watch };
