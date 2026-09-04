import { Button } from '../Button/Button';
import type { CSSProperties } from 'react';
import { PlusIcon } from './icons';
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

export interface DocumentToolbarProps {
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: () => void;
  newLabel?: string;
  openLabel?: string;
  saveLabel?: string;
  canSave?: boolean;
  showAddButton?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * New, Open, and Save actions for document-based apps.
 * @see https://developer.apple.com/design/human-interface-guidelines/file-management
 */
export function DocumentToolbar({
  onNew,
  onOpen,
  onSave,
  newLabel = 'New',
  openLabel = 'Open',
  saveLabel = 'Save',
  canSave = true,
  showAddButton = true,
  className,
  style,
}: DocumentToolbarProps) {
  return (
    <div
      className={[styles.toolbar, className].filter(Boolean).join(' ')}
      style={style}
      role="toolbar"
      aria-label="Document actions"
    >
      {showAddButton && onNew && (
        <Button
          size="md"
          leftIcon={<PlusIcon />}
          onClick={onNew}
          aria-label={newLabel}
          shape="roundedRect"
        >
          {newLabel}
        </Button>
      )}
      {onOpen && (
        <Button size="md" variant="secondary" onClick={onOpen}>
          {openLabel}
        </Button>
      )}
      {onSave && (
        <Button size="md" variant="secondary" onClick={onSave} disabled={!canSave}>
          {saveLabel}
        </Button>
      )}
    </div>
  );
}
