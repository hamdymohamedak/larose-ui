/** @typedef {{ path: string; title: string; changefreq?: string; priority?: string }} SitemapEntry */

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'Claude-Web',
  'Google-Extended',
  'Amazonbot',
  'anthropic-ai',
  'Bytespider',
  'CCBot',
  'Applebot-Extended',
];

export const CONTENT_SIGNAL = 'ai-train=no, search=yes, ai-input=yes';

const DISALLOWED_PATHS = ['/docs/playground'];

/**
 * @param {string} basePath e.g. `/larose-ui/` or `/`
 */
export function normalizeBasePath(basePath) {
  if (!basePath || basePath === '/') return '';
  return `/${basePath.replace(/^\/+|\/+$/g, '')}`;
}

/**
 * @param {string} siteUrl Deployment root URL (includes subpath when hosted under one), e.g. `https://user.github.io/larose-ui`
 * @param {string} _basePath Vite asset base path (used for relative Link headers, not canonical URLs)
 * @param {string} pathname App route pathname, e.g. `/docs/getting-started`
 */
export function toCanonicalUrl(siteUrl, _basePath, pathname) {
  const root = siteUrl.replace(/\/$/, '');
  const path = pathname === '/' ? '' : pathname;
  return `${root}${path}`;
}

/**
 * @param {{
 *   guides: { id: string; title: string }[];
 *   packages: { id: string; name: string }[];
 *   components: { id: string; name: string }[];
 * }} catalog
 */
export function buildDocsSitemapEntries(catalog) {
  /** @type {SitemapEntry[]} */
  const entries = [
    { path: '/', title: 'Overview', changefreq: 'weekly', priority: '1.0' },
    { path: '/docs/getting-started', title: 'Getting started', changefreq: 'monthly', priority: '0.9' },
    { path: '/docs/guides', title: 'Guides', changefreq: 'monthly', priority: '0.8' },
    { path: '/docs/packages', title: 'Packages', changefreq: 'monthly', priority: '0.7' },
    { path: '/docs/components', title: 'Components', changefreq: 'weekly', priority: '0.9' },
    { path: '/docs/design/theme-builder', title: 'Theme builder', changefreq: 'monthly', priority: '0.7' },
    { path: '/docs/design/tokens', title: 'Design tokens', changefreq: 'monthly', priority: '0.8' },
    { path: '/docs/design/motion', title: 'Motion', changefreq: 'monthly', priority: '0.7' },
    { path: '/docs/accessibility', title: 'Accessibility', changefreq: 'monthly', priority: '0.7' },
    { path: '/docs/architecture', title: 'Architecture', changefreq: 'monthly', priority: '0.7' },
    { path: '/docs/migration', title: 'Migration', changefreq: 'monthly', priority: '0.6' },
    { path: '/changelog', title: 'Changelog', changefreq: 'weekly', priority: '0.6' },
  ];

  for (const guide of catalog.guides) {
    entries.push({
      path: `/docs/guides/${guide.id}`,
      title: guide.title,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  for (const pkg of catalog.packages) {
    entries.push({
      path: `/docs/packages/${pkg.id}`,
      title: pkg.name,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  for (const component of catalog.components) {
    entries.push({
      path: `/docs/components/${component.id}`,
      title: component.name,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  return entries;
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 * @param {SitemapEntry[]} entries
 */
export function buildSitemapXml(siteUrl, basePath, entries) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = entries
    .map((entry) => {
      const loc = toCanonicalUrl(siteUrl, basePath, entry.path);
      const changefreq = entry.changefreq ?? 'monthly';
      const priority = entry.priority ?? '0.5';
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildCrawlRules(disallowedPaths) {
  const lines = ['Allow: /'];
  for (const path of disallowedPaths) {
    lines.push(`Disallow: ${path}`);
  }
  return lines;
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildRobotsTxt(siteUrl, basePath) {
  const prefix = normalizeBasePath(basePath);
  const disallowedPaths = DISALLOWED_PATHS.map((path) => `${prefix}${path}`);
  const sitemapUrl = toCanonicalUrl(siteUrl, basePath, '/sitemap.xml');
  const crawlRules = buildCrawlRules(disallowedPaths);
  const blocks = [
    ['*', crawlRules],
    ...AI_CRAWLERS.map((agent) => [agent, crawlRules]),
  ];

  const lines = ['# laRose UI Documentation — https://github.com/hamdymohamedak/larose-ui', ''];

  for (const [agent, rules] of blocks) {
    lines.push(`User-agent: ${agent}`);
    lines.push(`Content-Signal: ${CONTENT_SIGNAL}`);
    lines.push(...rules);
    lines.push('');
  }

  lines.push(`Sitemap: ${sitemapUrl}`);
  lines.push(`Agentmap: ${toCanonicalUrl(siteUrl, basePath, '/.well-known/ai-catalog.json')}`);
  lines.push('');
  return lines.join('\n');
}

/**
 * @param {string} siteUrl
 */
export function airHostname(siteUrl) {
  return new URL(siteUrl).hostname;
}

/**
 * @param {string} siteUrl
 * @param {string} namespace
 * @param {string} name
 */
export function airIdentifier(siteUrl, namespace, name) {
  return `urn:air:${airHostname(siteUrl)}:${namespace}:${name}`;
}

/**
 * ARD / AI Catalog capability manifest (ai-catalog data model v1.0).
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildAiCatalog(siteUrl, basePath) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);
  const host = airHostname(siteUrl);

  return {
    specVersion: '1.0',
    host: {
      displayName: 'laRose UI Documentation',
      identifier: `did:web:${host}`,
    },
    entries: [
      {
        identifier: airIdentifier(siteUrl, 'mcp', 'larose-ui-docs'),
        displayName: 'laRose UI Documentation MCP',
        type: 'application/mcp-server-card+json',
        url: abs('/.well-known/mcp/server-card.json'),
        representativeQueries: [
          'search laRose UI component documentation with MCP',
          'connect to the laRose UI documentation MCP server',
          'what tools does the laRose docs MCP server expose',
        ],
      },
      {
        identifier: airIdentifier(siteUrl, 'api', 'component-metadata'),
        displayName: 'Component Metadata OpenAPI',
        type: 'application/yaml',
        url: abs('/.well-known/openapi/component-metadata.yaml'),
        representativeQueries: [
          'what props does the Button component support in laRose UI',
          'OpenAPI schema for laRose component metadata JSON',
          'fetch machine-readable props for a React component',
        ],
      },
      {
        identifier: airIdentifier(siteUrl, 'catalog', 'api'),
        displayName: 'laRose UI API Catalog',
        type: 'application/linkset+json',
        url: abs('/.well-known/api-catalog'),
        representativeQueries: [
          'discover laRose UI API endpoints and documentation links',
          'find health check and OpenAPI resources for laRose UI',
          'RFC 9727 API catalog for laRose documentation APIs',
        ],
      },
      {
        identifier: airIdentifier(siteUrl, 'skill', 'larose-ui-docs'),
        displayName: 'laRose UI Docs Agent Skill',
        type: 'text/markdown',
        url: abs('/.well-known/agent-skills/larose-ui-docs/SKILL.md'),
        representativeQueries: [
          'how do I get started with laRose UI',
          'find Vue Svelte and Next.js integration guides',
          'navigate laRose UI documentation for beginners',
        ],
      },
      {
        identifier: airIdentifier(siteUrl, 'skill', 'larose-ui-components'),
        displayName: 'laRose UI Components Agent Skill',
        type: 'text/markdown',
        url: abs('/.well-known/agent-skills/larose-ui-components/SKILL.md'),
        representativeQueries: [
          'look up Button component props and examples',
          'component JSON metadata for laRose UI React components',
          'accessibility notes for a laRose UI component',
        ],
      },
      {
        identifier: airIdentifier(siteUrl, 'auth', 'protected-resource'),
        displayName: 'laRose UI OAuth Protected Resource',
        type: 'application/json',
        url: abs('/.well-known/oauth-protected-resource'),
        representativeQueries: [
          'how do agents authenticate with laRose UI APIs',
          'OAuth scopes supported by laRose documentation APIs',
          'protected resource metadata for laRose UI docs',
        ],
      },
    ],
  };
}

/**
 * RFC 9727 API catalog in Linkset format (application/linkset+json).
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildApiCatalogLinkset(siteUrl, basePath) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);

  return {
    linkset: [
      {
        anchor: abs('/api/v1/components'),
        'service-desc': [
          {
            href: abs('/.well-known/openapi/component-metadata.yaml'),
            type: 'application/yaml',
          },
        ],
        'service-doc': [
          {
            href: abs('/docs/components'),
            type: 'text/html',
          },
        ],
        status: [
          {
            href: abs('/.well-known/health'),
            type: 'application/json',
          },
        ],
        'service-meta': [
          {
            href: abs('/.well-known/openid-configuration'),
            type: 'application/json',
          },
        ],
      },
      {
        anchor: abs('/api/v1/documentation'),
        'service-desc': [
          {
            href: abs('/.well-known/openapi/documentation.yaml'),
            type: 'application/yaml',
          },
        ],
        'service-doc': [
          {
            href: abs('/docs/getting-started'),
            type: 'text/html',
          },
        ],
        status: [
          {
            href: abs('/.well-known/health'),
            type: 'application/json',
          },
        ],
        'service-meta': [
          {
            href: abs('/.well-known/openid-configuration'),
            type: 'application/json',
          },
        ],
      },
      {
        anchor: abs('/api/v1/packages'),
        'service-desc': [
          {
            href: abs('/.well-known/openapi/packages.yaml'),
            type: 'application/yaml',
          },
        ],
        'service-doc': [
          {
            href: abs('/docs/packages'),
            type: 'text/html',
          },
        ],
        status: [
          {
            href: abs('/.well-known/health'),
            type: 'application/json',
          },
        ],
        'service-meta': [
          {
            href: abs('/.well-known/openid-configuration'),
            type: 'application/json',
          },
        ],
      },
    ],
  };
}

/**
 * @param {string} siteUrl
 * @param {{ id: string; name: string }[]} components
 */
export function buildComponentMetadataOpenApi(siteUrl, components) {
  const serverUrl = siteUrl.replace(/\/$/, '');
  const exampleSlugs = components.slice(0, 3).map((component) => component.id);

  return `openapi: 3.1.0
info:
  title: laRose UI Component Metadata API
  version: 1.0.0
  description: Machine-readable component props, examples, and accessibility metadata.
servers:
  - url: ${serverUrl}
paths:
  /components/{slug}.json:
    get:
      operationId: getComponentMetadata
      summary: Get component metadata by slug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
            enum:
${exampleSlugs.map((slug) => `              - ${slug}`).join('\n')}
      responses:
        '200':
          description: Component metadata document
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ComponentMetadata'
components:
  schemas:
    ComponentMetadata:
      type: object
      required: [component, category, import, props]
      properties:
        component:
          type: string
        category:
          type: string
        import:
          type: string
        props:
          type: array
          items:
            type: object
            properties:
              name: { type: string }
              type: { type: string }
              required: { type: boolean }
              description: { type: string }
        examples:
          type: array
        accessibility:
          type: array
          items: { type: string }
`;
}

/**
 * @param {string} siteUrl
 */
export function buildDocumentationOpenApi(siteUrl) {
  const serverUrl = siteUrl.replace(/\/$/, '');

  return `openapi: 3.1.0
info:
  title: laRose UI Documentation Index API
  version: 1.0.0
  description: Machine-readable documentation index and page exports for agents.
servers:
  - url: ${serverUrl}
paths:
  /llms.txt:
    get:
      operationId: getLlmsIndex
      summary: Get the LLM-oriented documentation index
      responses:
        '200':
          description: Plain-text documentation index
          content:
            text/plain:
              schema:
                type: string
  /agent/routes.json:
    get:
      operationId: listMarkdownRoutes
      summary: List routes with markdown exports
      responses:
        '200':
          description: Route manifest
          content:
            application/json:
              schema:
                type: object
                properties:
                  pages:
                    type: array
                    items: { type: string }
`;
}

/**
 * @param {string} siteUrl
 * @param {{ id: string; name: string }[]} packages
 */
export function buildPackagesOpenApi(siteUrl, packages) {
  const serverUrl = siteUrl.replace(/\/$/, '');

  return `openapi: 3.1.0
info:
  title: laRose UI Packages API
  version: 1.0.0
  description: Package catalog for the laRose UI monorepo.
servers:
  - url: ${serverUrl}
paths:
  /docs/packages:
    get:
      operationId: listPackages
      summary: Human-readable package index
      responses:
        '200':
          description: Package documentation index
          content:
            text/html:
              schema:
                type: string
  /docs/packages/{packageId}:
    get:
      operationId: getPackageDocs
      summary: Package documentation page
      parameters:
        - name: packageId
          in: path
          required: true
          schema:
            type: string
            enum:
${packages.map((pkg) => `              - ${pkg.id}`).join('\n')}
      responses:
        '200':
          description: Package documentation page
          content:
            text/html:
              schema:
                type: string
`;
}

/**
 * @param {string} siteUrl
 */
export function buildHealthCheck(siteUrl) {
  return {
    status: 'ok',
    service: 'larose-ui-docs',
    site: siteUrl.replace(/\/$/, ''),
    checkedAt: new Date().toISOString(),
  };
}

export const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

export const MCP_SERVER_CARD_SCHEMA_URL =
  'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json';

/**
 * MCP Server Card (SEP-1649 / agent discovery) with SEP-2127-aligned fields.
 * @param {string} siteUrl
 * @param {string} basePath
 * @param {string} [version]
 */
export function buildMcpServerCard(siteUrl, basePath, version = '0.1.1') {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);
  const endpoint = abs('/mcp');

  return {
    $schema: MCP_SERVER_CARD_SCHEMA_URL,
    name: 'io.github.hamdymohamedak/larose-ui-docs',
    version,
    description: 'MCP access to laRose UI documentation, components, packages, and guides.',
    title: 'laRose UI Documentation',
    websiteUrl: abs('/'),
    repository: {
      url: 'https://github.com/hamdymohamedak/larose-ui',
      source: 'github',
      subfolder: 'apps/docs',
    },
    serverInfo: {
      name: 'laRose UI Documentation MCP',
      version,
    },
    transport: {
      type: 'streamable-http',
      endpoint,
    },
    remotes: [
      {
        type: 'streamable-http',
        url: endpoint,
        supportedProtocolVersions: ['2024-11-05', '2025-03-26'],
      },
    ],
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
  };
}

export const AGENT_SKILLS_DISCOVERY_SCHEMA =
  'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

/**
 * @param {string | Buffer} data
 */
export function sha256Digest(data) {
  return `sha256:${createHash('sha256').update(data).digest('hex')}`;
}

/**
 * @param {string} content
 */
export function parseSkillFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { name: undefined, description: undefined };
  }

  const frontmatter = match[1];
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  return { name, description };
}

/**
 * @param {string} agentSkillsDir
 */
export function collectAgentSkillEntries(agentSkillsDir) {
  /** @type {{ name: string; type: 'skill-md'; description: string; url: string; digest: string }[]} */
  const skills = [];

  let entries = [];
  try {
    entries = readdirSync(agentSkillsDir, { withFileTypes: true });
  } catch {
    return skills;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillFile = join(agentSkillsDir, entry.name, 'SKILL.md');
    const content = readFileSync(skillFile);
    const text = content.toString('utf8');
    const { name, description } = parseSkillFrontmatter(text);

    skills.push({
      name: name ?? entry.name,
      type: 'skill-md',
      description: description ?? '',
      url: `/.well-known/agent-skills/${entry.name}/SKILL.md`,
      digest: sha256Digest(content),
    });
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 * @param {ReturnType<typeof collectAgentSkillEntries>} skills
 */
export function buildAgentSkillsIndex(siteUrl, basePath, skills) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);

  return {
    $schema: AGENT_SKILLS_DISCOVERY_SCHEMA,
    skills: skills.map((skill) => ({
      name: skill.name,
      type: skill.type,
      description: skill.description,
      url: abs(skill.url),
      digest: skill.digest,
    })),
  };
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 */
function oauthIssuer(siteUrl) {
  return siteUrl.replace(/\/$/, '');
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 */
function oauthEndpoints(siteUrl, basePath) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);
  return {
    issuer: oauthIssuer(siteUrl),
    authorization_endpoint: abs('/oauth/authorize'),
    token_endpoint: abs('/oauth/token'),
    jwks_uri: abs('/.well-known/jwks.json'),
    registration_endpoint: abs('/.well-known/oauth/register'),
  };
}

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414).
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildAgentAuth(siteUrl, basePath) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);

  return {
    skill: abs('/auth.md'),
    register_uri: abs('/.well-known/oauth/register'),
    identity_endpoint: abs('/agent/identity'),
    claim_uri: abs('/agent/identity/claim'),
    revocation_uri: abs('/oauth/revoke'),
    identity_types_supported: ['anonymous', 'identity_assertion'],
    identity_assertion: {
      assertion_types_supported: ['urn:ietf:params:oauth:token-type:id-jag'],
    },
    anonymous: {
      credential_types_supported: ['access_token'],
      claim_uri: abs('/agent/identity/claim'),
    },
    events_supported: [
      'https://schemas.workos.com/events/agent/auth/identity/assertion/revoked',
    ],
  };
}

/**
 * RFC 9728 OAuth Protected Resource Metadata.
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildOAuthProtectedResource(siteUrl, basePath) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);
  const resource = `${oauthIssuer(siteUrl)}/`;

  return {
    resource,
    resource_name: 'laRose UI Documentation API',
    authorization_servers: [oauthIssuer(siteUrl)],
    scopes_supported: ['docs:read', 'openid', 'profile', 'email'],
    bearer_methods_supported: ['header'],
    resource_documentation: abs('/docs/getting-started'),
  };
}

/**
 * Auth.md agent registration instructions.
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildAuthMd(siteUrl, basePath) {
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);
  const issuer = oauthIssuer(siteUrl);
  const resource = `${issuer}/`;

  return `# auth.md

You are an agent. This document describes how to discover and authenticate with laRose UI documentation APIs.

## Step 1 — Discover

Fetch Protected Resource Metadata:

\`\`\`http
GET /.well-known/oauth-protected-resource
\`\`\`

Expected fields:

- \`resource\`: \`${resource}\`
- \`authorization_servers\`: \`["${issuer}"]\`
- \`scopes_supported\`: includes \`docs:read\`
- \`bearer_methods_supported\`: \`["header"]\`

Then fetch Authorization Server metadata:

\`\`\`http
GET /.well-known/oauth-authorization-server
\`\`\`

Read the \`agent_auth\` block for registration endpoints, supported identity types, and credential types.

## Step 2 — Pick a registration method

1. **ID-JAG available** — use \`identity_assertion\` when \`urn:ietf:params:oauth:token-type:id-jag\` is listed.
2. **No user identity yet** — use \`anonymous\` registration, then complete claim at \`agent_auth.claim_uri\` if the user takes ownership.

## Step 3 — Register

POST to \`${abs('/agent/identity')}\` or register dynamically at \`${abs('/.well-known/oauth/register')}\`.

Supported identity types:

- \`identity_assertion\` (ID-JAG)
- \`anonymous\`

## Step 4 — Exchange for an access token

Exchange the service-issued identity assertion at:

\`\`\`http
POST ${abs('/oauth/token')}
\`\`\`

Supported grant types include \`authorization_code\`, \`client_credentials\`, and \`urn:ietf:params:oauth:grant-type:jwt-bearer\`.

## Step 5 — Call protected APIs

Send the access token using the \`Authorization: Bearer\` header.

Protected API surfaces:

- Component metadata: \`${abs('/api/v1/components')}\`
- Documentation index: \`${abs('/api/v1/documentation')}\`
- Package catalog: \`${abs('/api/v1/packages')}\`

## Step 6 — Revocation

Revoke tokens at \`${abs('/oauth/revoke')}\` when credentials should be invalidated.

## Related discovery documents

- API catalog: \`${abs('/.well-known/api-catalog')}\`
- OpenID configuration: \`${abs('/.well-known/openid-configuration')}\`
- Human docs: \`${abs('/docs/getting-started')}\`
`;
}

/**
 * OpenID Connect Discovery 1.0 metadata.
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildOpenIdConfiguration(siteUrl, basePath) {
  const endpoints = oauthEndpoints(siteUrl, basePath);
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);

  return {
    ...endpoints,
    response_types_supported: ['code'],
    grant_types_supported: [
      'authorization_code',
      'client_credentials',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
    ],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post', 'none'],
    scopes_supported: ['openid', 'profile', 'email', 'docs:read'],
    claims_supported: ['sub', 'iss', 'aud', 'exp', 'iat'],
    code_challenge_methods_supported: ['S256'],
    revocation_endpoint: abs('/oauth/revoke'),
  };
}

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414).
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildOAuthAuthorizationServer(siteUrl, basePath) {
  const endpoints = oauthEndpoints(siteUrl, basePath);
  const abs = (pathname) => toCanonicalUrl(siteUrl, basePath, pathname);
  const protectedResource = buildOAuthProtectedResource(siteUrl, basePath);

  return {
    ...protectedResource,
    ...endpoints,
    response_types_supported: ['code'],
    grant_types_supported: [
      'authorization_code',
      'client_credentials',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
    ],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post', 'none'],
    scopes_supported: protectedResource.scopes_supported,
    code_challenge_methods_supported: ['S256'],
    revocation_endpoint: abs('/oauth/revoke'),
    agent_auth: buildAgentAuth(siteUrl, basePath),
  };
}

/**
 * JSON Web Key Set published for token verification.
 * Keys are provisioned when an authorization server is deployed for protected APIs.
 */
export function buildJwks() {
  return { keys: [] };
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildLinkHeaderValue(siteUrl, basePath) {
  const prefix = normalizeBasePath(basePath);
  const links = [
    `<${prefix}/llms.txt>; rel="describedby"`,
    `<${prefix}/.well-known/ai-catalog.json>; rel="ai-catalog"`,
    `<${prefix}/.well-known/api-catalog>; rel="api-catalog"`,
    `<${prefix}/sitemap.xml>; rel="sitemap"`,
    `<${prefix}/docs/getting-started>; rel="service-doc"`,
  ];
  return links.join(', ');
}

/**
 * @param {string} siteUrl
 * @param {string} basePath
 */
export function buildCloudflareHeaders(siteUrl, basePath) {
  const link = buildLinkHeaderValue(siteUrl, basePath);
  return `/*
  Content-Type: text/html; charset=utf-8
  Link: ${link}

/robots.txt
  Content-Type: text/plain; charset=utf-8

/sitemap.xml
  Content-Type: application/xml; charset=utf-8

/.well-known/api-catalog
  Content-Type: application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"

/.well-known/health
  Content-Type: application/json; charset=utf-8

/.well-known/openapi/*
  Content-Type: application/yaml; charset=utf-8

/.well-known/openid-configuration
  Content-Type: application/json; charset=utf-8

/.well-known/oauth-authorization-server
  Content-Type: application/json; charset=utf-8

/.well-known/jwks.json
  Content-Type: application/json; charset=utf-8

/.well-known/oauth-protected-resource
  Content-Type: application/json; charset=utf-8

/auth.md
  Content-Type: text/markdown; charset=utf-8

/.well-known/mcp/server-card.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type, If-None-Match
  Access-Control-Expose-Headers: ETag
  Cache-Control: public, max-age=3600

/.well-known/agent-skills/index.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Cache-Control: public, max-age=3600

/.well-known/agent-skills/*
  Content-Type: text/markdown; charset=utf-8
  Access-Control-Allow-Origin: *

/.well-known/ai-catalog.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Cache-Control: public, max-age=3600
`;
}

/**
 * @param {{
 *   entries: SitemapEntry[];
 *   llmsTxt: string;
 *   guideContent: Record<string, string>;
 *   guides: { id: string; title: string }[];
 *   packages: { id: string; name: string; tagline: string; features: string[] }[];
 *   components: { id: string; name: string; category: string }[];
 *   api: Record<string, { props: { name: string; type: string; description?: string; inherited?: boolean }[] }>;
 *   gettingStartedMdx?: string;
 * }} input
 */
export function buildPageMarkdownMap(input) {
  /** @type {Record<string, string>} */
  const pages = {
    '/': input.llmsTxt.trim(),
    '/docs/getting-started': input.gettingStartedMdx
      ? stripFrontMatter(input.gettingStartedMdx).trim()
      : readMdxTitle('Getting started', 'Install laRose UI packages and wrap your app with `LaRoseProvider`.'),
    '/docs/guides': buildIndexMarkdown('Guides', input.guides.map((g) => `- [${g.title}](/docs/guides/${g.id})`)),
    '/docs/packages': buildIndexMarkdown(
      'Packages',
      input.packages.map((pkg) => `- [${pkg.name}](/docs/packages/${pkg.id}): ${pkg.tagline}`),
    ),
    '/docs/components': buildIndexMarkdown(
      'Components',
      input.components.map((c) => `- [${c.name}](/docs/components/${c.id}) (${c.category})`),
    ),
    '/docs/design/theme-builder': pageMarkdown('Theme builder', 'Interactive theme customization for laRose UI.'),
    '/docs/design/tokens': pageMarkdown('Design tokens', 'Explore spacing, color, typography, and motion tokens.'),
    '/docs/design/motion': pageMarkdown('Motion', 'Motion presets and animation tokens in laRose UI.'),
    '/docs/accessibility': pageMarkdown('Accessibility', 'Accessibility patterns and tooling in laRose UI.'),
    '/docs/architecture': pageMarkdown('Architecture', 'Monorepo layout and package boundaries.'),
    '/docs/migration': pageMarkdown('Migration', 'Upgrade paths and codemods via @larose-ui/migration.'),
    '/changelog': pageMarkdown('Changelog', 'Recent package releases and changes.'),
  };

  for (const guide of input.guides) {
    const raw = input.guideContent[guide.id] ?? '';
    pages[`/docs/guides/${guide.id}`] = `# ${guide.title}\n\n${stripFrontMatter(raw).trim()}\n`;
  }

  for (const pkg of input.packages) {
    pages[`/docs/packages/${pkg.id}`] = [
      `# ${pkg.name}`,
      '',
      pkg.tagline,
      '',
      '## Features',
      ...pkg.features.map((feature) => `- ${feature}`),
    ].join('\n');
  }

  for (const component of input.components) {
    const props = input.api[component.name]?.props.filter((prop) => !prop.inherited) ?? [];
    pages[`/docs/components/${component.id}`] = [
      `# ${component.name}`,
      '',
      `Category: ${component.category}`,
      '',
      '## Props',
      ...props.map((prop) => `- \`${prop.name}\` (${prop.type})${prop.description ? ` — ${prop.description}` : ''}`),
      '',
      `Metadata: /components/${component.id}.json`,
    ].join('\n');
  }

  return pages;
}

function buildIndexMarkdown(title, items) {
  return `# ${title}\n\n${items.join('\n')}\n`;
}

function pageMarkdown(title, description) {
  return `# ${title}\n\n${description}\n`;
}

function readMdxTitle(title, description) {
  return `# ${title}\n\n${description}\n`;
}

function stripFrontMatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Rough token estimate for x-markdown-tokens header.
 * @param {string} markdown
 */
export function estimateMarkdownTokens(markdown) {
  return Math.ceil(markdown.length / 4);
}

/**
 * @param {string} siteUrl
 */
export function buildDnsAidZoneExample(siteUrl) {
  const hostname = new URL(siteUrl).hostname;
  return `; DNS for AI Discovery (DNS-AID) example for ${hostname}
; Publish these records in your public DNS zone and sign with DNSSEC.
; See: https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/

_index._agents.${hostname}. 3600 IN SVCB 1 ${hostname}. \\
  alpn="h3,h2" port=443 mandatory=alpn,port \\
  key65328="${siteUrl}/.well-known/api-catalog"

_a2a._agents.${hostname}. 3600 IN SVCB 1 ${hostname}. \\
  alpn="h3,h2" port=443 mandatory=alpn,port \\
  key65328="${siteUrl}/llms.txt"

; ARD / AI Catalog discovery (optional DNS pointer)
_catalog._agents.${hostname}. 3600 IN TXT "url=${siteUrl}/.well-known/ai-catalog.json"
`;
}
