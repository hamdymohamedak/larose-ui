<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import { isSafeRedirectPath } from '@larose-ui/core';
  import { Dialog } from '@larose-ui/svelte';

  interface Props {
    loginUrl?: string;
    onSessionExpired?: (returnUrl: string) => void;
    children?: Snippet;
  }

  let { loginUrl = '/login', onSessionExpired, children }: Props = $props();
  let expired = $state(false);

  function handler(event: Event) {
    const detail = (event as CustomEvent<{ code?: number }>).detail;
    if (detail?.code === 401) expired = true;
  }

  onMount(() => {
    window.addEventListener('larose:session-expired', handler);
  });
  onDestroy(() => {
    window.removeEventListener('larose:session-expired', handler);
  });

  const safeLoginUrl = isSafeRedirectPath(loginUrl) ? loginUrl : '/login';

  function handleRedirect() {
    const returnUrl = window.location.pathname + window.location.search;
    onSessionExpired?.(returnUrl);
    window.location.href = `${safeLoginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
</script>

{@render children?.()}
<Dialog
  open={expired}
  title="Session expired"
  description="Your session has expired. Sign in again to continue."
  confirmLabel="Sign in"
  cancelLabel="Dismiss"
  onclose={() => (expired = false)}
  onconfirm={handleRedirect}
/>
