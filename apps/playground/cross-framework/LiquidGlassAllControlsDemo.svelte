<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import LiquidGlassCheckbox from '../../../packages/svelte/src/lib/LiquidGlass/Checkbox/LiquidGlassCheckbox.svelte';
  import LiquidGlassProgress from '../../../packages/svelte/src/lib/LiquidGlass/Progress/LiquidGlassProgress.svelte';
  import LiquidGlassRange from '../../../packages/svelte/src/lib/LiquidGlass/Range/LiquidGlassRange.svelte';
  import LiquidGlassSwitch from '../../../packages/svelte/src/lib/LiquidGlass/Switch/LiquidGlassSwitch.svelte';

  let on = $state(true);
  let checked = $state(false);
  let volume = $state(68);
  let progress = $state(45);

  let timer: number | undefined;
  onMount(() => {
    timer = window.setInterval(() => {
      progress = progress >= 100 ? 0 : progress + 2;
    }, 120);
  });
  onDestroy(() => {
    if (timer != null) window.clearInterval(timer);
  });
</script>

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
        checked={on}
        ariaLabel="Notifications"
        onChange={(value) => (on = value)}
      />
    </div>

    <LiquidGlassCheckbox
      label="Remember my settings"
      checked={checked}
      onChange={(value) => (checked = value)}
    />

    <div>
      <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin-bottom: 8px">
        Volume — {volume}
      </div>
      <LiquidGlassRange
        value={volume}
        ariaLabel="Volume"
        onChange={(value) => (volume = value)}
      />
    </div>

    <div>
      <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin-bottom: 8px">
        Download progress
      </div>
      <LiquidGlassProgress value={progress} ariaLabel="Download progress" />
    </div>
  </div>
</div>
