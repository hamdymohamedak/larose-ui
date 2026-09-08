/**
 * Tiny ANSI helpers for CLI reports. No extra dependency.
 * Honors NO_COLOR and FORCE_COLOR; colors only when stdout is a TTY unless forced.
 */

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
} as const;

export function shouldColor(stream?: { isTTY?: boolean }): boolean {
  const force = process.env.FORCE_COLOR;
  if (force === '0') return false;
  if (force != null && force !== '') return true;

  const noColor = process.env.NO_COLOR;
  if (noColor != null && noColor !== '') return false;

  if (stream) return Boolean(stream.isTTY);
  return Boolean(process.stdout?.isTTY || process.stderr?.isTTY);
}

function wrap(open: string, text: string): string {
  if (!shouldColor()) return text;
  return `${open}${text}${ANSI.reset}`;
}

export const color = {
  bold: (text: string) => wrap(ANSI.bold, text),
  dim: (text: string) => wrap(ANSI.dim, text),
  red: (text: string) => wrap(ANSI.red, text),
  green: (text: string) => wrap(ANSI.green, text),
  yellow: (text: string) => wrap(ANSI.yellow, text),
  blue: (text: string) => wrap(ANSI.blue, text),
  magenta: (text: string) => wrap(ANSI.magenta, text),
  cyan: (text: string) => wrap(ANSI.cyan, text),
  success: (text: string) => wrap(`${ANSI.bold}${ANSI.green}`, text),
  heading: (text: string) => wrap(`${ANSI.bold}${ANSI.cyan}`, text),
};
