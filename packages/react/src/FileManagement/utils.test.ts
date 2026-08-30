import { describe, expect, it } from 'vitest';
import {
  canPreviewFile,
  documentTitleWithEditedSuffix,
  filterFilesByType,
  formatDisplayName,
  formatFileSize,
  getFileExtension,
  stripExtension,
} from './utils';

describe('FileManagement utils', () => {
  it('parses extensions', () => {
    expect(getFileExtension('Notes.pages')).toBe('pages');
    expect(stripExtension('Notes.pages')).toBe('Notes');
  });

  it('hides extensions when requested', () => {
    expect(formatDisplayName('Budget.numbers', false)).toBe('Budget');
    expect(formatDisplayName('Budget.numbers', true)).toBe('Budget.numbers');
  });

  it('formats file sizes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('filters by accepted types', () => {
    const items = [
      { id: '1', name: 'Spec.pdf', extension: 'pdf' },
      { id: '2', name: 'Photo.jpg', extension: 'jpg' },
    ];
    expect(filterFilesByType(items, ['pdf']).map((item) => item.id)).toEqual(['1']);
  });

  it('adds edited suffix when autosave is on', () => {
    expect(documentTitleWithEditedSuffix('Untitled', true, true)).toBe('Untitled — Edited');
    expect(documentTitleWithEditedSuffix('Untitled', true, false)).toBe('Untitled');
  });

  it('detects previewable files', () => {
    expect(canPreviewFile({ url: '/a.png', type: 'image/png' })).toBe(true);
    expect(canPreviewFile({ extension: 'zip' })).toBe(false);
  });
});
