<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FeatureState } from '@larose-ui/runtime-core';
  import { createFeatureContext, setFeaturesContext } from './context';

  interface Props {
    features?: Record<string, FeatureState>;
    loading?: boolean;
    children?: Snippet;
  }

  let { features = {}, loading = false, children }: Props = $props();
  setFeaturesContext(createFeatureContext(features, loading));
</script>

{@render children?.()}
