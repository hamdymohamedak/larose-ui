import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { isSafeRedirectPath } from '@larose-ui/core';
import { Dialog } from '@larose-ui/react';

export interface SessionGuardProps {
  children: ReactNode;
  onSessionExpired?: (returnUrl: string) => void;
  loginUrl?: string;
}

export function SessionGuard({
  children,
  onSessionExpired,
  loginUrl = '/login',
}: SessionGuardProps) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ code?: number }>).detail;
      if (detail?.code === 401) setExpired(true);
    };
    window.addEventListener('larose:session-expired', handler);
    return () => window.removeEventListener('larose:session-expired', handler);
  }, []);

  const safeLoginUrl = isSafeRedirectPath(loginUrl) ? loginUrl : '/login';

  const handleRedirect = useCallback(() => {
    const returnUrl = window.location.pathname + window.location.search;
    onSessionExpired?.(returnUrl);
    window.location.href = `${safeLoginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }, [safeLoginUrl, onSessionExpired]);

  return (
    <>
      {children}
      <Dialog
        open={expired}
        onClose={() => setExpired(false)}
        title="Session expired"
        description="Your session has expired. Sign in again to continue."
        confirmLabel="Sign in"
        cancelLabel="Dismiss"
        onConfirm={handleRedirect}
      />
    </>
  );
}

export function notifySessionExpired(code = 401): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('larose:session-expired', { detail: { code } }));
  }
}
