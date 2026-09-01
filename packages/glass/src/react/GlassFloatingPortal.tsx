import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface GlassFloatingPortalProps {
  children: ReactNode;
  /** When false, children render inline (no portal). */
  enabled?: boolean;
}

/**
 * Renders floating glass UI at document.body to escape overflow:hidden ancestors.
 */
export function GlassFloatingPortal({ children, enabled = true }: GlassFloatingPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!enabled || !children) return null;
  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(children, document.body);
}
