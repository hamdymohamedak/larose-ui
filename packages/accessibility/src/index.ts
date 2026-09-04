export type A11ySeverity = 'error' | 'warning';

export interface A11yViolation {
  severity: A11ySeverity;
  rule: string;
  message: string;
  file?: string;
  line?: number;
  fix?: string;
}

export interface A11yScanResult {
  passed: boolean;
  violations: A11yViolation[];
}

const RULES = [
  {
    id: 'dialog-label',
    pattern: /role=["']dialog["']/,
    missing: /aria-labelledby|aria-label/,
    message: 'Dialog/Modal may be missing accessible label',
    fix: 'Add title prop or aria-labelledby',
    severity: 'error' as const,
  },
  {
    id: 'empty-button',
    pattern: /<button[^>]*>\s*<\/button>/,
    missing: /aria-label/,
    message: 'Empty button without aria-label',
    fix: 'Add aria-label or visible text',
    severity: 'warning' as const,
  },
  {
    id: 'img-alt',
    // Match JSX/HTML `alt=` and Svelte shorthand `{alt}`
    pattern: /<img(?![^>]*(?:\balt=|\{alt\}))/,
    message: 'Image missing alt attribute',
    fix: 'Add alt="" for decorative or descriptive alt text',
    severity: 'error' as const,
  },
  {
    id: 'input-label',
    pattern: /<input[^>]*\bid=["']([^"']+)["']/,
    requiresLabelFor: true,
    message: 'Input with id may be missing associated label',
    fix: 'Use <label htmlFor="..."> or aria-label',
    severity: 'warning' as const,
  },
];

export function scanComponentSource(source: string, filePath?: string): A11yScanResult {
  const violations: A11yViolation[] = [];
  const lines = source.split('\n');

  for (const rule of RULES) {
    if (rule.id === 'input-label') {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        const idMatch = line.match(/<input[^>]*\bid=["']([^"']+)["']/);
        if (!idMatch) continue;
        const id = idMatch[1]!;
        const hasLabel =
          source.includes(`htmlFor="${id}"`) ||
          source.includes(`htmlFor='${id}'`) ||
          line.includes('aria-label');
        if (!hasLabel) {
          violations.push({
            severity: rule.severity,
            rule: rule.id,
            message: rule.message,
            file: filePath,
            line: i + 1,
            fix: rule.fix,
          });
        }
      }
      continue;
    }

    if (!rule.pattern.test(source)) continue;
    if ('missing' in rule && rule.missing && rule.missing.test(source)) continue;

    violations.push({
      severity: rule.severity,
      rule: rule.id,
      message: rule.message,
      file: filePath,
      fix: rule.fix,
    });
  }

  return {
    passed: violations.filter((v) => v.severity === 'error').length === 0,
    violations,
  };
}

export function formatA11yReport(result: A11yScanResult): string {
  if (result.violations.length === 0) return 'Accessibility scan passed.';

  const lines = ['Accessibility scan report:', ''];
  for (const v of result.violations) {
    lines.push(`[${v.severity.toUpperCase()}] ${v.rule}: ${v.message}`);
    if (v.file) lines.push(`  File: ${v.file}${v.line ? `:${v.line}` : ''}`);
    if (v.fix) lines.push(`  Fix: ${v.fix}`);
    lines.push('');
  }
  lines.push(result.passed ? 'Result: PASS (warnings only)' : 'Result: FAIL');
  return lines.join('\n');
}

/** Recommended CSP for apps using laRose runtime tokens. */
export const RECOMMENDED_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
].join('; ');
