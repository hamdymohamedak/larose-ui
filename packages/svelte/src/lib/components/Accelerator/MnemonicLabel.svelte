<script lang="ts">
  import { parseMnemonicLabel, resolveMnemonicKey } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Menu/Menu.module.css';

  let {
    label,
    mnemonic,
    showAccessKey = false,
    class: className,
    style,
  }: {
    label: string;
    mnemonic?: string;
    showAccessKey?: boolean;
    class?: string;
    style?: string;
  } = $props();

  const parsed = $derived(parseMnemonicLabel(label));
  const accessKey = $derived(resolveMnemonicKey(label, mnemonic) ?? parsed.mnemonicKey);
  const display = $derived(parsed.displayLabel);
  const index = $derived(
    showAccessKey && accessKey ? display.toLowerCase().indexOf(accessKey.toLowerCase()) : -1,
  );
</script>

{#if !showAccessKey || !accessKey || index === -1}
  <span class={className} {style}>{display}</span>
{:else}
  <span class={className} {style}>
    {display.slice(0, index)}<span class={styles.mnemonicChar}>{display.charAt(index)}</span
    >{display.slice(index + 1)}
  </span>
{/if}
