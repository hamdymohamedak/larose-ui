<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  const KEYFRAME_ID = 'glass-scroll-scene-keyframes';

  const CARD_DATA = [
    {
      title: 'Convex squircle bezel',
      body: 'Soft flat-to-curve transition — no harsh interior edge. The squircle Apple favors.',
      accent: 'rgba(139,107,255,0.35)',
      accentEnd: 'rgba(139,107,255,0.05)',
      tall: true,
    },
    {
      title: '127 samples per radius',
      body: 'Displacement vectors are pre-computed and rotated around the bar.',
      accent: 'rgba(63,224,208,0.30)',
      accentEnd: 'rgba(63,224,208,0.04)',
      tall: false,
    },
    {
      title: 'R/G channel encoding',
      body: 'X and Y displacement stored in Red and Green channels, neutral at 128.',
      accent: 'rgba(255,95,162,0.32)',
      accentEnd: 'rgba(255,95,162,0.04)',
      tall: false,
    },
    {
      title: 'Scroll behind the bar',
      body: 'Watch the aurora bend through the glass bezel as you scroll this content.',
      accent: 'rgba(255,255,255,0.06)',
      accentEnd: 'rgba(255,255,255,0.02)',
      tall: false,
    },
    {
      title: 'Snell – Descartes law',
      body: 'n₁ sin θ₁ = n₂ sin θ₂ — the refraction angle depends on the surface normal.',
      accent: 'rgba(139,107,255,0.22)',
      accentEnd: 'rgba(63,224,208,0.06)',
      tall: false,
    },
    {
      title: 'Chromium-only refraction',
      body: 'SVG filters as backdrop-filter only work in Chromium. All other engines fall back to frosted blur.',
      accent: 'rgba(255,95,162,0.20)',
      accentEnd: 'rgba(255,95,162,0.03)',
      tall: false,
    },
  ] as const;

  let {
    contentPaddingBottom = 140,
    children,
  }: {
    contentPaddingBottom?: number;
    children?: Snippet;
  } = $props();

  onMount(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(KEYFRAME_ID)) return;
    const style = document.createElement('style');
    style.id = KEYFRAME_ID;
    style.textContent = `
      @keyframes glass-aurora-drift {
        0%   { background-position: 0% 0%, 0% 0%, 0% 0%; }
        100% { background-position: 6% -4%, -5% 5%, 3% -3%; }
      }
      @media (prefers-reduced-motion: reduce) {
        .glass-aurora-layer { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  });
</script>

<div
  style="
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #100b22;
    color: #f3f1fa;
    font-family: -apple-system, 'SF Pro Text', ui-rounded, 'Segoe UI', system-ui, sans-serif;
  "
>
  <div
    aria-hidden="true"
    class="glass-aurora-layer"
    style="
      position: absolute;
      inset: 0;
      background:
        radial-gradient(60% 45% at 15% 10%, #8b6bff 0%, transparent 65%),
        radial-gradient(55% 40% at 85% 15%, #3fe0d0 0%, transparent 60%),
        radial-gradient(65% 55% at 50% 100%, #ff5fa2 0%, transparent 65%),
        #100b22;
      filter: saturate(1.15);
      animation: glass-aurora-drift 26s ease-in-out infinite alternate;
      pointer-events: none;
    "
  ></div>

  <div
    style="
      position: relative;
      z-index: 1;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    "
  >
    <div
      style="
        max-width: 480px;
        margin: 0 auto;
        padding: 56px 22px {contentPaddingBottom}px;
      "
    >
      <header style="margin-bottom: 34px">
        <h1
          style="
            font-size: 30px;
            line-height: 1.15;
            letter-spacing: -0.01em;
            margin: 0 0 10px;
            font-weight: 650;
          "
        >
          Liquid Glass
        </h1>
        <p
          style="
            margin: 0;
            color: #b9b3d6;
            font-size: 15px;
            line-height: 1.55;
            max-width: 34ch;
          "
        >
          A convex-squircle bezel, a precomputed displacement field, and an SVG filter doing the
          actual refraction of everything behind it.
        </p>
      </header>

      <div style="display: grid; gap: 14px">
        {#each CARD_DATA as card, i (i)}
          <div
            style="
              border-radius: 22px;
              padding: 20px 20px 18px;
              border: 1px solid rgba(255,255,255,0.10);
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              min-height: {card.tall ? 200 : 96}px;
              background: linear-gradient(155deg, {card.accent}, {card.accentEnd});
            "
          >
            <h3
              style="
                margin: 0 0 4px;
                font-size: 16px;
                font-weight: 600;
                color: #f3f1fa;
                letter-spacing: -0.01em;
              "
            >
              {card.title}
            </h3>
            <span style="font-size: 13px; color: #b9b3d6; line-height: 1.5">{card.body}</span>
          </div>
        {/each}
      </div>

      {#if children}
        <div style="margin-top: 24px">
          {@render children()}
        </div>
      {/if}
    </div>
  </div>
</div>
