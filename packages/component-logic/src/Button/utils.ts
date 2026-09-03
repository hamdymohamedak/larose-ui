import type { ButtonShape } from './types';

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
  if (options.hasText && options.hasIcon) return 'roundedRect';
  if (options.hasText) return 'capsule';
  return 'capsule';
}
