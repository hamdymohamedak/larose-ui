import { describe, expect, it } from 'vitest';
import { parseIntent, sanitizePrompt } from './intent';

describe('sanitizePrompt', () => {
  it('strips unsafe markup', () => {
    expect(sanitizePrompt('<script>alert(1)</script> show late')).not.toContain('<script>');
  });

  it('truncates long input', () => {
    expect(sanitizePrompt('a'.repeat(600)).length).toBeLessThanOrEqual(500);
  });
});

describe('parseIntent', () => {
  it('detects table filter intent', () => {
    const intent = parseIntent('Show employees who were late more than 3 times');
    expect(intent.type).toBe('table.filter');
    expect(intent.confidence).not.toBe('low');
  });

  it('detects form populate intent', () => {
    const intent = parseIntent('Create employee for Ahmed Mohamed');
    expect(intent.type).toBe('form.populate');
  });
});
