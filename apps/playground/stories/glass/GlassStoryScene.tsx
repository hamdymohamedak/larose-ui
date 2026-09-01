/**
 * Storybook-only utilities for dragging Glass components over a fixed background.
 * Not part of @larose-ui/glass — production components are unchanged.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

const BACKDROP_STYLE: CSSProperties = {
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  background:
    'radial-gradient(circle at 18% 28%, rgb(252 231 243 / 0.95), transparent 38%), radial-gradient(circle at 78% 22%, rgb(224 231 255 / 0.9), transparent 36%), radial-gradient(circle at 52% 78%, rgb(254 243 199 / 0.85), transparent 34%), linear-gradient(145deg, #ddd6fe 0%, #bfdbfe 45%, #fce7f3 100%)',
};

function RefractionBackdrop() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="glass-story-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="rgb(80 50 160)"
              strokeWidth="0.85"
              strokeDasharray="3 4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#glass-story-grid)" />
      </svg>

      {/* Fixed color blobs — drag glass over these to verify refraction */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          left: '12%',
          top: '20%',
          background: 'radial-gradient(circle, rgb(244 114 182 / 0.65), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          right: '14%',
          top: '30%',
          background: 'radial-gradient(circle, rgb(129 140 248 / 0.6), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 160,
          height: 160,
          borderRadius: '50%',
          left: '42%',
          bottom: '18%',
          background: 'radial-gradient(circle, rgb(251 191 36 / 0.55), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

function StorybookHint() {
  return (
    <p
      style={{
        position: 'fixed',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 0,
        padding: '0.35rem 0.75rem',
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#4338ca',
        background: 'rgb(255 255 255 / 0.82)',
        border: '1px solid rgb(99 102 241 / 0.25)',
        boxShadow: '0 4px 16px rgb(0 0 0 / 0.06)',
        zIndex: 1000,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      Storybook only — drag the glass surface; use controls normally (buttons, switches, sliders)
    </p>
  );
}

export interface DraggableGlassProbeProps {
  children: ReactNode;
  /** Initial offset from viewport center (px). */
  defaultOffset?: { x: number; y: number };
}

/**
 * Wraps a single Glass demo. Pointer-drag moves it freely over the fixed backdrop.
 */
const INTERACTIVE_SELECTOR =
  'button, input, select, textarea, a[href], [role="switch"], [role="slider"], [role="tab"], [contenteditable="true"]';

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export function DraggableGlassProbe({
  children,
  defaultOffset = { x: 0, y: 0 },
}: DraggableGlassProbeProps) {
  const [offset, setOffset] = useState(defaultOffset);
  const [grabbing, setGrabbing] = useState(false);
  const dragging = useRef(false);
  const pointerId = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || isInteractiveTarget(event.target)) return;
      dragging.current = true;
      setGrabbing(true);
      pointerId.current = event.pointerId;
      start.current = {
        x: event.clientX,
        y: event.clientY,
        ox: offset.x,
        oy: offset.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [offset.x, offset.y],
  );

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || pointerId.current !== event.pointerId) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    setOffset({ x: start.current.ox + dx, y: start.current.oy + dy });
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return;
    dragging.current = false;
    setGrabbing(false);
    pointerId.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <div
      role="presentation"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        position: 'fixed',
        left: `calc(50% + ${offset.x}px)`,
        top: `calc(50% + ${offset.y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        cursor: grabbing ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      data-storybook-glass-probe=""
    >
      {children}
    </div>
  );
}

export interface GlassStorySceneProps {
  children: ReactNode;
  /** When true (default), wraps children in a single draggable probe. */
  draggable?: boolean;
  /** Show the storybook hint banner. */
  showHint?: boolean;
}

/**
 * Full-viewport refraction test scene with a fixed background pattern.
 */
export function GlassStoryScene({
  children,
  draggable = true,
  showHint = true,
}: GlassStorySceneProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div style={BACKDROP_STYLE} data-storybook-glass-scene="">
      <RefractionBackdrop />
      {showHint && <StorybookHint />}
      {draggable ? <DraggableGlassProbe>{children}</DraggableGlassProbe> : children}
    </div>
  );
}
