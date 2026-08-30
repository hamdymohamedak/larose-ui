import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { PickerColumn, PickerValue } from './types';
import { columnsFromValues } from './utils';
import { WheelColumn } from './WheelColumn';
import { WheelPickerRowHeightProvider } from './WheelPickerContext';
import styles from './Picker.module.css';

export interface WheelPickerProps {
  columns: PickerColumn[];
  value: PickerValue;
  onChange: (value: PickerValue) => void;
  disabled?: boolean;
  /** Removes chrome for embedding in inline layouts. */
  inline?: boolean;
  /** Compact popover presentation — wheels fill the panel edge-to-edge. */
  compact?: boolean;
  'aria-label'?: string;
}

function measureProbeRowHeight(probe: HTMLElement): number | null {
  const item = probe.querySelector('[data-wheel-item]') as HTMLElement | null;
  if (!item) return null;
  const height = item.getBoundingClientRect().height;
  return height > 0 ? height : null;
}

export function WheelPicker({
  columns,
  value,
  onChange,
  disabled = false,
  inline = false,
  compact = false,
  'aria-label': ariaLabel = 'Picker',
}: WheelPickerProps) {
  const probeRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(0);
  const resolvedColumns = columnsFromValues(columns, value);

  useLayoutEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;

    const measure = () => {
      const height = measureProbeRowHeight(probe);
      if (height !== null) {
        setRowHeight((prev) => (Math.abs(prev - height) > 0.5 ? height : prev));
      }
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(probe);
    return () => observer.disconnect();
  }, []);

  const handleColumnChange = useCallback(
    (columnId: string, nextValue: string) => {
      onChange({ ...value, [columnId]: nextValue });
    },
    [onChange, value],
  );

  const wheelClassName = [
    styles.wheels,
    inline ? styles.wheelsInline : undefined,
    compact ? styles.wheelsCompact : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <WheelPickerRowHeightProvider value={rowHeight}>
      <div className={wheelClassName} role="group" aria-label={ariaLabel}>
        <div ref={probeRef} className={styles.wheelMeasureProbe} aria-hidden="true">
          <div data-wheel-item="" className={styles.wheelItem}>
            <span className={styles.wheelItemLabel}>0</span>
          </div>
        </div>
        {resolvedColumns.map((column) => (
          <WheelColumn
            key={column.id}
            id={column.id}
            label={column.label}
            options={column.options}
            value={value[column.id] ?? column.options[0]?.value ?? ''}
            onChange={(next) => handleColumnChange(column.id, next)}
            disabled={disabled}
            columnFlex={column.flex}
          />
        ))}
      </div>
    </WheelPickerRowHeightProvider>
  );
}
