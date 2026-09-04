<script lang="ts">
  import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';
  import { cn } from '../../utils/cn';
  import type { SearchScopeOption } from '../../SearchField/types';

  interface Props {
    options: SearchScopeOption[];
    value?: string;
    class?: string;
    style?: string;
  }

  let { options, value = $bindable(''), class: className, style }: Props = $props();
</script>

<div class={cn(styles.scopeBar, className)} {style} role="tablist" aria-label="Search scope">
  {#each options as option (option.id)}
    <button
      type="button"
      role="tab"
      class={styles.scopeOption}
      data-selected={option.id === value ? 'true' : undefined}
      aria-selected={option.id === value}
      onclick={() => (value = option.id)}
    >
      {option.label}
    </button>
  {/each}
</div>
