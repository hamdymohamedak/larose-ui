<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PermissionFallback } from '@larose-ui/core';
  import { resolvePermissionFallback } from '@larose-ui/permissions-core';
  import { permissionStore } from './context';

  interface Props {
    permission: string;
    resource?: string;
    fallback?: PermissionFallback;
    reason?: string;
    children: Snippet;
  }

  let {
    permission,
    resource,
    fallback = 'hidden',
    reason,
    children,
  }: Props = $props();

  const result = permissionStore(permission, resource);
  const mode = $derived(resolvePermissionFallback($result.allowed, false, fallback));
  const explainReason = $derived(reason ?? $result.reason);
</script>

{#if mode === 'loading'}
  <span aria-busy="true">{@render children()}</span>
{:else if mode === 'forbidden' || mode === 'disabled' || mode === 'readonly'}
  <span
    class="lr-explainable"
    data-variant={mode === 'forbidden' ? 'forbidden' : mode === 'readonly' ? 'readonly' : 'disabled'}
    title={explainReason ?? 'Not allowed'}
    style="display: inline-flex; flex-direction: column; gap: 0.25rem"
  >
    <span aria-disabled="true" data-permission-fallback={mode}>{@render children()}</span>
    <span
      role="note"
      style="font-size: var(--lr-font-size-xs, 0.75rem); color: var(--lr-color-text-muted, #64748b); max-width: 16rem"
    >
      {explainReason ?? 'Access denied'}
    </span>
  </span>
{:else if mode !== 'hidden'}
  {@render children()}
{/if}
