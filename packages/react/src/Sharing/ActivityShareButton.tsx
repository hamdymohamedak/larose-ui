import { useRef, useState, type CSSProperties } from 'react';
import { ActivityView } from './ActivityView';
import { ShareButton } from './ShareButton';
import type { ActivityItem } from './types';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

export interface ActivityShareButtonProps {
  activities: ActivityItem[];
  excludedActivityIds?: string[];
  label?: string;
  title?: string;
  onActivitySelect?: (activity: ActivityItem) => void;
  /** Uses popover on wide viewports and sheet on compact widths when auto. */
  presentation?: 'sheet' | 'popover' | 'auto';
  className?: string;
  style?: CSSProperties;
}

/**
 * Share button that opens an activity view — the standard HIG entry point.
 */
export function ActivityShareButton({
  activities,
  excludedActivityIds,
  label = 'Share',
  title,
  onActivitySelect,
  presentation = 'auto',
  className,
  style,
}: ActivityShareButtonProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const resolvedPresentation =
    presentation === 'auto'
      ? typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
        ? 'popover'
        : 'sheet'
      : presentation;

  return (
    <span className={[styles.wrapper, className].filter(Boolean).join(' ')} style={style}>
      <ShareButton
        ref={buttonRef}
        label={label}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      />
      <ActivityView
        open={open}
        onClose={() => setOpen(false)}
        activities={activities}
        excludedActivityIds={excludedActivityIds}
        presentation={resolvedPresentation}
        title={title}
        onActivitySelect={onActivitySelect}
        anchorRef={buttonRef}
      />
    </span>
  );
}
