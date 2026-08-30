import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { FileBrowser, type FileBrowserProps } from './FileBrowser';
import styles from './FileManagement.module.css';

export interface DocumentLauncherProps extends Omit<FileBrowserProps, 'toolbar'> {
  appTitle: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  background?: ReactNode;
  accessories?: ReactNode;
}

/**
 * Document launcher pattern: hero title card + file browser sheet.
 * @see https://developer.apple.com/design/human-interface-guidelines/file-management
 */
export function DocumentLauncher({
  appTitle,
  primaryActionLabel = 'Create Document',
  secondaryActionLabel = 'Choose Template',
  onPrimaryAction,
  onSecondaryAction,
  background,
  accessories,
  ...browserProps
}: DocumentLauncherProps) {
  return (
    <div className={styles.launcher}>
      <div className={styles.launcherHero}>
        {background ?? <div className={styles.launcherBackground} aria-hidden="true" />}
        {accessories}
        <div className={styles.launcherContent}>
          <h2 className={styles.launcherTitle}>{appTitle}</h2>
          <div className={styles.launcherActions}>
            {onPrimaryAction && (
              <Button size="lg" onClick={onPrimaryAction}>
                {primaryActionLabel}
              </Button>
            )}
            {onSecondaryAction && (
              <Button size="lg" variant="secondary" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.launcherSheet}>
        <FileBrowser {...browserProps} />
      </div>
    </div>
  );
}
