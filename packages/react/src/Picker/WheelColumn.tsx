import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { useMotion } from '../Motion/MotionContext';
import type { PickerOption } from './types';
import { getWheelItemVisual, useWheelPhysics } from './useWheelPhysics';
import { useWheelPickerRowHeight } from './WheelPickerContext';
import { mergeStyles } from '../shared/styleProps';
import styles from '@larose-ui/styles/components/Picker/Picker.module.css';

export interface WheelColumnProps {
  id: string;
  label?: string;
  options: PickerOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  columnFlex?: number;
  className?: string;
  style?: CSSProperties;
}

function measureRowHeight(viewport: HTMLElement): number | null {
  const item = viewport.querySelector('[data-wheel-item]') as HTMLElement | null;
  if (!item) return null;
  const height = item.getBoundingClientRect().height;
  return height > 0 ? height : null;
}

export function WheelColumn({
  id,
  label,
  options,
  value,
  onChange,
  disabled = false,
  columnFlex,
  className,
  style,
}: WheelColumnProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const { motionEnabled } = useMotion();
  const sharedRowHeight = useWheelPickerRowHeight();
  const [localRowHeight, setLocalRowHeight] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useLayoutEffect(() => {
    if (sharedRowHeight > 0) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const height = measureRowHeight(viewport);
      if (height !== null) {
        setLocalRowHeight((prev) => (Math.abs(prev - height) > 0.5 ? height : prev));
      }
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [options.length, sharedRowHeight]);

  const rowHeight = sharedRowHeight > 0 ? sharedRowHeight : localRowHeight;

  const handleIndexChange = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      if (option.value !== value) onChange(option.value);
    },
    [onChange, options, value],
  );

  const { viewportProps, listStyle, getItemVisual, getItemDistance, scrollToIndex, centeredIndex } =
    useWheelPhysics({
      itemCount: options.length,
      rowHeight,
      selectedIndex,
      onIndexChange: handleIndexChange,
      disabled,
      motionEnabled,
    });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        scrollToIndex(selectedIndex - 1);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        scrollToIndex(selectedIndex + 1);
      }
    },
    [disabled, scrollToIndex, selectedIndex],
  );

  const padding = `calc((var(--lr-picker-wheel-height) - var(--lr-picker-row-height)) / 2)`;
  const physicsReady = rowHeight > 0;

  const columnStyle = {
    ...(columnFlex !== undefined
      ? ({ flex: columnFlex } as CSSProperties)
      : undefined),
  };

  return (
    <div
      className={[styles.wheelColumn, className].filter(Boolean).join(' ')}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      style={mergeStyles(columnStyle, style)}
    >
      {label && (
        <span id={labelId} className={styles.wheelLabel}>
          {label}
        </span>
      )}
      <div ref={viewportRef} className={styles.wheelViewport} {...viewportProps}>
        <div className={styles.wheelFadeTop} aria-hidden="true" />
        <div className={styles.wheelSelection} aria-hidden="true" />
        <div
          id={id}
          className={styles.wheelList}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${id}-option-${centeredIndex}`}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          style={physicsReady ? listStyle : undefined}
        >
          <div className={styles.wheelListPadding} style={{ height: padding }} aria-hidden="true" />
          {options.map((option, index) => {
            const visual = physicsReady
              ? getItemVisual(index)
              : getWheelItemVisual(index - selectedIndex);
            const distance = physicsReady
              ? Math.abs(getItemDistance(index))
              : Math.abs(index - selectedIndex);
            const isCentered = distance < 0.45;
            const isCommitted = option.value === value;
            return (
              <div
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isCommitted}
                data-wheel-item=""
                className={styles.wheelItem}
                data-centered={isCentered ? 'true' : undefined}
                data-disabled={option.disabled ? 'true' : undefined}
                style={physicsReady ? { opacity: visual.opacity } : undefined}
                onClick={() => {
                  if (disabled || option.disabled) return;
                  scrollToIndex(index);
                }}
              >
                <span
                  className={styles.wheelItemLabel}
                  style={
                    physicsReady
                      ? {
                          transform: `rotateX(${visual.rotateX}deg) scale(${visual.scale})`,
                        }
                      : undefined
                  }
                >
                  {option.label}
                </span>
              </div>
            );
          })}
          <div className={styles.wheelListPadding} style={{ height: padding }} aria-hidden="true" />
        </div>
        <div className={styles.wheelFadeBottom} aria-hidden="true" />
      </div>
    </div>
  );
}
