import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ObservabilityProvider,
  ObservedForm,
  ObservedComponent,
} from './react';
import { createNoopAdapter, createEventCollector } from '@larose-ui/observability-core';

describe('ObservedForm', () => {
  it('tracks form opened on mount', async () => {
    const collector = createEventCollector();
    render(
      <ObservabilityProvider collector={collector}>
        <ObservedForm name="test-form">
          <input name="email" aria-label="Email" />
        </ObservedForm>
      </ObservabilityProvider>,
    );

    await waitFor(() => {
      expect(collector.getFormFunnelMetrics('test-form').opens).toBe(1);
    });
  });

  it('tracks field focus', async () => {
    const collector = createEventCollector();
    render(
      <ObservabilityProvider collector={collector}>
        <ObservedForm name="test-form">
          <input name="email" aria-label="Email" />
        </ObservedForm>
      </ObservabilityProvider>,
    );

    await userEvent.click(screen.getByLabelText('Email'));
    expect(collector.getEvents({ type: 'form.field_focused' })).toHaveLength(1);
  });
});

describe('ObservedComponent', () => {
  it('tracks performance on render', () => {
    const collector = createEventCollector();
    render(
      <ObservabilityProvider collector={collector}>
        <ObservedComponent name="SlowTable">
          <div>Content</div>
        </ObservedComponent>
      </ObservabilityProvider>,
    );

    expect(collector.getEvents({ type: 'performance' })).toHaveLength(1);
  });
});

describe('ObservabilityProvider', () => {
  it('uses adapter', () => {
    const adapter = createNoopAdapter();
    const track = vi.spyOn(adapter, 'track');
    const collector = createEventCollector({ adapter });

    render(
      <ObservabilityProvider collector={collector}>
        <button onClick={() => collector.track({ type: 'interaction', component: 'btn' })}>
          Click
        </button>
      </ObservabilityProvider>,
    );

    collector.track({ type: 'interaction', component: 'btn' });
    expect(track).toHaveBeenCalled();
  });

  it('resets collector when tenant or user scope changes', () => {
    const collector = createEventCollector({ tenantId: 'tenant-a', userId: 'user-a' });
    collector.track({ type: 'interaction', component: 'btn' });
    expect(collector.getEvents()).toHaveLength(1);

    const { rerender } = render(
      <ObservabilityProvider collector={collector} tenantId="tenant-a" userId="user-a">
        <span>app</span>
      </ObservabilityProvider>,
    );

    rerender(
      <ObservabilityProvider collector={collector} tenantId="tenant-b" userId="user-a">
        <span>app</span>
      </ObservabilityProvider>,
    );

    expect(collector.getEvents()).toHaveLength(0);
  });
});
