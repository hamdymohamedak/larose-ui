export interface BrowserTarget {
  name: string;
  minVersion: number;
  engine?: string;
}

export interface BrowserMatrix {
  version: number;
  browsers: BrowserTarget[];
  engines: {
    node: string;
  };
}

export const DEFAULT_BROWSER_MATRIX: BrowserMatrix = {
  version: 1,
  browsers: [
    { name: 'chrome', minVersion: 120, engine: 'Blink' },
    { name: 'firefox', minVersion: 121, engine: 'Gecko' },
    { name: 'safari', minVersion: 17, engine: 'WebKit' },
    { name: 'edge', minVersion: 120, engine: 'Blink' },
  ],
  engines: {
    node: '>=20',
  },
};

export interface BrowserMatrixCheck {
  passed: boolean;
  matrix: BrowserMatrix;
  nodeEngine?: string;
  issues: string[];
}

export function validateBrowserMatrix(
  matrix: BrowserMatrix,
  nodeEngine?: string,
): BrowserMatrixCheck {
  const issues: string[] = [];

  if (matrix.browsers.length === 0) {
    issues.push('Browser matrix must define at least one browser target');
  }

  for (const browser of matrix.browsers) {
    if (!browser.name.trim()) issues.push('Browser target missing name');
    if (browser.minVersion <= 0) {
      issues.push(`Browser ${browser.name} has invalid minVersion`);
    }
  }

  if (nodeEngine && matrix.engines.node) {
    const expected = normalizeEngine(matrix.engines.node);
    const actual = normalizeEngine(nodeEngine);
    if (expected && actual && expected !== actual) {
      issues.push(
        `Node engine mismatch: package.json specifies "${nodeEngine}", matrix requires "${matrix.engines.node}"`,
      );
    }
  }

  return {
    passed: issues.length === 0,
    matrix,
    nodeEngine,
    issues,
  };
}

function normalizeEngine(value: string): string {
  return value.replace(/\s+/g, '');
}
