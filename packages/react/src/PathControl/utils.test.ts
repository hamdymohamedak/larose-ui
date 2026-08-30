import { describe, expect, it, vi } from 'vitest';
import {
  collapsePathSegments,
  isEllipsisSegment,
  resolveSelectedSegment,
  warnIfPathControlInToolbar,
} from './utils';

describe('PathControl utils', () => {
  const segments = [
    { id: 'disk', label: 'Macintosh HD' },
    { id: 'users', label: 'Users' },
    { id: 'me', label: 'me' },
    { id: 'docs', label: 'Documents' },
    { id: 'file', label: 'Report.pages' },
  ];

  it('collapses middle segments when the path is long', () => {
    const collapsed = collapsePathSegments(segments, 4);
    expect(collapsed).toHaveLength(4);
    expect(isEllipsisSegment(collapsed[1]!)).toBe(true);
    expect(collapsed[0]).toMatchObject({ label: 'Macintosh HD' });
    expect(collapsed[3]).toMatchObject({ label: 'Report.pages' });
  });

  it('resolves the selected segment', () => {
    expect(resolveSelectedSegment(segments, 'docs').label).toBe('Documents');
    expect(resolveSelectedSegment(segments).label).toBe('Report.pages');
  });

  it('warns when used in a toolbar', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfPathControlInToolbar('toolbar');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
