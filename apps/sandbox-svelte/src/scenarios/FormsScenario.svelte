<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import { Button, Input, Card } from '@larose-ui/svelte';

  let name = $state('');
  let submitted = $state('');

  function onSubmit(event: Event) {
    event.preventDefault();
    submitted = name.trim() || '(empty)';
  }
</script>

<LaRoseProvider theme="light" locale="en" tenantId="sandbox">
  <div class="sbx-stage-pad sbx-stack">
    <Card title="Quick form">
      <form class="sbx-stack" onsubmit={onSubmit}>
        <Input label="Name" name="name" bind:value={name} />
        <Button type="submit" data-sbx="form-submit">Submit</Button>
      </form>
    </Card>
    <p data-sbx="form-result" class="sbx-muted">
      {submitted ? `Submitted: ${submitted}` : 'Not submitted yet.'}
    </p>
  </div>
</LaRoseProvider>
