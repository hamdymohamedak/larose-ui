import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { Glass } from './Glass';

describe('Glass (React)', () => {
  afterEach(() => {
    cleanup();
    document.getElementById('larose-glass-defs')?.remove();
  });

  it('mounts with glass data attribute and SVG filter', async () => {
    const { container } = render(
      <Glass lens={{ width: 120, height: 48, borderRadius: 24, depth: 8, curvature: 35 }}>
        <span>Hello</span>
      </Glass>,
    );

    const shell = container.querySelector('[data-larose-glass]');
    expect(shell).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();

    await waitFor(() => {
      const filtered = container.querySelector('[data-larose-glass]') as HTMLElement;
      expect(filtered?.style.filter).toMatch(/url\(#larose-glass-/);
      expect(document.getElementById('larose-glass-defs')).toBeTruthy();
    });
  });

  it('renders static fallback when disabled', () => {
    const { container } = render(
      <Glass lens={{ width: 100, height: 40, borderRadius: 20 }} disabled>
        <span>Off</span>
      </Glass>,
    );

    expect(container.querySelector('[data-larose-glass]')).toBeNull();
    expect(screen.getByText('Off')).toBeTruthy();
  });

  it('unmount removes filter defs when last instance is destroyed', async () => {
    const { unmount } = render(
      <Glass lens={{ width: 80, height: 40, borderRadius: 20 }}>
        <span>Bye</span>
      </Glass>,
    );

    await waitFor(() => {
      expect(document.getElementById('larose-glass-defs')).toBeTruthy();
    });
    unmount();
    expect(document.getElementById('larose-glass-defs')).toBeNull();
  });
});
