<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import type {
    EventCollector,
    ObservabilityAdapter,
    ObservabilityConfig,
  } from '@larose-ui/observability-core';
  import {
    createObservabilityContext,
    setObservabilityContext,
    syncObservabilityScope,
  } from './context';

  interface Props {
    adapter?: ObservabilityAdapter;
    tenantId?: string;
    userId?: string;
    sessionId?: string;
    debug?: boolean;
    collector?: EventCollector;
    children: Snippet;
  }

  let {
    adapter,
    tenantId,
    userId,
    sessionId,
    debug,
    collector,
    children,
  }: Props = $props();

  const value = untrack(() =>
    createObservabilityContext({
      adapter,
      tenantId,
      userId,
      sessionId,
      debug,
      collector,
    } satisfies ObservabilityConfig & { collector?: EventCollector }),
  );

  setObservabilityContext(value);

  const scopeRef = untrack(() => ({
    current: `${tenantId ?? ''}:${userId ?? ''}:${sessionId ?? ''}`,
  }));

  $effect(() => {
    syncObservabilityScope(
      value,
      { adapter, tenantId, userId, sessionId },
      scopeRef,
    );
  });
</script>

{@render children()}
