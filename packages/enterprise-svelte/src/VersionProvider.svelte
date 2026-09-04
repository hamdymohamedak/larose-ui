<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import type { VersionInfo } from '@larose-ui/core';
  import { Alert } from '@larose-ui/svelte';
  import {
    checkVersionCompatibility,
    type VersionCheckOptions,
  } from '@larose-ui/enterprise-core';
  import { VERSION_CONTEXT } from './version';

  type Props = VersionCheckOptions & {
    showBanner?: boolean;
    children?: Snippet;
  };

  let {
    frontend,
    backend,
    minBackend,
    maxBackend,
    deprecatedFeatures,
    requiredFeatures,
    showBanner = true,
    children,
  }: Props = $props();

  const info: VersionInfo = checkVersionCompatibility({
    frontend,
    backend,
    minBackend,
    maxBackend,
    deprecatedFeatures,
    requiredFeatures,
  });

  setContext(VERSION_CONTEXT, info);
</script>

{#if showBanner && !info.compatible}
  <Alert variant="warning" title="Version mismatch">
    {info.warnings[0] ?? 'This feature requires an application update.'}
  </Alert>
{/if}
{@render children?.()}
