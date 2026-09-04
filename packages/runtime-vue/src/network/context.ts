import { inject, provide, type InjectionKey, ref, type Ref } from 'vue';
import {
  createNetworkMonitor,
  type NetworkMonitor,
  type NetworkState,
} from '@larose-ui/network';

const defaultNetworkState: NetworkState = {
  condition: 'fast',
  online: true,
};

export const NETWORK_KEY: InjectionKey<Ref<NetworkState>> = Symbol('larose-network');
export const NETWORK_MONITOR_KEY: InjectionKey<NetworkMonitor | null> = Symbol(
  'larose-network-monitor',
);

export function useNetwork(): NetworkState {
  return (inject(NETWORK_KEY, null) ?? ref(defaultNetworkState)).value;
}

export function useNetworkMonitor(): NetworkMonitor | null {
  return inject(NETWORK_MONITOR_KEY, null);
}

export function provideNetwork(monitor?: NetworkMonitor): {
  state: Ref<NetworkState>;
  mount: () => void;
  unmount: () => void;
} {
  const state = ref<NetworkState>(defaultNetworkState);
  const networkMonitor = monitor ?? createNetworkMonitor();
  let unsubscribe: (() => void) | undefined;
  const owned = !monitor;

  const onFailure = () => networkMonitor.reportFailure();
  const onSuccess = () => networkMonitor.reportSuccess();

  provide(NETWORK_KEY, state);
  provide(NETWORK_MONITOR_KEY, networkMonitor);

  return {
    state,
    mount() {
      unsubscribe = networkMonitor.subscribe((next) => {
        state.value = next;
      });
      if (typeof window !== 'undefined') {
        window.addEventListener('larose:network-failure', onFailure);
        window.addEventListener('larose:network-success', onSuccess);
      }
    },
    unmount() {
      unsubscribe?.();
      if (typeof window !== 'undefined') {
        window.removeEventListener('larose:network-failure', onFailure);
        window.removeEventListener('larose:network-success', onSuccess);
      }
      if (owned) networkMonitor.destroy();
    },
  };
}
