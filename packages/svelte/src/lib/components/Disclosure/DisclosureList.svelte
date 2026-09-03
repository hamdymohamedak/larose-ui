<script lang="ts">
  import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
  import { cn } from '../../utils/cn';
  import DisclosureTriangle from './DisclosureTriangle.svelte';

  export interface DisclosureListItem {
    id: string;
    label: string;
    defaultExpanded?: boolean;
    children?: DisclosureListItem[];
  }

  interface Props {
    items: DisclosureListItem[];
    class?: string;
    style?: string;
  }

  let { items, class: className, style }: Props = $props();
</script>

<ul class={cn(styles.nestedList, className)} {style}>
  {#each items as item (item.id)}
    <li class={styles.nestedItem}>
      {#if item.children?.length}
        <DisclosureTriangle label={item.label} defaultExpanded={item.defaultExpanded}>
          {#snippet children()}
            <svelte:self items={item.children!} />
          {/snippet}
        </DisclosureTriangle>
      {:else}
        <span>{item.label}</span>
      {/if}
    </li>
  {/each}
</ul>
