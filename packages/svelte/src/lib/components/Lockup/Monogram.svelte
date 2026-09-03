<script lang="ts">
  import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
  import { cn } from '../../utils/cn';
  import { getInitials } from '../../Lockup/utils';

  interface Props {
    name: string;
    imageUrl?: string;
    class?: string;
    style?: string;
  }

  let { name, imageUrl, class: className, style }: Props = $props();
</script>

<span class={cn(styles.monogramCircle, className)} {style} aria-label={name}>
  {#if imageUrl}
    <img src={imageUrl} alt="" class={styles.monogramImage} />
  {:else}
    <span class={styles.monogramInitials}>{getInitials(name)}</span>
  {/if}
</span>
