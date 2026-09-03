<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTabItem } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics & LiquidGlassChromeProps & {
      items: LiquidGlassTabItem[]; activeKey?: string; defaultActiveKey?: string;
      height?: number; borderRadius?: number; maxWidth?: number;
    }
  >(),
  { height: 64, borderRadius: LIQUID_GLASS_PRESETS.tabBar.borderRadius, maxWidth: 420 },
);
const emit = defineEmits<{ change: [key: string] }>();
const internal = ref(props.defaultActiveKey ?? props.items[0]?.key ?? '');
const current = computed(() => props.activeKey ?? internal.value);
function select(key: string, disabled?: boolean) {
  if (disabled) return;
  if (props.activeKey === undefined) internal.value = key;
  emit('change', key);
}
</script>
<template>
  <div style="display: flex; justify-content: center">
    <LiquidGlass as="nav" aria-label="Primary navigation" :class="className" width="100%" :max-width="maxWidth" :height="height" :border-radius="borderRadius" :displacement-scale="displacementScale ?? LIQUID_GLASS_PRESETS.tabBar.displacementScale" :bezel-width="bezelWidth ?? LIQUID_GLASS_PRESETS.tabBar.bezelWidth" :style="style">
      <div role="tablist" style="display: flex; width: 100%; height: 100%">
        <button v-for="item in items" :key="item.key" type="button" role="tab" :aria-selected="item.key === current" :disabled="item.disabled" :style="{ flex: 1, background: 'none', border: 'none', color: item.key === current ? '#fff' : 'rgba(255,255,255,0.55)' }" @click="select(item.key, item.disabled)">
          <slot name="icon" :item="item" :active="item.key === current" />
          <span v-if="item.label">{{ item.label }}</span>
        </button>
      </div>
    </LiquidGlass>
  </div>
</template>
