<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTopBarItem } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  type TopBarItem = LiquidGlassTopBarItem & {
    icon?: Component | Snippet;
  };

  let {
    title,
    items = [],
    activeKey,
    defaultActiveKey,
    onChange,
    variant = 'floating',
    height = 56,
    borderRadius: borderRadiusProp,
    paddingX = 16,
    activeColor = '#ffffff',
    inactiveColor = 'rgba(255, 255, 255, 0.62)',
    titleColor = '#ffffff',
    navTrackBackground = 'rgba(255, 255, 255, 0.08)',
    navActiveBackground = 'rgba(255, 255, 255, 0.18)',
    position = 'fixed',
    top: topProp,
    insetX: insetXProp,
    className,
    style,
    logo,
    trailing,
    displacementScale = LIQUID_GLASS_PRESETS.topBar.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.topBar.bezelWidth,
    specularAngle = LIQUID_GLASS_PRESETS.topBar.specularAngle,
    innerBottomShadow = 0.12,
    ...optics
  }: LiquidGlassOptics &
    LiquidGlassChromeProps & {
      title?: string;
      items?: TopBarItem[];
      activeKey?: string;
      defaultActiveKey?: string;
      onChange?: (key: string) => void;
      variant?: 'floating' | 'edge';
      height?: number;
      borderRadius?: number;
      paddingX?: number;
      activeColor?: string;
      inactiveColor?: string;
      titleColor?: string;
      navTrackBackground?: string;
      navActiveBackground?: string;
      position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static';
      top?: number | string;
      insetX?: number;
      logo?: Snippet;
      trailing?: Snippet;
    } = $props();

  const isFloating = $derived(variant === 'floating');
  const insetX = $derived(insetXProp ?? (isFloating ? 16 : 0));
  const top = $derived(topProp ?? (isFloating ? 14 : 0));
  const borderRadius = $derived(
    borderRadiusProp ?? (isFloating ? LIQUID_GLASS_PRESETS.topBar.borderRadius : 0),
  );
  const isPositioned = $derived(
    position === 'fixed' || position === 'absolute' || position === 'sticky',
  );

  let internal = $state(defaultActiveKey ?? items[0]?.key ?? '');
  const current = $derived(activeKey ?? internal);

  function select(key: string, disabled?: boolean) {
    if (disabled) return;
    if (activeKey === undefined) internal = key;
    onChange?.(key);
  }

  function itemIcon(item: TopBarItem): Component | undefined {
    return item.icon as Component | undefined;
  }
</script>

<div
  style:position={position}
  style:top={isPositioned ? (typeof top === 'number' ? `${top}px` : top) : undefined}
  style:left={isPositioned ? `${insetX}px` : undefined}
  style:right={isPositioned ? `${insetX}px` : undefined}
  style:z-index={isPositioned ? 20 : undefined}
  style:pointer-events="none"
>
  <LiquidGlass
    as="header"
    aria-label="Top navigation"
    {className}
    width="100%"
    {height}
    {borderRadius}
    {displacementScale}
    {bezelWidth}
    {specularAngle}
    {innerBottomShadow}
    {...optics}
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: `0 ${paddingX}px`,
      pointerEvents: 'auto',
      ...style,
    }}
  >
    <div style="display:flex;align-items:center;gap:10px;min-width:0;justify-self:start">
      {#if logo}
        <span style="display:flex;align-items:center;justify-content:center;flex-shrink:0">
          {@render logo()}
        </span>
      {/if}
      {#if title}
        <span
          style="color:{titleColor};font-weight:700;font-size:1.0625rem;letter-spacing:-0.03em;line-height:1;white-space:nowrap"
        >
          {title}
        </span>
      {/if}
    </div>

    {#if items.length}
      <nav
        role="tablist"
        aria-label="Sections"
        style="display:flex;align-items:center;justify-self:center;gap:2px;padding:3px;border-radius:999px;background:{navTrackBackground};box-shadow:inset 0 0 0 1px rgba(255,255,255,0.10)"
      >
        {#each items as item (item.key)}
          {@const isActive = item.key === current}
          {@const Icon = itemIcon(item)}
          <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={item.ariaLabel ?? item.label}
            disabled={item.disabled}
            style="
              display:inline-flex;align-items:center;justify-content:center;gap:6px;
              height:32px;padding:0 16px;border-radius:999px;border:none;
              background:{isActive ? navActiveBackground : 'transparent'};
              box-shadow:{isActive
              ? 'inset 0 0 0 1px rgba(255,255,255,0.22), 0 1px 4px rgba(0,0,0,0.12)'
              : 'none'};
              color:{isActive ? activeColor : inactiveColor};
              font-size:0.8125rem;font-weight:{isActive ? 600 : 500};
              letter-spacing:-0.01em;line-height:1;font-family:inherit;
              cursor:{item.disabled ? 'not-allowed' : 'pointer'};
              opacity:{item.disabled ? 0.4 : 1};
              transition:background 0.22s cubic-bezier(0.2, 0.9, 0.25, 1.1), color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
              transform:{isActive ? 'scale(1)' : 'scale(0.98)'};
              -webkit-tap-highlight-color:transparent;
            "
            onclick={() => select(item.key, item.disabled)}
          >
            {#if Icon}
              <Icon />
            {/if}
            {item.label}
          </button>
        {/each}
      </nav>
    {/if}

    <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;justify-self:end">
      {@render trailing?.()}
    </div>
  </LiquidGlass>
</div>
