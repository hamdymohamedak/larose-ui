<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import LiquidGlassCheckbox from '../../../packages/vue/src/LiquidGlass/Checkbox/LiquidGlassCheckbox.vue';
import LiquidGlassProgress from '../../../packages/vue/src/LiquidGlass/Progress/LiquidGlassProgress.vue';
import LiquidGlassRange from '../../../packages/vue/src/LiquidGlass/Range/LiquidGlassRange.vue';
import LiquidGlassSwitch from '../../../packages/vue/src/LiquidGlass/Switch/LiquidGlassSwitch.vue';

const on = ref(true);
const checked = ref(false);
const volume = ref(68);
const progress = ref(45);

let timer: number | undefined;
onMounted(() => {
  timer = window.setInterval(() => {
    progress.value = progress.value >= 100 ? 0 : progress.value + 2;
  }, 120);
});
onUnmounted(() => {
  if (timer != null) window.clearInterval(timer);
});
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      box-sizing: border-box;
      background:
        radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 45%),
        radial-gradient(circle at 80% 30%, #a855f7 0%, transparent 40%),
        linear-gradient(160deg, #0f172a, #1e293b 55%, #334155);
    "
  >
    <div
      style="
        width: min(420px, 92vw);
        display: flex;
        flex-direction: column;
        gap: 28px;
        pointer-events: auto;
      "
    >
      <div style="display: flex; align-items: center; justify-content: space-between">
        <span style="color: #fff; font-size: 14px">Notifications</span>
        <LiquidGlassSwitch
          :checked="on"
          aria-label="Notifications"
          @change="on = $event"
        />
      </div>

      <LiquidGlassCheckbox
        label="Remember my settings"
        :checked="checked"
        @change="checked = $event"
      />

      <div>
        <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin-bottom: 8px">
          Volume — {{ volume }}
        </div>
        <LiquidGlassRange :value="volume" aria-label="Volume" @change="volume = $event" />
      </div>

      <div>
        <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin-bottom: 8px">
          Download progress
        </div>
        <LiquidGlassProgress :value="progress" aria-label="Download progress" />
      </div>
    </div>
  </div>
</template>
