import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MotionProvider } from './MotionContext';
import { usePresence } from './usePresence';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <MotionProvider reducedMotion="never">{children}</MotionProvider>;
}

describe('usePresence', () => {
  it('mounts on present and unmounts after exit', () => {
    const { result, rerender } = renderHook(
      ({ present }) => usePresence({ present }),
      { initialProps: { present: false }, wrapper },
    );

    expect(result.current.shouldRender).toBe(false);
    expect(result.current.phase).toBe('exited');

    rerender({ present: true });
    expect(result.current.shouldRender).toBe(true);
    expect(result.current.phase).toBe('entering');

    act(() => {
      result.current.onAnimationEnd({
        target: document.createElement('div'),
        currentTarget: document.createElement('div'),
      } as unknown as React.AnimationEvent);
    });

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
