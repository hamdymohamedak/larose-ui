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
    blur,
    saturation,
    tint,
    tintFallback,
    displacementScale,
    bezelWidth,
    refractionStrength,
    showSpecular,
    specularAngle,
    specularTopOpacity,
    specularEdgeOpacity,
    innerTopHighlight,
    innerBottomShadow,
    shadowIntensity,
    borderColor,
    ...rest
  }: LiquidGlassSurfaceProps & { children?: Snippet } & Record<string, unknown> = $props();

  let shellNode: HTMLElement | null = $state(null);
  const glass = createLiquidGlassRuntime(
    () => ({
      borderRadius,
      onDisplacementMapChange,
      blur,
      saturation,
      tint,
      tintFallback,
      displacementScale,
      bezelWidth,
      refractionStrength,
      showSpecular,
      specularAngle,
      specularTopOpacity,
      specularEdgeOpacity,
      innerTopHighlight,
      innerBottomShadow,
      shadowIntensity,
      borderColor,
    }),
    () => shellNode,
  );
  const layout = $derived(splitLiquidGlassLayoutStyle(style));
  const geometryStyle = $derived({
    position: 'relative',
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    borderRadius,
    boxSizing: 'border-box',
    ...glass.shellStyle,
    ...layout.shell,
  });

  /** CSS properties that stay unitless when numeric (React/Vue convention). */
  const UNITLESS = new Set([
    'opacity',
    'zIndex',
    'fontWeight',
    'lineHeight',
    'flex',
    'flexGrow',
    'flexShrink',
    'order',
    'zoom',
    'widows',
    'orphans',
    'fillOpacity',
    'strokeOpacity',
    'strokeWidth',
  ]);

  /**
   * Serialize camelCase style maps; keep vendor prefixes (Webkit* → -webkit-*).
   * Appends `px` to length numbers so geometry matches React's style runtime.
   */
  function toStyle(map: Record<string, string | number | undefined | null>) {
    return Object.entries(map)
      .filter((entry): entry is [string, string | number] => entry[1] != null)
      .map(([key, value]) => {
        const cssKey = key
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-ms-/, '-ms-')
          .replace(/^-webkit-/, '-webkit-')
          .replace(/^-moz-/, '-moz-');
        const cssValue =
          typeof value === 'number' && !UNITLESS.has(key) ? `${value}px` : value;
        return `${cssKey}:${cssValue}`;
      })
      .join(';');
  }

  const contentStyle = $derived(
    toStyle({
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      ...layout.content,
    }),
  );

  const specularStyle = $derived(
    toStyle({
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      padding: 1,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      background: `conic-gradient(from ${glass.optics.specularAngle}deg at 50% 0%, rgba(255,255,255,${glass.optics.specularTopOpacity}), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,${glass.optics.specularEdgeOpacity}) 100%)`,
      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    }),
  );

  const highlightStyle = $derived(
    toStyle({
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      boxShadow: `inset 0 1px 0 rgba(255,255,255,${glass.optics.innerTopHighlight}), inset 0 -6px 14px rgba(0,0,0,${glass.optics.innerBottomShadow})`,
    }),
  );
</script>

{#snippet shellChildren()}
  {#if glass.optics.showSpecular}
    <div aria-hidden="true" style={specularStyle}></div>
  {/if}
  <div aria-hidden="true" style={highlightStyle}></div>
  <div style={contentStyle}>
    {@render children?.()}
  </div>
{/snippet}

{#if glass.supportsRefraction}
  <svg aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;overflow:hidden">
    <defs>
      <filter id={glass.filterId} x="-15%" y="-40%" width="130%" height="180%" color-interpolation-filters="sRGB">
        {#if glass.mapDataUrl}
          <feImage href={glass.mapDataUrl} x="0" y="0" width="100%" height="100%" result="displacement_map" />
        {/if}
        <feDisplacementMap
          in="SourceGraphic"
          in2="displacement_map"
          scale={glass.optics.displacementScale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
{/if}

{#if as === 'button'}
  <button
    bind:this={shellNode}
    class={className}
    style={toStyle(geometryStyle)}
    aria-label={ariaLabel}
    type={type === 'submit' || type === 'reset' ? type : 'button'}
    {disabled}
    {...rest}
  >
    {@render shellChildren()}
  </button>
{:else}
  <svelte:element this={as} bind:this={shellNode} class={className} style={toStyle(geometryStyle)} aria-label={ariaLabel} {...rest}>
    {@render shellChildren()}
  </svelte:element>
{/if}
