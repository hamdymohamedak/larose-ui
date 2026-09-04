<script lang="ts">
  import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';
  import type { SearchToken } from '../../SearchField/types';

  interface Props {
    token: SearchToken;
    onRemove?: () => void;
    onSelect?: () => void;
  }

  let { token, onRemove, onSelect }: Props = $props();
</script>

<button type="button" class={styles.token} onclick={onSelect}>
  <span>{token.label}</span>
  <span
    class={styles.tokenRemove}
    aria-hidden="true"
    onclick={(e) => {
      e.stopPropagation();
      onRemove?.();
    }}
  >×</span>
</button>
