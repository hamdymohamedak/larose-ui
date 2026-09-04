# AI runtime

# AI Runtime (Phase 5)

Foundational AI layer with strict permission boundaries.

## Current State

- `@larose-ui/ai-react`: SmartTable, SmartForm, mock + HTTP adapters
- **Intent pipeline** — `parseIntent()`, `sanitizePrompt()`
- **Permission-bound execution** — `createAIRuntime()` gates every action
- **AIProvider** — wires runtime to `usePermissions()` from laRose
- **HTTP adapter** — `createHttpAdapter()` with mock fallback

## Usage

```tsx
import {
  AIProvider,
  SmartTable,
  SmartForm,
  createHttpAdapter,
  createMockAdapter,
} from '@larose-ui/ai-react';
import { LaRoseProvider } from '@larose-ui/runtime-react';

const adapter = createHttpAdapter({
  baseUrl: 'https://api.example.com',
  fallback: createMockAdapter(),
});

<LaRoseProvider permissions={['employees.read', 'employees.write']}>
  <AIProvider adapter={adapter} onAudit={(e) => console.debug(e)}>
    <SmartTable readPermission="employees.read" {...tableProps} />
    <SmartForm writePermission="employees.write" {...formProps} />
  </AIProvider>
</LaRoseProvider>
```

SmartTable/SmartForm work without `AIProvider` when nested in `LaRoseProvider` — they use `useSmartAIRuntime()` which reads permissions automatically.

## Security Rule

AI execution paths never bypass user permissions. Backend remains source of truth; HTTP adapter forwards prompts to your API — do not expose secrets in the client adapter.

## API Endpoints (HTTP adapter)

| Endpoint | Body | Response |
|----------|------|----------|
| `POST /api/ai/table-filter` | `{ query, columns, sample }` | `TableFilterResult` |
| `POST /api/ai/form-populate` | `{ query, fields }` | `FormFillResult` |
