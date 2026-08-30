import { documentTitleWithEditedSuffix } from './utils';
import styles from './FileManagement.module.css';

export interface UnsavedIndicatorProps {
  title: string;
  edited?: boolean;
  /** When false, show the unsaved dot (manual save mode). */
  autosaveEnabled?: boolean;
}

/**
 * Shows unsaved-change feedback per Apple HIG autosave guidance.
 * @see https://developer.apple.com/design/human-interface-guidelines/file-management
 */
export function UnsavedIndicator({
  title,
  edited = false,
  autosaveEnabled = true,
}: UnsavedIndicatorProps) {
  const showDot = edited && !autosaveEnabled;
  const displayTitle = documentTitleWithEditedSuffix(title, edited, autosaveEnabled);

  return (
    <span className={styles.unsaved}>
      <span
        className={styles.unsavedDot}
        data-hidden={showDot ? 'false' : 'true'}
        aria-hidden={!showDot}
        title="Unsaved changes"
      />
      <span>{displayTitle}</span>
    </span>
  );
}
