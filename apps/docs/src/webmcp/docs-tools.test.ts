import { describe, expect, it } from 'vitest';
import {
  createDocsWebMcpTools,
  executeListComponents,
  executeListPackages,
  executeSearchDocs,
} from '@/webmcp/docs-tools';

describe('WebMCP docs tools', () => {
  it('defines tools with name, description, inputSchema, and execute', () => {
    const tools = createDocsWebMcpTools();
    expect(tools.length).toBeGreaterThanOrEqual(5);

    for (const tool of tools) {
      expect(tool.name).toMatch(/^[a-z0-9._-]+$/);
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.inputSchema).toBeTruthy();
      expect(typeof tool.execute).toBe('function');
    }

    const names = tools.map((tool) => tool.name);
    expect(names).toContain('search_docs');
    expect(names).toContain('navigate_docs');
    expect(names).toContain('get_component_metadata');
  });

  it('searches documentation entries', () => {
    const result = executeSearchDocs({ query: 'Button', limit: 5 });
    expect(result.query).toBe('Button');
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results[0]?.path).toMatch(/^\/docs\//);
  });

  it('lists packages and components', () => {
    const packages = executeListPackages();
    expect(packages.packages.some((pkg) => pkg.id === 'react')).toBe(true);

    const components = executeListComponents({ category: 'Actions' });
    expect(components.category).toBe('Actions');
    expect(components.components.some((component) => component.id === 'button')).toBe(true);
  });
});
