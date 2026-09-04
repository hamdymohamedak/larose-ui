<script setup lang="ts">
import { SCENARIOS } from '../../../sandbox-shared/scenarios.js';
</script>

<template>
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">
      Kitchen sink for <code>@larose-ui/vue</code>. Pair with React / Svelte +
      <code>pnpm test:parity</code>. Storybook remains docs only.
    </p>
    <ul class="sbx-stack" style="margin: 0; padding-left: 1.2rem">
      <li v-for="s in SCENARIOS.filter((x) => x.id !== 'home')" :key="s.id">
        <a :href="`#/${s.id}`">{{ s.title }}</a> — {{ s.description }}
      </li>
    </ul>
  </div>
</template>
