import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { Glass } from './Glass';
import { GlassFloatingPortal } from './GlassFloatingPortal';
import { LENS_PRESETS } from '../lens/presets';
import { useFloatingPlacement } from './useFloatingPlacement';
import type { GlassLens } from '../types';

export interface GlassTooltipProps {
  content: ReactNode;
  children: ReactNode;
  lens?: Partial<GlassLens>;
  /** Render tooltip in a document.body portal (default true). */
  portal?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function GlassTooltip({
  content,
  children,
  lens,
  portal = true,
  className,
  style,
}: GlassTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = detectA11yPreferences().reducedMotion;

  const resolvedLens = {
    ...LENS_PRESETS.tooltip(120, 36),
    ...lens,
  };

  const placement = useFloatingPlacement(anchorRef, panelRef, visible, {
    preferredSide: 'top',
    gap: 6,
    strategy: portal ? 'fixed' : 'absolute',
  });

  const panelPosition: CSSProperties = portal
    ? {
        position: 'fixed',
        top: placement?.top ?? -9999,
        left: placement?.left ?? 0,
      }
    : {
        position: 'absolute',
        top: placement?.top,
        left: placement?.left ?? '50%',
        transform: placement ? undefined : 'translateX(-50%)',
        bottom: placement ? undefined : 'calc(100% + 6px)',
      };

  const panel = visible ? (
    <span
      ref={panelRef}
      id={tooltipId}
      role="tooltip"
      style={{
        ...panelPosition,
        zIndex: 10000,
        whiteSpace: 'nowrap',
        visibility: placement ? 'visible' : 'hidden',
        transition: reducedMotion ? 'none' : 'opacity 0.12s ease',
      }}
    >
      <Glass lens={resolvedLens}>
        <span style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>{content}</span>
      </Glass>
    </span>
  ) : null;

  return (
    <span
      ref={anchorRef}
      className={className}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? tooltipId : undefined}>{children}</span>
      {portal ? <GlassFloatingPortal enabled>{panel}</GlassFloatingPortal> : panel}
    </span>
  );
}
