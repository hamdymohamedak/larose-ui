<script lang="ts">
  import { documentTitleWithEditedSuffix } from '../../FileManagement/utils';
  import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

  let {
    title,
    edited = false,
    autosaveEnabled = true,
    class: className,
    style,
  }: { title: string; edited?: boolean; autosaveEnabled?: boolean; class?: string; style?: string } = $props();

  const showDot = $derived(edited && !autosaveEnabled);
  const displayTitle = $derived(documentTitleWithEditedSuffix(title, edited, autosaveEnabled));
</script>

<span class={[styles.unsaved, className].filter(Boolean).join(' ')} {style}>
  <span class={styles.unsavedDot} data-hidden={showDot ? 'false' : 'true'} aria-hidden={!showDot} title="Unsaved changes"></span>
  <span>{displayTitle}</span>
</span>
