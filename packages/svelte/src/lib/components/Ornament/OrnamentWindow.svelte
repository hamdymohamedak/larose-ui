<script lang="ts">
  import type { Snippet } from 'svelte';
  import type {
    OrnamentConfig,
    OrnamentContentAlignment,
    OrnamentEdge,
    OrnamentVisibility,
  } from '../../Ornament/types';
  import { alignmentToFlex, resolveOrnamentVisibility, warnIfTooManyOrnaments } from '../../Ornament/utils';
  import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';
  import { cn } from '../../utils/cn';

  let {
    children,
    ornament,
    edge = 'bottom',
    alignment = 'center',
    visibility = 'visible',
    immersive = false,
    ornaments,
    class: className,
    style,
    'aria-label': ariaLabel = 'Window',
  }: {
    children?: Snippet;
    ornament?: Snippet;
    edge?: OrnamentEdge;
    alignment?: OrnamentContentAlignment;
    visibility?: OrnamentVisibility;
    immersive?: boolean;
    ornaments?: OrnamentConfig[];
    class?: string;
    style?: string;
    'aria-label'?: string;
  } = $props();

  const resolvedOrnaments = $derived(ornaments?.length ? ornaments : []);
  const showOrnaments = $derived(resolveOrnamentVisibility(visibility, immersive));
  const edges: OrnamentEdge[] = ['top', 'bottom', 'leading', 'trailing'];

  $effect(() => {
    warnIfTooManyOrnaments(resolvedOrnaments);
  });
</script>

<section
  class={cn(styles.window, className)}
  {style}
  aria-label={ariaLabel}
  data-immersive={immersive ? 'true' : undefined}
>
  <div class={styles.content} data-immersive={immersive ? 'true' : undefined}>
    {#if children}{@render children()}{/if}
  </div>
  {#if showOrnaments}
    {#each edges as ornamentEdge}
      {#each resolvedOrnaments.filter((item) => (item.edge ?? 'bottom') === ornamentEdge) as item (item.id)}
        <div
          class={styles.ornamentLayer}
          data-edge={ornamentEdge}
          data-alignment={item.alignment ?? alignment}
          style={`justify-content:${alignmentToFlex(item.alignment ?? alignment)}`}
        >
          <div class={styles.ornament} role="toolbar" aria-label="Ornament">
            <div class={styles.ornamentInner}>
              {#if typeof item.content === 'function'}
                {@render (item.content as Snippet)()}
              {:else if item.content != null}
                {item.content}
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {/each}
    {#if ornament}
      <div
        class={styles.ornamentLayer}
        data-edge={edge}
        data-alignment={alignment}
        style={`justify-content:${alignmentToFlex(alignment)}`}
      >
        <div class={styles.ornament} role="toolbar" aria-label="Ornament">
          <div class={styles.ornamentInner}>{@render ornament()}</div>
        </div>
      </div>
    {/if}
  {/if}
</section>
