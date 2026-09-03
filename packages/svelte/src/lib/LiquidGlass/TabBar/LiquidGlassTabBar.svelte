<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTabItem } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    items,
    activeKey,
    defaultActiveKey,
    onChange,
    height = 64,
    className,
    style,
    icon,
    borderRadius = LIQUID_GLASS_PRESETS.tabBar.borderRadius,
    maxWidth = 420,
    indicatorPadding = 8,
    showIndicator = true,
    indicatorBackground = 'rgba(255, 255, 255, 0.16)',
    indicatorBorderColor = 'rgba(255, 255, 255, 0.28)',
    activeColor = '#ffffff',
    inactiveColor = 'rgba(255, 255, 255, 0.55)',
    position = 'fixed',
    bottom = 22,
    displacementScale = LIQUID_GLASS_PRESETS.tabBar.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.tabBar.bezelWidth,
    ...optics
  }: LiquidGlassOptics &
    LiquidGlassChromeProps & {
      items: LiquidGlassTabItem[];
      activeKey?: string;
      defaultActiveKey?: string;
      onChange?: (key: string) => void;
      height?: number;
      borderRadius?: number;
      maxWidth?: number;
      indicatorPadding?: number;
      showIndicator?: boolean;
      indicatorBackground?: string;
      indicatorBorderColor?: string;
      activeColor?: string;
      inactiveColor?: string;
      position?: 'fixed' | 'absolute' | 'relative' | 'static';
      bottom?: number | string;
      icon?: Snippet<[LiquidGlassTabItem, boolean]>;
    } = $props();

  let internal = $state(defaultActiveKey ?? items[0]?.key ?? '');
  const current = $derived(activeKey ?? internal);
  const activeIndex = $derived(items.findIndex((item) => item.key === current));
  const itemCount = $derived(items.length);
  const indicatorWidth = $derived(
    `calc((100% - ${indicatorPadding * 2}px) / ${itemCount || 1})`,
  );
  const indicatorTranslate = $derived(
    activeIndex >= 0 ? `translateX(${activeIndex * 100}%)` : 'none',
  );
  const isPositioned = $derived(position === 'fixed' || position === 'absolute');
  const bottomCss = $derived(typeof bottom === 'number' ? `${bottom}px` : bottom);

  function select(key: string, disabled?: boolean) {
    if (disabled) return;
    if (activeKey === undefined) internal = key;
    onChange?.(key);
  }

  function itemIconComponent(item: LiquidGlassTabItem): Component | undefined {
    return item.icon as Component | undefined;
  }
</script>

<div
  style:position={position}
  style:left={isPositioned ? '0' : undefined}
  style:right={isPositioned ? '0' : undefined}
  style:bottom={isPositioned ? bottomCss : undefined}
  style:padding={isPositioned ? '0 20px' : undefined}
  style:z-index={isPositioned ? 10 : undefined}
  style:display="flex"
  style:justify-content="center"
  style:pointer-events="none"
>
  <LiquidGlass
    as="nav"
    aria-label="Primary navigation"
    {className}
    width="100%"
    {maxWidth}
    {height}
    {borderRadius}
    {displacementScale}
    {bezelWidth}
    {...optics}
    style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto', ...style }}
  >
    {#if showIndicator && activeIndex >= 0}
      <div
        aria-hidden="true"
        style="
          position: absolute;
          top: {indicatorPadding}px;
          bottom: {indicatorPadding}px;
          left: {indicatorPadding}px;
          width: {indicatorWidth};
          border-radius: 999px;
          background: {indicatorBackground};
          box-shadow: inset 0 0 0 1px {indicatorBorderColor};
          transition: transform 0.42s cubic-bezier(0.2, 0.9, 0.25, 1.15);
          transform: {indicatorTranslate};
          pointer-events: none;
        "
      ></div>
    {/if}

    <div role="tablist" style="display: flex; width: 100%; height: 100%">
      {#each items as item (item.key)}
        {@const isActive = item.key === current}
        {@const Icon = itemIconComponent(item)}
        <button
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={item.ariaLabel ?? item.label ?? item.key}
          disabled={item.disabled}
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: {item.label ? '3px' : '0'};
            background: none;
            border: none;
            color: {isActive ? activeColor : inactiveColor};
            padding: 0;
            cursor: {item.disabled ? 'not-allowed' : 'pointer'};
            -webkit-tap-highlight-color: transparent;
            opacity: {item.disabled ? 0.4 : 1};
            position: relative;
            transition: color 0.28s ease;
            font-family: inherit;
          "
          onclick={() => select(item.key, item.disabled)}
        >
          <span
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              transform: {isActive ? 'translateY(-1px) scale(1.08)' : 'none'};
            "
          >
            {#if icon}
              {@render icon(item, isActive)}
            {:else if Icon}
              <Icon />
            {/if}
          </span>
          {#if item.label != null}
            <span
              style="
                font-size: 10px;
                font-weight: {isActive ? 600 : 500};
                letter-spacing: 0.01em;
                line-height: 1;
              "
            >
              {item.label}
            </span>
          {/if}
          {#if item.badge !== undefined}
            <span
              aria-label={`${item.badge} notifications`}
              style="
                position: absolute;
                top: 14%;
                right: 20%;
                min-width: 16px;
                height: 16px;
                border-radius: 999px;
                background: #ff3b30;
                color: #fff;
                font-size: 9.5px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 4px;
                line-height: 1;
                pointer-events: none;
              "
            >
              {item.badge}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </LiquidGlass>
</div>
