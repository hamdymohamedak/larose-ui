/**
 * Cloudflare Pages middleware for agent-ready behaviors:
 * - RFC 8288 Link headers on the homepage
 * - Markdown for Agents (Accept: text/markdown)
 * - Correct MIME types for extensionless well-known files
 *
 * GitHub Pages ignores this file; deploy to Cloudflare Pages (or proxy) for full score.
 */

const API_CATALOG_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

const CONTENT_TYPES = new Map([
  ['/robots.txt', 'text/plain; charset=utf-8'],
  ['/sitemap.xml', 'application/xml; charset=utf-8'],
  ['/llms.txt', 'text/plain; charset=utf-8'],
  ['/.well-known/api-catalog', API_CATALOG_TYPE],
  ['/.well-known/api-catalog.json', API_CATALOG_TYPE],
  ['/.well-known/health', 'application/json; charset=utf-8'],
  ['/.well-known/ai-catalog.json', 'application/json; charset=utf-8'],
  ['/.well-known/mcp/server-card.json', 'application/json; charset=utf-8'],
  ['/.well-known/agent-skills/index.json', 'application/json; charset=utf-8'],
  ['/.well-known/openid-configuration', 'application/json; charset=utf-8'],
  ['/.well-known/oauth-authorization-server', 'application/json; charset=utf-8'],
  ['/.well-known/oauth-protected-resource', 'application/json; charset=utf-8'],
  ['/.well-known/jwks.json', 'application/json; charset=utf-8'],
  ['/auth.md', 'text/markdown; charset=utf-8'],
]);

function normalizeBasePath(basePath) {
  if (!basePath || basePath === '/') return '';
  return `/${String(basePath).replace(/^\/+|\/+$/g, '')}`;
}

function stripBasePath(pathname, basePath) {
  const prefix = normalizeBasePath(basePath);
  if (!prefix) return pathname || '/';
  if (pathname === prefix || pathname === `${prefix}/`) return '/';
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || '/';
  return pathname;
}

function acceptQuality(accept, mediaType) {
  for (const part of accept.split(',').map((value) => value.trim())) {
    const [type, ...params] = part.split(';').map((value) => value.trim());
    if (type === mediaType) {
      const qParam = params.find((param) => param.startsWith('q='));
      return qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    }
  }
  return 0;
}

function prefersMarkdown(accept) {
  if (!accept.includes('text/markdown') && !accept.includes('text/x-markdown')) return false;
  if (!accept.includes('text/html')) return true;
  return acceptQuality(accept, 'text/markdown') >= acceptQuality(accept, 'text/html');
}

function markdownAssetPath(pathname, basePath) {
  const prefix = normalizeBasePath(basePath);
  const fileName = pathname === '/' ? 'index' : pathname.replace(/^\//, '').replace(/\//g, '__');
  return `${prefix}/agent/markdown/${fileName}.md`;
}

function estimateTokens(markdown) {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

function buildLinkHeader(origin, basePath) {
  const prefix = normalizeBasePath(basePath);
  const abs = (pathname) => `${origin}${prefix}${pathname}`;
  return [
    `<${abs('/llms.txt')}>; rel="describedby"; type="text/plain"`,
    `<${abs('/.well-known/ai-catalog.json')}>; rel="ai-catalog"; type="application/json"`,
    `<${abs('/.well-known/api-catalog')}>; rel="api-catalog"; type="application/linkset+json"`,
    `<${abs('/.well-known/openapi/documentation.yaml')}>; rel="service-desc"; type="application/yaml"`,
    `<${abs('/docs/getting-started')}>; rel="service-doc"; type="text/html"`,
    `<${abs('/sitemap.xml')}>; rel="sitemap"; type="application/xml"`,
    `<${abs('/.well-known/mcp/server-card.json')}>; rel="mcp-server-card"; type="application/json"`,
    `<${abs('/.well-known/agent-skills/index.json')}>; rel="agent-skills"; type="application/json"`,
  ].join(', ');
}

function withHeaders(response, mutate) {
  const headers = new Headers(response.headers);
  mutate(headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const basePath = env.BASE_PATH || env.VITE_BASE_PATH || '';
  const pathname = stripBasePath(url.pathname, basePath);
  const accept = request.headers.get('Accept') || '';

  if (prefersMarkdown(accept)) {
    const assetPath = markdownAssetPath(pathname, basePath);
    const markdownUrl = new URL(assetPath, url.origin);
    const markdownResponse = await env.ASSETS.fetch(markdownUrl);
    if (markdownResponse.ok) {
      const markdown = await markdownResponse.text();
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'x-markdown-tokens': String(estimateTokens(markdown)),
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  const response = await next();
  const contentType = CONTENT_TYPES.get(pathname);
  const isHome = pathname === '/' || pathname === '/index.html';

  if (!contentType && !isHome) {
    if (pathname.startsWith('/.well-known/openapi/') && pathname.endsWith('.yaml')) {
      return withHeaders(response, (headers) => {
        headers.set('Content-Type', 'application/yaml; charset=utf-8');
      });
    }
    if (pathname.startsWith('/.well-known/agent-skills/') && pathname.endsWith('/SKILL.md')) {
      return withHeaders(response, (headers) => {
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Access-Control-Allow-Origin', '*');
      });
    }
    if (pathname.startsWith('/agent/markdown/') && pathname.endsWith('.md')) {
      return withHeaders(response, (headers) => {
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Access-Control-Allow-Origin', '*');
      });
    }
    return response;
  }

  return withHeaders(response, (headers) => {
    if (contentType) headers.set('Content-Type', contentType);
    if (pathname === '/.well-known/api-catalog' || pathname === '/.well-known/api-catalog.json') {
      headers.set('Access-Control-Allow-Origin', '*');
    }
    if (isHome && response.ok) {
      headers.set('Link', buildLinkHeader(url.origin, basePath));
    }
  });
}
