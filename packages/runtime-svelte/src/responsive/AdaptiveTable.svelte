<script lang="ts" generics="T">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { shouldUseSkeleton } from '@larose-ui/network';
  import {
    buildResponsiveSnapshot,
    defaultBreakpoints,
    type ResponsiveSnapshot,
  } from '@larose-ui/runtime-core';
  import { RESPONSIVE_CONTEXT } from './context';
  import { getI18n } from '../i18n/context';
  import { getNetwork } from '../network/context';
  import type { AdaptiveTableProps } from './types';

  let {
    data,
    columns,
    keyExtractor,
    loading = false,
    emptyMessage,
    networkCondition,
  }: AdaptiveTableProps<T> = $props();

  const responsiveStore = getContext<Readable<ResponsiveSnapshot> | undefined>(RESPONSIVE_CONTEXT);
  let breakpoint = $state<ResponsiveSnapshot>(
    buildResponsiveSnapshot(1024, defaultBreakpoints, false),
  );

  $effect(() => {
    if (!responsiveStore) return;
    return responsiveStore.subscribe((v) => {
      breakpoint = v;
    });
  });

  const { t } = getI18n();
  const network = getNetwork();
  const showSkeleton = $derived(
    loading || shouldUseSkeleton(networkCondition ?? network.condition),
  );
  const isMobile = $derived(breakpoint.isMobile || breakpoint.breakpoint === 'mobile');
  const visibleColumns = $derived(
    isMobile ? columns.filter((c) => c.priority !== 'low') : columns,
  );
</script>

{#if showSkeleton}
  <div data-lr-adaptive-table="skeleton" aria-busy="true">
    {#each [1, 2, 3] as i (i)}
      <div
        style="height: 48px; background: var(--lr-color-surface); border-radius: var(--lr-radius-md); margin-bottom: var(--lr-space-2)"
      ></div>
    {/each}
  </div>
{:else if data.length === 0}
  <div data-lr-adaptive-table="empty" role="status">
    {emptyMessage ?? t('common.empty')}
  </div>
{:else if isMobile}
  <div data-lr-adaptive-table="cards">
    {#each data as row (keyExtractor(row))}
      <article
        style="padding: var(--lr-space-4); border: 1px solid var(--lr-color-border); border-radius: var(--lr-radius-md); margin-bottom: var(--lr-space-3); background: var(--lr-color-surface-elevated)"
      >
        {#each visibleColumns as col (col.key)}
          <div
            style="display: flex; justify-content: space-between; margin-bottom: var(--lr-space-2)"
          >
            <span style="color: var(--lr-color-text-muted); font-size: var(--lr-font-size-sm)"
              >{col.header}</span
            >
            <span>{col.render(row)}</span>
          </div>
        {/each}
      </article>
    {/each}
  </div>
{:else}
  <table data-lr-adaptive-table="table" style="width: 100%; border-collapse: collapse">
    <thead>
      <tr>
        {#each columns as col (col.key)}
          <th
            style="text-align: start; padding: var(--lr-space-3); border-bottom: 2px solid var(--lr-color-border); font-weight: var(--lr-font-weight-semibold)"
          >
            {col.header}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row (keyExtractor(row))}
        <tr>
          {#each columns as col (col.key)}
            <td style="padding: var(--lr-space-3); border-bottom: 1px solid var(--lr-color-border)">
              {col.render(row)}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
