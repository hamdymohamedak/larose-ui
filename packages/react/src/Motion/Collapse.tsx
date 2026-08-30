import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  getSpringPreset,
  isSpringSettled,
  stepSpring,
  type SpringPresetName,
} from '@larose-ui/core';
import { useMotion } from './MotionContext';

export interface UseSpringAnimationOptions {
  target: number;
  preset?: SpringPresetName;
  enabled?: boolean;
  onSettle?: () => void;
}

/**
 * RAF-driven spring animation for interruptible gesture release (drawers, sheets).
 * Continues from current position and velocity when target changes.
 */
export function useSpringAnimation({
  target,
  preset = 'gentle',
  enabled = true,
  onSettle,
}: UseSpringAnimationOptions): {
  value: number;
  setValue: (value: number, velocity?: number) => void;
  style: CSSProperties;
} {
  const { motionEnabled } = useMotion();
  const active = enabled && motionEnabled;
  const config = getSpringPreset(preset);
  const stateRef = useRef({ value: target, velocity: 0 });
  const [value, setDisplayValue] = useState(target);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const onSettleRef = useRef(onSettle);
  onSettleRef.current = onSettle;

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  const tick = useCallback(
    (now: number) => {
      const last = lastTimeRef.current ?? now;
      const delta = Math.min((now - last) / 1000, 0.064);
      lastTimeRef.current = now;

      const next = stepSpring(stateRef.current, target, config, delta);
      stateRef.current = next;
      setDisplayValue(next.value);

      if (isSpringSettled(next, target)) {
        stateRef.current = { value: target, velocity: 0 };
        setDisplayValue(target);
        stop();
        onSettleRef.current?.();
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    },
    [config, stop, target],
  );

  useEffect(() => {
    if (!active) {
      stop();
      stateRef.current = { value: target, velocity: 0 };
      setDisplayValue(target);
      return;
    }

    stop();
    frameRef.current = requestAnimationFrame(tick);
    return stop;
  }, [active, target, tick, stop]);

  const setValue = useCallback(
    (next: number, velocity = 0) => {
      stop();
      stateRef.current = { value: next, velocity };
      setDisplayValue(next);
    },
    [stop],
  );

  return {
    value,
    setValue,
    style: { transform: `translate3d(${value}px, 0, 0)` },
  };
}

export interface CollapseProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  duration?: string;
}

/**
 * Height-based expand/collapse with measured content height.
 * Uses transform-friendly opacity + grid technique where possible.
 */
export function Collapse({ open, children, className, duration }: CollapseProps) {
  const { motionEnabled } = useMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(open ? 'auto' : 0);
  const [phase, setPhase] = useState<'open' | 'closed' | 'animating'>(
    open ? 'open' : 'closed',
  );

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (!motionEnabled) {
      setHeight(open ? 'auto' : 0);
      setPhase(open ? 'open' : 'closed');
      return;
    }

    if (open) {
      const fullHeight = el.scrollHeight;
      setPhase('animating');
      setHeight(fullHeight);
      const onEnd = () => {
        setHeight('auto');
        setPhase('open');
      };
      const timer = window.setTimeout(onEnd, 280);
      return () => window.clearTimeout(timer);
    }

    const currentHeight = el.scrollHeight;
    setPhase('animating');
    setHeight(currentHeight);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setHeight(0));
    });
    const onEnd = () => setPhase('closed');
    const timer = window.setTimeout(onEnd, 280);
    return () => window.clearTimeout(timer);
  }, [open, motionEnabled]);

  const transitionDuration = duration ?? 'var(--lr-motion-duration-normal)';

  return (
    <div
      className={className}
      data-collapse={phase}
      aria-hidden={!open && phase === 'closed'}
      style={{
        overflow: 'hidden',
        height: height === 'auto' ? 'auto' : `${height}px`,
        visibility: !open && phase === 'closed' ? 'hidden' : 'visible',
        transition:
          motionEnabled && phase === 'animating'
            ? `height ${transitionDuration} var(--lr-motion-spring-gentle)`
            : undefined,
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName !== 'height') return;
        if (!open && height === 0) setPhase('closed');
        if (open && height === 'auto') setPhase('open');
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
