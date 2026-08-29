import type { NetworkCondition } from '@larose-ui/core';

export interface NetworkState {
  condition: NetworkCondition;
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  /** Consecutive request failures in the current window */
  failureCount?: number;
}

export interface NetworkMonitorOptions {
  slowThresholdMs?: number;
  pollIntervalMs?: number;
  /** Failures within window before condition becomes `failed` */
  failureThreshold?: number;
  /** How long `recovering` lasts after reconnect (ms) */
  recoveringDurationMs?: number;
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

function resolveBaseCondition(
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

  return 'fast';
}

export class NetworkMonitor {
  private listeners = new Set<NetworkListener>();
  private state: NetworkState;
  private pollTimer?: ReturnType<typeof setInterval>;
  private recoveringTimer?: ReturnType<typeof setTimeout>;
  private wasOffline = false;
  private recoveringUntil = 0;
  private failureCount = 0;
  private onOnline = () => this.handleOnline();
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

  /** Report a failed network/API request */
  reportFailure(): void {
    const threshold = this.options.failureThreshold ?? 3;
    this.failureCount += 1;
    if (this.failureCount >= threshold && this.state.online) {
      this.setCondition('failed');
    }
  }

  /** Report a successful request — clears failure streak */
  reportSuccess(): void {
    this.failureCount = 0;
    if (this.state.condition === 'failed') {
      this.update();
    }
  }

  destroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);
    const connection = getConnection();
    connection?.removeEventListener?.('change', this.onConnectionChange);
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.recoveringTimer) clearTimeout(this.recoveringTimer);
    this.listeners.clear();
  }

  private handleOnline(): void {
    if (this.wasOffline) {
      this.recoveringUntil = Date.now() + (this.options.recoveringDurationMs ?? 5000);
      if (this.recoveringTimer) clearTimeout(this.recoveringTimer);
      this.recoveringTimer = setTimeout(() => this.update(), this.options.recoveringDurationMs ?? 5000);
    }
    this.wasOffline = false;
    this.update();
  }

  private readState(): NetworkState {
    const online = typeof navigator === 'undefined' ? true : navigator.onLine;
    const connection = getConnection();
    const base = resolveBaseCondition(
      online,
      connection,
      this.options.slowThresholdMs,
    );

    let condition = base;
    if (!online) {
      this.wasOffline = true;
      condition = 'offline';
    } else if (Date.now() < this.recoveringUntil) {
      condition = 'recovering';
    } else if (this.failureCount >= (this.options.failureThreshold ?? 3)) {
      condition = 'failed';
    }

    return {
      online,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      failureCount: this.failureCount,
      condition,
    };
  }

  private setCondition(condition: NetworkCondition): void {
    this.state = { ...this.state, condition };
    this.listeners.forEach((l) => l(this.state));
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

export function isOnlineNetwork(condition: NetworkCondition): boolean {
  return (
    condition === 'online' ||
    condition === 'fast' ||
    condition === 'recovering'
  );
}

export function isSlowNetwork(condition: NetworkCondition): boolean {
  return (
    condition === 'slow' ||
    condition === 'intermittent' ||
    condition === 'high-latency'
  );
}

export function isDegradedNetwork(condition: NetworkCondition): boolean {
  return (
    isSlowNetwork(condition) ||
    condition === 'failed' ||
    condition === 'offline'
  );
}

export function shouldUseSkeleton(condition: NetworkCondition): boolean {
  return isSlowNetwork(condition) || condition === 'recovering';
}

/** @deprecated Use isOnlineNetwork — `online` condition alias for `fast` */
export function normalizeNetworkCondition(condition: NetworkCondition): NetworkCondition {
  return condition === 'online' ? 'fast' : condition;
}
