import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { Glass } from './Glass';
import { GlassFloatingPortal } from './GlassFloatingPortal';
import { LENS_PRESETS } from '../lens/presets';
import { useFloatingPlacement } from './useFloatingPlacement';
import { useFocusTrap } from './useFocusTrap';
import type { GlassLens } from '../types';

export interface GlassPopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  lens?: Partial<GlassLens>;
  width?: number;
  /** Render panel in a document.body portal (default true). */
  portal?: boolean;
  /** Trap focus inside the panel while open (default true). */
  modal?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_W = 280;
const DEFAULT_H = 160;

export function GlassPopover({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  children,
  lens,
  width = DEFAULT_W,
  portal = true,
  modal = true,
  className,
  style,
}: GlassPopoverProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internal;
  const triggerId = useId();
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = detectA11yPreferences().reducedMotion;

  const resolvedLens = {
    ...LENS_PRESETS.popover(width, DEFAULT_H),
    ...lens,
  };

  const placement = useFloatingPlacement(triggerRef, panelRef, isOpen, {
    preferredSide: 'bottom',
    gap: 8,
    strategy: portal ? 'fixed' : 'absolute',
  });

  const close = useCallback(() => {
    if (!isControlled) setInternal(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, close]);

  useFocusTrap(panelRef, isOpen && modal, triggerRef);

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  const panelPosition: CSSProperties = portal
    ? {
        position: 'fixed',
        top: placement?.top ?? -9999,
        left: placement?.left ?? 0,
      }
    : {
        position: 'absolute',
        top: placement?.top ?? 'calc(100% + 8px)',
        left: placement?.left ?? 0,
      };

  const panel = isOpen ? (
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-modal={modal ? 'true' : undefined}
      aria-labelledby={triggerId}
      tabIndex={-1}
      style={{
        ...panelPosition,
        zIndex: 10000,
        visibility: placement ? 'visible' : 'hidden',
        transition: reducedMotion ? 'none' : 'opacity 0.15s ease',
      }}
    >
      <Glass lens={resolvedLens}>
        <div style={{ padding: '1rem', width, boxSizing: 'border-box' }}>{children}</div>
      </Glass>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          font: 'inherit',
        }}
      >
        {trigger}
      </button>
      {portal ? (
        <GlassFloatingPortal enabled>{panel}</GlassFloatingPortal>
      ) : (
        panel
      )}
    </div>
  );
}
