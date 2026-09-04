<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FileBrowserItem, FileBrowserTab, FileSyncStatus } from '../../FileManagement/types';
  import {
    formatDisplayName,
    formatFileDate,
    formatFileSize,
    filterFilesByTab,
    filterFilesByType,
  } from '../../FileManagement/utils';
  import DocumentIcon from './DocumentIcon.svelte';
  import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

  let {
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
    class: className,
    style,
  }: {
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
    toolbar?: Snippet;
    class?: string;
    style?: string;
  } = $props();

  const tabs: { id: FileBrowserTab; label: string }[] = [
    { id: 'recents', label: 'Recents' },
    { id: 'shared', label: 'Shared' },
    { id: 'browse', label: 'Browse' },
  ];

  const visible = $derived(filterFilesByType(filterFilesByTab(files, activeTab), acceptTypes));

  function syncLabel(status?: FileSyncStatus): string {
    switch (status) {
      case 'synced': return 'Synced';
      case 'syncing': return 'Syncing';
      case 'error': return 'Sync error';
      case 'offline': return 'Offline';
      default: return '';
    }
  }
</script>

<section class={[styles.browser, className].filter(Boolean).join(' ')} {style} aria-label="File browser">
  <div class={styles.browserHeader}>
    <div class={styles.tabList} role="tablist" aria-label="File locations">
      {#each tabs as tab (tab.id)}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          class={styles.tab}
          data-active={activeTab === tab.id ? 'true' : undefined}
          onclick={() => onTabChange?.(tab.id)}>{tab.label}</button
        >
      {/each}
    </div>
    <div class={styles.browserControls}>
      {#if onShowExtensionsChange}
        <label class={styles.toggleLabel}>
          <input type="checkbox" checked={showExtensions} onchange={(event) => onShowExtensionsChange((event.currentTarget as HTMLInputElement).checked)} />
          Show extensions
        </label>
      {/if}
      {@render toolbar?.()}
    </div>
  </div>
  {#if visible.length === 0}
    <div class={styles.emptyState}>{emptyLabel}</div>
  {:else}
    <ul class={styles.fileList} role="listbox" aria-label="Documents">
      {#each visible as file (file.id)}
        {@const details = [formatFileSize(file.size), formatFileDate(file.modifiedAt), file.location === 'icloud' ? 'iCloud' : file.location === 'remote' ? 'Remote' : 'On My Device'].filter(Boolean).join(' · ')}
        <li
          role="option"
          aria-selected={selectedId === file.id}
          class={styles.fileRow}
          data-selected={selectedId === file.id ? 'true' : undefined}
          onclick={() => onSelect?.(file)}
          ondblclick={() => onOpen?.(file)}
        >
          <span class={styles.fileIcon}>
            {#if file.thumbnailUrl}
              <img src={file.thumbnailUrl} alt="" width="20" height="20" />
            {:else}
              <DocumentIcon />
            {/if}
          </span>
          <div class={styles.fileMeta}>
            <span class={styles.fileName}>{formatDisplayName(file.name, showExtensions)}</span>
            <span class={styles.fileDetails}>{details}</span>
          </div>
          {#if file.syncStatus}
            <span class={styles.syncBadge} data-status={file.syncStatus} title={syncLabel(file.syncStatus)} aria-label={syncLabel(file.syncStatus)}></span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>
