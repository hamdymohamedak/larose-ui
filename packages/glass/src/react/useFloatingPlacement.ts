import { useLayoutEffect, useState, type RefObject } from 'react';

export type FloatingSide = 'top' | 'bottom';
export type FloatingStrategy = 'absolute' | 'fixed';

export interface FloatingPlacement {
  side: FloatingSide;
  top: number;
  left: number;
  strategy: FloatingStrategy;
}

export interface UseFloatingPlacementOptions {
  gap?: number;
  preferredSide?: FloatingSide;
  padding?: number;
  /** fixed = viewport coordinates (portals); absolute = offset-parent coordinates */
  strategy?: FloatingStrategy;
}

const DEFAULT_GAP = 8;
const DEFAULT_PADDING = 8;

export function computeFloatingPlacement(
  anchorRect: DOMRectReadOnly,
  panelW: number,
  panelH: number,
  options: Required<Pick<UseFloatingPlacementOptions, 'gap' | 'padding' | 'preferredSide' | 'strategy'>> & {
    containerRect?: DOMRectReadOnly;
  },
): FloatingPlacement {
  const { gap, padding, preferredSide, strategy } = options;
  const containerRect = options.containerRect ?? { left: 0, top: 0, right: 0, bottom: 0 } as DOMRectReadOnly;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  const spaceBelow = vh - anchorRect.bottom - gap - padding;
  const spaceAbove = anchorRect.top - gap - padding;

  let side: FloatingSide = preferredSide;
  if (preferredSide === 'bottom' && spaceBelow < panelH && spaceAbove > spaceBelow) {
    side = 'top';
  } else if (preferredSide === 'top' && spaceAbove < panelH && spaceBelow > spaceAbove) {
    side = 'bottom';
  }

  if (strategy === 'fixed') {
    let left = anchorRect.left;
    left = Math.max(padding, Math.min(left, vw - padding - panelW));
    const top =
      side === 'bottom'
        ? anchorRect.bottom + gap
        : anchorRect.top - panelH - gap;
    return { side, top, left, strategy };
  }

  let left = anchorRect.left - containerRect.left;
  const maxLeft = vw - padding - containerRect.left - panelW;
  const minLeft = padding - containerRect.left;
  left = Math.max(minLeft, Math.min(left, maxLeft));

  const top =
    side === 'bottom'
      ? anchorRect.bottom - containerRect.top + gap
      : anchorRect.top - containerRect.top - panelH - gap;

  return { side, top, left, strategy };
}

/**
 * Flip/shift floating panels relative to an anchor within the viewport.
 */
export function useFloatingPlacement(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  options: UseFloatingPlacementOptions = {},
): FloatingPlacement | null {
  const gap = options.gap ?? DEFAULT_GAP;
  const padding = options.padding ?? DEFAULT_PADDING;
  const preferredSide = options.preferredSide ?? 'bottom';
  const strategy = options.strategy ?? 'absolute';
  const [placement, setPlacement] = useState<FloatingPlacement | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPlacement(null);
      return;
    }

    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;

    const measure = () => {
      const container =
        strategy === 'fixed'
          ? undefined
          : (anchor.offsetParent as HTMLElement | null) ?? anchor.parentElement;
      if (strategy === 'absolute' && !container) return;

      const anchorRect = anchor.getBoundingClientRect();
      const containerRect = container?.getBoundingClientRect();
      const panelH = floating.offsetHeight || floating.getBoundingClientRect().height;
      const panelW = floating.offsetWidth || floating.getBoundingClientRect().width;

      setPlacement(
        computeFloatingPlacement(anchorRect, panelW, panelH, {
          gap,
          padding,
          preferredSide,
          strategy,
          containerRect,
        }),
      );
    };

    measure();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(floating);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [anchorRef, floatingRef, gap, open, padding, preferredSide, strategy]);

  return placement;
}
