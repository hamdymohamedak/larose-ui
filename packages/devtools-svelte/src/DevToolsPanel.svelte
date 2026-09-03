<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { getComponentPerformance } from '@larose-ui/devtools-core';
  import {
    getOptionalRuntime,
    getBreakpoint,
    getEnvironment,
    getI18n,
  } from '@larose-ui/runtime-svelte';
  import { getPermissionsContext } from '@larose-ui/permissions-svelte';
  import { getOptionalObservabilityContext } from '@larose-ui/observability-svelte';
  import { get } from 'svelte/store';

  interface Props {
    defaultOpen?: boolean;
  }

  let { defaultOpen = false }: Props = $props();

  let open = $state(defaultOpen);
  let tab = $state<'context' | 'inspector'>('context');
  let inspectMode = $state(false);
  let selected = $state<{ name: string; el: Element } | null>(null);

  const runtime = getOptionalRuntime();
  const environment = getEnvironment();
  const breakpoint = getBreakpoint();
  const { locale, dir } = getI18n();
  let permissions = $state<string[]>([]);
  try {
    permissions = get(getPermissionsContext()).permissions;
  } catch {
    permissions = [];
  }
  const observability = getOptionalObservabilityContext();

  const performanceSummary = $derived(
    selected && observability
      ? getComponentPerformance(
          observability.collector.getEvents({ component: selected.name }),
        )
      : null,
  );

  function pickTarget(el: Element | null) {
    if (!el) return null;
    return el.closest('[data-lr-component]') ?? el.closest('[data-lr-audited-field]');
  }

  function onMove(e: MouseEvent) {
    if (!inspectMode) return;
    pickTarget(e.target as Element);
  }

  function onClick(e: MouseEvent) {
    if (!inspectMode) return;
    e.preventDefault();
    e.stopPropagation();
    const node = pickTarget(e.target as Element);
    if (node) {
      selected = {
        name:
          node.getAttribute('data-lr-component') ??
          node.getAttribute('data-lr-audited-field') ??
          'unknown',
        el: node,
      };
    }
  }

  onMount(() => {
    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('click', onClick, true);
  });
  onDestroy(() => {
    window.removeEventListener('mousemove', onMove, true);
    window.removeEventListener('click', onClick, true);
  });

  const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
</script>

{#if !isProd}
  <button
    type="button"
    aria-label="Toggle laRose DevTools"
    style="position: fixed; bottom: 12px; right: 12px; z-index: 99999; border-radius: 999px; padding: 8px 12px; background: #111; color: #fff; border: none; cursor: pointer"
    onclick={() => (open = !open)}
  >
    laRose
  </button>
  {#if open}
    <aside
      data-lr-devtools
      style="position: fixed; bottom: 56px; right: 12px; width: 320px; max-height: 70vh; overflow: auto; z-index: 99999; background: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 12px; font-size: 12px"
    >
      <div style="display: flex; gap: 4px; margin-bottom: 8px">
        <button
          type="button"
          onclick={() => {
            tab = 'context';
            inspectMode = false;
          }}>Context</button
        >
        <button
          type="button"
          onclick={() => {
            tab = 'inspector';
            inspectMode = true;
          }}>Inspector</button
        >
      </div>
      {#if tab === 'context'}
        <p>env: {environment}</p>
        <p>locale: {locale} ({dir})</p>
        <p>breakpoint: {breakpoint.breakpoint} @ {breakpoint.width}px</p>
        <p>permissions: {permissions.join(', ') || '(none)'}</p>
        <p>runtime: {runtime ? 'connected' : 'none'}</p>
      {:else}
        <p>{inspectMode ? 'Click a data-lr-* node' : 'Enable inspector'}</p>
        {#if selected}
          <p>Selected: {selected.name}</p>
        {/if}
        {#if performanceSummary}
          <pre>{JSON.stringify(performanceSummary, null, 2)}</pre>
        {/if}
      {/if}
    </aside>
  {/if}
{/if}
