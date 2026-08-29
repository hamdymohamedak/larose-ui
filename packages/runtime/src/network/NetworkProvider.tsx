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
} from '@larose/network';

const defaultNetworkState: NetworkState = {
  condition: 'online',
  online: true,
};

const NetworkContext = createContext<NetworkState>(defaultNetworkState);

export function useNetwork(): NetworkState {
  return useContext(NetworkContext);
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

  return (
    <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>
  );
}
