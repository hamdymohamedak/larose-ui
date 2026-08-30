import { useCallback, useMemo, useState } from 'react';
import { Menu } from '../Menu/Menu';
import { prepareMenuEntries } from '../Menu/utils';
import type { PathControlProps, PathSegment } from './types';
import {
  collapsePathSegments,
  isEllipsisSegment,
  PATH_SEPARATOR,
  resolveSelectedSegment,
} from './utils';
import styles from './PathControl.module.css';

function FolderIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 8h6l2 2h8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StandardPathControl({
  segments,
  selectedId,
  editable,
  onSegmentSelect,
  onDropPath,
}: PathControlProps) {
  const [dragOver, setDragOver] = useState(false);
  const display = useMemo(() => collapsePathSegments(segments), [segments]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      if (!editable || !onDropPath) return;
      event.preventDefault();
      setDragOver(false);
      const raw = event.dataTransfer.getData('application/x-larose-path');
      if (!raw) return;
      try {
        onDropPath(JSON.parse(raw) as PathSegment[]);
      } catch {
        /* ignore malformed payload */
      }
    },
    [editable, onDropPath],
  );

  return (
    <div
      className={[styles.standard, dragOver ? styles.dropTarget : undefined].filter(Boolean).join(' ')}
      onDragOver={(event) => {
        if (!editable) return;
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {display.map((entry, index) => {
        if (isEllipsisSegment(entry)) {
          return (
            <span key={entry.id} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          );
        }

        const isSelected = entry.id === (selectedId ?? segments.at(-1)?.id);
        return (
          <span key={entry.id} className={styles.standard}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden="true">
                {PATH_SEPARATOR}
              </span>
            )}
            <button
              type="button"
              className={styles.segment}
              aria-current={isSelected ? 'page' : undefined}
              disabled={!onSegmentSelect}
              onClick={() => onSegmentSelect?.(entry)}
            >
              <span className={styles.icon}>{entry.icon ?? <FolderIcon />}</span>
              <span>{entry.label}</span>
            </button>
          </span>
        );
      })}
    </div>
  );
}

function PopupPathControl({
  segments,
  selectedId,
  editable,
  onSegmentSelect,
  onChoose,
}: PathControlProps) {
  const selected = resolveSelectedSegment(segments, selectedId);

  const menuEntries = useMemo(() => {
    const items = segments.map((segment) => ({
      id: segment.id,
      label: segment.label,
      icon: segment.icon ?? <FolderIcon />,
      selected: segment.id === selected.id,
      onSelect: () => onSegmentSelect?.(segment),
    }));
    if (editable && onChoose) {
      return prepareMenuEntries([
        ...items,
        { type: 'separator' as const },
        { id: 'choose', label: 'Choose…', onSelect: onChoose },
      ]);
    }
    return prepareMenuEntries(items);
  }, [editable, onChoose, onSegmentSelect, segments, selected.id]);

  return (
    <Menu entries={menuEntries} layout="large" dimBackground={false}>
      <button type="button" className={styles.popupTrigger} aria-label={`Path: ${selected.label}`}>
        <span className={styles.icon}>{selected.icon ?? <FolderIcon />}</span>
        <span>{selected.label}</span>
        <ChevronDown />
      </button>
    </Menu>
  );
}

/**
 * macOS path control — standard linear or pop-up style.
 * @see https://developer.apple.com/design/human-interface-guidelines/path-controls
 */
export function PathControl({
  segments,
  selectedId,
  variant = 'standard',
  editable = false,
  onSegmentSelect,
  onChoose,
  onDropPath,
  className,
  'aria-label': ariaLabel = 'Path',
}: PathControlProps) {
  if (segments.length === 0) return null;

  return (
    <nav
      className={[styles.pathControl, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      data-variant={variant}
    >
      {variant === 'popup' ? (
        <PopupPathControl
          segments={segments}
          selectedId={selectedId}
          editable={editable}
          onSegmentSelect={onSegmentSelect}
          onChoose={onChoose}
        />
      ) : (
        <StandardPathControl
          segments={segments}
          selectedId={selectedId}
          editable={editable}
          onSegmentSelect={onSegmentSelect}
          onDropPath={onDropPath}
        />
      )}
    </nav>
  );
}

export type { PathControlProps, PathSegment, PathControlVariant } from './types';
export { collapsePathSegments, resolveSelectedSegment, PATH_SEPARATOR } from './utils';
