import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { LENS_PRESETS } from '../lens/presets';
import { useGlassLensOverlay } from './useGlassLensOverlay';

export interface GlassSliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

const TRACK_HEIGHT = 5;
const THUMB_W = 28;
const THUMB_H = 28;

const THUMB_LENS = LENS_PRESETS.sliderThumb(THUMB_W, THUMB_H);

export function GlassSlider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled,
  className,
  style,
  'aria-label': ariaLabel = 'Slider',
}: GlassSliderProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const inputId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(200);
  const reducedMotion = detectA11yPreferences().reducedMotion;

  const ratio = Math.max(0, Math.min(1, (current - min) / (max - min)));
  const thumbX = ratio * Math.max(0, trackWidth - THUMB_W);
  const thumbY = (TRACK_HEIGHT - THUMB_H) / 2;

  const { lensRef, setBounds } = useGlassLensOverlay({
    lens: THUMB_LENS,
    initialBounds: { x: thumbX, y: thumbY, width: THUMB_W, height: THUMB_H },
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => setTrackWidth(track.clientWidth);
    measure();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Position-only update — reuses displacement map; skip engine when reduced motion
  useEffect(() => {
    if (reducedMotion) return;
    setBounds({ x: thumbX, y: thumbY, width: THUMB_W, height: THUMB_H });
  }, [thumbX, thumbY, reducedMotion, setBounds]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      data-larose-glass-slider=""
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        minHeight: THUMB_H + 8,
        ...style,
      }}
    >
      <div
        ref={trackRef}
        aria-hidden="true"
        style={{
          position: 'relative',
          flex: 1,
          height: TRACK_HEIGHT,
          marginTop: (THUMB_H - TRACK_HEIGHT) / 2,
          borderRadius: TRACK_HEIGHT / 2,
          isolation: 'isolate',
          background: 'var(--lr-color-fill-tertiary, rgb(120 120 128 / 0.18))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${ratio * 100}%`,
            borderRadius: TRACK_HEIGHT / 2,
            background: 'var(--lr-color-accent, #0071e3)',
          }}
        />
        {/* Glass thumb — positioned relative to track, overflows vertically */}
        <div
          ref={lensRef}
          aria-hidden="true"
          data-larose-glass-lens=""
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        />
      </div>

      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          margin: 0,
        }}
      />
    </div>
  );
}
