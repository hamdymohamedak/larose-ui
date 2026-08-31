import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { STORY_COMPONENT_MAP } from './docs-metadata.mjs';

/**
 * @param {string} root
 * @param {string} componentName
 */
export function parseStoryExamples(root, componentName) {
  const storyFile = STORY_COMPONENT_MAP[componentName];
  if (!storyFile) return [];

  const storyPath = join(root, 'apps/playground/stories', storyFile);
  if (!existsSync(storyPath)) return [];

  const source = readFileSync(storyPath, 'utf8');
  /** @type {import('./docs-types.mjs').DocsExampleEntry[]} */
  const examples = [];

  const storyRegex =
    /export const (\w+):\s*Story\s*=\s*\{([\s\S]*?)\n\};/g;

  for (const match of source.matchAll(storyRegex)) {
    const exportName = match[1];
    const body = match[2];
    const nameMatch = body.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const title = nameMatch?.[1] ?? exportName.replace(/([A-Z])/g, ' $1').trim();

    const argsMatch = body.match(/args:\s*\{([\s\S]*?)\}/);
    if (argsMatch) {
      const argsSource = argsMatch[1];
      const props = parseArgsObject(argsSource);
      examples.push({
        id: exportName,
        title,
        kind: classifyExample(exportName, title),
        props,
        code: generateExampleCode(componentName, props),
      });
      continue;
    }

    if (body.includes('render:')) {
      examples.push({
        id: exportName,
        title,
        kind: classifyExample(exportName, title),
        props: {},
        code: `// See Storybook story "${exportName}" for composite layout example.`,
        composite: true,
      });
    }
  }

  return examples.slice(0, 12);
}

/**
 * @param {string} argsSource
 */
function parseArgsObject(argsSource) {
  /** @type {Record<string, string | number | boolean>} */
  const props = {};
  for (const line of argsSource.split('\n')) {
    const trimmed = line.trim().replace(/,$/, '');
    const kv = trimmed.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    props[key] = parseLiteral(rawValue.trim());
  }
  return props;
}

/**
 * @param {string} raw
 */
function parseLiteral(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  const quoted = raw.match(/^['"`](.*)['"`]$/);
  if (quoted) return quoted[1];
  return raw;
}

/**
 * @param {string} exportName
 * @param {string} title
 */
function classifyExample(exportName, title) {
  const lower = `${exportName} ${title}`.toLowerCase();
  if (lower.includes('primary') || lower.includes('basic')) return 'basic';
  if (lower.includes('variant') || lower.includes('all')) return 'variants';
  if (lower.includes('size')) return 'sizes';
  if (lower.includes('load')) return 'loading';
  if (lower.includes('disabled')) return 'disabled';
  if (lower.includes('icon')) return 'with-icon';
  if (lower.includes('destruct')) return 'destructive';
  return 'advanced';
}

/**
 * @param {string} componentName
 * @param {Record<string, string | number | boolean>} props
 */
function generateExampleCode(componentName, props) {
  const voidElements = new Set(['Spinner', 'Skeleton']);
  const propEntries = Object.entries(props).filter(([key]) => key !== 'children');
  const propLines = propEntries.map(([key, value]) => {
    if (typeof value === 'string') return `  ${key}="${value}"`;
    if (typeof value === 'boolean') return value ? `  ${key}` : `  ${key}={false}`;
    return `  ${key}={${JSON.stringify(value)}}`;
  });

  const child = typeof props.children === 'string' ? props.children : 'Example';
  if (voidElements.has(componentName)) {
    return `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ' '}/>`;
  }

  const open = `<${componentName}${propLines.length ? `\n${propLines.join('\n')}\n` : ''}>`;
  return `${open}${child}</${componentName}>`;
}
