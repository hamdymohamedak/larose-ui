import { Children, type ReactNode } from 'react';

export {
  formatButtonLabel,
  resolveButtonShape,
} from '@larose-ui/component-logic/button';

export interface SplitButtonChildrenResult {
  /** Trimmed text label, if any. */
  text: string | null;
  /** Non-text nodes (e.g. inline SVG icons) rendered after the label. */
  inlineIcons: ReactNode[];
}

export function hasTextContent(children: ReactNode): boolean {
  if (children === null || children === undefined || children === false) return false;
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children).trim().length > 0;
  }
  if (Array.isArray(children)) {
    return children.some((child) => hasTextContent(child));
  }
  return splitButtonChildren(children).text !== null;
}

/** Split mixed button children into a stable text label and trailing inline icons. */
export function splitButtonChildren(children: ReactNode): SplitButtonChildrenResult {
  const inlineIcons: ReactNode[] = [];
  const textParts: string[] = [];

  for (const child of Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      const trimmed = String(child).trim();
      if (trimmed) textParts.push(trimmed);
      continue;
    }

    inlineIcons.push(child);
  }

  return {
    text: textParts.length > 0 ? textParts.join(' ') : null,
    inlineIcons,
  };
}
