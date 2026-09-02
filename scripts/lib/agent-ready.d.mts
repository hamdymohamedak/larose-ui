export interface SitemapEntry {
  path: string;
  title: string;
  changefreq?: string;
  priority?: string;
}

export interface DocsCatalog {
  guides: { id: string; title: string }[];
  packages: { id: string; name: string; tagline?: string }[];
  components: { id: string; name: string; category?: string }[];
}

export interface LinksetLink {
  href: string;
  type: string;
}

export interface ApiCatalogLinksetEntry {
  anchor: string;
  'service-desc'?: LinksetLink[];
  'service-doc'?: LinksetLink[];
  status?: LinksetLink[];
  'service-meta'?: LinksetLink[];
}

export interface AgentAuthMetadata {
  skill: string;
  register_uri: string;
  identity_endpoint: string;
  claim_uri: string;
  revocation_uri: string;
  identity_types_supported: string[];
  identity_assertion: {
    assertion_types_supported: string[];
  };
  anonymous: {
    credential_types_supported: string[];
    claim_uri: string;
  };
  events_supported?: string[];
}

export interface OAuthAuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  resource?: string;
  authorization_servers?: string[];
  scopes_supported: string[];
  bearer_methods_supported?: string[];
  response_types_supported: string[];
  grant_types_supported: string[];
  subject_types_supported?: string[];
  id_token_signing_alg_values_supported?: string[];
  agent_auth?: AgentAuthMetadata;
  revocation_endpoint?: string;
}

export interface McpServerCard {
  name: string;
  serverInfo: {
    name: string;
    version: string;
  };
  transport: {
    type: string;
    endpoint: string;
  };
  capabilities: {
    tools: boolean;
    resources: boolean;
    prompts: boolean;
  };
  remotes?: Array<{ url: string }>;
}

export interface AgentSkillEntry {
  name: string;
  type: 'skill-md';
  description: string;
  url: string;
  digest: string;
}

export interface AiCatalogEntry {
  identifier: string;
  displayName: string;
  type: string;
  url: string;
  data?: unknown;
  representativeQueries?: string[];
}

export interface AiCatalog {
  specVersion: string;
  host: {
    displayName: string;
    identifier: string;
  };
  entries: AiCatalogEntry[];
}

export const AI_CRAWLERS: readonly string[];
export const CONTENT_SIGNAL: string;
export const API_CATALOG_CONTENT_TYPE: string;
export const MCP_SERVER_CARD_SCHEMA_URL: string;
export const AGENT_SKILLS_DISCOVERY_SCHEMA: string;

export function normalizeBasePath(basePath: string): string;
export function toCanonicalUrl(siteUrl: string, basePath: string, pathname: string): string;
export function buildDocsSitemapEntries(catalog: DocsCatalog): SitemapEntry[];
export function buildSitemapXml(siteUrl: string, basePath: string, entries: SitemapEntry[]): string;
export function buildRobotsTxt(siteUrl: string, basePath: string): string;
export function airHostname(siteUrl: string): string;
export function airIdentifier(siteUrl: string, namespace: string, name: string): string;
export function buildAiCatalog(siteUrl: string, basePath: string): AiCatalog;
export function buildApiCatalogLinkset(
  siteUrl: string,
  basePath: string,
): { linkset: ApiCatalogLinksetEntry[] };
export function buildComponentMetadataOpenApi(
  siteUrl: string,
  components: { id: string; name: string }[],
): string;
export function buildDocumentationOpenApi(siteUrl: string): string;
export function buildPackagesOpenApi(
  siteUrl: string,
  packages: { id: string; name: string }[],
): string;
export function buildHealthCheck(siteUrl: string): { status: string; timestamp: string };
export function buildMcpServerCard(
  siteUrl: string,
  basePath: string,
  version?: string,
): McpServerCard;
export function sha256Digest(data: string | Buffer): string;
export function parseSkillFrontmatter(content: string): {
  name: string | undefined;
  description: string | undefined;
};
export function collectAgentSkillEntries(agentSkillsDir: string): AgentSkillEntry[];
export function buildAgentSkillsIndex(
  siteUrl: string,
  basePath: string,
  skills: AgentSkillEntry[],
): { $schema: string; skills: AgentSkillEntry[] };
export function buildAgentAuth(siteUrl: string, basePath: string): AgentAuthMetadata;
export function buildOAuthProtectedResource(
  siteUrl: string,
  basePath: string,
): OAuthAuthorizationServerMetadata;
export function buildAuthMd(siteUrl: string, basePath: string): string;
export function buildOpenIdConfiguration(
  siteUrl: string,
  basePath: string,
): OAuthAuthorizationServerMetadata;
export function buildOAuthAuthorizationServer(
  siteUrl: string,
  basePath: string,
): OAuthAuthorizationServerMetadata;
export function buildJwks(): { keys: unknown[] };
export function buildLinkHeaderValue(siteUrl: string, basePath: string): string;
export function buildCloudflareHeaders(siteUrl: string, basePath: string): string;
export function buildPageMarkdownMap(input: Record<string, unknown>): Map<string, string>;
export function estimateMarkdownTokens(markdown: string): number;
export function buildDnsAidZoneExample(siteUrl: string): string;
