<script lang="ts">
  import ToastProvider from '../../../packages/svelte/src/lib/components/Toast/ToastProvider.svelte';
  import ToastDemoBody from './ToastDemoBody.svelte';

  let {
    autoTitle = 'Welcome',
    autoMessage = 'laRose toast notifications are ready.',
    buttonLabel = 'Show toast',
  }: {
    autoTitle?: string;
    autoMessage?: string;
    buttonLabel?: string;
  } = $props();
</script>

<ToastProvider>
  <ToastDemoBody {autoTitle} {autoMessage} {buttonLabel} />
</ToastProvider>
