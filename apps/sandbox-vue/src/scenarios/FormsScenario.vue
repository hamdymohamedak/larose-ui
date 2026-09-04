<script setup lang="ts">
import { ref } from 'vue';
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import { Button, Input, Card } from '@larose-ui/vue';

const name = ref('');
const submitted = ref('');

function onSubmit(event: Event) {
  event.preventDefault();
  submitted.value = name.value.trim() || '(empty)';
}
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox">
    <div class="sbx-stage-pad sbx-stack">
      <Card title="Quick form">
        <form class="sbx-stack" @submit="onSubmit">
          <Input v-model="name" label="Name" name="name" data-sbx="form-name" />
          <Button type="submit" data-sbx="form-submit">Submit</Button>
        </form>
      </Card>
      <p data-sbx="form-result" class="sbx-muted">
        {{ submitted ? `Submitted: ${submitted}` : 'Not submitted yet.' }}
      </p>
    </div>
  </LaRoseProvider>
</template>
