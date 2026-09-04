<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PermissionFallback } from '@larose-ui/core';
  import { resolvePermissionFallback } from '@larose-ui/permissions-core';
  import { getPermissionsContext, permissionStore } from './context';

  interface Props {
    action: string;
    resource?: string;
    fallback?: PermissionFallback;
    reason?: string;
    children: Snippet;
  }

  let {
    action,
    resource,
    fallback = 'disabled',
    reason,
    children,
  }: Props = $props();

  const ctx = getPermissionsContext();
  const result = permissionStore(action, resource);
  const mode = $derived(
    resolvePermissionFallback($result.allowed, $ctx.loading, fallback),
  );
  const explainReason = $derived(
    reason ?? $result.reason ?? `Missing permission: ${action}`,
  );
</script>

{#if mode === 'loading'}
  <div data-permission-state="loading" aria-busy="true">{@render children()}</div>
{:else if !$result.allowed && mode !== 'hidden'}
  <span
    class="lr-explainable"
    data-variant={mode === 'forbidden' ? 'forbidden' : 'disabled'}
    title={explainReason}
    style="display: inline-flex; flex-direction: column; gap: 0.25rem"
  >
    <div data-permission-state={mode} aria-disabled="true">{@render children()}</div>
    <span
      role="note"
      style="font-size: var(--lr-font-size-xs, 0.75rem); color: var(--lr-color-text-muted, #64748b); max-width: 16rem"
    >
      {explainReason}
    </span>
  </span>
{:else if $result.allowed}
  {@render children()}
{/if}
