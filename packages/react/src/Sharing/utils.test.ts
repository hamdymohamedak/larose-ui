import { describe, expect, it } from 'vitest';
import { formatSharePermissionSummary, collaboratorInitials } from './utils';

describe('Sharing utils', () => {
  it('summarizes invited edit permission', () => {
    expect(formatSharePermissionSummary('invited', 'edit')).toBe(
      'Only invited people can edit',
    );
  });

  it('summarizes everyone edit permission', () => {
    expect(formatSharePermissionSummary('everyone', 'edit')).toBe(
      'Everyone can make changes',
    );
  });

  it('derives initials from names', () => {
    expect(collaboratorInitials('Sara Ali')).toBe('SA');
  });
});
