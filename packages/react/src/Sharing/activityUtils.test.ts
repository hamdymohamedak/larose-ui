import { describe, expect, it } from 'vitest';
import type { ActivityItem } from './types';
import {
  filterActivities,
  formatActivityTitle,
  isDuplicateSystemActivity,
  partitionActivities,
  prepareActivities,
  sortActivities,
} from './activityUtils';

const sample: ActivityItem[] = [
  { id: 'copy', title: 'Copy', kind: 'action', system: true },
  { id: 'copy-photo', title: 'Copy Photo', kind: 'app' },
  { id: 'messages', title: 'Messages', kind: 'share' },
  { id: 'print', title: 'Print', kind: 'action', system: true },
];

describe('Activity utils', () => {
  it('formats succinct titles', () => {
    expect(formatActivityTitle('  Print Transaction  ')).toBe('Print Transaction');
  });

  it('sorts app activities before share and system actions', () => {
    const sorted = sortActivities(sample);
    expect(sorted.map((item) => item.id)).toEqual([
      'copy-photo',
      'messages',
      'copy',
      'print',
    ]);
  });

  it('filters excluded activities', () => {
    expect(filterActivities(sample, ['print']).map((item) => item.id)).not.toContain('print');
  });

  it('partitions activities by kind', () => {
    const parts = partitionActivities(sample);
    expect(parts.app).toHaveLength(1);
    expect(parts.share).toHaveLength(1);
    expect(parts.actions).toHaveLength(2);
  });

  it('detects duplicate system action titles', () => {
    expect(isDuplicateSystemActivity('Copy', ['Copy', 'Print'])).toBe(true);
    expect(isDuplicateSystemActivity('Copy Photo', ['Copy'])).toBe(false);
  });

  it('prepares filtered and sorted activities', () => {
    const prepared = prepareActivities(sample, ['print']);
    expect(prepared.some((item) => item.id === 'print')).toBe(false);
    expect(prepared[0]?.id).toBe('copy-photo');
  });
});
