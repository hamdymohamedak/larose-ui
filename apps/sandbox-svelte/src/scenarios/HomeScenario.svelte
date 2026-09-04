<script lang="ts">
  import { SCENARIOS } from '../../../sandbox-shared/scenarios.js';
</script>

<div class="sbx-stage-pad sbx-stack">
  <p class="sbx-muted">
    Kitchen sink for <code>@larose-ui/svelte</code>. Pair with React / Vue +
    <code>pnpm test:parity</code>. Storybook remains docs only.
  </p>
  <ul class="sbx-stack" style="margin: 0; padding-left: 1.2rem">
    {#each SCENARIOS.filter((s) => s.id !== 'home') as s (s.id)}
      <li>
        <a href={`#/${s.id}`}>{s.title}</a>
        — {s.description}
      </li>
    {/each}
  </ul>
</div>
