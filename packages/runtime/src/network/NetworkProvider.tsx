import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createNetworkMonitor,
  type NetworkMonitor,
  type NetworkState,
} from '@larose-ui/network';

const defaultNetworkState: NetworkState = {
  condition: 'fast',
  online: true,
};

const NetworkContext = createContext<NetworkState>(defaultNetworkState);
const NetworkMonitorContext = createContext<NetworkMonitor | null>(null);

export function useNetwork(): NetworkState {
  return useContext(NetworkContext);
}

export function useNetworkMonitor(): NetworkMonitor | null {
  return useContext(NetworkMonitorContext);
}

export interface NetworkProviderProps {
  children: ReactNode;
  monitor?: NetworkMonitor;
}

export function NetworkProvider({ children, monitor }: NetworkProviderProps) {
  const [state, setState] = useState<NetworkState>(defaultNetworkState);

  const networkMonitor = useMemo(
    () => monitor ?? createNetworkMonitor(),
    [monitor],
  );

  useEffect(() => {
    return networkMonitor.subscribe(setState);
  }, [networkMonitor]);

  useEffect(() => {
    if (!monitor) {
      return () => networkMonitor.destroy();
    }
  }, [monitor, networkMonitor]);

  useEffect(() => {
    const onFailure = () => networkMonitor.reportFailure();
    const onSuccess = () => networkMonitor.reportSuccess();
    window.addEventListener('larose:network-failure', onFailure);
    window.addEventListener('larose:network-success', onSuccess);
    return () => {
      window.removeEventListener('larose:network-failure', onFailure);
      window.removeEventListener('larose:network-success', onSuccess);
    };
  }, [networkMonitor]);

  return (
    <NetworkMonitorContext.Provider value={networkMonitor}>
      <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>
    </NetworkMonitorContext.Provider>
  );
}
