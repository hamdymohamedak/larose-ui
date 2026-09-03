<script lang="ts">
  import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label: string;
    imageUrl?: string;
    class?: string;
    style?: string;
    onclick?: () => void;
  }

  let { label, imageUrl, class: className, style, onclick }: Props = $props();
</script>

<button type="button" class={cn(styles.captionSurface, className)} {style} {onclick}>
  {#if imageUrl}<img src={imageUrl} alt="" class={styles.captionImage} />{/if}
  <span class={styles.captionText}>{label}</span>
</button>
