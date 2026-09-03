import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { buildLiquidGlassDisplacementMap } from '../engine/displacement-map';
import { supportsLiquidGlassRefraction } from '../engine/detect';
import { resolveLiquidGlassOptics } from '../engine/defaults';
import type { LiquidGlassOptics } from '../engine/types';

export interface UseLiquidGlassOptions extends LiquidGlassOptics {
  borderRadius?: number;
  onDisplacementMapChange?: (dataUrl: string) => void;
}

export function useLiquidGlass(options: Ref<UseLiquidGlassOptions> | (() => UseLiquidGlassOptions)) {
  const read = () => (typeof options === 'function' ? options() : options.value);
  const filterId = `lgf-${Math.random().toString(36).slice(2, 10)}`;
  const shellRef = ref<HTMLElement | null>(null);
  const mapDataUrl = ref('');
  const supportsRefraction = supportsLiquidGlassRefraction();
  const optics = computed(() => resolveLiquidGlassOptics(read()));

  function rebuildMap() {
    const el = shellRef.value;
    const { borderRadius = 30, onDisplacementMapChange } = read();
    if (!el) return;
    const w = Math.max(2, Math.round(el.offsetWidth));
    const h = Math.max(2, Math.round(el.offsetHeight));
    const resolved = optics.value;
    const url = buildLiquidGlassDisplacementMap({
      width: w,
      height: h,
      borderRadius: Math.min(borderRadius, w / 2, h / 2),
      bezelWidth: resolved.bezelWidth,
      refractionStrength: resolved.refractionStrength,
    });
    mapDataUrl.value = url;
    onDisplacementMapChange?.(url);
  }

  let observer: ResizeObserver | undefined;
  onMounted(() => {
    if (!supportsRefraction) return;
    rebuildMap();
    const el = shellRef.value;
    if (!el || typeof ResizeObserver === 'undefined') return;
    observer = new ResizeObserver(rebuildMap);
    observer.observe(el);
  });
  onBeforeUnmount(() => observer?.disconnect());
  watch(() => [read().borderRadius, read().bezelWidth, read().refractionStrength], () => {
    if (supportsRefraction) rebuildMap();
  });

  const backdropFilter = computed(() =>
    supportsRefraction
      ? `url(#${filterId}) saturate(${optics.value.saturation})`
      : `blur(${optics.value.blur}px) saturate(${optics.value.saturation})`,
  );
  const shellStyle = computed(() => {
    const resolved = optics.value;
    return {
      background: supportsRefraction ? resolved.tint : resolved.tintFallback,
      backdropFilter: backdropFilter.value,
      WebkitBackdropFilter: backdropFilter.value,
      boxShadow: [
        resolved.shadowIntensity > 0
          ? `0 18px 40px -12px rgba(0, 0, 0, ${(0.55 * resolved.shadowIntensity).toFixed(2)})`
          : null,
        `inset 0 0 0 1px ${resolved.borderColor}`,
      ].filter(Boolean).join(', '),
      overflow: 'hidden' as const,
    };
  });

  return { shellRef, filterId, mapDataUrl, supportsRefraction, optics, backdropFilter, shellStyle };
}
