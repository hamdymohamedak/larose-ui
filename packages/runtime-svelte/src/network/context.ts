import { getContext, setContext } from 'svelte';
import { writable, type Readable } from 'svelte/store';
import {
  createNetworkMonitor,
  type NetworkMonitor,
  type NetworkState,
} from '@larose-ui/network';

const defaultNetworkState: NetworkState = {
  condition: 'fast',
  online: true,
};

export const NETWORK_CONTEXT = 'larose-network';
export const NETWORK_MONITOR_CONTEXT = 'larose-network-monitor';

export function createNetworkStore(monitor?: NetworkMonitor): {
  state: Readable<NetworkState>;
  monitor: NetworkMonitor;
  mount: () => void;
  destroy: () => void;
} {
  const networkMonitor = monitor ?? createNetworkMonitor();
  const owned = !monitor;
  const state = writable<NetworkState>(defaultNetworkState);
  let unsubscribe: (() => void) | undefined;

  const onFailure = () => networkMonitor.reportFailure();
  const onSuccess = () => networkMonitor.reportSuccess();

  return {
    state: { subscribe: state.subscribe },
    monitor: networkMonitor,
    mount() {
      unsubscribe = networkMonitor.subscribe((next) => state.set(next));
      if (typeof window !== 'undefined') {
        window.addEventListener('larose:network-failure', onFailure);
        window.addEventListener('larose:network-success', onSuccess);
      }
    },
    destroy() {
      unsubscribe?.();
      if (typeof window !== 'undefined') {
        window.removeEventListener('larose:network-failure', onFailure);
        window.removeEventListener('larose:network-success', onSuccess);
      }
      if (owned) networkMonitor.destroy();
    },
  };
}

export function setNetworkContext(
  state: Readable<NetworkState>,
  monitor: NetworkMonitor,
): void {
  setContext(NETWORK_CONTEXT, state);
  setContext(NETWORK_MONITOR_CONTEXT, monitor);
}

export function getNetwork(): NetworkState {
  try {
    const store = getContext<Readable<NetworkState> | undefined>(NETWORK_CONTEXT);
    if (!store) return defaultNetworkState;
    let value = defaultNetworkState;
    const unsub = store.subscribe((v) => {
      value = v;
    });
    unsub();
    return value;
  } catch {
    return defaultNetworkState;
  }
}
