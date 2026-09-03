<script lang="ts">
  import { getToolbarPlatform } from '../../Toolbar/context';
  import BackChevronIcon from './BackChevronIcon.svelte';
  import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';

  let {
    onclick,
    disabled,
    companionLabel,
  }: { onclick?: () => void; disabled?: boolean; companionLabel?: string } = $props();

  const platform = $derived(getToolbarPlatform());
  const showCompanion = $derived(platform === 'visionos' && companionLabel);
</script>

<button type="button" class={styles.item} data-platform={platform} aria-label="Back" {disabled} {onclick}>
  <span class={styles.itemIcon}><BackChevronIcon /></span>
  {#if showCompanion}<span class={styles.companion}>{companionLabel}</span>{/if}
</button>
