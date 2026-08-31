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

export const docsNavigation: DocsNavSection[] = [
  {
    label: 'Introduction',
    items: [
      { label: 'Overview', path: '/' },
      { label: 'Getting started', path: '/docs/getting-started' },
    ],
  },
  {
    label: 'Guides',
    items: docsGuides.map((guide) => ({
      label: guide.title,
      path: `/docs/guides/${guide.id}`,
    })),
  },
  {
    label: 'Design system',
    items: [
      { label: 'Theme builder', path: '/docs/design/theme-builder' },
      { label: 'Design tokens', path: '/docs/design/tokens' },
      { label: 'Motion playground', path: '/docs/design/motion' },
      { label: 'Playground', path: '/docs/playground' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Architecture', path: '/docs/architecture' },
      { label: 'Accessibility', path: '/docs/accessibility' },
      { label: 'Migration', path: '/docs/migration' },
      { label: 'Changelog', path: '/changelog' },
    ],
  },
  {
    label: 'Packages',
    items: [
      { label: 'All packages', path: '/docs/packages' },
      ...docsPackages.map((pkg) => ({
        label: pkg.name.replace('@larose-ui/', ''),
        path: `/docs/packages/${pkg.id}`,
      })),
    ],
    collapsible: true,
  },
  {
    label: 'Components',
    items: [
      { label: 'All components', path: '/docs/components' },
      ...docsComponentCategories.flatMap((category) => {
        const items = docsComponents.filter((entry) => entry.category === category);
        return items.map((item) => ({
          label: item.name,
          path: `/docs/components/${item.id}`,
        }));
      }),
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
