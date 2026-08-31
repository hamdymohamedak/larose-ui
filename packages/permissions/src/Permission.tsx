import type { ReactNode } from 'react';
import type { PermissionFallback } from '@larose-ui/core';
import { usePermission, usePermissions } from './PermissionProvider';
import { resolvePermissionFallback } from '@larose-ui/permissions-core';
import { Explainable } from './Explainable';

export interface PermissionProps {
  action: string;
  resource?: string;
  fallback?: PermissionFallback;
  reason?: string;
  children: ReactNode;
}

export function Permission({
  action,
  resource,
  fallback = 'disabled',
  reason,
  children,
}: PermissionProps) {
  const result = usePermission(action, resource);
  const { loading } = usePermissions();
  const mode = resolvePermissionFallback(result.allowed, loading, fallback);
  const explainReason = reason ?? result.reason;

  if (mode === 'hidden') return null;

  if (mode === 'loading') {
    return (
      <div data-permission-state="loading" aria-busy="true">
        {children}
      </div>
    );
  }

  if (!result.allowed) {
    return (
      <Explainable
        reason={explainReason ?? `Missing permission: ${action}`}
        variant={mode === 'forbidden' ? 'forbidden' : 'disabled'}
      >
        <div data-permission-state={mode} aria-disabled="true">
          {children}
        </div>
      </Explainable>
    );
  }

  return <>{children}</>;
}
