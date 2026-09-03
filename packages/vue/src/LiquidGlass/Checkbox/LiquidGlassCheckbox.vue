<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics & LiquidGlassChromeProps & {
      checked?: boolean; defaultChecked?: boolean; disabled?: boolean; size?: number;
      borderRadius?: number; checkColor?: string; checkedTint?: string; label?: string;
      labelColor?: string; ariaLabel?: string;
    }
  >(),
  {
    defaultChecked: false, size: 26,
    borderRadius: LIQUID_GLASS_PRESETS.checkbox.borderRadius,
    checkColor: '#ffffff', checkedTint: 'rgba(52, 199, 89, 0.42)', labelColor: '#ffffff',
    displacementScale: LIQUID_GLASS_PRESETS.checkbox.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.checkbox.bezelWidth,
    shadowIntensity: LIQUID_GLASS_PRESETS.checkbox.shadowIntensity,
  },
);
const emit = defineEmits<{ change: [checked: boolean] }>();
const internal = ref(props.defaultChecked);
const isOn = computed(() => props.checked ?? internal.value);
function toggle() {
  if (props.disabled) return;
  const next = !isOn.value;
  if (props.checked === undefined) internal.value = next;
  emit('change', next);
}
</script>
<template>
  <label :class="className" :style="{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, color: labelColor, ...style }">
    <button type="button" role="checkbox" :aria-checked="isOn" :aria-label="ariaLabel" :disabled="disabled" style="padding:0;border:none;background:none" @click="toggle">
      <LiquidGlass as="span" :width="size" :height="size" :border-radius="borderRadius" :displacement-scale="displacementScale" :bezel-width="bezelWidth" :shadow-intensity="shadowIntensity" :tint="isOn ? checkedTint : tint" :tint-fallback="tintFallback">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" :style="{ opacity: isOn ? 1 : 0 }">
          <path d="M2.5 7.2 5.8 10.5 11.5 3.8" :stroke="checkColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </LiquidGlass>
    </button>
    <span v-if="label != null">{{ label }}</span>
  </label>
</template>
