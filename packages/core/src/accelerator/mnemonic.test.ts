import { describe, expect, it } from 'vitest';
import {
  matchTypeAheadPrefix,
  parseMnemonicLabel,
  resolveMnemonicKey,
  stripMnemonicMarker,
} from './mnemonic';

describe('parseMnemonicLabel', () => {
  it('parses & marker labels', () => {
    expect(parseMnemonicLabel('&File')).toEqual({
      displayLabel: 'File',
      mnemonicKey: 'f',
    });
    expect(parseMnemonicLabel('Save &As…')).toEqual({
      displayLabel: 'Save As…',
      mnemonicKey: 'a',
    });
  });

  it('returns label unchanged when no marker', () => {
    expect(parseMnemonicLabel('Edit')).toEqual({
      displayLabel: 'Edit',
      mnemonicKey: undefined,
    });
  });
});

describe('resolveMnemonicKey', () => {
  it('uses explicit override or first letter', () => {
    expect(resolveMnemonicKey('File')).toBe('f');
    expect(resolveMnemonicKey('File', 'i')).toBe('i');
    expect(resolveMnemonicKey('&Edit')).toBe('e');
  });
});

describe('stripMnemonicMarker', () => {
  it('removes & from display text', () => {
    expect(stripMnemonicMarker('&File')).toBe('File');
  });
});

describe('matchTypeAheadPrefix', () => {
  it('matches case-insensitive prefixes ignoring markers', () => {
    expect(matchTypeAheadPrefix('&Save As…', 'sa')).toBe(true);
    expect(matchTypeAheadPrefix('Close', 'op')).toBe(false);
  });
});
