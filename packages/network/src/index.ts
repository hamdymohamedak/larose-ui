import type { NetworkCondition } from '@larose/core';

export interface NetworkState {
  condition: NetworkCondition;
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export interface NetworkMonitorOptions {
  slowThresholdMs?: number;
  pollIntervalMs?: number;
}

type NetworkListener = (state: NetworkState) => void;

interface NavigatorConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  addEventListener?(type: string, listener: () => void): void;
  removeEventListener?(type: string, listener: () => void): void;
}

function getConnection(): NavigatorConnection | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as Navigator & { connection?: NavigatorConnection }).connection;
}

function resolveCondition(
  online: boolean,
  connection?: NavigatorConnection,
  slowThresholdMs = 2000,
): NetworkCondition {
  if (!online) return 'offline';

  const rtt = connection?.rtt;
  const effectiveType = connection?.effectiveType;

  if (rtt !== undefined && rtt >= slowThresholdMs) return 'high-latency';
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g') return 'intermittent';

  return 'online';
}

export class NetworkMonitor {
  private listeners = new Set<NetworkListener>();
  private state: NetworkState;
  private pollTimer?: ReturnType<typeof setInterval>;
  private onOnline = () => this.update();
  private onOffline = () => this.update();
  private onConnectionChange = () => this.update();

  constructor(private options: NetworkMonitorOptions = {}) {
    this.state = this.readState();
    this.attach();
  }

  get current(): NetworkState {
    return this.state;
  }

  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  destroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);
    const connection = getConnection();
    connection?.removeEventListener?.('change', this.onConnectionChange);
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.listeners.clear();
  }

  private readState(): NetworkState {
    const online = typeof navigator === 'undefined' ? true : navigator.onLine;
    const connection = getConnection();
    return {
      online,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      condition: resolveCondition(
        online,
        connection,
        this.options.slowThresholdMs,
      ),
    };
  }

  private update(): void {
    this.state = this.readState();
    this.listeners.forEach((l) => l(this.state));
  }

  private attach(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', this.onOnline);
    window.addEventListener('offline', this.onOffline);
    const connection = getConnection();
    connection?.addEventListener?.('change', this.onConnectionChange);

    const interval = this.options.pollIntervalMs ?? 30000;
    this.pollTimer = setInterval(() => this.update(), interval);
  }
}

export function createNetworkMonitor(
  options?: NetworkMonitorOptions,
): NetworkMonitor {
  return new NetworkMonitor(options);
}

export function isSlowNetwork(condition: NetworkCondition): boolean {
  return (
    condition === 'slow' ||
    condition === 'intermittent' ||
    condition === 'high-latency'
  );
}

export function shouldUseSkeleton(condition: NetworkCondition): boolean {
  return isSlowNetwork(condition);
}
