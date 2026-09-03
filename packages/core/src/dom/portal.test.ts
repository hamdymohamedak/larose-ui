import { describe, expect, it } from 'vitest';
import {
  getLaRosePortalTarget,
  LAROSE_PORTAL_ROOT_ATTR,
  LAROSE_PROVIDER_ATTR,
  mergeDefinedProps,
} from './portal';

describe('mergeDefinedProps', () => {
  it('keeps defaults when incoming values are undefined', () => {
    expect(
      mergeDefinedProps(
        { variant: 'primary', size: 'md' },
        { variant: undefined, size: 'lg', loading: true },
      ),
    ).toEqual({ variant: 'primary', size: 'lg', loading: true });
  });
});

describe('getLaRosePortalTarget', () => {
  it('prefers portal root, then provider, then body', () => {
    const body = { nodeName: 'BODY' } as unknown as HTMLElement;
    const provider = { nodeName: 'PROVIDER' } as unknown as HTMLElement;
    const portalRoot = { nodeName: 'PORTAL' } as unknown as HTMLElement;
    const nodes = new Map<string, HTMLElement | null>([
      [`[${LAROSE_PORTAL_ROOT_ATTR}]`, null],
      [`[${LAROSE_PROVIDER_ATTR}]`, null],
    ]);

    const doc = {
      body,
      querySelector(selector: string) {
        return nodes.get(selector) ?? null;
      },
    } as unknown as Document;

    expect(getLaRosePortalTarget(doc)).toBe(body);

    nodes.set(`[${LAROSE_PROVIDER_ATTR}]`, provider);
    expect(getLaRosePortalTarget(doc)).toBe(provider);

    nodes.set(`[${LAROSE_PORTAL_ROOT_ATTR}]`, portalRoot);
    expect(getLaRosePortalTarget(doc)).toBe(portalRoot);
  });
});
