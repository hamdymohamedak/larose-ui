import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { exampleValueFromType } from './generate-playground-seeds.mjs';

/**
 * @param {unknown} value
 */
function formatExample(value) {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * @param {{ kind: string, value?: unknown }} example
 */
function exampleToDisplay(example) {
  if (!example || example.kind === 'omit') {
    return '—';
  }
  if (example.kind === 'boolean') return String(Boolean(example.value));
  if (example.kind === 'number') return String(example.value);
  if (example.kind === 'raw') return String(example.value);
  return JSON.stringify(example.value);
}

/**
 * @param {import('./docs-types.mjs').DocsPropEntry} prop
 */
export function withExample(prop) {
  if (prop.example) return prop;
  const fromDefault = exampleValueFromType(prop.type, prop.default);
  return {
    ...prop,
    example: exampleToDisplay(fromDefault),
  };
}

/**
 * Load all contracts/components/*.json
 * @param {string} root
 */
export function loadAllContracts(root) {
  const dir = join(root, 'contracts/components');
  /** @type {Record<string, any>} */
  const contracts = {};
  if (!existsSync(dir)) return contracts;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const name = file.replace(/\.json$/, '');
    try {
      contracts[name] = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch {
      // skip
    }
  }
  return contracts;
}

/**
 * Extract LiquidGlassSurfaceBaseProps from liquid-glass-core.
 * @param {string} root
 */
export function extractLiquidGlassBaseProps(root) {
  const filePath = join(root, 'packages/liquid-glass-core/src/types.ts');
  if (!existsSync(filePath)) return [];
  const source = readFileSync(filePath, 'utf8');
  // extractInterfaceProps is not exported — duplicate minimal extraction via regex fallback
  /** @type {import('./docs-types.mjs').DocsPropEntry[]} */
  const props = [];
  const opticsBlock = source.match(/export interface LiquidGlassOptics \{([\s\S]*?)\n\}/);
  const geometryBlock = source.match(/export interface LiquidGlassGeometry \{([\s\S]*?)\n\}/);
  const chromeBlock = source.match(/export interface LiquidGlassChromeProps \{([\s\S]*?)\n\}/);
  const surfaceBlock = source.match(/export interface LiquidGlassSurfaceBaseProps[\s\S]*?\{([\s\S]*?)\n\}/);

  for (const block of [opticsBlock, geometryBlock, chromeBlock, surfaceBlock]) {
    if (!block) continue;
    const body = block[1];
    const re = /\/\*\*([\s\S]*?)\*\/\s*(?:readonly\s+)?(?:'([^']+)'|([A-Za-z0-9_]+))\??\s*:\s*([^;]+);/g;
    let match;
    while ((match = re.exec(body))) {
      const doc = match[1];
      const name = match[2] || match[3];
      const type = match[4].trim();
      const defaultMatch = doc.match(/@default\s+(.+)/);
      const descMatch = doc.replace(/@default[\s\S]*/g, '').replace(/\s*\*\s?/g, ' ').trim();
      props.push({
        name,
        type,
        required: !body.includes(`${name}?`) && !new RegExp(`${name}\\?`).test(match[0]),
        default: defaultMatch ? defaultMatch[1].trim() : undefined,
        description: descMatch || undefined,
        inherited: false,
      });
    }

    // Also catch props without JSDoc
    const simpleRe = /(?:'([^']+)'|([A-Za-z0-9_]+))\??\s*:\s*([^;]+);/g;
    let sm;
    const seen = new Set(props.map((p) => p.name));
    while ((sm = simpleRe.exec(body))) {
      const name = sm[1] || sm[2];
      if (seen.has(name)) continue;
      seen.add(name);
      props.push({
        name,
        type: sm[3].trim(),
        required: false,
        inherited: false,
      });
    }
  }

  // Deduplicate by name
  const byName = new Map();
  for (const prop of props) {
    if (!byName.has(prop.name)) byName.set(prop.name, prop);
  }
  return [...byName.values()].map(withExample);
}

/**
 * Merge TS-extracted API with contracts + examples.
 * @param {string} root
 * @param {Record<string, import('./docs-types.mjs').DocsComponentApi>} api
 * @param {string[]} componentNames
 */
export function mergeComponentApi(root, api, componentNames) {
  const contracts = loadAllContracts(root);
  const liquidGlassProps = extractLiquidGlassBaseProps(root);

  /** @type {Record<string, import('./docs-types.mjs').DocsComponentApi>} */
  const merged = { ...api };

  for (const name of componentNames) {
    const current = merged[name] ?? { props: [], events: [], accessibility: [] };
    const contract = contracts[name];
    /** @type {Map<string, import('./docs-types.mjs').DocsPropEntry>} */
    const byName = new Map();

    for (const prop of current.props ?? []) {
      byName.set(prop.name.replace(/^['"]|['"]$/g, ''), withExample(prop));
    }

    if (contract?.props) {
      for (const prop of contract.props) {
        const key = String(prop.name).replace(/^['"]|['"]$/g, '');
        const existing = byName.get(key);
        if (existing) {
          byName.set(key, withExample({
            ...existing,
            type: existing.type || prop.type,
            description: existing.description || prop.description,
            default: existing.default ?? prop.default,
            required: existing.required || Boolean(prop.required),
          }));
        } else {
          byName.set(
            key,
            withExample({
              name: key,
              type: prop.type ?? 'unknown',
              required: Boolean(prop.required),
              default: prop.default,
              description: prop.description,
              inherited: false,
            }),
          );
        }
      }
    }

    if ((name === 'LiquidGlass' || name.startsWith('LiquidGlass')) && liquidGlassProps.length) {
      for (const prop of liquidGlassProps) {
        const key = prop.name;
        if (!byName.has(key)) byName.set(key, prop);
        else {
          const existing = byName.get(key);
          byName.set(key, withExample({ ...prop, ...existing, example: existing?.example || prop.example }));
        }
      }
    }

    const props = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
    merged[name] = {
      props,
      events: props.filter((prop) => prop.name.startsWith('on')),
      accessibility: current.accessibility ?? contract?.accessibility ?? [],
    };
  }

  return merged;
}
