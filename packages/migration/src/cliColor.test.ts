import { afterEach, describe, expect, it } from 'vitest';
import { color, shouldColor } from './cliColor';

const originalNoColor = process.env.NO_COLOR;
const originalForceColor = process.env.FORCE_COLOR;

afterEach(() => {
  if (originalNoColor === undefined) delete process.env.NO_COLOR;
  else process.env.NO_COLOR = originalNoColor;
  if (originalForceColor === undefined) delete process.env.FORCE_COLOR;
  else process.env.FORCE_COLOR = originalForceColor;
});

describe('shouldColor', () => {
  it('disables color when NO_COLOR is set', () => {
    process.env.NO_COLOR = '1';
    delete process.env.FORCE_COLOR;
    expect(shouldColor({ isTTY: true })).toBe(false);
  });

  it('disables color when FORCE_COLOR is 0', () => {
    delete process.env.NO_COLOR;
    process.env.FORCE_COLOR = '0';
    expect(shouldColor({ isTTY: true })).toBe(false);
  });

  it('lets FORCE_COLOR override NO_COLOR', () => {
    process.env.NO_COLOR = '1';
    process.env.FORCE_COLOR = '1';
    expect(shouldColor({ isTTY: false })).toBe(true);
  });

  it('follows TTY when no env override is set', () => {
    delete process.env.NO_COLOR;
    delete process.env.FORCE_COLOR;
    expect(shouldColor({ isTTY: true })).toBe(true);
    expect(shouldColor({ isTTY: false })).toBe(false);
  });

  it('uses stdout/stderr TTY when no stream is passed', () => {
    delete process.env.NO_COLOR;
    delete process.env.FORCE_COLOR;
    expect(typeof shouldColor()).toBe('boolean');
  });
});

describe('color', () => {
  it('wraps text in green ANSI when color is forced', () => {
    delete process.env.NO_COLOR;
    process.env.FORCE_COLOR = '1';
    expect(color.green('packages/react/src/Activity/Activity.tsx')).toBe(
      '\x1b[32mpackages/react/src/Activity/Activity.tsx\x1b[0m',
    );
    expect(color.success('Created files:')).toBe('\x1b[1m\x1b[32mCreated files:\x1b[0m');
    expect(color.heading('Next steps:')).toBe('\x1b[1m\x1b[36mNext steps:\x1b[0m');
  });

  it('returns plain text when color is disabled', () => {
    process.env.NO_COLOR = '1';
    delete process.env.FORCE_COLOR;
    expect(color.green('packages/react/src/Activity/Activity.tsx')).toBe(
      'packages/react/src/Activity/Activity.tsx',
    );
  });
});
