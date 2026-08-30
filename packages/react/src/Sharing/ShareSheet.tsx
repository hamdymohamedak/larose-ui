import { useEffect, useId, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type {
  ShareAudience,
  ShareDestination,
  SharePermission,
  SharePermissionOption,
  ShareSettings,
} from './types';
import { formatSharePermissionSummary } from './utils';
import { ChevronRightIcon } from './icons';
import styles from './Sharing.module.css';

export interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  settings: ShareSettings;
  onSettingsChange?: (settings: ShareSettings) => void;
  destinations?: ShareDestination[];
  permissionOptions?: SharePermissionOption[];
  footer?: ReactNode;
}

const defaultDestinations: ShareDestination[] = [];

const defaultPermissionOptions: SharePermissionOption[] = [
  {
    id: 'invited-edit',
    audience: 'invited',
    permission: 'edit',
    label: 'Only invited people',
    description: 'Can make changes',
  },
  {
    id: 'invited-view',
    audience: 'invited',
    permission: 'view',
    label: 'Only invited people',
    description: 'Can view only',
  },
  {
    id: 'everyone-edit',
    audience: 'everyone',
    permission: 'edit',
    label: 'Everyone',
    description: 'Can make changes',
  },
  {
    id: 'everyone-view',
    audience: 'everyone',
    permission: 'view',
    label: 'Everyone',
    description: 'Can view only',
  },
];

export function ShareSheet({
  open,
  onClose,
  title = 'Share',
  settings,
  onSettingsChange,
  destinations = defaultDestinations,
  permissionOptions = defaultPermissionOptions,
  footer,
}: ShareSheetProps) {
  const titleId = useId();
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    if (!open) return;
    setShowPermissions(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const summary = formatSharePermissionSummary(settings.audience, settings.permission);

  const selectPermission = (audience: ShareAudience, permission: SharePermission) => {
    onSettingsChange?.({ ...settings, audience, permission });
    setShowPermissions(false);
  };

  return createPortal(
    <div
      className={styles.sheetOverlay}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.sheetHeader}>
          <h2 id={titleId} className={styles.sheetTitle}>
            {title}
          </h2>
          {onSettingsChange && (
            <button
              type="button"
              className={styles.permissionSummary}
              onClick={() => setShowPermissions((value) => !value)}
              aria-expanded={showPermissions}
            >
              <span>{summary}</span>
              <ChevronRightIcon />
            </button>
          )}
        </div>

        {showPermissions && onSettingsChange && (
          <div className={styles.permissionPanel} role="group" aria-label="Sharing permissions">
            {permissionOptions.map((option) => {
              const selected =
                option.audience === settings.audience &&
                option.permission === settings.permission;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={styles.option}
                  data-selected={selected ? 'true' : undefined}
                  onClick={() => selectPermission(option.audience, option.permission)}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.description && (
                    <span className={styles.optionDescription}>{option.description}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.destinations} role="menu" aria-label="Share destinations">
          {destinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              className={styles.destination}
              role="menuitem"
              onClick={() => {
                destination.onSelect?.();
                onClose();
              }}
            >
              {destination.icon && (
                <span className={styles.destinationIcon}>{destination.icon}</span>
              )}
              <span>{destination.label}</span>
            </button>
          ))}
        </div>

        {footer && <div className={styles.section}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
