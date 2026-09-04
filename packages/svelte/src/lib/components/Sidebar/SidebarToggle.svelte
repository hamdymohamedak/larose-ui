<script lang="ts">
  import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

  let {
    hidden,
    onToggle,
    label = 'Toggle sidebar',
    class: className,
    style,
  }: {
    hidden?: boolean;
    onToggle?: () => void;
    label?: string;
    class?: string;
    style?: string;
  } = $props();
</script>

<button
  type="button"
  class={[styles.toggle, className].filter(Boolean).join(' ')}
  {style}
  aria-pressed={!hidden}
  onclick={onToggle}
>
  {hidden ? 'Show Sidebar' : 'Hide Sidebar'}
  <span class="sr-only">{label}</span>
</button>
