# @larose-ui/forms-svelte

Svelte 5 schema-driven `Form` adapter. Schema helpers come from `@larose-ui/forms-core`; controls render via `@larose-ui/svelte`.

```svelte
<script>
  import { Form } from '@larose-ui/forms-svelte';
</script>

<Form {schema} onsubmit={onSave} />
```
