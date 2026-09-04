<script setup lang="ts">
import { computed, ref, useSlots, type Component, type CSSProperties, type VNode } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTopBarItem } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';
import { normalizeGlassStyle } from '../core/normalizeGlassStyle';

export type VueLiquidGlassTopBarItem = LiquidGlassTopBarItem & {
  icon?: Component | VNode;
};

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        title?: string;
        items?: VueLiquidGlassTopBarItem[];
        activeKey?: string;
        defaultActiveKey?: string;
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
      }
  >(),
  {
    items: () => [],
    variant: 'floating',
    height: 56,
    paddingX: 16,
    activeColor: '#ffffff',
    inactiveColor: 'rgba(255, 255, 255, 0.62)',
    titleColor: '#ffffff',
    navTrackBackground: 'rgba(255, 255, 255, 0.08)',
    navActiveBackground: 'rgba(255, 255, 255, 0.18)',
    position: 'fixed',
    displacementScale: LIQUID_GLASS_PRESETS.topBar.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.topBar.bezelWidth,
    specularAngle: LIQUID_GLASS_PRESETS.topBar.specularAngle,
    innerBottomShadow: 0.12,
  },
);

const emit = defineEmits<{ change: [key: string] }>();
const slots = useSlots();

const isFloating = computed(() => props.variant === 'floating');
const insetX = computed(() => props.insetX ?? (isFloating.value ? 16 : 0));
const top = computed(() => props.top ?? (isFloating.value ? 14 : 0));
const radius = computed(
  () =>
    props.borderRadius ??
    (isFloating.value ? LIQUID_GLASS_PRESETS.topBar.borderRadius : 0),
);
const internal = ref(props.defaultActiveKey ?? props.items[0]?.key ?? '');
const current = computed(() => props.activeKey ?? internal.value);
const isPositioned = computed(
  () =>
    props.position === 'fixed' ||
    props.position === 'absolute' ||
    props.position === 'sticky',
);

const wrapperStyle = computed((): CSSProperties =>
  normalizeGlassStyle({
    position: props.position,
    ...(isPositioned.value
      ? {
          top: typeof top.value === 'number' ? `${top.value}px` : top.value,
          left: insetX.value,
          right: insetX.value,
          zIndex: 20,
        }
      : undefined),
    pointerEvents: 'none',
  }),
);

function select(key: string, disabled?: boolean) {
  if (disabled) return;
  if (props.activeKey === undefined) internal.value = key;
  emit('change', key);
}

function itemIcon(item: VueLiquidGlassTopBarItem): Component | VNode | undefined {
  return item.icon;
}
</script>

<template>
  <div :style="wrapperStyle">
    <LiquidGlass
      as="header"
      aria-label="Top navigation"
      :class="className"
      width="100%"
      :height="height"
      :border-radius="radius"
      :displacement-scale="displacementScale"
      :bezel-width="bezelWidth"
      :specular-angle="specularAngle"
      :blur="blur"
      :saturation="saturation"
      :tint="tint"
      :tint-fallback="tintFallback"
      :refraction-strength="refractionStrength"
      :show-specular="showSpecular"
      :specular-top-opacity="specularTopOpacity"
      :specular-edge-opacity="specularEdgeOpacity"
      :inner-top-highlight="innerTopHighlight"
      :inner-bottom-shadow="innerBottomShadow"
      :shadow-intensity="shadowIntensity"
      :border-color="borderColor"
      :style="{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: `0 ${paddingX}px`,
        pointerEvents: 'auto',
        ...style,
      }"
    >
      <div style="display:flex;align-items:center;gap:10px;min-width:0;justify-self:start">
        <span v-if="slots.logo" style="display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <slot name="logo" />
        </span>
        <span
          v-if="title"
          :style="{
            color: titleColor,
            fontWeight: 700,
            fontSize: '1.0625rem',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }"
        >
          {{ title }}
        </span>
      </div>

      <nav
        v-if="items.length"
        role="tablist"
        aria-label="Sections"
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifySelf: 'center',
          gap: '2px',
          padding: '3px',
          borderRadius: 999,
          background: navTrackBackground,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
        }"
      >
        <button
          v-for="item in items"
          :key="item.key"
          type="button"
          role="tab"
          :aria-selected="item.key === current"
          :aria-label="item.ariaLabel ?? item.label"
          :disabled="item.disabled"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            height: '32px',
            padding: '0 16px',
            borderRadius: 999,
            border: 'none',
            background: item.key === current ? navActiveBackground : 'transparent',
            boxShadow:
              item.key === current
                ? 'inset 0 0 0 1px rgba(255,255,255,0.22), 0 1px 4px rgba(0,0,0,0.12)'
                : 'none',
            color: item.key === current ? activeColor : inactiveColor,
            fontSize: '0.8125rem',
            fontWeight: item.key === current ? 600 : 500,
            letterSpacing: '-0.01em',
            lineHeight: 1,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            opacity: item.disabled ? 0.4 : 1,
            fontFamily: 'inherit',
            transition:
              'background 0.22s cubic-bezier(0.2, 0.9, 0.25, 1.1), color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease',
            transform: item.key === current ? 'scale(1)' : 'scale(0.98)',
            WebkitTapHighlightColor: 'transparent',
          }"
          @click="select(item.key, item.disabled)"
        >
          <component :is="itemIcon(item)" v-if="item.icon" />
          {{ item.label }}
        </button>
      </nav>

      <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;justify-self:end">
        <slot name="trailing" />
      </div>
    </LiquidGlass>
  </div>
</template>
