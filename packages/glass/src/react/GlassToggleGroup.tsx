import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { getSpringPreset, stepSpring, isSpringSettled, detectA11yPreferences } from '@larose-ui/core';
import { LENS_PRESETS } from '../lens/presets';
import { useGlassLensOverlay } from './useGlassLensOverlay';

export interface GlassToggleGroupOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface GlassToggleGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: GlassToggleGroupOption[];
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

const INDICATOR_LENS = LENS_PRESETS.toggleIndicator(80, 32);

export function GlassToggleGroup({
  value,
  defaultValue = '',
  onValueChange,
  options,
  className,
  style,
  'aria-label': ariaLabel = 'Toggle group',
}: GlassToggleGroupProps) {
  const [internal, setInternal] = useState(defaultValue || options[0]?.value || '');
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const baseId = useId();
  const shellRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const springX = useRef({ value: 0, velocity: 0 });
  const springW = useRef({ value: 80, velocity: 0 });
  const initialised = useRef(false);
  const reducedMotion = detectA11yPreferences().reducedMotion;

  const { lensRef, setBounds } = useGlassLensOverlay({ lens: INDICATOR_LENS });

  const measureActive = useCallback((): { x: number; y: number; width: number; height: number } | null => {
    const shell = shellRef.current;
    if (!shell) return null;
    const active = shell.querySelector<HTMLElement>(`[data-toggle-value="${current}"]`);
    if (!active) return null;
    const shellRect = shell.getBoundingClientRect();
    const tabRect = active.getBoundingClientRect();
    return {
      x: tabRect.left - shellRect.left,
      y: tabRect.top - shellRect.top,
      width: tabRect.width,
      height: tabRect.height,
    };
  }, [current]);

  useEffect(() => {
    const m = measureActive();
    if (!m) return;

    if (!initialised.current) {
      springX.current = { value: m.x, velocity: 0 };
      springW.current = { value: m.width, velocity: 0 };
      initialised.current = true;
      setBounds(m);
      return;
    }

    if (reducedMotion) {
      setBounds(m);
      return;
    }

    const config = getSpringPreset('snappy');
    const targetX = m.x;
    const targetW = m.width;
    const targetY = m.y;
    const targetH = m.height;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      springX.current = stepSpring(springX.current, targetX, config, dt);
      springW.current = stepSpring(springW.current, targetW, config, dt);
      setBounds({
        x: springX.current.value,
        y: targetY,
        width: springW.current.value,
        height: targetH,
      });
      if (
        !isSpringSettled(springX.current, targetX) ||
        !isSpringSettled(springW.current, targetW)
      ) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, measureActive, reducedMotion, setBounds]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          const m = measureActive();
          if (m) setBounds(m);
        })
      : null;
    observer?.observe(shell);
    return () => observer?.disconnect();
  }, [measureActive, setBounds]);

  const handleSelect = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = options.filter((o) => !o.disabled);
    const idx = enabled.findIndex((o) => o.value === current);
    if (idx < 0) return;

    let nextIdx = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % enabled.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + enabled.length) % enabled.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = enabled.length - 1;
    } else {
      return;
    }

    const next = enabled[nextIdx];
    if (next) handleSelect(next.value);
  };

  return (
    <div
      ref={shellRef}
      role="tablist"
      aria-label={ariaLabel}
      className={className}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        display: 'inline-flex',
        padding: '0.1875rem',
        borderRadius: 999,
        background: 'rgb(118 118 128 / 0.12)',
        isolation: 'isolate',
        ...style,
      }}
      data-larose-glass-toggle-group=""
    >
      <div ref={lensRef} aria-hidden="true" data-larose-glass-lens="" />

      {options.map((option) => {
        const selected = current === option.value;
        const tabId = `${baseId}-${option.value}`;
        return (
          <button
            key={option.value}
            id={tabId}
            type="button"
            role="tab"
            data-toggle-value={option.value}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={option.disabled}
            onClick={() => handleSelect(option.value)}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.375rem 0.875rem',
              border: 'none',
              borderRadius: 999,
              background: 'transparent',
              color: selected
                ? 'var(--lr-color-label, #1c1c1e)'
                : 'var(--lr-color-label-secondary, rgb(60 60 67 / 0.6))',
              fontWeight: selected ? 500 : 400,
              fontSize: '0.875rem',
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              font: 'inherit',
              transition: reducedMotion ? 'none' : 'color 0.15s ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
