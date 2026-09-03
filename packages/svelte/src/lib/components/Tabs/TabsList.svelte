<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    children: Snippet;
    class?: string;
    style?: string;
    'aria-label'?: string;
  }

  let {
    children,
    class: className,
    style,
    'aria-label': ariaLabel = 'Tabs',
  }: Props = $props();
</script>

<div class={cn(styles.list, className)} {style} role="tablist" aria-label={ariaLabel}>
  {@render children()}
</div>
