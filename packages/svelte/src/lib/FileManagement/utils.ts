import type { FileBrowserItem } from './types';

export function getFileExtension(name: string): string | undefined {
  const index = name.lastIndexOf('.');
  if (index <= 0 || index === name.length - 1) return undefined;
  return name.slice(index + 1).toLowerCase();
}

export function stripExtension(name: string): string {
  const extension = getFileExtension(name);
  if (!extension) return name;
  return name.slice(0, -(extension.length + 1));
}

export function formatDisplayName(name: string, showExtensions: boolean): string {
  if (showExtensions) return name;
  return stripExtension(name);
}

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatFileDate(value?: Date | string): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function filterFilesByType(items: FileBrowserItem[], acceptTypes?: string[]): FileBrowserItem[] {
  if (!acceptTypes?.length) return items;
  const normalized = acceptTypes.map((type) => type.replace(/^\./, '').toLowerCase());
  return items.filter((item) => {
    const extension = item.extension ?? getFileExtension(item.name);
    const type = item.type?.toLowerCase();
    return normalized.some(
      (candidate) =>
        extension === candidate ||
        type === candidate ||
        type?.includes(candidate),
    );
  });
}

export function filterFilesByTab(
  items: FileBrowserItem[],
  tab: 'recents' | 'shared' | 'browse',
): FileBrowserItem[] {
  if (tab === 'shared') return items.filter((item) => item.shared);
  return items;
}

export function documentTitleWithEditedSuffix(
  title: string,
  edited: boolean,
  autosaveEnabled: boolean,
): string {
  if (!edited) return title;
  if (autosaveEnabled) return `${title} — Edited`;
  return title;
}

export function canPreviewFile(source: { type?: string; extension?: string; url?: string; textContent?: string }): boolean {
  if (source.textContent) return true;
  if (!source.url) return false;
  const type = (source.type ?? source.extension ?? '').toLowerCase();
  return ['image', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'text', 'txt', 'md'].some(
    (candidate) => type.includes(candidate),
  );
}
