<script lang="ts">
  import { registerAccelerator } from '@larose-ui/svelte';

  let last = $state('none');

  const unregister = registerAccelerator(
    { key: 'j', mod: true, shift: true },
    () => {
      last = 'mod+shift+j';
    },
    { id: 'sandbox-accelerator-j', allowInEditable: true },
  );

  $effect(() => () => unregister());
</script>

<div class="sbx-stage-pad sbx-stack">
  <p class="sbx-muted">
    Press <kbd>⌘⇧J</kbd> / <kbd>Ctrl+Shift+J</kbd> to fire the sandbox accelerator.
  </p>
  <p data-sbx="accelerator-status">Last accelerator: {last}</p>
</div>
