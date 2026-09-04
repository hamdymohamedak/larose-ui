# @larose-ui/forms-vue

Vue 3 schema-driven `Form` adapter. Schema helpers come from `@larose-ui/forms-core`; controls render via `@larose-ui/vue`.

```vue
<script setup>
import { Form } from '@larose-ui/forms-vue';
</script>

<Form :schema="schema" @submit="onSave" />
```
