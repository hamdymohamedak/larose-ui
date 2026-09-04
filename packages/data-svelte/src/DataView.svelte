<script lang="ts">
  import { getRetryDelay, isQueryEmpty } from '@larose-ui/data-core';
  import { createQuery, type CreateQueryOptions } from './createQuery';
  import type { Snippet } from 'svelte';

  type Props = CreateQueryOptions<unknown> & {
    url: string;
    children?: Snippet<[unknown, () => Promise<void>]>;
    loading?: Snippet;
    empty?: Snippet;
    unauthorized?: Snippet;
  };

  let { url, children, loading, empty, unauthorized, ...queryOptions }: Props = $props();

  const query = createQuery(() => url, queryOptions);
  let countdown = $state<number | null>(null);

  $effect(() => {
    const snapshot = $query;
    if (snapshot.status !== 'error' || !snapshot.error || snapshot.error.code !== 429 || !snapshot.error.retryable) {
      countdown = null;
      return;
    }
    const delay = Math.ceil(getRetryDelay(snapshot.retryCount, 2000) / 1000);
    countdown = delay;
    const timer = setInterval(() => {
      if (countdown === null || countdown <= 1) {
        clearInterval(timer);
        countdown = null;
        void query.retry();
        return;
      }
      countdown -= 1;
    }, 1000);
    return () => clearInterval(timer);
  });
</script>

{#if $query.status === 'loading' || $query.status === 'idle'}
  {#if loading}
    {@render loading()}
  {:else}
    <div role="status" aria-busy="true" style="padding: var(--lr-space-4)">Loading...</div>
  {/if}
{:else if $query.status === 'unauthorized'}
  {#if unauthorized}
    {@render unauthorized()}
  {:else}
    <div role="alert" style="padding: var(--lr-space-4); color: var(--lr-color-error)">
      You do not have permission to view this data.
    </div>
  {/if}
{:else if $query.status === 'error' && $query.error}
  <div role="alert" data-lr-error={$query.error.code}>
    <p style="color: var(--lr-color-error); margin-bottom: var(--lr-space-2)">{$query.error.message}</p>
    {#if $query.error.retryable && $query.error.code !== 429}
      <button type="button" onclick={() => query.retry()}>Retry</button>
    {/if}
    {#if countdown !== null}
      <p style="font-size: var(--lr-font-size-sm); color: var(--lr-color-text-muted)">
        Retrying in {countdown}s...
      </p>
    {/if}
  </div>
{:else if isQueryEmpty($query.status, $query.data)}
  {#if empty}
    {@render empty()}
  {:else}
    <div role="status" style="padding: var(--lr-space-4); color: var(--lr-color-text-muted)">
      No data found
    </div>
  {/if}
{:else if $query.data !== null && children}
  {@render children($query.data, query.refetch)}
{/if}
