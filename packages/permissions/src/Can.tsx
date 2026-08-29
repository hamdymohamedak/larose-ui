import type { ReactNode } from 'react';
import type { PermissionFallback } from '@larose/core';
import { usePermission } from './PermissionProvider';
import { resolvePermissionFallback } from './evaluator';
import { Explainable } from './Explainable';

export interface CanProps {
  permission: string;
  resource?: string;
  fallback?: PermissionFallback;
  children: ReactNode;
  reason?: string;
}

export function Can({
  permission,
  resource,
  fallback = 'hidden',
  children,
  reason,
}: CanProps) {
  const result = usePermission(permission, resource);
  const mode = resolvePermissionFallback(result.allowed, false, fallback);
  const explainReason = reason ?? result.reason;

  if (mode === 'hidden') return null;

  if (mode === 'loading') {
    return <span aria-busy="true">{children}</span>;
  }

  if (mode === 'forbidden') {
    return (
      <Explainable reason={explainReason ?? 'Access denied'} variant="forbidden">
        {children}
      </Explainable>
    );
  }

  if (mode === 'disabled' || mode === 'readonly') {
    return (
      <Explainable
        reason={explainReason ?? 'Not allowed'}
        variant={mode === 'readonly' ? 'readonly' : 'disabled'}
      >
        <span aria-disabled="true" data-permission-fallback={mode}>
          {children}
        </span>
      </Explainable>
    );
  }

  return <>{children}</>;
}
