import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Presence } from '../Motion/Presence';
import type { CollaborationAction, Collaborator } from './types';
import { collaboratorInitials } from './utils';
import { MessageIcon, VideoIcon } from './icons';
import styles from './Sharing.module.css';

export interface CollaborationPopoverProps {
  trigger: ReactNode;
  collaborators: Collaborator[];
  actions?: CollaborationAction[];
  manageLabel?: string;
  onManage?: () => void;
  onMessage?: () => void;
  onVideo?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Three-section collaboration popover per Apple HIG:
 * collaborators + communication, custom actions, manage shared file.
 */
export function CollaborationPopover({
  trigger,
  collaborators,
  actions = [],
  manageLabel = 'Manage Shared File',
  onManage,
  onMessage,
  onVideo,
  open,
  defaultOpen = false,
  onOpenChange,
}: CollaborationPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const popoverId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [align, setAlign] = useState<'start' | 'end'>('end');

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, setOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const root = rootRef.current;
    const popover = popoverRef.current;
    if (!root || !popover) return;

    const triggerRect = root.getBoundingClientRect();
    const popoverWidth = popover.offsetWidth;
    const padding = 8;
    const rightAlignedLeft = triggerRect.right - popoverWidth;

    setAlign(rightAlignedLeft < padding ? 'start' : 'end');
  }, [isOpen, collaborators.length, actions.length]);

  return (
    <span ref={rootRef} className={styles.wrapper}>
      <span
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
      >
        {trigger}
      </span>
      <Presence present={isOpen} variant="popover" placement="bottom">
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-label="Collaboration"
          className={styles.popover}
          data-side="bottom"
          data-align={align}
        >
          <div className={styles.section}>
            {collaborators.map((person) => (
              <div key={person.id} className={styles.collaboratorRow}>
                <span className={styles.avatar} aria-hidden="true">
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt="" />
                  ) : (
                    person.initials ?? collaboratorInitials(person.name)
                  )}
                </span>
                <span className={styles.collaboratorName}>{person.name}</span>
              </div>
            ))}
            {(onMessage || onVideo) && (
              <div className={styles.communicationRow}>
                {onMessage && (
                  <button type="button" className={styles.commButton} onClick={onMessage}>
                    <MessageIcon />
                    Messages
                  </button>
                )}
                {onVideo && (
                  <button type="button" className={styles.commButton} onClick={onVideo}>
                    <VideoIcon />
                    FaceTime
                  </button>
                )}
              </div>
            )}
          </div>

          {actions.length > 0 && (
            <div className={styles.section}>
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={styles.actionButton}
                  onClick={() => {
                    action.onSelect?.();
                    setOpen(false);
                  }}
                >
                  <span className={styles.optionLabel}>{action.label}</span>
                  {action.description && (
                    <span className={styles.optionDescription}>{action.description}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {onManage && (
            <div className={styles.section}>
              <button
                type="button"
                className={styles.manageButton}
                onClick={() => {
                  onManage();
                  setOpen(false);
                }}
              >
                {manageLabel}
              </button>
            </div>
          )}
        </div>
      </Presence>
    </span>
  );
}
