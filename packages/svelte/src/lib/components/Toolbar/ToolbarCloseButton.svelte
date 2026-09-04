<script lang="ts">
  import { getToolbarPlatform } from '../../Toolbar/context';
  import CloseIcon from './CloseIcon.svelte';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let { onclick, disabled }: { onclick?: () => void; disabled?: boolean } = $props();
  const platform = $derived(getToolbarPlatform());
</script>

<button type="button" class={styles.item} data-platform={platform} aria-label="Close" {disabled} {onclick}>
  <span class={styles.itemIcon}><CloseIcon /></span>
</button>
