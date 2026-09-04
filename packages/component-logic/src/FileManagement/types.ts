export type FileSyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

export type FileLocation = 'local' | 'remote' | 'icloud';

export type FileBrowserTab = 'recents' | 'shared' | 'browse';

export interface FileBrowserItem {
  id: string;
  name: string;
  extension?: string;
  size?: number;
  modifiedAt?: Date | string;
  location?: FileLocation;
  syncStatus?: FileSyncStatus;
  thumbnailUrl?: string;
  /** MIME type or category used for filtering (e.g. pdf, image). */
  type?: string;
  shared?: boolean;
}

export interface FilePreviewSource {
  name: string;
  url?: string;
  textContent?: string;
  type?: string;
  extension?: string;
}
