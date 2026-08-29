import { describe, expect, it } from 'vitest';
import type { UIEvent } from '@larose-ui/observability';
import { getComponentPerformance } from './componentPerformance';

describe('getComponentPerformance', () => {
  it('aggregates render metrics for a component', () => {
    const events: UIEvent[] = [
      {
        type: 'performance',
        component: 'EmployeeTable',
        timestamp: 1,
        metadata: { renderTimeMs: 10, threshold: 'ok' },
      },
      {
        type: 'performance',
        component: 'EmployeeTable',
        timestamp: 2,
        metadata: { renderTimeMs: 30, threshold: 'slow' },
      },
      {
        type: 'interaction',
        component: 'EmployeeTable',
        timestamp: 3,
      },
    ];

    const summary = getComponentPerformance(events);
    expect(summary.renderCount).toBe(2);
    expect(summary.lastRenderMs).toBe(30);
    expect(summary.avgRenderMs).toBe(20);
    expect(summary.threshold).toBe('slow');
  });

  it('returns empty summary when no performance events exist', () => {
    const summary = getComponentPerformance([]);
    expect(summary.renderCount).toBe(0);
    expect(summary.lastRenderMs).toBeNull();
  });
});
