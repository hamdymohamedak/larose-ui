import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { Permission } from '@larose/core';
import { evaluateAbac, hasPermission, type AbacContext } from './evaluator';

export interface PermissionContextValue {
  permissions: string[];
  loading: boolean;
  context: AbacContext;
  check: (action: string, resource?: string) => Permission;
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  loading: false,
  context: {},
  check: (action, resource) => hasPermission([], action, resource),
});

export function usePermissions(): PermissionContextValue {
  return useContext(PermissionContext);
}

export function usePermission(action: string, resource?: string): Permission {
  const { check } = usePermissions();
  return check(action, resource);
}

export interface PermissionProviderProps {
  permissions?: string[];
  loading?: boolean;
  context?: AbacContext;
  children: ReactNode;
}

export function PermissionProvider({
  permissions = [],
  loading = false,
  context = {},
  children,
}: PermissionProviderProps) {
  const value = useMemo<PermissionContextValue>(
    () => ({
      permissions,
      loading,
      context,
      check: (action, resource) =>
        evaluateAbac(permissions, { action, resource }, context),
    }),
    [permissions, loading, context],
  );

  return (
    <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
  );
}
