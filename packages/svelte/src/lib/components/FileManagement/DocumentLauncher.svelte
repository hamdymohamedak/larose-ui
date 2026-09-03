<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from '../Button/Button.svelte';
  import FileBrowser from './FileBrowser.svelte';
  import type { FileBrowserItem, FileBrowserTab } from '../../FileManagement/types';
  import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

  let {
    appTitle,
    primaryActionLabel = 'Create Document',
    secondaryActionLabel = 'Choose Template',
    onPrimaryAction,
    onSecondaryAction,
    background,
    accessories,
    class: className,
    style,
    files,
    activeTab,
    onTabChange,
    showExtensions,
    onShowExtensionsChange,
    selectedId,
    onSelect,
    onOpen,
    acceptTypes,
    emptyLabel,
  }: {
    appTitle: string;
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    background?: Snippet;
    accessories?: Snippet;
    class?: string;
    style?: string;
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
  } = $props();
</script>

<div class={[styles.launcher, className].filter(Boolean).join(' ')} {style}>
  <div class={styles.launcherHero}>
    {#if background}{@render background()}{:else}<div class={styles.launcherBackground} aria-hidden="true"></div>{/if}
    {@render accessories?.()}
    <div class={styles.launcherContent}>
      <h2 class={styles.launcherTitle}>{appTitle}</h2>
      <div class={styles.launcherActions}>
        {#if onPrimaryAction}<Button size="lg" onclick={onPrimaryAction}>{primaryActionLabel}</Button>{/if}
        {#if onSecondaryAction}<Button size="lg" variant="secondary" onclick={onSecondaryAction}>{secondaryActionLabel}</Button>{/if}
      </div>
    </div>
  </div>
  <div class={styles.launcherSheet}>
    <FileBrowser {files} {activeTab} {onTabChange} {showExtensions} {onShowExtensionsChange} {selectedId} {onSelect} {onOpen} {acceptTypes} {emptyLabel} />
  </div>
</div>
