import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface StoryManifestEntry {
  file: string;
  title: string;
}

export interface VisualBaseline {
  version: number;
  stories: StoryManifestEntry[];
}

export interface VisualRegressionResult {
  passed: boolean;
  current: StoryManifestEntry[];
  missing: StoryManifestEntry[];
  added: StoryManifestEntry[];
  changed: Array<{ file: string; baselineTitle: string; currentTitle: string }>;
}

const META_TITLE_PATTERN = /const\s+meta[\s\S]*?title:\s*['"]([^'"]+)['"]/;

export async function scanStoryManifest(
  storiesDir: string,
  options: { storySuffix?: string } = {},
): Promise<StoryManifestEntry[]> {
  const storySuffix = options.storySuffix ?? '.stories.tsx';
  const entries = await readdir(storiesDir, { withFileTypes: true });
  const stories: StoryManifestEntry[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(storySuffix)) continue;
    const file = entry.name;
    const source = await readFile(join(storiesDir, file), 'utf-8');
    stories.push({
      file,
      title: extractStoryTitle(source, file),
    });
  }

  return stories.sort((a, b) => a.file.localeCompare(b.file));
}

function extractStoryTitle(source: string, file: string): string {
  const metaMatch = source.match(META_TITLE_PATTERN);
  if (metaMatch?.[1]) return metaMatch[1];

  const metaIndex = source.indexOf('const meta');
  if (metaIndex >= 0) {
    const slice = source.slice(metaIndex, metaIndex + 600);
    const titleMatch = slice.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch?.[1]) return titleMatch[1];
  }

  const head = source.split('\n').slice(0, 25).join('\n');
  const headMatch = head.match(/title:\s*['"]([^'"]+)['"]/);
  return headMatch?.[1] ?? file.replace(/\.stories\.(tsx|ts|vue|svelte)$/, '');
}

export function compareVisualBaseline(
  current: StoryManifestEntry[],
  baseline: VisualBaseline,
): VisualRegressionResult {
  const baselineByFile = new Map(baseline.stories.map((story) => [story.file, story]));
  const currentByFile = new Map(current.map((story) => [story.file, story]));

  const missing = baseline.stories.filter((story) => !currentByFile.has(story.file));
  const added = current.filter((story) => !baselineByFile.has(story.file));
  const changed: VisualRegressionResult['changed'] = [];

  for (const story of current) {
    const base = baselineByFile.get(story.file);
    if (base && base.title !== story.title) {
      changed.push({
        file: story.file,
        baselineTitle: base.title,
        currentTitle: story.title,
      });
    }
  }

  return {
    passed: missing.length === 0 && changed.length === 0,
    current,
    missing,
    added,
    changed,
  };
}

export function formatVisualRegressionReport(result: VisualRegressionResult): string {
  const lines = ['Visual regression manifest', ''];

  if (result.passed && result.added.length === 0) {
    lines.push(`All ${result.current.length} baseline stories present.`);
    return lines.join('\n');
  }

  if (result.missing.length > 0) {
    lines.push('Missing stories (removed or renamed):');
    for (const story of result.missing) {
      lines.push(`  - ${story.file} (${story.title})`);
    }
    lines.push('');
  }

  if (result.changed.length > 0) {
    lines.push('Changed story titles:');
    for (const change of result.changed) {
      lines.push(
        `  - ${change.file}: "${change.baselineTitle}" → "${change.currentTitle}"`,
      );
    }
    lines.push('');
  }

  if (result.added.length > 0) {
    lines.push('New stories (update quality/visual-baseline.json):');
    for (const story of result.added) {
      lines.push(`  + ${story.file} (${story.title})`);
    }
    lines.push('');
  }

  lines.push(result.passed ? 'Result: PASS' : 'Result: FAIL');
  return lines.join('\n');
}
