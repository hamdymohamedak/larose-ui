<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import {
    createAIRuntime,
    createMockAdapter,
    type AIAdapter,
    type AIAuditEvent,
  } from '@larose-ui/ai-core';
  import { getPermissionsContext } from '@larose-ui/permissions-svelte';
  import { get } from 'svelte/store';
  import { setAIContext } from './context';

  interface Props {
    adapter?: AIAdapter;
    onAudit?: (event: AIAuditEvent) => void;
    children: Snippet;
  }

  let { adapter, onAudit, children }: Props = $props();

  const permissions = getPermissionsContext();
  const runtime = untrack(() =>
    createAIRuntime({
      adapter: adapter ?? createMockAdapter(),
      grantedPermissions: () => get(permissions).permissions,
      onAudit,
    }),
  );
  setAIContext(runtime);
</script>

{@render children()}
