<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Environment } from '@larose-ui/core';
  import { setEnvironmentContext } from './context';

  interface Props {
    environment?: Environment;
    children?: Snippet;
  }

  let { environment = 'development', children }: Props = $props();
  setEnvironmentContext(environment);

  const envLabels: Partial<Record<Environment, string>> = {
    staging: 'STAGING',
    demo: 'DEMO MODE',
    readonly: 'READ ONLY',
    maintenance: 'MAINTENANCE',
  };

  const showBanner = environment !== 'development' && environment !== 'production';
  const label = envLabels[environment];
</script>

{#if showBanner && label}
  <div
    data-lr-env-banner
    style="background: var(--lr-color-warning, #ca8a04); color: var(--lr-color-text-inverse, #fff); text-align: center; padding: var(--lr-space-1, 0.25rem); font-size: var(--lr-font-size-xs, 0.75rem); font-weight: 600; letter-spacing: 0.05em"
  >
    {label}
  </div>
{/if}
{@render children?.()}
