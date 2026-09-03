<script lang="ts">
  import { truncateToolbarTitle, warnIfToolbarTitleTooLong } from '../../Toolbar/utils';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    children,
    large = false,
    class: className,
    style,
  }: { children: string; large?: boolean; class?: string; style?: string } = $props();

  $effect(() => {
    warnIfToolbarTitleTooLong(children);
  });
</script>

<span
  class={[styles.title, large ? styles.titleLarge : undefined, className].filter(Boolean).join(' ')}
  {style}
  title={children}
>
  {truncateToolbarTitle(children, large ? 40 : 15)}
</span>
