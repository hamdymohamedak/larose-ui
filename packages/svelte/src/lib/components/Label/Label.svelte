<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Label/Label.module.css';
  import { cn } from '../../utils/cn';

  export type LabelImportance = 'primary' | 'secondary' | 'tertiary' | 'quaternary';

  interface Props {
    importance?: LabelImportance;
    selectable?: boolean;
    mono?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    importance = 'primary',
    selectable = false,
    mono = false,
    class: className,
    children,
  }: Props = $props();
</script>

<svelte:element
  this={'span'}
  class={cn(styles.root, styles[importance], className)}
  data-importance={importance}
  data-selectable={selectable ? 'true' : undefined}
  data-mono={mono ? 'true' : undefined}
>
  {@render children()}
</svelte:element>
