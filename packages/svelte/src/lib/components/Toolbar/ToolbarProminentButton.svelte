<script lang="ts">
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    children,
    onclick,
    disabled,
    class: className,
    style,
  }: {
    children: string;
    onclick?: () => void;
    disabled?: boolean;
    class?: string;
    style?: string;
  } = $props();
</script>

<button type="button" class={[styles.prominent, className].filter(Boolean).join(' ')} {style} {disabled} {onclick}>
  {children}
</button>
