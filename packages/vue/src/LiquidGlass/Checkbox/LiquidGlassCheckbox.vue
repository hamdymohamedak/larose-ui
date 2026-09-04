<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        checked?: boolean;
        defaultChecked?: boolean;
        disabled?: boolean;
        size?: number;
        borderRadius?: number;
        checkColor?: string;
        checkedTint?: string;
        label?: string;
        labelColor?: string;
        ariaLabel?: string;
      }
  >(),
  {
    // undefined — not false — so omitted `checked` stays uncontrolled (Vue Boolean cast).
    checked: undefined,
    defaultChecked: false,
    disabled: false,
    size: 26,
    borderRadius: LIQUID_GLASS_PRESETS.checkbox.borderRadius,
    checkColor: '#ffffff',
    checkedTint: 'rgba(52, 199, 89, 0.42)',
    labelColor: '#ffffff',
    displacementScale: LIQUID_GLASS_PRESETS.checkbox.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.checkbox.bezelWidth,
    shadowIntensity: LIQUID_GLASS_PRESETS.checkbox.shadowIntensity,
  },
);

const emit = defineEmits<{ change: [checked: boolean] }>();
const internal = ref(props.defaultChecked);
const isControlled = computed(() => props.checked !== undefined);
const isOn = computed(() => (isControlled.value ? !!props.checked : internal.value));

function toggle() {
  if (props.disabled) return;
  const next = !isOn.value;
  if (!isControlled.value) internal.value = next;
  emit('change', next);
}
</script>

<template>
  <label
    :class="className"
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      fontFamily: 'inherit',
      color: labelColor,
      fontSize: '0.9375rem',
      ...style,
    }"
  >
    <button
      type="button"
      role="checkbox"
      :aria-checked="isOn"
      :aria-label="ariaLabel"
      :disabled="disabled"
      :style="{
        padding: 0,
        border: 'none',
        background: 'none',
        lineHeight: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }"
      @click="toggle"
    >
      <LiquidGlass
        as="span"
        :width="size"
        :height="size"
        :border-radius="borderRadius"
        :displacement-scale="displacementScale"
        :bezel-width="bezelWidth"
        :shadow-intensity="shadowIntensity"
        :blur="blur"
        :saturation="saturation"
        :refraction-strength="refractionStrength"
        :show-specular="showSpecular"
        :specular-angle="specularAngle"
        :specular-top-opacity="specularTopOpacity"
        :specular-edge-opacity="specularEdgeOpacity"
        :inner-top-highlight="innerTopHighlight"
        :inner-bottom-shadow="innerBottomShadow"
        :border-color="borderColor"
        :tint="isOn ? checkedTint : tint"
        :tint-fallback="tintFallback"
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.45, 0.64, 1)',
          transform: isOn ? 'scale(1.04)' : 'scale(1)',
        }"
      >
        <span
          :style="{
            opacity: isOn ? 1 : 0,
            transform: isOn ? 'scale(1)' : 'scale(0.6)',
            transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.45, 0.64, 1)',
          }"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style="display: block"
          >
            <path
              d="M2.5 7.2 5.8 10.5 11.5 3.8"
              :stroke="checkColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </LiquidGlass>
    </button>
    <span v-if="label != null">{{ label }}</span>
  </label>
</template>
