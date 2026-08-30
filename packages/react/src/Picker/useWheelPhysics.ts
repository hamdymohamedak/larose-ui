import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type WheelEvent,
} from 'react';
import {
  getSpringPreset,
  isSpringSettled,
  stepSpring,
  type SpringState,
} from '@larose-ui/core';

export interface WheelItemVisual {
  opacity: number;
  scale: number;
  rotateX: number;
}

/** Visual state for a wheel row based on distance from the selection center (in rows). */
export function getWheelItemVisual(distanceRows: number): WheelItemVisual {
  const abs = Math.min(Math.abs(distanceRows), 2.5);
  if (abs < 0.001) {
    return { opacity: 1, scale: 1, rotateX: 0 };
  }
  const direction = distanceRows < 0 ? 1 : -1;
  return {
    opacity: Math.max(0.28, 1 - abs * 0.22),
    scale: Math.max(0.86, 1 - abs * 0.045),
    rotateX: direction * abs * 14,
  };
}

export interface UseWheelPhysicsOptions {
  itemCount: number;
  rowHeight: number;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  disabled?: boolean;
  motionEnabled?: boolean;
}

export interface UseWheelPhysicsResult {
  offset: number;
  centeredIndex: number;
  viewportProps: {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
    onWheel: (event: WheelEvent<HTMLDivElement>) => void;
    style: CSSProperties;
  };
  listStyle: CSSProperties;
  getItemDistance: (index: number) => number;
  getItemVisual: (index: number) => WheelItemVisual;
  scrollToIndex: (index: number, animate?: boolean) => void;
}

const INERTIA_FRICTION = 0.92;
const MIN_INERTIA_VELOCITY = 20;
const MAX_INERTIA_VELOCITY = 2800;
const VELOCITY_SAMPLE_COUNT = 5;

function clampIndex(index: number, maxIndex: number): number {
  return Math.max(0, Math.min(maxIndex, index));
}

function indexFromOffset(offset: number, rowHeight: number, maxIndex: number): number {
  if (rowHeight <= 0) return 0;
  return clampIndex(Math.round(offset / rowHeight), maxIndex);
}

function clampVelocity(velocity: number): number {
  return Math.max(-MAX_INERTIA_VELOCITY, Math.min(MAX_INERTIA_VELOCITY, velocity));
}

function averageVelocity(samples: number[]): number {
  if (samples.length === 0) return 0;
  return samples.reduce((sum, value) => sum + value, 0) / samples.length;
}

export function useWheelPhysics({
  itemCount,
  rowHeight,
  selectedIndex,
  onIndexChange,
  disabled = false,
  motionEnabled = true,
}: UseWheelPhysicsOptions): UseWheelPhysicsResult {
  const maxIndex = Math.max(0, itemCount - 1);
  const targetOffset = selectedIndex * rowHeight;

  const offsetRef = useRef(targetOffset);
  const [offset, setOffset] = useState(targetOffset);
  const springRef = useRef<SpringState>({ value: targetOffset, velocity: 0 });
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocitySamplesRef = useRef<number[]>([]);
  const wheelEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevRowHeightRef = useRef(rowHeight);
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  const config = getSpringPreset('snappy');

  const clampOffset = useCallback(
    (value: number) => {
      if (rowHeight <= 0) return 0;
      return Math.max(0, Math.min(maxIndex * rowHeight, value));
    },
    [maxIndex, rowHeight],
  );

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastFrameRef.current = null;
    isAnimatingRef.current = false;
  }, []);

  const applyOffset = useCallback(
    (next: number) => {
      const clamped = clampOffset(next);
      offsetRef.current = clamped;
      setOffset(clamped);
    },
    [clampOffset],
  );

  const settleAtOffset = useCallback(
    (nextOffset: number) => {
      if (rowHeight <= 0) return;
      const index = indexFromOffset(nextOffset, rowHeight, maxIndex);
      const snapped = index * rowHeight;
      applyOffset(snapped);
      springRef.current = { value: snapped, velocity: 0 };
      if (index !== selectedIndex) onIndexChangeRef.current(index);
    },
    [applyOffset, maxIndex, rowHeight, selectedIndex],
  );

  const animateToOffset = useCallback(
    (target: number, initialVelocity = 0) => {
      stopAnimation();
      if (rowHeight <= 0) return;

      const clampedTarget = clampOffset(target);

      if (!motionEnabled) {
        settleAtOffset(clampedTarget);
        return;
      }

      springRef.current = { value: offsetRef.current, velocity: initialVelocity };
      isAnimatingRef.current = true;

      const tick = (now: number) => {
        const last = lastFrameRef.current ?? now;
        const delta = Math.min((now - last) / 1000, 0.032);
        lastFrameRef.current = now;

        const next = stepSpring(springRef.current, clampedTarget, config, delta);
        springRef.current = next;
        applyOffset(next.value);

        if (isSpringSettled(next, clampedTarget, 0.35, 8)) {
          settleAtOffset(clampedTarget);
          stopAnimation();
          return;
        }

        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    },
    [clampOffset, config, motionEnabled, rowHeight, settleAtOffset, stopAnimation, applyOffset],
  );

  const startInertia = useCallback(
    (initialVelocity: number) => {
      stopAnimation();
      if (rowHeight <= 0) return;

      if (!motionEnabled || Math.abs(initialVelocity) < MIN_INERTIA_VELOCITY) {
        const index = indexFromOffset(offsetRef.current, rowHeight, maxIndex);
        animateToOffset(index * rowHeight);
        return;
      }

      isAnimatingRef.current = true;
      let velocity = clampVelocity(initialVelocity);
      lastFrameRef.current = null;

      const tick = (now: number) => {
        const last = lastFrameRef.current ?? now;
        const delta = Math.min((now - last) / 1000, 0.032);
        lastFrameRef.current = now;

        velocity *= INERTIA_FRICTION ** (delta * 60);

        if (Math.abs(velocity) < MIN_INERTIA_VELOCITY) {
          const index = indexFromOffset(offsetRef.current, rowHeight, maxIndex);
          animateToOffset(index * rowHeight);
          return;
        }

        const next = offsetRef.current + velocity * delta;
        const clamped = clampOffset(next);

        if (clamped !== next) {
          velocity *= -0.25;
        }

        applyOffset(clamped);
        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    },
    [animateToOffset, applyOffset, clampOffset, maxIndex, motionEnabled, rowHeight, stopAnimation],
  );

  const scrollToIndex = useCallback(
    (index: number, animate = true) => {
      if (rowHeight <= 0) return;
      const clamped = clampIndex(index, maxIndex);
      const target = clamped * rowHeight;
      if (animate && motionEnabled) {
        animateToOffset(target);
      } else {
        settleAtOffset(target);
      }
    },
    [animateToOffset, maxIndex, motionEnabled, rowHeight, settleAtOffset],
  );

  useLayoutEffect(() => {
    if (rowHeight <= 0) return;

    const prev = prevRowHeightRef.current;
    if (prev > 0 && prev !== rowHeight) {
      applyOffset((offsetRef.current / prev) * rowHeight);
    } else if (!isDraggingRef.current && !isAnimatingRef.current) {
      applyOffset(selectedIndex * rowHeight);
    }

    prevRowHeightRef.current = rowHeight;
  }, [applyOffset, rowHeight, selectedIndex]);

  useEffect(() => {
    if (isDraggingRef.current || isAnimatingRef.current || rowHeight <= 0) return;
    const next = selectedIndex * rowHeight;
    if (Math.abs(offsetRef.current - next) > 0.5) {
      if (motionEnabled) {
        animateToOffset(next);
      } else {
        settleAtOffset(next);
      }
    }
  }, [animateToOffset, motionEnabled, rowHeight, selectedIndex, settleAtOffset]);

  useEffect(
    () => () => {
      stopAnimation();
      if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);
    },
    [stopAnimation],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled || itemCount === 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      isDraggingRef.current = true;
      stopAnimation();
      lastPointerYRef.current = event.clientY;
      lastPointerTimeRef.current = performance.now();
      velocitySamplesRef.current = [];
    },
    [disabled, itemCount, stopAnimation],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const dy = lastPointerYRef.current - event.clientY;
      const now = performance.now();
      const dt = now - lastPointerTimeRef.current;
      if (dt > 0) {
        const sample = clampVelocity((dy / dt) * 1000);
        const samples = velocitySamplesRef.current;
        samples.push(sample);
        if (samples.length > VELOCITY_SAMPLE_COUNT) samples.shift();
      }
      lastPointerYRef.current = event.clientY;
      lastPointerTimeRef.current = now;
      applyOffset(offsetRef.current + dy);
    },
    [applyOffset],
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    startInertia(averageVelocity(velocitySamplesRef.current));
  }, [startInertia]);

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      endDrag();
    },
    [endDrag],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      endDrag();
    },
    [endDrag],
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (disabled || itemCount === 0 || rowHeight <= 0) return;
      event.preventDefault();
      stopAnimation();
      const delta = event.deltaY;
      applyOffset(offsetRef.current + delta);
      const samples = velocitySamplesRef.current;
      samples.push(clampVelocity(delta * 12));
      if (samples.length > VELOCITY_SAMPLE_COUNT) samples.shift();

      if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);
      wheelEndTimerRef.current = setTimeout(() => {
        startInertia(averageVelocity(samples));
      }, 100);
    },
    [applyOffset, disabled, itemCount, rowHeight, startInertia, stopAnimation],
  );

  const getItemDistance = useCallback(
    (index: number) => {
      if (rowHeight <= 0) return index;
      return index - offset / rowHeight;
    },
    [offset, rowHeight],
  );

  const getItemVisual = useCallback(
    (index: number) => getWheelItemVisual(getItemDistance(index)),
    [getItemDistance],
  );

  const centeredIndex =
    rowHeight > 0 ? indexFromOffset(offset, rowHeight, maxIndex) : selectedIndex;

  return {
    offset,
    centeredIndex,
    viewportProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onWheel: handleWheel,
      style: { touchAction: 'none' },
    },
    listStyle: { transform: `translate3d(0, ${-offset}px, 0)` },
    getItemDistance,
    getItemVisual,
    scrollToIndex,
  };
}
