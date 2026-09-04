# @larose-ui/data-vue

Vue 3 adapter for `@larose-ui/data-core` — `useQuery`, `useMutation`, and `DataView`.

```ts
import { useQuery, DataView } from '@larose-ui/data-vue';

const { data, status } = useQuery<Employee[]>('/api/employees');
```

Uses the shared query/mutation reducers from `@larose-ui/data-core`. Permission gating is opt-in via `permissionAllowed`.
