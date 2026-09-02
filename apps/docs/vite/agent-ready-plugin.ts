import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Connect } from 'vite';
import type { Plugin, PreviewServer, ViteDevServer } from 'vite';
import { buildLinkHeaderValue, estimateMarkdownTokens, API_CATALOG_CONTENT_TYPE } from '../../../scripts/lib/agent-ready.mjs';

interface AgentReadyPluginOptions {
  rootDir: string;
  basePath: string;
  siteUrl: string;
}

function normalizeBasePath(basePath: string): string {
  if (!basePath || basePath === '/') return '';
  return `/${basePath.replace(/^\/+|\/+$/g, '')}`;
}

function stripBasePath(pathname: string, basePath: string): string {
  const prefix = normalizeBasePath(basePath);
  if (!prefix) return pathname || '/';
  if (pathname === prefix || pathname === `${prefix}/`) return '/';
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || '/';
  return pathname;
}

function acceptsMarkdown(req: IncomingMessage): boolean {
  const accept = req.headers.accept ?? '';
  return accept.includes('text/markdown') || accept.includes('text/x-markdown');
}

function acceptQuality(accept: string, mediaType: string): number {
  const parts = accept.split(',').map((part) => part.trim());
  for (const part of parts) {
    const [type, ...params] = part.split(';').map((value) => value.trim());
    if (type === mediaType) {
      const qParam = params.find((param) => param.startsWith('q='));
      return qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    }
  }
  return 0;
}

function prefersMarkdown(req: IncomingMessage): boolean {
  const accept = req.headers.accept ?? '';
  if (!acceptsMarkdown(req)) return false;
  if (!accept.includes('text/html')) return true;
  return acceptQuality(accept, 'text/markdown') >= acceptQuality(accept, 'text/html');
}

function loadMarkdownPages(rootDir: string): Map<string, string> {
  const routesPath = join(rootDir, 'public', 'agent', 'routes.json');
  const markdownDir = join(rootDir, 'public', 'agent', 'markdown');
  const routes = JSON.parse(readFileSync(routesPath, 'utf8')) as { pages: string[] };
  const pages = new Map<string, string>();

  for (const pathname of routes.pages) {
    const fileName = pathname === '/' ? 'index' : pathname.replace(/^\//, '').replace(/\//g, '__');
    pages.set(pathname, readFileSync(join(markdownDir, `${fileName}.md`), 'utf8'));
  }

  return pages;
}

function sendMarkdown(res: ServerResponse, markdown: string) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('x-markdown-tokens', String(estimateMarkdownTokens(markdown)));
  res.end(markdown);
}

function withHomepageLinkHeader(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
  linkHeader: string,
  next: Connect.NextFunction,
) {
  const isHomepage = pathname === '/' || pathname === '/index.html';
  if (!isHomepage) {
    next();
    return;
  }

  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = ((statusCode: number, ...args: unknown[]) => {
    if (!res.getHeader('Link')) {
      res.setHeader('Link', linkHeader);
    }
    return originalWriteHead(statusCode, ...(args as Parameters<typeof originalWriteHead> extends [number, ...infer R] ? R : never));
  }) as typeof res.writeHead;
  next();
}

function createAgentReadyMiddleware(
  options: AgentReadyPluginOptions,
  markdownPages: Map<string, string>,
): Connect.NextHandleFunction {
  const linkHeader = buildLinkHeaderValue(options.siteUrl, options.basePath);
  const publicDir = join(options.rootDir, 'public');

  return (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const pathname = stripBasePath(url.pathname, options.basePath);

    if (pathname === '/robots.txt') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(readFileSync(join(publicDir, 'robots.txt'), 'utf8'));
      return;
    }

    if (pathname === '/sitemap.xml') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.end(readFileSync(join(publicDir, 'sitemap.xml'), 'utf8'));
      return;
    }

    if (pathname === '/.well-known/api-catalog') {
      res.statusCode = 200;
      res.setHeader('Content-Type', API_CATALOG_CONTENT_TYPE);
      res.end(readFileSync(join(publicDir, '.well-known', 'api-catalog'), 'utf8'));
      return;
    }

    if (pathname === '/.well-known/health') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(readFileSync(join(publicDir, '.well-known', 'health'), 'utf8'));
      return;
    }

    if (
      pathname === '/.well-known/openid-configuration' ||
      pathname === '/.well-known/oauth-authorization-server' ||
      pathname === '/.well-known/oauth-protected-resource' ||
      pathname === '/.well-known/jwks.json'
    ) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(readFileSync(join(publicDir, pathname.slice(1)), 'utf8'));
      return;
    }

    if (pathname === '/auth.md') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.end(readFileSync(join(publicDir, 'auth.md'), 'utf8'));
      return;
    }

    if (pathname === '/.well-known/mcp/server-card.json') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-None-Match');
      res.setHeader('Access-Control-Expose-Headers', 'ETag');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.end(readFileSync(join(publicDir, '.well-known', 'mcp', 'server-card.json'), 'utf8'));
      return;
    }

    if (pathname === '/.well-known/agent-skills/index.json') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.end(readFileSync(join(publicDir, '.well-known', 'agent-skills', 'index.json'), 'utf8'));
      return;
    }

    if (pathname === '/.well-known/ai-catalog.json') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.end(readFileSync(join(publicDir, '.well-known', 'ai-catalog.json'), 'utf8'));
      return;
    }

    if (pathname.startsWith('/.well-known/agent-skills/') && pathname.endsWith('/SKILL.md')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(readFileSync(join(publicDir, pathname.slice(1)), 'utf8'));
      return;
    }

    if (pathname.startsWith('/.well-known/openapi/') && pathname.endsWith('.yaml')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/yaml; charset=utf-8');
      res.end(readFileSync(join(publicDir, pathname.slice(1)), 'utf8'));
      return;
    }

    if (prefersMarkdown(req)) {
      const markdown = markdownPages.get(pathname === '/index.html' ? '/' : pathname);
      if (markdown) {
        sendMarkdown(res, markdown);
        return;
      }
    }

    withHomepageLinkHeader(req, res, pathname, linkHeader, next);
  };
}

function useAgentReadyMiddleware(
  server: Pick<ViteDevServer, 'middlewares'>,
  options: AgentReadyPluginOptions,
  markdownPages: Map<string, string>,
) {
  server.middlewares.use(createAgentReadyMiddleware(options, markdownPages));
}

export function agentReadyPlugin(options: AgentReadyPluginOptions): Plugin {
  let markdownPages = new Map<string, string>();

  return {
    name: 'larose-docs-agent-ready',
    configureServer(server) {
      try {
        markdownPages = loadMarkdownPages(options.rootDir);
      } catch {
        markdownPages = new Map();
      }
      useAgentReadyMiddleware(server, options, markdownPages);
    },
    configurePreviewServer(server: PreviewServer) {
      try {
        markdownPages = loadMarkdownPages(options.rootDir);
      } catch {
        markdownPages = new Map();
      }
      useAgentReadyMiddleware(server, options, markdownPages);
    },
  };
}
