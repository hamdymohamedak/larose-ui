const TOKEN_RENAMES: Record<string, string> = {
  '--ui-color-primary': '--lr-color-primary',
  '--ui-color-secondary': '--lr-color-secondary',
  '--ui-color-success': '--lr-color-success',
  '--ui-color-warning': '--lr-color-warning',
  '--ui-color-error': '--lr-color-error',
  '--ui-color-background': '--lr-color-background',
  '--ui-color-surface': '--lr-color-surface',
  '--ui-color-border': '--lr-color-border',
  '--ui-color-text': '--lr-color-text',
};

export interface CodemodResult {
  content: string;
  changed: boolean;
  transforms: string[];
}

function renameTokens(source: string): CodemodResult {
  let content = source;
  const transforms: string[] = [];

  for (const [from, to] of Object.entries(TOKEN_RENAMES)) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      transforms.push(`token:${from}→${to}`);
    }
  }

  return { content, changed: content !== source, transforms };
}

function fixLaRoseProviderImport(source: string): CodemodResult {
  const importRegex =
    /import\s+\{([^}]+)\}\s+from\s+['"]@larose\/react['"]\s*;?/g;
  let content = source;
  let changed = false;
  const transforms: string[] = [];

  content = content.replace(importRegex, (full, specifiers: string) => {
    if (!specifiers.includes('LaRoseProvider')) return full;

    const parts = specifiers
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
    const reactParts = parts.filter((p: string) => p !== 'LaRoseProvider');

    changed = true;
    transforms.push('import:LaRoseProvider→@larose/runtime');

    const runtimeImport = "import { LaRoseProvider } from '@larose/runtime';";
    if (reactParts.length === 0) {
      return runtimeImport;
    }
    return `${runtimeImport}\nimport { ${reactParts.join(', ')} } from '@larose/react';`;
  });

  return { content, changed, transforms };
}

export function applyCodemods(source: string): CodemodResult {
  const steps = [renameTokens, fixLaRoseProviderImport];
  let content = source;
  const allTransforms: string[] = [];
  let changed = false;

  for (const step of steps) {
    const result = step(content);
    content = result.content;
    if (result.changed) {
      changed = true;
      allTransforms.push(...result.transforms);
    }
  }

  return { content, changed, transforms: allTransforms };
}

export interface ApplyCodemodsFileResult {
  path: string;
  changed: boolean;
  transforms: string[];
  content: string;
}

export function applyCodemodsToFiles(
  files: Array<{ path: string; content: string }>,
): ApplyCodemodsFileResult[] {
  return files.map((file) => {
    const result = applyCodemods(file.content);
    return {
      path: file.path,
      changed: result.changed,
      transforms: result.transforms,
      content: result.content,
    };
  });
}

export function formatCodemodReport(results: ApplyCodemodsFileResult[]): string {
  const changed = results.filter((r) => r.changed);
  if (changed.length === 0) {
    return 'No files required codemod transforms.';
  }

  const lines = [`Applied codemods to ${changed.length} file(s):`, ''];
  for (const file of changed) {
    lines.push(`${file.path}`);
    for (const t of file.transforms) {
      lines.push(`  - ${t}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
