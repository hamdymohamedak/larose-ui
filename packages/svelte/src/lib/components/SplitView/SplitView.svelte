<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SplitCompactMode, SplitOrientation } from '../../SplitView/types';
  import {
    defaultSizesFromPanes,
    redistributeHiddenPane,
    resizeAdjacentSizes,
  } from '../../SplitView/utils';
  import {
    setSplitViewContext,
    type SplitPaneRuntime,
    type SplitViewContextValue,
  } from '../../SplitView/context';
  import styles from '@larose-ui/styles/components/SplitView/SplitView.module.css';

  const STORAGE_PREFIX = 'larose-split-view';

  let {
    orientation = 'horizontal',
    compactMode = 'side-by-side',
    storageKey,
    toolbar,
    onSizesChange,
    class: className,
    style,
    'aria-label': ariaLabel = 'Split view',
    children,
  }: {
    orientation?: SplitOrientation;
    compactMode?: SplitCompactMode;
    storageKey?: string;
    toolbar?: Snippet;
    onSizesChange?: (sizes: number[]) => void;
    class?: string;
    style?: string;
    'aria-label'?: string;
    children?: Snippet;
  } = $props();

  let paneList = $state<SplitPaneRuntime[]>([]);
  let sizes = $state<number[]>([]);
  let visible = $state<boolean[]>([]);
  let containerEl = $state<HTMLDivElement | null>(null);
  let hydrated = $state(false);

  function loadState(paneCount: number, fallbackSizes: number[], fallbackVisible: boolean[]) {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${storageKey}`);
        if (raw) {
          const parsed = JSON.parse(raw) as { sizes?: number[]; visible?: boolean[] };
          if (parsed.sizes?.length === paneCount && parsed.visible?.length === paneCount) {
            return { sizes: parsed.sizes, visible: parsed.visible };
          }
        }
      } catch {
        /* ignore */
      }
    }
    return { sizes: fallbackSizes, visible: fallbackVisible };
  }

  function syncLayout(nextPanes: SplitPaneRuntime[]) {
    const fallbackSizes = defaultSizesFromPanes(nextPanes);
    const fallbackVisible = nextPanes.map((pane) => pane.defaultVisible);
    if (!hydrated) {
      const loaded = loadState(nextPanes.length, fallbackSizes, fallbackVisible);
      sizes = loaded.sizes;
      visible = loaded.visible;
      hydrated = true;
      return;
    }
    if (sizes.length !== nextPanes.length) {
      sizes = fallbackSizes;
      visible = fallbackVisible;
    }
  }

  const ctx: SplitViewContextValue = {
    showPane(id) {
      const index = paneList.findIndex((pane) => pane.id === id);
      if (index < 0) return;
      visible = visible.map((v, i) => (i === index ? true : v));
      paneList[index]?.onVisibleChange?.(true);
    },
    hidePane(id) {
      const index = paneList.findIndex((pane) => pane.id === id);
      if (index < 0 || !paneList[index]?.collapsible) return;
      const nextVisible = visible.map((v, i) => (i === index ? false : v));
      sizes = redistributeHiddenPane(sizes, index, nextVisible);
      visible = nextVisible;
      paneList[index]?.onVisibleChange?.(false);
    },
    get hiddenPanes() {
      return paneList
        .map((pane, index) => ({ id: pane.id, label: pane.label ?? pane.id, index }))
        .filter((pane) => !visible[pane.index] && paneList[pane.index]?.collapsible)
        .map(({ id, label }) => ({ id, label }));
    },
    registerPane(pane) {
      paneList = [...paneList.filter((entry) => entry.id !== pane.id), pane];
      syncLayout(paneList);
      return () => {
        paneList = paneList.filter((entry) => entry.id !== pane.id);
      };
    },
  };

  setSplitViewContext(ctx);

  $effect(() => {
    onSizesChange?.(sizes);
  });

  $effect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    window.localStorage.setItem(`${STORAGE_PREFIX}:${storageKey}`, JSON.stringify({ sizes, visible }));
  });

  function startResize(dividerIndex: number, startCoord: number, initialSizes: number[]) {
    const mins = paneList.map((pane) => pane.minSize);
    const maxes = paneList.map((pane) => pane.maxSize);
    const moveHandler = (event: MouseEvent) => {
      const host = containerEl;
      const total = host
        ? orientation === 'horizontal'
          ? host.getBoundingClientRect().width
          : host.getBoundingClientRect().height
        : 1;
      const deltaPx =
        orientation === 'horizontal' ? event.clientX - startCoord : event.clientY - startCoord;
      const deltaPercent = (deltaPx / Math.max(total, 1)) * 100;
      sizes = resizeAdjacentSizes(initialSizes, dividerIndex, deltaPercent, mins, maxes);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', onUp);
  }

  function paneFlex(index: number, isVisible: boolean) {
    const paneSize = isVisible ? `${sizes[index] ?? 0}%` : '0%';
    if (compactMode === 'stack') return isVisible ? '1 1 auto' : '0 0 auto';
    return `0 0 ${paneSize}`;
  }
</script>

{@render toolbar?.()}
<div style="display:contents">{@render children?.()}</div>
<div
  bind:this={containerEl}
  class={[styles.splitView, className].filter(Boolean).join(' ')}
  {style}
  data-orientation={orientation}
  data-compact={compactMode === 'stack' ? 'stack' : undefined}
  role="group"
  aria-label={ariaLabel}
>
  {#each paneList as config, index (config.id)}
    {@const controlledVisible = config.visible}
    {@const isVisible = controlledVisible !== undefined ? controlledVisible : (visible[index] ?? true)}
    {@const paneSize = isVisible ? `${sizes[index] ?? 0}%` : '0%'}
    {@const showDivider =
      compactMode !== 'stack' &&
      isVisible &&
      index < paneList.length - 1 &&
      paneList.slice(index + 1).some((_, nextIndex) => visible[index + 1 + nextIndex])}
    <section
      class={[styles.pane, config.className].filter(Boolean).join(' ')}
      style={`flex:${paneFlex(index, isVisible)};${orientation === 'horizontal' ? `width:${paneSize}` : `height:${paneSize}`}`}
      data-hidden={isVisible ? undefined : 'true'}
      aria-label={config.ariaLabel ?? config.label ?? config.id}
      hidden={!isVisible}
    >
      <div class={styles.paneBody}>{@render config.content?.()}</div>
    </section>
    {#if showDivider}
      {@const dividerIndex = paneList.slice(0, index + 1).filter((_, i) => {
        const vis = paneList[i]?.visible !== undefined ? paneList[i]!.visible : visible[i];
        return vis && i < paneList.length - 1;
      }).length - 1}
      <div
        class={styles.divider}
        role="separator"
        aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        tabindex={0}
        onmousedown={(event) => {
          event.preventDefault();
          startResize(Math.max(0, dividerIndex), orientation === 'horizontal' ? event.clientX : event.clientY, sizes);
        }}
        onkeydown={(event) => {
          if (
            event.key === 'ArrowRight' ||
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowDown' ||
            event.key === 'ArrowUp'
          ) {
            event.preventDefault();
            const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 2 : -2;
            sizes = resizeAdjacentSizes(
              sizes,
              Math.max(0, dividerIndex),
              delta,
              paneList.map((pane) => pane.minSize),
              paneList.map((pane) => pane.maxSize),
            );
          }
        }}
      ></div>
    {/if}
  {/each}
</div>
