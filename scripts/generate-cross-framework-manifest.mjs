#!/usr/bin/env node
/**
 * Generate a lightweight cross-framework manifest from registry domain modules.
 * Used by tooling / docs — does not replace React render functions.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryDir = join(
  root,
  'apps/playground/.storybook/crossFramework',
);
const outPath = join(registryDir, 'manifest.json');

const sources = [
  join(registryDir, 'registry.tsx'),
  ...readdirSync(join(registryDir, 'registry'))
    .filter((name) => /\.(tsx|ts)$/.test(name))
    .map((name) => join(registryDir, 'registry', name)),
];

/** @type {Map<string, { id: string; displayName: string; componentName: string; frameworks: string[] }>} */
const byId = new Map();

function addEntry({ id, displayName, componentName, frameworks }) {
  if (!id) return;
  byId.set(id, {
    id,
    displayName: displayName ?? id,
    componentName: componentName ?? displayName ?? id,
    frameworks: frameworks ?? ['react', 'vue', 'svelte'],
  });
}

for (const filePath of sources) {
  const source = readFileSync(filePath, 'utf8');

  // Object-literal entries: key: { id, displayName, componentName }
  const literalRegex =
    /^\s{2}([a-zA-Z][\w]*)\s*:\s*\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?displayName:\s*'([^']+)'(?:[\s\S]*?componentName:\s*'([^']+)')?/gm;

  let match;
  while ((match = literalRegex.exec(source)) !== null) {
    const [, key, id, displayName, componentName] = match;
    const slice = source.slice(match.index, match.index + 800);
    const frameworks = slice.includes('[...ALL]')
      ? ['react', 'vue', 'svelte']
      : slice.includes("'react'") && !slice.includes("'vue'")
        ? ['react']
        : ['react', 'vue', 'svelte'];
    addEntry({
      id: id ?? key,
      displayName,
      componentName: componentName ?? displayName,
      frameworks,
    });
  }

  // Helper entries: defineSlotParity / definePropsParity / defineCustomParity
  const helperRegex =
    /^\s{2}([a-zA-Z][\w]*)\s*:\s*define(?:Slot|Props|Custom)Parity\(\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?displayName:\s*'([^']+)'/gm;

  while ((match = helperRegex.exec(source)) !== null) {
    const [, , id, displayName] = match;
    addEntry({
      id,
      displayName,
      componentName: displayName,
      frameworks: ['react', 'vue', 'svelte'],
    });
  }
}

const entries = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

mkdirSync(registryDir, { recursive: true });
writeFileSync(
  outPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), count: entries.length, entries }, null, 2)}\n`,
);

console.log(`[larose] wrote ${entries.length} cross-framework entries to manifest.json`);
