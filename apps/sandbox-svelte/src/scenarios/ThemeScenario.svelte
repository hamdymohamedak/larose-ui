<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import { Card } from '@larose-ui/svelte';

  let theme = $state<'light' | 'dark'>('light');
</script>

<LaRoseProvider {theme} locale="en" tenantId="sandbox">
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">
      Provider root should expose <code>data-lr-theme="{theme}"</code>.
    </p>
    <p data-sbx="theme-label">Current theme: {theme}</p>
    <button
      type="button"
      data-sbx="toggle-theme"
      onclick={() => (theme = theme === 'light' ? 'dark' : 'light')}
    >
      Toggle theme
    </button>
    <Card title="Themed surface">
      <p class="sbx-muted" style="margin: 0">Card tokens follow the active theme.</p>
    </Card>
  </div>
</LaRoseProvider>
