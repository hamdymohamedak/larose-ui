<script setup lang="ts">
import { computed, ref, type Component, type CSSProperties } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTabItem } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';
import { normalizeGlassStyle } from '../core/normalizeGlassStyle';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        items: LiquidGlassTabItem[];
        activeKey?: string;
        defaultActiveKey?: string;
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
      }
  >(),
  {
    height: 64,
    borderRadius: LIQUID_GLASS_PRESETS.tabBar.borderRadius,
    maxWidth: 420,
    indicatorPadding: 8,
    showIndicator: true,
    indicatorBackground: 'rgba(255, 255, 255, 0.16)',
    indicatorBorderColor: 'rgba(255, 255, 255, 0.28)',
    activeColor: '#ffffff',
    inactiveColor: 'rgba(255, 255, 255, 0.55)',
    position: 'fixed',
    bottom: 22,
    displacementScale: LIQUID_GLASS_PRESETS.tabBar.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.tabBar.bezelWidth,
  },
);

const emit = defineEmits<{ change: [key: string] }>();

const internal = ref(props.defaultActiveKey ?? props.items[0]?.key ?? '');
const current = computed(() => props.activeKey ?? internal.value);
const activeIndex = computed(() => props.items.findIndex((item) => item.key === current.value));
const itemCount = computed(() => props.items.length);
const indicatorWidth = computed(
  () => `calc((100% - ${props.indicatorPadding * 2}px) / ${itemCount.value || 1})`,
);
const indicatorTranslate = computed(() =>
  activeIndex.value >= 0 ? `translateX(${activeIndex.value * 100}%)` : 'none',
);
const isPositioned = computed(
  () => props.position === 'fixed' || props.position === 'absolute',
);
const bottomCss = computed(() =>
  typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom,
);
const resolvedDisplacement = computed(
  () => props.displacementScale ?? LIQUID_GLASS_PRESETS.tabBar.displacementScale,
);
const resolvedBezel = computed(
  () => props.bezelWidth ?? LIQUID_GLASS_PRESETS.tabBar.bezelWidth,
);
const wrapperStyle = computed(() =>
  normalizeGlassStyle({
    position: props.position,
    ...(isPositioned.value
      ? {
          left: 0,
          right: 0,
          bottom: bottomCss.value,
        }
      : undefined),
    display: 'flex',
    justifyContent: 'center',
    padding: isPositioned.value ? '0 20px' : undefined,
    zIndex: isPositioned.value ? 10 : undefined,
    pointerEvents: 'none',
  }),
);

function select(key: string, disabled?: boolean) {
  if (disabled) return;
  if (props.activeKey === undefined) internal.value = key;
  emit('change', key);
}

function itemIcon(item: LiquidGlassTabItem): Component | undefined {
  return item.icon as Component | undefined;
}

const indicatorStyle = computed((): CSSProperties =>
  normalizeGlassStyle({
    position: 'absolute',
    top: props.indicatorPadding,
    bottom: props.indicatorPadding,
    left: props.indicatorPadding,
    width: indicatorWidth.value,
    borderRadius: 999,
    background: props.indicatorBackground,
    boxShadow: `inset 0 0 0 1px ${props.indicatorBorderColor}`,
    transition: 'transform 0.42s cubic-bezier(0.2, 0.9, 0.25, 1.15)',
    transform: indicatorTranslate.value,
    pointerEvents: 'none',
  }),
);

function tabButtonStyle(item: LiquidGlassTabItem): CSSProperties {
  const active = item.key === current.value;
  return normalizeGlassStyle({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: item.label ? 3 : 0,
    background: 'none',
    border: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    color: active ? props.activeColor : props.inactiveColor,
    padding: 0,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    WebkitTapHighlightColor: 'transparent',
    opacity: item.disabled ? 0.4 : 1,
    position: 'relative',
    transition: 'color 0.28s ease',
    fontFamily: 'inherit',
  });
}

function iconWrapStyle(item: LiquidGlassTabItem): CSSProperties {
  const active = item.key === current.value;
  return normalizeGlassStyle({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: active ? 'translateY(-1px) scale(1.08)' : 'none',
  });
}

function labelStyle(item: LiquidGlassTabItem): CSSProperties {
  return normalizeGlassStyle({
    fontSize: 10,
    fontWeight: item.key === current.value ? 600 : 500,
    letterSpacing: '0.01em',
    lineHeight: 1,
  });
}

const badgeStyle = computed((): CSSProperties =>
  normalizeGlassStyle({
    position: 'absolute',
    top: '14%',
    right: '20%',
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    background: '#ff3b30',
    color: '#fff',
    fontSize: 9.5,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    lineHeight: 1,
    pointerEvents: 'none',
  }),
);
</script>

<template>
  <div :style="wrapperStyle">
    <LiquidGlass
      as="nav"
      aria-label="Primary navigation"
      :class="className"
      width="100%"
      :max-width="maxWidth"
      :height="height"
      :border-radius="borderRadius"
      :displacement-scale="resolvedDisplacement"
      :bezel-width="resolvedBezel"
      :blur="blur"
      :saturation="saturation"
      :tint="tint"
      :tint-fallback="tintFallback"
      :refraction-strength="refractionStrength"
      :show-specular="showSpecular"
      :specular-angle="specularAngle"
      :specular-top-opacity="specularTopOpacity"
      :specular-edge-opacity="specularEdgeOpacity"
      :inner-top-highlight="innerTopHighlight"
      :inner-bottom-shadow="innerBottomShadow"
      :shadow-intensity="shadowIntensity"
      :border-color="borderColor"
      :style="{ display: 'flex', alignItems: 'center', pointerEvents: 'auto', ...style }"
    >
      <div
        v-if="showIndicator && activeIndex >= 0"
        aria-hidden="true"
        :style="indicatorStyle"
      />

      <div role="tablist" style="display: flex; width: 100%; height: 100%">
        <button
          v-for="item in items"
          :key="item.key"
          type="button"
          role="tab"
          :aria-selected="item.key === current"
          :aria-label="item.ariaLabel ?? item.label ?? item.key"
          :disabled="item.disabled"
          :style="tabButtonStyle(item)"
          @click="select(item.key, item.disabled)"
        >
          <span :style="iconWrapStyle(item)">
            <slot name="icon" :item="item" :active="item.key === current">
              <component :is="itemIcon(item)" v-if="item.icon" />
            </slot>
          </span>
          <span v-if="item.label != null" :style="labelStyle(item)">
            {{ item.label }}
          </span>
          <span
            v-if="item.badge !== undefined"
            :aria-label="`${item.badge} notifications`"
            :style="badgeStyle"
          >
            {{ item.badge }}
          </span>
        </button>
      </div>
    </LiquidGlass>
  </div>
</template>
