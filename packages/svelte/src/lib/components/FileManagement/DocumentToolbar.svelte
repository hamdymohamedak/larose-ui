<script lang="ts">
  import Button from '../Button/Button.svelte';
  import PlusIcon from './PlusIcon.svelte';
  import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

  let {
    onNew,
    onOpen,
    onSave,
    newLabel = 'New',
    openLabel = 'Open',
    saveLabel = 'Save',
    canSave = true,
    showAddButton = true,
    class: className,
    style,
  }: {
    onNew?: () => void;
    onOpen?: () => void;
    onSave?: () => void;
    newLabel?: string;
    openLabel?: string;
    saveLabel?: string;
    canSave?: boolean;
    showAddButton?: boolean;
    class?: string;
    style?: string;
  } = $props();
</script>

<div class={[styles.toolbar, className].filter(Boolean).join(' ')} {style} role="toolbar" aria-label="Document actions">
  {#if showAddButton && onNew}
    <Button size="md" shape="roundedRect" onclick={onNew} tooltip={newLabel}>
      {#snippet leftIcon()}<PlusIcon />{/snippet}
      {newLabel}
    </Button>
  {/if}
  {#if onOpen}
    <Button size="md" variant="secondary" onclick={onOpen}>{openLabel}</Button>
  {/if}
  {#if onSave}
    <Button size="md" variant="secondary" onclick={onSave} disabled={!canSave}>{saveLabel}</Button>
  {/if}
</div>
