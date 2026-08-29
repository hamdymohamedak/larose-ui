# laRose Security

## Core Principle

> The UI is NOT the authorization layer.

Real authorization must always be enforced by the backend. laRose ensures the UI **correctly reflects** the security model — never replaces it.

## Permission-Aware UI

```jsx
<Can permission="employees.delete" fallback="hidden">
  <DeleteButton />
</Can>
```

Fallback modes:

| Mode | Behavior |
|------|----------|
| hidden | Not rendered (default for destructive) |
| disabled | Visible but non-interactive |
| forbidden | Visible with forbidden message |
| readonly | Display-only |

Never expose sensitive data assuming UI hiding is sufficient.

## Session & Authentication

Support UI patterns for:

- Session expiration → redirect to login with return URL
- 401 responses → automatic session refresh or logout flow
- 403 responses → forbidden state with explainable message
- Token refresh without user disruption

## Sensitive Actions

- Confirmation dialogs for irreversible operations
- Audit trail integration (`<AuditedInput />`)
- Rate limiting UI (429 → countdown retry)
- Production environment warnings (visual indicators)

## Tenant Isolation

- Tenant context flows through all providers
- UI never mixes tenant data in shared state
- Tenant-specific theming does not leak tokens across tenants
- Feature flags scoped to tenant/org/user

## Data Handling

- No secrets in client-side code or tokens
- Sensitive fields (salary, SSN) support masked display
- Form drafts encrypted in local storage (offline package)
- Clipboard restrictions for sensitive data (optional)

## XSS Prevention

- React's default escaping
- No `dangerouslySetInnerHTML` in core components
- Sanitized rich text via explicit opt-in component (future)

## CSRF

- Mutation requests include CSRF tokens when configured
- `@larose/data` supports CSRF header injection

## Content Security Policy

Document recommended CSP headers for apps using laRose:

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';  /* runtime tokens require inline CSS vars */
img-src 'self' data: https:;
```

## Security-Aware Component States

| Scenario | UI Response |
|----------|-------------|
| Unauthorized action | Hidden or explainable disabled |
| Session expired | Modal + redirect |
| Sensitive field edit | Audit log + confirmation |
| Production destructive op | Enhanced confirmation + env badge |
| Cross-tenant access attempt | Error boundary + report |

## Dependency Security

- Automated dependency scanning in CI
- Pin major versions in apps
- Regular `@larose/*` security patches

## Compliance Considerations

Architecture supports (implementation per app):

- GDPR — consent UI patterns, data export triggers
- HIPAA — audit trails, access logging hooks
- SOC 2 — observability event trails

laRose provides hooks; compliance logic remains in the application layer.
