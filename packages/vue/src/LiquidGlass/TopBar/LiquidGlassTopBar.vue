<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTopBarItem } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics & LiquidGlassChromeProps & {
      title?: string; items?: LiquidGlassTopBarItem[]; activeKey?: string; defaultActiveKey?: string;
      variant?: 'floating' | 'edge'; height?: number;
    }
  >(),
  {
    items: () => [], variant: 'floating', height: 56,
    displacementScale: LIQUID_GLASS_PRESETS.topBar.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.topBar.bezelWidth,
    specularAngle: LIQUID_GLASS_PRESETS.topBar.specularAngle,
  },
);
const emit = defineEmits<{ change: [key: string] }>();
const radius = computed(() => (props.variant === 'floating' ? LIQUID_GLASS_PRESETS.topBar.borderRadius : 0));
const internal = ref(props.defaultActiveKey ?? props.items[0]?.key ?? '');
const current = computed(() => props.activeKey ?? internal.value);
function select(key: string, disabled?: boolean) {
  if (disabled) return;
  if (props.activeKey === undefined) internal.value = key;
  emit('change', key);
}
</script>
<template>
  <LiquidGlass as="header" aria-label="Top navigation" :class="className" width="100%" :height="height" :border-radius="radius" :displacement-scale="displacementScale" :bezel-width="bezelWidth" :specular-angle="specularAngle" :style="style">
    <div style="display:flex;align-items:center;gap:10px">
      <slot name="logo" />
      <strong v-if="title">{{ title }}</strong>
    </div>
    <nav v-if="items.length" role="tablist">
      <button v-for="item in items" :key="item.key" type="button" role="tab" :aria-selected="item.key === current" :disabled="item.disabled" @click="select(item.key, item.disabled)">{{ item.label }}</button>
    </nav>
    <slot name="trailing" />
  </LiquidGlass>
</template>
