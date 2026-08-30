import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MotionProvider } from './MotionContext';
import { usePresence } from './usePresence';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <MotionProvider reducedMotion="never">{children}</MotionProvider>;
}

describe('usePresence', () => {
  it('mounts on present and unmounts after exit', async () => {
    const { result, rerender } = renderHook(
      ({ present }) => usePresence({ present }),
      { initialProps: { present: false }, wrapper },
    );

    expect(result.current.shouldRender).toBe(false);
    expect(result.current.phase).toBe('exited');

    rerender({ present: true });
    expect(result.current.shouldRender).toBe(true);
    expect(['mounting', 'entering']).toContain(result.current.phase);

    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    });

    expect(result.current.phase).toBe('entering');

    act(() => {
      const el = document.createElement('div');
      result.current.onAnimationEnd({
        target: el,
        currentTarget: el,
      } as unknown as React.AnimationEvent);
    });

    expect(result.current.phase).toBe('entered');

    rerender({ present: false });
    expect(result.current.phase).toBe('exiting');
  });

  it('skips animation when motion disabled', () => {
    const reducedWrapper = ({ children }: { children: ReactNode }) => (
      <MotionProvider reducedMotion="always">{children}</MotionProvider>
    );

    const { result, rerender } = renderHook(
      ({ present }) => usePresence({ present }),
      { initialProps: { present: false }, wrapper: reducedWrapper },
    );

    rerender({ present: true });
    expect(result.current.phase).toBe('entered');

    rerender({ present: false });
    expect(result.current.phase).toBe('exited');
    expect(result.current.shouldRender).toBe(false);
  });
});
