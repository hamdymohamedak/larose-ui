import { docsComponents, docsPackages } from '@/data/catalog.generated';
import { searchDocs } from '@/components/CommandSearch';
import type { ModelContextTool, ToolExecuteCallbackOptions } from '@/webmcp/model-context';

function docsBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

function resolveDocsUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = docsBasePath();
  return base ? `${base}${normalized}` : normalized || '/';
}

export function navigateDocsPath(path: string): { path: string; url: string } {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = resolveDocsUrl(normalized);
  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
  return { path: normalized, url };
}

export async function fetchComponentMetadata(
  componentId: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetch(`${resolveDocsUrl(`/components/${componentId}.json`)}`, { signal });
  if (!response.ok) {
    throw new Error(`Component metadata not found for "${componentId}" (${response.status})`);
  }
  return response.json();
}

function readString(input: Record<string, unknown>, key: string): string | undefined {
  const value = input[key];
  return typeof value === 'string' ? value : undefined;
}

function readNumber(input: Record<string, unknown>, key: string, fallback: number): number {
  const value = input[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function executeSearchDocs(input: Record<string, unknown>) {
  const query = readString(input, 'query');
  if (!query) {
    throw new Error('query is required');
  }
  const limit = Math.min(50, Math.max(1, readNumber(input, 'limit', 10)));
  return {
    query,
    results: searchDocs(query, limit).map((entry) => ({
      title: entry.title,
      type: entry.type,
      path: entry.path,
      excerpt: entry.excerpt,
    })),
  };
}

export function executeListPackages() {
  return {
    packages: docsPackages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      tagline: pkg.tagline,
      path: `/docs/packages/${pkg.id}`,
    })),
  };
}

export function executeListComponents(input: Record<string, unknown>) {
  const category = readString(input, 'category');
  const components = category
    ? docsComponents.filter((component) => component.category === category)
    : docsComponents;

  return {
    category: category ?? null,
    components: components.map((component) => ({
      id: component.id,
      name: component.name,
      category: component.category,
      path: `/docs/components/${component.id}`,
      metadataUrl: `/components/${component.id}.json`,
    })),
  };
}

export function executeGetCurrentPage() {
  const base = docsBasePath();
  const pathname = window.location.pathname;
  const path =
    base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname || '/';

  return {
    path,
    url: window.location.href,
    title: document.title,
  };
}

async function withAbort<T>(
  run: (signal: AbortSignal) => Promise<T>,
  options: ToolExecuteCallbackOptions,
): Promise<T> {
  if (options.signal.aborted) {
    throw options.signal.reason ?? new DOMException('Aborted', 'AbortError');
  }
  return run(options.signal);
}

export function createDocsWebMcpTools(): ModelContextTool[] {
  return [
    {
      name: 'search_docs',
      title: 'Search documentation',
      description:
        'Search laRose UI documentation for components, packages, guides, props, and pages.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search terms, e.g. "Button variant" or "vue provider".',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            description: 'Maximum number of results to return.',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input) => executeSearchDocs(input),
    },
    {
      name: 'navigate_docs',
      title: 'Navigate documentation',
      description: 'Navigate the docs site to a route path such as /docs/components/button.',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Docs route path starting with /, e.g. /docs/getting-started.',
          },
        },
        required: ['path'],
        additionalProperties: false,
      },
      execute: (input) => {
        const path = readString(input, 'path');
        if (!path) {
          throw new Error('path is required');
        }
        return navigateDocsPath(path);
      },
    },
    {
      name: 'get_component_metadata',
      title: 'Get component metadata',
      description:
        'Fetch machine-readable JSON metadata for a laRose UI component by slug (e.g. button).',
      inputSchema: {
        type: 'object',
        properties: {
          componentId: {
            type: 'string',
            description: 'Component slug, e.g. button or date-picker.',
          },
        },
        required: ['componentId'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input, options) =>
        withAbort((signal) => {
          const componentId = readString(input, 'componentId');
          if (!componentId) {
            throw new Error('componentId is required');
          }
          return fetchComponentMetadata(componentId, signal);
        }, options),
    },
    {
      name: 'list_packages',
      title: 'List packages',
      description: 'List all @larose-ui packages documented on the site.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => executeListPackages(),
    },
    {
      name: 'list_components',
      title: 'List components',
      description: 'List laRose UI components, optionally filtered by category.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Optional category filter, e.g. Forms or Actions.',
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input) => executeListComponents(input),
    },
    {
      name: 'get_current_page',
      title: 'Get current page',
      description: 'Return the current docs route path, URL, and document title.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => executeGetCurrentPage(),
    },
  ];
}
