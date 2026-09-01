# auth.md

You are an agent. This document describes how to discover and authenticate with laRose UI documentation APIs.

## Step 1 — Discover

Fetch Protected Resource Metadata:

```http
GET /.well-known/oauth-protected-resource
```

Expected fields:

- `resource`: `https://hamdymohamedak.github.io/larose-ui/`
- `authorization_servers`: `["https://hamdymohamedak.github.io/larose-ui"]`
- `scopes_supported`: includes `docs:read`
- `bearer_methods_supported`: `["header"]`

Then fetch Authorization Server metadata:

```http
GET /.well-known/oauth-authorization-server
```

Read the `agent_auth` block for registration endpoints, supported identity types, and credential types.

## Step 2 — Pick a registration method

1. **ID-JAG available** — use `identity_assertion` when `urn:ietf:params:oauth:token-type:id-jag` is listed.
2. **No user identity yet** — use `anonymous` registration, then complete claim at `agent_auth.claim_uri` if the user takes ownership.

## Step 3 — Register

POST to `https://hamdymohamedak.github.io/larose-ui/agent/identity` or register dynamically at `https://hamdymohamedak.github.io/larose-ui/.well-known/oauth/register`.

Supported identity types:

- `identity_assertion` (ID-JAG)
- `anonymous`

## Step 4 — Exchange for an access token

Exchange the service-issued identity assertion at:

```http
POST https://hamdymohamedak.github.io/larose-ui/oauth/token
```

Supported grant types include `authorization_code`, `client_credentials`, and `urn:ietf:params:oauth:grant-type:jwt-bearer`.

## Step 5 — Call protected APIs

Send the access token using the `Authorization: Bearer` header.

Protected API surfaces:

- Component metadata: `https://hamdymohamedak.github.io/larose-ui/api/v1/components`
- Documentation index: `https://hamdymohamedak.github.io/larose-ui/api/v1/documentation`
- Package catalog: `https://hamdymohamedak.github.io/larose-ui/api/v1/packages`

## Step 6 — Revocation

Revoke tokens at `https://hamdymohamedak.github.io/larose-ui/oauth/revoke` when credentials should be invalidated.

## Related discovery documents

- API catalog: `https://hamdymohamedak.github.io/larose-ui/.well-known/api-catalog`
- OpenID configuration: `https://hamdymohamedak.github.io/larose-ui/.well-known/openid-configuration`
- Human docs: `https://hamdymohamedak.github.io/larose-ui/docs/getting-started`
