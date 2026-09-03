<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '../../../packages/svelte/src/lib/components/Button/Button.svelte';
  import { getToast } from '../../../packages/svelte/src/lib/toast/context';

  let {
    autoTitle = 'Welcome',
    autoMessage = 'laRose toast notifications are ready.',
    buttonLabel = 'Show toast',
  }: {
    autoTitle?: string;
    autoMessage?: string;
    buttonLabel?: string;
  } = $props();

  const { toast } = getToast();

  onMount(() => {
    toast({
      title: autoTitle,
      message: autoMessage,
      variant: 'info',
    });
  });

  function show() {
    toast({ title: 'Saved', message: 'Employee record updated.', variant: 'success' });
  }
</script>

<Button onclick={show}>{buttonLabel}</Button>
