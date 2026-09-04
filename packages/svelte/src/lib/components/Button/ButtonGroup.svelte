<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Button/Button.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    children: Snippet;
    orientation?: 'horizontal' | 'vertical';
    fullWidth?: boolean;
    class?: string;
    style?: string;
    'aria-label'?: string;
  }

  let {
    children,
    orientation = 'horizontal',
    fullWidth = false,
    class: className,
    style,
    'aria-label': ariaLabel,
  }: Props = $props();
</script>

<div
  class={cn(styles.group, className)}
  {style}
  data-orientation={orientation}
  data-full-width={fullWidth ? 'true' : undefined}
  role="group"
  aria-label={ariaLabel}
>
  {@render children()}
</div>
