<script lang="ts">
  import Button from '../Button/Button.svelte';
  import type { FilePreviewSource } from '../../FileManagement/types';
  import { canPreviewFile } from '../../FileManagement/utils';
  import PreviewIcon from './PreviewIcon.svelte';
  import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

  let {
    source,
    onClose,
    closeLabel = 'Close preview',
    class: className,
    style,
  }: { source: FilePreviewSource; onClose?: () => void; closeLabel?: string; class?: string; style?: string } = $props();

  const previewable = $derived(canPreviewFile(source));
  const type = $derived((source.type ?? source.extension ?? '').toLowerCase());
  const isImage = $derived(type.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(type));
</script>

<section class={[styles.preview, className].filter(Boolean).join(' ')} {style} aria-label={`Preview ${source.name}`}>
  <div class={styles.previewHeader}>
    <h3 class={styles.previewTitle}>{source.name}</h3>
    {#if onClose}
      <Button size="sm" variant="secondary" onclick={onClose}>{closeLabel}</Button>
    {/if}
  </div>
  <div class={styles.previewBody}>
    {#if !previewable}
      <div class={styles.previewFallback}><PreviewIcon /><span>Preview isn't available for this file type.</span></div>
    {/if}
    {#if previewable && source.textContent}
      <pre class={styles.previewText}>{source.textContent}</pre>
    {/if}
    {#if previewable && source.url && isImage}
      <img class={styles.previewImage} src={source.url} alt={source.name} />
    {/if}
    {#if previewable && source.url && !isImage && !source.textContent}
      <iframe title={source.name} src={source.url} style="width:100%;min-height:18rem;border:0;border-radius:0.5rem"></iframe>
    {/if}
  </div>
</section>
