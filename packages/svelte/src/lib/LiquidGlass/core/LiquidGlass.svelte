<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LiquidGlassSurfaceProps } from '../engine/types';
  import { splitLiquidGlassLayoutStyle } from './splitLayoutStyle';
  import { createLiquidGlassRuntime } from './useLiquidGlass.svelte';

  let {
    as = 'div',
    className,
    style,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    borderRadius = 30,
    onDisplacementMapChange,
    'aria-label': ariaLabel,
    type,
    disabled,
    children,
    ...optics
  }: LiquidGlassSurfaceProps & { children?: Snippet } = $props();

  let shellNode: HTMLElement | null = $state(null);
  const glass = createLiquidGlassRuntime(
    () => ({ borderRadius, onDisplacementMapChange, ...optics }),
    () => shellNode,
  );
  const layout = $derived(splitLiquidGlassLayoutStyle(style));
  const geometryStyle = $derived({
    position: 'relative',
    width, height, minWidth, maxWidth, minHeight, maxHeight, borderRadius,
    boxSizing: 'border-box',
    ...glass.shellStyle,
    ...layout.shell,
  });

  function toStyle(map: Record<string, string | number | undefined>) {
    return Object.entries(map)
      .filter((entry): entry is [string, string | number] => entry[1] != null)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}:${value}`)
      .join(';');
  }
</script>

{#if glass.supportsRefraction}
  <svg aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;overflow:hidden">
    <defs>
      <filter id={glass.filterId} x="-15%" y="-40%" width="130%" height="180%" color-interpolation-filters="sRGB">
        {#if glass.mapDataUrl}
          <feImage href={glass.mapDataUrl} x="0" y="0" width="100%" height="100%" result="displacement_map" />
        {/if}
        <feDisplacementMap in="SourceGraphic" in2="displacement_map" scale={glass.optics.displacementScale} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
{/if}

{#if as === 'button'}
  <button bind:this={shellNode} class={className} style={toStyle(geometryStyle)} aria-label={ariaLabel} type={type === 'submit' || type === 'reset' ? type : 'button'} {disabled}>
    <div style="position:relative;z-index:1;width:100%;height:100%;box-sizing:border-box">
      {@render children?.()}
    </div>
  </button>
{:else}
  <svelte:element this={as} bind:this={shellNode} class={className} style={toStyle(geometryStyle)} aria-label={ariaLabel}>
    <div style="position:relative;z-index:1;width:100%;height:100%;box-sizing:border-box">
      {@render children?.()}
    </div>
  </svelte:element>
{/if}
