import { useEffect, useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { ActivityItem, ActivityPresentation } from './types';
import { partitionActivities, prepareActivities } from './activityUtils';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

export interface ActivityViewProps {
  open: boolean;
  onClose: () => void;
  activities: ActivityItem[];
  excludedActivityIds?: string[];
  presentation?: ActivityPresentation;
  title?: string;
  onActivitySelect?: (activity: ActivityItem) => void;
  footer?: ReactNode;
  /** Used for popover positioning when presentation is popover. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  style?: CSSProperties;
}

function ActivityViewPanel({
  title,
  titleId,
  share,
  app,
  actions,
  onSelect,
  footer,
}: {
  title?: string;
  titleId: string;
  share: ActivityItem[];
  app: ActivityItem[];
  actions: ActivityItem[];
  onSelect: (activity: ActivityItem) => void;
  footer?: ReactNode;
}) {
  return (
    <>
      {title && (
        <div className={styles.activityHeader}>
          <h2 id={titleId} className={styles.sheetTitle}>
            {title}
          </h2>
        </div>
      )}

      {share.length > 0 && (
        <div className={styles.activityShareRow} role="group" aria-label="Share destinations">
          {share.map((activity) => (
            <button
              key={activity.id}
              type="button"
              className={styles.activityShareTile}
              onClick={() => onSelect(activity)}
            >
              <span className={styles.activityShareIcon}>{activity.icon}</span>
              <span className={styles.activityShareLabel}>{activity.title}</span>
              {activity.subtitle && (
                <span className={styles.activityShareSubtitle}>{activity.subtitle}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {(app.length > 0 || actions.length > 0) && (
        <div className={styles.activityActionSection}>
          {app.length > 0 && (
            <ul className={styles.activityActionList} role="menu" aria-label="App actions">
              {app.map((activity) => (
                <li key={activity.id}>
                  <button
                    type="button"
                    className={styles.activityActionRow}
                    role="menuitem"
                    onClick={() => onSelect(activity)}
                  >
                    {activity.icon && (
                      <span className={styles.activityActionIcon}>{activity.icon}</span>
                    )}
                    <span className={styles.activityActionTitle}>{activity.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {app.length > 0 && actions.length > 0 && (
            <div className={styles.activitySectionDivider} role="separator" />
          )}

          {actions.length > 0 && (
            <ul className={styles.activityActionList} role="menu" aria-label="Actions">
              {actions.map((activity) => (
                <li key={activity.id}>
                  <button
                    type="button"
                    className={styles.activityActionRow}
                    role="menuitem"
                    onClick={() => onSelect(activity)}
                  >
                    {activity.icon && (
                      <span className={styles.activityActionIcon}>{activity.icon}</span>
                    )}
                    <span className={styles.activityActionTitle}>{activity.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {footer && <div className={styles.section}>{footer}</div>}
    </>
  );
}

/**
 * Activity view (share sheet) with sharing destinations and contextual actions.
 * @see https://developer.apple.com/design/human-interface-guidelines/activity-views
 */
export function ActivityView({
  open,
  onClose,
  activities,
  excludedActivityIds = [],
  presentation = 'sheet',
  title,
  onActivitySelect,
  footer,
  anchorRef,
  className,
  style,
}: ActivityViewProps) {
  const titleId = useId();

  const prepared = useMemo(
    () => prepareActivities(activities, excludedActivityIds),
    [activities, excludedActivityIds],
  );
  const { share, app, actions } = useMemo(() => partitionActivities(prepared), [prepared]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    if (presentation === 'sheet') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (presentation === 'sheet') {
        document.body.style.overflow = '';
      }
    };
  }, [onClose, open, presentation]);

  if (!open) return null;

  const handleSelect = (activity: ActivityItem) => {
    activity.onSelect?.();
    onActivitySelect?.(activity);
    onClose();
  };

  const panel = (
    <ActivityViewPanel
      title={title}
      titleId={titleId}
      share={share}
      app={app}
      actions={actions}
      onSelect={handleSelect}
      footer={footer}
    />
  );

  if (presentation === 'popover') {
    const anchor = anchorRef?.current?.getBoundingClientRect();
    const anchorStyle = anchor
      ? {
          position: 'fixed' as const,
          top: anchor.bottom + 8,
          right: Math.max(16, window.innerWidth - anchor.right),
          zIndex: 100,
        }
      : undefined;

    return createPortal(
      <div className={styles.activityPopoverBackdrop} role="presentation" onClick={onClose}>
        <div
          className={[styles.activityPopover, className].filter(Boolean).join(' ')}
          style={{ ...anchorStyle, ...style }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          onClick={(event) => event.stopPropagation()}
        >
          {panel}
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      className={styles.sheetOverlay}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={[styles.activitySheet, className].filter(Boolean).join(' ')}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {panel}
      </div>
    </div>,
    document.body,
  );
}
