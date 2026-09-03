import {
  docsComponentCategories,
  docsComponents,
  docsGuides,
  docsPackages,
} from '@/data/catalog.generated';

export interface DocsNavItem {
  label: string;
  path: string;
}

export interface DocsNavSection {
  label: string;
  items: DocsNavItem[];
  collapsible?: boolean;
}

// Framework guides that are hand-crafted — deduplicated from the catalog list
const BUILTIN_GUIDE_IDS = new Set(['vue', 'svelte', 'nextjs', 'nuxt']);

export const docsNavigation: DocsNavSection[] = [
  // ── 1. Start here — visible, short, welcoming ──
  {
    label: 'Start here',
    items: [
      { label: 'Overview', path: '/' },
      { label: 'Getting started', path: '/docs/getting-started' },
    ],
  },

  // ── 2. Guides — frameworks + any catalog guides merged ──
  {
    label: 'Guides',
    items: [
      { label: 'React', path: '/docs/getting-started' },
      { label: 'Vue 3', path: '/docs/guides/vue' },
      { label: 'Svelte 5', path: '/docs/guides/svelte' },
      { label: 'Next.js', path: '/docs/guides/nextjs' },
      { label: 'Nuxt', path: '/docs/guides/nuxt' },
      ...docsGuides
        .filter((g) => !BUILTIN_GUIDE_IDS.has(g.id))
        .map((guide) => ({ label: guide.title, path: `/docs/guides/${guide.id}` })),
    ],
  },

  // ── 3. Design system ──
  {
    label: 'Design system',
    items: [
      { label: 'Theme builder', path: '/docs/design/theme-builder' },
      { label: 'Design tokens', path: '/docs/design/tokens' },
      { label: 'Motion', path: '/docs/design/motion' },
    ],
  },

  // ── 4. Components — collapsed, big list ──
  {
    label: 'Components',
    items: [
      { label: 'All components', path: '/docs/components' },
      ...docsComponentCategories.flatMap((category) =>
        docsComponents
          .filter((entry) => entry.category === category)
          .map((item) => ({ label: item.name, path: `/docs/components/${item.id}` })),
      ),
    ],
    collapsible: true,
  },

  // ── 5. Reference — collapsed, for advanced / infrequent use ──
  {
    label: 'Reference',
    items: [
      { label: 'All packages', path: '/docs/packages' },
      ...docsPackages.map((pkg) => ({
        label: pkg.name.replace('@larose-ui/', ''),
        path: `/docs/packages/${pkg.id}`,
      })),
      { label: 'Architecture', path: '/docs/architecture' },
      { label: 'Accessibility', path: '/docs/accessibility' },
      { label: 'Playground', path: '/docs/playground' },
      { label: 'Migration', path: '/docs/migration' },
      { label: 'Changelog', path: '/changelog' },
    ],
    collapsible: true,
  },
];

const titleByPath = new Map<string, string>();
for (const section of docsNavigation) {
  for (const item of section.items) {
    titleByPath.set(item.path, item.label);
  }
}

export function findDocsPageTitle(pathname: string): string {
  if (titleByPath.has(pathname)) {
    return titleByPath.get(pathname)!;
  }

  const packageMatch = pathname.match(/^\/docs\/packages\/([^/]+)$/);
  if (packageMatch?.[1]) {
    return `@larose-ui/${packageMatch[1]}`;
  }

  const componentMatch = pathname.match(/^\/docs\/components\/([^/]+)$/);
  if (componentMatch?.[1]) {
    const component = docsComponents.find((entry) => entry.id === componentMatch[1]);
    return component?.name ?? 'Component';
  }

  const guideMatch = pathname.match(/^\/docs\/guides\/([^/]+)$/);
  if (guideMatch?.[1]) {
    const guide = docsGuides.find((entry) => entry.id === guideMatch[1]);
    return guide?.title ?? 'Guide';
  }

  return 'Documentation';
}

export function filterNavigation(query: string): DocsNavSection[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return docsNavigation;

  return docsNavigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.label.toLowerCase().includes(normalized)),
    }))
    .filter((section) => section.items.length > 0);
}
