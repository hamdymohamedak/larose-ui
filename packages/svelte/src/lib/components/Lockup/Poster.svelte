<script lang="ts">
  import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    title: string;
    subtitle?: string;
    imageUrl: string;
    class?: string;
    style?: string;
  }

  let { title, subtitle, imageUrl, class: className, style }: Props = $props();
</script>

<figure class={cn(styles.posterFrame, className)} {style}>
  <img src={imageUrl} alt={title} class={styles.posterImage} />
  <figcaption class={styles.posterMeta}>
    <div class={styles.posterTitle}>{title}</div>
    {#if subtitle}<div class={styles.posterSubtitle}>{subtitle}</div>{/if}
  </figcaption>
</figure>
