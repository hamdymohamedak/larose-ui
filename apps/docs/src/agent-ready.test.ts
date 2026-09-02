import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  AGENT_SKILLS_DISCOVERY_SCHEMA,
  AI_CRAWLERS,
  API_CATALOG_CONTENT_TYPE,
  CONTENT_SIGNAL,
  buildAgentAuth,
  buildAgentSkillsIndex,
  buildAiCatalog,
  buildApiCatalogLinkset,
  buildAuthMd,
  buildDocsSitemapEntries,
  buildJwks,
  buildLinkHeaderValue,
  buildMcpServerCard,
  buildOAuthAuthorizationServer,
  buildOAuthProtectedResource,
  buildOpenIdConfiguration,
  buildRobotsTxt,
  buildSitemapXml,
  collectAgentSkillEntries,
  estimateMarkdownTokens,
  parseSkillFrontmatter,
  sha256Digest,
} from '../../../scripts/lib/agent-ready.mjs';

const publicDir = join(import.meta.dirname, '..', 'public');
const siteUrl = 'https://example.com/docs';
const basePath = '/docs/';

describe('agent-ready generated files', () => {
  it('writes robots.txt with AI crawlers, content signals, and sitemap reference', () => {
    const robots = readFileSync(join(publicDir, 'robots.txt'), 'utf8');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain(`Content-Signal: ${CONTENT_SIGNAL}`);
    expect(robots).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
    expect(robots).toMatch(/Agentmap: https?:\/\/\S+\/\.well-known\/ai-catalog\.json/);
    for (const agent of AI_CRAWLERS) {
      expect(robots).toContain(`User-agent: ${agent}`);
    }
    expect(robots).toContain('Disallow: /larose-ui/docs/playground');
  });

  it('writes a valid sitemap.xml with canonical URLs', () => {
    const sitemap = readFileSync(join(publicDir, 'sitemap.xml'), 'utf8');
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain('/docs/getting-started</loc>');
    expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+<\/loc>/);
  });

  it('writes ARD ai-catalog manifest with specVersion, host, and entries', () => {
    const catalog = JSON.parse(readFileSync(join(publicDir, '.well-known', 'ai-catalog.json'), 'utf8'));
    expect(catalog.specVersion).toBe('1.0');
    expect(catalog.host.displayName).toBeTruthy();
    expect(catalog.host.identifier).toMatch(/^did:web:/);
    expect(catalog.entries.length).toBeGreaterThanOrEqual(5);

    for (const entry of catalog.entries) {
      expect(entry.identifier).toMatch(/^urn:air:[^:]+:[^:]+:[^:]+$/);
      expect(entry.displayName).toBeTruthy();
      expect(entry.type).toBeTruthy();
      expect(entry.url).toMatch(/^https?:\/\//);
      expect(entry.representativeQueries?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('writes RFC 9727 api-catalog linkset and supporting well-known files', () => {
    expect(existsSync(join(publicDir, '.well-known', 'api-catalog'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'health'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'openid-configuration'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'oauth-authorization-server'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'oauth-protected-resource'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'jwks.json'))).toBe(true);
    expect(existsSync(join(publicDir, 'auth.md'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'mcp', 'server-card.json'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'agent-skills', 'index.json'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'ai-catalog.json'))).toBe(true);
    expect(existsSync(join(publicDir, '.well-known', 'agent-skills', 'larose-ui-docs', 'SKILL.md'))).toBe(
      true,
    );
    expect(existsSync(join(publicDir, '.well-known', 'openapi', 'component-metadata.yaml'))).toBe(true);
    expect(existsSync(join(publicDir, 'agent', 'routes.json'))).toBe(true);
    expect(existsSync(join(publicDir, 'agent', 'markdown', 'index.md'))).toBe(true);
    expect(existsSync(join(publicDir, 'dns-aid.zone.example'))).toBe(true);

    const catalog = JSON.parse(readFileSync(join(publicDir, '.well-known', 'api-catalog'), 'utf8'));
    expect(Array.isArray(catalog.linkset)).toBe(true);
    expect(catalog.linkset.length).toBeGreaterThan(0);
    for (const entry of catalog.linkset) {
      expect(entry.anchor).toMatch(/^https?:\/\//);
      expect(entry['service-desc']?.[0]?.href).toMatch(/^https?:\/\//);
      expect(entry['service-doc']?.[0]?.href).toMatch(/^https?:\/\//);
      expect(entry.status?.[0]?.href).toMatch(/^https?:\/\//);
    }
  });

  it('ships Cloudflare _headers for Link response headers and api-catalog content type', () => {
    const headers = readFileSync(join(publicDir, '_headers'), 'utf8');
    expect(headers).toContain('Link:');
    expect(headers).toContain('rel="api-catalog"');
    expect(headers).toContain('/.well-known/ai-catalog.json');
    expect(headers).toContain('Content-Type: text/plain; charset=utf-8');
    expect(headers).toContain('Content-Type: application/json; charset=utf-8');
    expect(headers).toContain('application/linkset+json');
    expect(headers).toContain('/.well-known/agent-skills/index.json');
    expect(headers).toContain('Access-Control-Allow-Origin: *');
  });
});

describe('agent-ready builders', () => {
  const catalog = {
    guides: [{ id: 'vue', title: 'Vue 3' }],
    packages: [{ id: 'react', name: '@larose-ui/react', tagline: 'React components' }],
    components: [{ id: 'button', name: 'Button', category: 'Actions' }],
  };

  it('builds sitemap entries for static and dynamic routes', () => {
    const entries = buildDocsSitemapEntries(catalog);
    expect(entries.some((entry) => entry.path === '/')).toBe(true);
    expect(entries.some((entry) => entry.path === '/docs/guides/vue')).toBe(true);
    expect(entries.some((entry) => entry.path === '/docs/components/button')).toBe(true);
  });

  it('builds link header value with registered relation types', () => {
    const link = buildLinkHeaderValue(siteUrl, basePath);
    expect(link).toContain('rel="describedby"');
    expect(link).toContain('rel="ai-catalog"');
    expect(link).toContain('rel="api-catalog"');
    expect(link).toContain('rel="sitemap"');
    expect(link).toContain('rel="service-doc"');
    expect(link).toContain('/.well-known/api-catalog');
  });

  it('builds RFC 9727 api catalog linkset entries', () => {
    const linkset = buildApiCatalogLinkset(siteUrl, basePath);
    expect(linkset.linkset).toHaveLength(3);
    const components = linkset.linkset.find((entry) => entry.anchor.endsWith('/api/v1/components'));
    expect(components?.['service-desc']?.[0]?.type).toBe('application/yaml');
    expect(components?.['service-doc']?.[0]?.type).toBe('text/html');
    expect(components?.status?.[0]?.type).toBe('application/json');
    expect(components?.['service-meta']?.[0]?.href).toContain('/.well-known/openid-configuration');
    expect(API_CATALOG_CONTENT_TYPE).toContain('application/linkset+json');
  });

  it('builds OAuth and OIDC discovery metadata with required fields', () => {
    const oidc = buildOpenIdConfiguration(siteUrl, basePath);
    const oauth = buildOAuthAuthorizationServer(siteUrl, basePath);
    const prm = buildOAuthProtectedResource(siteUrl, basePath);
    const jwks = buildJwks();

    for (const metadata of [oidc, oauth]) {
      expect(metadata.issuer).toBe('https://example.com/docs');
      expect(metadata.authorization_endpoint).toContain('/oauth/authorize');
      expect(metadata.token_endpoint).toContain('/oauth/token');
      expect(metadata.jwks_uri).toContain('/.well-known/jwks.json');
      expect(metadata.grant_types_supported).toContain('authorization_code');
      expect(metadata.response_types_supported).toContain('code');
    }

    expect(prm.resource).toBe('https://example.com/docs/');
    expect(prm.authorization_servers).toEqual(['https://example.com/docs']);
    expect(prm.scopes_supported).toContain('docs:read');
    expect(prm.bearer_methods_supported).toContain('header');

    expect(oauth.agent_auth?.register_uri).toContain('/.well-known/oauth/register');
    expect(oauth.agent_auth?.identity_types_supported).toContain('identity_assertion');
    expect(oauth.agent_auth?.identity_assertion?.assertion_types_supported).toContain(
      'urn:ietf:params:oauth:token-type:id-jag',
    );
    expect(oauth.agent_auth?.anonymous?.credential_types_supported).toContain('access_token');
    expect(oauth.agent_auth?.claim_uri).toContain('/agent/identity/claim');
    expect(oauth.agent_auth?.revocation_uri).toContain('/oauth/revoke');

    expect(oidc.subject_types_supported).toContain('public');
    expect(oidc.id_token_signing_alg_values_supported).toContain('RS256');
    expect(Array.isArray(jwks.keys)).toBe(true);
  });

  it('builds auth.md with required heading and discovery instructions', () => {
    const authMd = buildAuthMd(siteUrl, basePath);
    const agentAuth = buildAgentAuth(siteUrl, basePath);

    expect(authMd).toMatch(/^# auth\.md/m);
    expect(authMd).toContain('/.well-known/oauth-protected-resource');
    expect(authMd).toContain('/.well-known/oauth-authorization-server');
    expect(authMd).toContain('identity_assertion');
    expect(authMd).toContain('anonymous');
    expect(agentAuth.skill).toBe('https://example.com/docs/auth.md');
  });

  it('builds MCP server card with serverInfo, transport, and capabilities', () => {
    const card = buildMcpServerCard(siteUrl, basePath, '1.2.3');

    expect(card.serverInfo).toEqual({
      name: 'laRose UI Documentation MCP',
      version: '1.2.3',
    });
    expect(card.transport.type).toBe('streamable-http');
    expect(card.transport.endpoint).toBe('https://example.com/docs/mcp');
    expect(card.capabilities).toEqual({
      tools: true,
      resources: true,
      prompts: true,
    });
    expect(card.remotes?.[0]?.url).toBe(card.transport.endpoint);
    expect(card.name).toBe('io.github.hamdymohamedak/larose-ui-docs');
  });

  it('builds agent skills discovery index with schema, digests, and absolute urls', () => {
    const skillContent = `---
name: demo-skill
description: Demo skill for tests.
---

# Demo
`;
    const digest = sha256Digest(skillContent);
    const index = buildAgentSkillsIndex(siteUrl, basePath, [
      {
        name: 'demo-skill',
        type: 'skill-md',
        description: 'Demo skill for tests.',
        url: '/.well-known/agent-skills/demo-skill/SKILL.md',
        digest,
      },
    ]);

    expect(index.$schema).toBe(AGENT_SKILLS_DISCOVERY_SCHEMA);
    expect(index.skills).toHaveLength(1);
    expect(index.skills[0]).toEqual({
      name: 'demo-skill',
      type: 'skill-md',
      description: 'Demo skill for tests.',
      url: 'https://example.com/docs/.well-known/agent-skills/demo-skill/SKILL.md',
      digest,
    });
    expect(digest).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('parses skill frontmatter and collects entries from the skills directory', () => {
    const parsed = parseSkillFrontmatter(`---
name: larose-ui-docs
description: Docs skill.
---
`);
    expect(parsed.name).toBe('larose-ui-docs');
    expect(parsed.description).toBe('Docs skill.');

    const skills = collectAgentSkillEntries(join(publicDir, '.well-known', 'agent-skills'));
    expect(skills.length).toBeGreaterThanOrEqual(3);
    expect(skills.some((skill) => skill.name === 'larose-ui-components')).toBe(true);
    for (const skill of skills) {
      expect(skill.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
    }
  });

  it('estimates markdown token counts', () => {
    expect(estimateMarkdownTokens('abcd')).toBe(1);
    expect(estimateMarkdownTokens('a'.repeat(40))).toBe(10);
  });

  it('builds ARD ai-catalog manifest with urn identifiers and representative queries', () => {
    const catalog = buildAiCatalog(siteUrl, basePath);
    expect(catalog.specVersion).toBe('1.0');
    expect(catalog.host.displayName).toBe('laRose UI Documentation');
    expect(catalog.host.identifier).toBe('did:web:example.com');
    expect(catalog.entries.length).toBeGreaterThanOrEqual(5);

    for (const entry of catalog.entries) {
      expect(entry.identifier).toMatch(/^urn:air:example\.com:[^:]+:[^:]+$/);
      expect(entry.displayName).toBeTruthy();
      expect(entry.type).toBeTruthy();
      expect(entry.url).toMatch(/^https:\/\/example\.com\/docs\//);
      expect(entry.data).toBeUndefined();
      expect(entry.representativeQueries?.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries?.length).toBeLessThanOrEqual(5);
    }

    const mcp = catalog.entries.find((entry) => entry.identifier.endsWith(':mcp:larose-ui-docs'));
    expect(mcp?.type).toBe('application/mcp-server-card+json');
  });

  it('generates robots and sitemap for github pages base path', () => {
    const ghSiteUrl = 'https://hamdymohamedak.github.io/larose-ui';
    const ghBase = '/larose-ui/';
    const robots = buildRobotsTxt(ghSiteUrl, ghBase);
    const sitemap = buildSitemapXml(ghSiteUrl, ghBase, buildDocsSitemapEntries(catalog));
    expect(robots).toContain('Sitemap: https://hamdymohamedak.github.io/larose-ui/sitemap.xml');
    expect(robots).toContain(
      'Agentmap: https://hamdymohamedak.github.io/larose-ui/.well-known/ai-catalog.json',
    );
    expect(sitemap).toContain('<loc>https://hamdymohamedak.github.io/larose-ui/docs/components/button</loc>');
  });
});
