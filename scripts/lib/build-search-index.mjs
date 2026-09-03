/**
 * @param {object} input
 * @param {import('./docs-types.mjs').DocsPackageEntry[]} input.packages
 * @param {import('./docs-types.mjs').DocsComponentEntry[]} input.components
 * @param {import('./docs-types.mjs').DocsGuideEntry[]} input.guides
 * @param {Record<string, string>} input.guideContent
 * @param {Record<string, import('./docs-types.mjs').DocsComponentApi>} input.api
 * @param {Record<string, import('./docs-types.mjs').DocsExampleEntry[]>} input.examples
 * @param {Record<string, import('./docs-types.mjs').TokenSearchEntry[]>} input.tokens
 */
export function buildSearchIndex(input) {
  /** @type {import('./docs-types.mjs').DocsSearchEntry[]} */
  const entries = [];

  for (const pkg of input.packages) {
    entries.push({
      id: `package:${pkg.id}`,
      title: pkg.name,
      type: 'package',
      path: `/docs/packages/${pkg.id}`,
      keywords: [pkg.name, pkg.tagline, ...pkg.features].join(' '),
      excerpt: pkg.tagline,
    });
  }

  for (const component of input.components) {
    const api = input.api[component.name];
    const propKeywords = api?.props?.map((prop) => `${component.name}.${prop.name} ${prop.type}`) ?? [];
    entries.push({
      id: `component:${component.id}`,
      title: component.name,
      type: 'component',
      path: `/docs/components/${component.id}`,
      keywords: [component.name, component.category, ...propKeywords].join(' '),
      excerpt: `${component.category} component from @larose-ui/${component.package ?? 'react'}`,
    });

    for (const prop of api?.props ?? []) {
      if (prop.inherited) continue;
      entries.push({
        id: `prop:${component.id}:${prop.name}`,
        title: `${component.name}.${prop.name}`,
        type: 'prop',
        path: `/docs/components/${component.id}#api`,
        keywords: [component.name, prop.name, prop.type, prop.description ?? ''].join(' '),
        excerpt: prop.description ?? `${prop.type}${prop.required ? ' (required)' : ''}`,
      });
    }

    for (const example of input.examples[component.name] ?? []) {
      entries.push({
        id: `example:${component.id}:${example.id}`,
        title: `${component.name} — ${example.title}`,
        type: 'example',
        path: `/docs/components/${component.id}#examples`,
        keywords: [component.name, example.title, example.kind, JSON.stringify(example.props)].join(' '),
        excerpt: example.code.slice(0, 120),
      });
    }
  }

  for (const guide of input.guides) {
    const content = input.guideContent[guide.id] ?? '';
    entries.push({
      id: `guide:${guide.id}`,
      title: guide.title,
      type: 'guide',
      path: `/docs/guides/${guide.id}`,
      keywords: [guide.title, content.slice(0, 2000)].join(' '),
      excerpt: content.replace(/^#+\s+/gm, '').slice(0, 160).trim(),
    });
  }

  for (const tokenGroup of Object.values(input.tokens).flat()) {
    entries.push({
      id: `token:${tokenGroup.cssVariable}`,
      title: tokenGroup.name,
      type: 'token',
      path: '/docs/design/tokens',
      keywords: [tokenGroup.name, tokenGroup.cssVariable, tokenGroup.category, tokenGroup.description ?? ''].join(
        ' ',
      ),
      excerpt: `${tokenGroup.cssVariable} = ${tokenGroup.value}`,
    });
  }

  return entries;
}

/**
 * @param {string} root
 */
export async function extractTokenSearchEntries(root) {
  /** @type {Record<string, import('./docs-types.mjs').TokenSearchEntry[]>} */
  const grouped = {
    Colors: [],
    Typography: [],
    Spacing: [],
    Radius: [],
    Shadows: [],
    Motion: [],
    Other: [],
  };

  try {
    const tokensPath = `${root}/packages/tokens/dist/index.js`;
    const { getTokens, tokensToCSSVariables } = await import(tokensPath);
    const light = getTokens('light');
    const cssVars = tokensToCSSVariables(light);

    for (const [cssVariable, value] of Object.entries(cssVars)) {
      const category = categorizeToken(cssVariable);
      grouped[category].push({
        name: cssVariable.replace(/^--lr-/, '').replace(/-/g, '.'),
        cssVariable,
        value,
        category,
        description: `Design token exposed as ${cssVariable}`,
        relatedComponents: inferRelatedComponents(cssVariable),
      });
    }
  } catch {
    // tokens package may not be built yet during first run
  }

  return grouped;
}

/**
 * @param {string} cssVariable
 */
function categorizeToken(cssVariable) {
  if (cssVariable.includes('color')) return 'Colors';
  if (cssVariable.includes('font') || cssVariable.includes('text')) return 'Typography';
  if (cssVariable.includes('space') || cssVariable.includes('gap')) return 'Spacing';
  if (cssVariable.includes('radius')) return 'Radius';
  if (cssVariable.includes('shadow')) return 'Shadows';
  if (cssVariable.includes('duration') || cssVariable.includes('ease') || cssVariable.includes('motion')) {
    return 'Motion';
  }
  return 'Other';
}

/**
 * @param {string} cssVariable
 */
function inferRelatedComponents(cssVariable) {
  if (cssVariable.includes('button')) return ['Button', 'ButtonGroup'];
  if (cssVariable.includes('modal')) return ['Modal'];
  if (cssVariable.includes('drawer')) return ['Drawer'];
  if (cssVariable.includes('input') || cssVariable.includes('field')) return ['Input', 'Textarea', 'Select'];
  if (cssVariable.includes('card')) return ['Card'];
  return [];
}
