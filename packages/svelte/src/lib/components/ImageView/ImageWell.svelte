<script lang="ts">
  import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    src?: string;
    alt?: string;
    accept?: string;
    disabled?: boolean;
    class?: string;
    style?: string;
    placeholder?: string;
    onChange?: (file: File | null) => void;
  }

  let {
    src,
    alt = '',
    accept = 'image/*',
    disabled,
    class: className,
    style,
    placeholder = 'Drop image',
    onChange,
  }: Props = $props();

  const inputId = `image-well-${Math.random().toString(36).slice(2)}`;
</script>

<label class={cn(styles.well, className)} {style} for={inputId}>
  {#if src}
    <img {src} alt={alt} />
  {:else}
    <span class={styles.wellPlaceholder}>{placeholder}</span>
  {/if}
  <input
    id={inputId}
    type="file"
    {accept}
    {disabled}
    class={styles.wellInput}
    onchange={(e) => onChange?.((e.currentTarget as HTMLInputElement).files?.[0] ?? null)}
  />
</label>
