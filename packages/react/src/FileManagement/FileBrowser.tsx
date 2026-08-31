import type { ReactNode } from 'react';
import type { FileBrowserItem, FileBrowserTab, FileSyncStatus } from './types';
import {
  formatDisplayName,
  formatFileDate,
  formatFileSize,
  filterFilesByTab,
  filterFilesByType,
} from './utils';
import { DocumentIcon } from './icons';
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

export interface FileBrowserProps {
  files: FileBrowserItem[];
  activeTab?: FileBrowserTab;
  onTabChange?: (tab: FileBrowserTab) => void;
  showExtensions?: boolean;
  onShowExtensionsChange?: (show: boolean) => void;
  selectedId?: string;
  onSelect?: (file: FileBrowserItem) => void;
  onOpen?: (file: FileBrowserItem) => void;
  acceptTypes?: string[];
  emptyLabel?: string;
  toolbar?: ReactNode;
}

const tabs: { id: FileBrowserTab; label: string }[] = [
  { id: 'recents', label: 'Recents' },
  { id: 'shared', label: 'Shared' },
  { id: 'browse', label: 'Browse' },
];

function syncLabel(status?: FileSyncStatus): string {
  switch (status) {
    case 'synced':
      return 'Synced';
    case 'syncing':
      return 'Syncing';
    case 'error':
      return 'Sync error';
    case 'offline':
      return 'Offline';
    default:
      return '';
  }
}

export function FileBrowser({
  files,
  activeTab = 'recents',
  onTabChange,
  showExtensions = false,
  onShowExtensionsChange,
  selectedId,
  onSelect,
  onOpen,
  acceptTypes,
  emptyLabel = 'No documents in this location.',
  toolbar,
}: FileBrowserProps) {
  const tabbed = filterFilesByTab(files, activeTab);
  const visible = filterFilesByType(tabbed, acceptTypes);

  return (
    <section className={styles.browser} aria-label="File browser">
      <div className={styles.browserHeader}>
        <div className={styles.tabList} role="tablist" aria-label="File locations">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={styles.tab}
              data-active={activeTab === tab.id ? 'true' : undefined}
              onClick={() => onTabChange?.(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.browserControls}>
          {onShowExtensionsChange && (
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showExtensions}
                onChange={(event) => onShowExtensionsChange(event.target.checked)}
              />
              Show extensions
            </label>
          )}
          {toolbar}
        </div>
      </div>
      {visible.length === 0 ? (
        <div className={styles.emptyState}>{emptyLabel}</div>
      ) : (
        <ul className={styles.fileList} role="listbox" aria-label="Documents">
          {visible.map((file) => {
            const details = [
              formatFileSize(file.size),
              formatFileDate(file.modifiedAt),
              file.location === 'icloud' ? 'iCloud' : file.location === 'remote' ? 'Remote' : 'On My Device',
            ]
              .filter(Boolean)
              .join(' · ');

            return (
              <li
                key={file.id}
                role="option"
                aria-selected={selectedId === file.id}
                className={styles.fileRow}
                data-selected={selectedId === file.id ? 'true' : undefined}
                onClick={() => onSelect?.(file)}
                onDoubleClick={() => onOpen?.(file)}
              >
                <span className={styles.fileIcon}>
                  {file.thumbnailUrl ? (
                    <img src={file.thumbnailUrl} alt="" width={20} height={20} />
                  ) : (
                    <DocumentIcon />
                  )}
                </span>
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>
                    {formatDisplayName(file.name, showExtensions)}
                  </span>
                  <span className={styles.fileDetails}>{details}</span>
                </div>
                {file.syncStatus && (
                  <span
                    className={styles.syncBadge}
                    data-status={file.syncStatus}
                    title={syncLabel(file.syncStatus)}
                    aria-label={syncLabel(file.syncStatus)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
