<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { SessionState } from '@larose-ui/core';
  import type { NetworkState } from '@larose-ui/network';
  import { shouldSyncOfflineQueue } from '@larose-ui/runtime-core';
  import { NETWORK_CONTEXT } from '../network/context';
  import { OFFLINE_CONTEXT, type OfflineContextValue } from '../offline/context';

  interface Props {
    session?: SessionState;
    children?: Snippet;
  }

  let { session, children }: Props = $props();

  const networkStore = getContext<Readable<NetworkState>>(NETWORK_CONTEXT);
  const offlineStore = getContext<Readable<OfflineContextValue>>(OFFLINE_CONTEXT);

  let online = $state(true);
  let queueLength = $state(0);
  let sync = $state<OfflineContextValue['sync'] | null>(null);

  $effect(() => {
    const unsubNetwork = networkStore.subscribe((state) => {
      online = state.online;
    });
    const unsubOffline = offlineStore.subscribe((state) => {
      queueLength = state.queue.length;
      sync = state.sync;
    });
    return () => {
      unsubNetwork();
      unsubOffline();
    };
  });

  $effect(() => {
    if (!shouldSyncOfflineQueue(session)) return;
    if (!online || queueLength === 0 || !sync) return;
    void sync(async (request) => {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    });
  });
</script>

{@render children?.()}
