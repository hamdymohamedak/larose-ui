import type { ButtonShape } from './types';
import type { ReactNode } from 'react';

export function formatButtonLabel(label: string, opensAnotherView = false): string {
  const trimmed = label.trim();
  if (!opensAnotherView) return trimmed;
  if (trimmed.endsWith('…') || trimmed.endsWith('...')) return trimmed.replace(/\.{3}$/, '…');
  return `${trimmed}…`;
}

export function resolveButtonShape(options: {
  shape?: ButtonShape;
  iconOnly?: boolean;
  hasText: boolean;
  hasIcon: boolean;
}): ButtonShape {
  if (options.shape) return options.shape;
  if (options.iconOnly || (options.hasIcon && !options.hasText)) return 'circle';
  if (options.hasText && !options.hasIcon) return 'capsule';
  return 'capsule';
}

export function hasTextContent(children: ReactNode): boolean {
  if (children === null || children === undefined || children === false) return false;
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children).trim().length > 0;
  }
  if (Array.isArray(children)) {
    return children.some((child) => hasTextContent(child));
  }
  return true;
}
