import type { Permission, PermissionFallback } from '@larose/core';

export interface PermissionCheck {
  action: string;
  resource?: string;
}

export function hasPermission(
  granted: string[],
  action: string,
  resource?: string,
): Permission {
  const fullAction = resource ? `${resource}.${action}` : action;
  const normalized = action.includes('.') ? action : fullAction;

  const allowed =
    granted.includes(normalized) ||
    granted.includes(action) ||
    granted.includes('*') ||
    granted.some((p) => p.endsWith('.*') && normalized.startsWith(p.slice(0, -2)));

  return {
    action: normalized,
    resource,
    allowed,
    reason: allowed ? undefined : `Missing permission: ${normalized}`,
  };
}

export function resolvePermissionFallback(
  allowed: boolean,
  loading: boolean,
  fallback: PermissionFallback,
): PermissionFallback {
  if (loading) return 'loading';
  if (allowed) return 'visible';
  return fallback;
}

export interface AbacContext {
  userId?: string;
  tenantId?: string;
  roles?: string[];
  attributes?: Record<string, unknown>;
}

export function evaluateAbac(
  granted: string[],
  check: PermissionCheck,
  context: AbacContext,
): Permission {
  const base = hasPermission(granted, check.action, check.resource);

  if (!base.allowed && context.roles?.includes('admin')) {
    return { ...base, allowed: true, reason: undefined };
  }

  return base;
}
