# @larose-ui/permissions-vue

Vue 3 adapter for `@larose-ui/permissions-core` — `PermissionProvider`, `usePermissions`, `Can`, `Permission`.

```vue
<script setup>
import { PermissionProvider, Can } from '@larose-ui/permissions-vue';
</script>

<PermissionProvider :permissions="['employees.read']">
  <Can permission="employees.read">Visible</Can>
</PermissionProvider>
```
