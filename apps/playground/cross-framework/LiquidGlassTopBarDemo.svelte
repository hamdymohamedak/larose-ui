<script lang="ts">
  import LiquidGlassTopBar from '../../../packages/svelte/src/lib/LiquidGlass/TopBar/LiquidGlassTopBar.svelte';
  import GlassScrollScene from './GlassScrollScene.svelte';

  const TOP_BAR_NAV_ITEMS = [
    { key: 'home', label: 'Home' },
    { key: 'discover', label: 'Discover' },
    { key: 'library', label: 'Library' },
  ];

  let {
    title = 'laRose',
    defaultActiveKey = 'home',
    variant = 'floating',
    height = 56,
    showTrailing = true,
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
  }: {
    title?: string;
    defaultActiveKey?: string;
    variant?: 'floating' | 'edge';
    height?: number;
    showTrailing?: boolean;
    blur?: number;
    saturation?: number;
    tint?: string;
    tintFallback?: string;
    displacementScale?: number;
    bezelWidth?: number;
    refractionStrength?: number;
    showSpecular?: boolean;
    specularAngle?: number;
    specularTopOpacity?: number;
    specularEdgeOpacity?: number;
    innerTopHighlight?: number;
    innerBottomShadow?: number;
    shadowIntensity?: number;
    borderColor?: string;
  } = $props();

  let active = $state('home');

  $effect(() => {
    if (defaultActiveKey) active = defaultActiveKey;
  });
</script>

{#snippet trailing()}
  {#if showTrailing}
    <button
      type="button"
      aria-label="Settings"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
        color: rgba(255, 255, 255, 0.85);
        font-size: 16px;
        cursor: pointer;
      "
    >
      ⚙
    </button>
  {/if}
{/snippet}

<GlassScrollScene contentPaddingBottom={120}>
  <LiquidGlassTopBar
    {title}
    items={TOP_BAR_NAV_ITEMS}
    activeKey={active}
    onChange={(key) => (active = key)}
    {variant}
    {height}
    {blur}
    {saturation}
    {tint}
    {tintFallback}
    {displacementScale}
    {bezelWidth}
    {refractionStrength}
    {showSpecular}
    {specularAngle}
    {specularTopOpacity}
    {specularEdgeOpacity}
    {innerTopHighlight}
    {innerBottomShadow}
    {shadowIntensity}
    {borderColor}
    trailing={trailing}
    style={{
      position: 'fixed',
      top: variant === 'edge' ? '0' : '14px',
      left: variant === 'edge' ? '0' : '16px',
      right: variant === 'edge' ? '0' : '16px',
      zIndex: 20,
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      color: '#fff',
    }}
  />
</GlassScrollScene>
