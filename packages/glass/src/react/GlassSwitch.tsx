import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import { getSpringPreset, stepSpring, isSpringSettled, detectA11yPreferences } from '@larose-ui/core';
import { LENS_PRESETS } from '../lens/presets';
import { useGlassLensOverlay } from './useGlassLensOverlay';

export interface GlassSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const THUMB_Y = 2;
const THUMB_OFF_X = 2;
const THUMB_ON_X = TRACK_WIDTH - THUMB_SIZE - 2;

const THUMB_LENS = LENS_PRESETS.switchThumb(THUMB_SIZE);

export function GlassSwitch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
  style,
  'aria-label': ariaLabel = 'Toggle',
}: GlassSwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;
  const inputId = useId();
  const rafRef = useRef(0);
  const springRef = useRef({ value: isOn ? 1 : 0, velocity: 0 });
  const reducedMotion = detectA11yPreferences().reducedMotion;

  const thumbX = isOn ? THUMB_ON_X : THUMB_OFF_X;

  const { lensRef, setBounds } = useGlassLensOverlay({
    lens: THUMB_LENS,
    initialBounds: { x: thumbX, y: THUMB_Y, width: THUMB_SIZE, height: THUMB_SIZE },
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    },
    [isControlled, onCheckedChange],
  );

  useEffect(() => {
    if (reducedMotion) {
      setBounds({ x: isOn ? THUMB_ON_X : THUMB_OFF_X, y: THUMB_Y, width: THUMB_SIZE, height: THUMB_SIZE });
      return undefined;
    }

    const target = isOn ? 1 : 0;
    const config = getSpringPreset('responsive');
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      springRef.current = stepSpring(springRef.current, target, config, dt);
      const x = THUMB_OFF_X + springRef.current.value * (THUMB_ON_X - THUMB_OFF_X);
      setBounds({ x, y: THUMB_Y, width: THUMB_SIZE, height: THUMB_SIZE });

      if (!isSpringSettled(springRef.current, target)) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOn, reducedMotion, setBounds]);

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-checked={isOn}
        style={{
          position: 'absolute',
          width: 1, height: 1, padding: 0, margin: -1,
          overflow: 'hidden', clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap', border: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          isolation: 'isolate',
          background: isOn
            ? 'var(--lr-color-accent, #34c759)'
            : 'var(--lr-color-fill-tertiary, rgb(120 120 128 / 0.16))',
          transition: reducedMotion ? 'none' : 'background 0.22s ease',
          boxShadow: 'inset 0 1.5px 4px rgb(0 0 0 / 0.08)',
        }}
      >
        <div ref={lensRef} aria-hidden="true" data-larose-glass-lens="" />
      </div>
    </label>
  );
}
