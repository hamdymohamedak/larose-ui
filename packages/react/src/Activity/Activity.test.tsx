import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Activity } from './Activity';

describe('Activity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders summary props and hides free children while collapsed', () => {
    render(
      <Activity title="Uploading" description="Project.zip" icon="↑">
        <span>Detail panel</span>
      </Activity>,
    );

    const root = screen.getByRole('button');
    expect(screen.getByText('Uploading')).toBeInTheDocument();
    expect(screen.getByText('Project.zip')).toBeInTheDocument();
    expect(root).toHaveAttribute('data-larose', 'Activity');
    expect(root).toHaveAttribute('data-mode', 'collapsed');
    expect(root).toHaveAttribute('data-expandable', 'true');

    const detail = screen.getByText('Detail panel', { hidden: true });
    expect(detail.closest('[data-slot="body"]')).toHaveAttribute('data-open', 'false');
  });

  it('reveals centered children when expanded', () => {
    render(
      <Activity title="Uploading" defaultExpanded>
        <span>Detail panel</span>
      </Activity>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('data-mode', 'expanded');
    expect(screen.getByRole('button')).toHaveAttribute('data-has-body', 'true');
    expect(screen.getByText('Detail panel')).toBeInTheDocument();
  });

  it('applies mode, status, and priority data attributes', () => {
    render(
      <Activity
        mode="expanded"
        status="progress"
        priority="long-running"
        title="Deploy"
        progress={40}
        expandable={false}
      />,
    );

    const root = screen.getByRole('status');
    expect(root).toHaveAttribute('data-mode', 'expanded');
    expect(root).toHaveAttribute('data-status', 'progress');
    expect(root).toHaveAttribute('data-priority', 'long-running');
  });

  it('supports style and className customization', () => {
    render(
      <Activity
        title="Sync"
        expandable={false}
        className="custom-activity"
        style={{ ['--lr-activity-bg' as string]: '#111827', marginTop: 8 }}
      />,
    );

    const root = screen.getByRole('status');
    expect(root).toHaveClass('custom-activity');
    expect(root).toHaveStyle({ marginTop: '8px' });
  });

  it('renders a progress meter from the progress prop', () => {
    render(<Activity title="Uploading" status="progress" progress={80} expandable={false} />);

    const meter = screen.getByRole('progressbar');
    expect(meter).toHaveAttribute('aria-valuenow', '80');
  });

  it('clamps progress between 0 and 100', () => {
    const { rerender } = render(
      <Activity progress={150} status="progress" title="Job" expandable={false} />,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<Activity progress={-20} status="progress" title="Job" expandable={false} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('toggles collapsed and expanded by default', () => {
    render(<Activity title="AI generation" description="Drafting summary…" />);

    const root = screen.getByRole('button');
    expect(root).toHaveAttribute('data-mode', 'collapsed');
    expect(root).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(root);
    expect(root).toHaveAttribute('data-mode', 'expanded');
    expect(root).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(root, { key: 'Enter' });
    expect(root).toHaveAttribute('data-mode', 'collapsed');
  });

  it('auto-expands after expandAfter delay', () => {
    render(<Activity title="Uploading" expandAfter={1200} />);

    const root = screen.getByRole('button');
    expect(root).toHaveAttribute('data-mode', 'collapsed');

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(root).toHaveAttribute('data-mode', 'expanded');
  });

  it('supports controlled expanded state', () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <Activity expanded={false} onExpandedChange={onExpandedChange} title="Payment" />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('data-mode', 'collapsed');

    rerender(<Activity expanded onExpandedChange={onExpandedChange} title="Payment" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-mode', 'expanded');
  });

  it('keeps persistent mode from collapsing on click', () => {
    render(<Activity mode="persistent" title="Recording" description="00:12" />);

    const root = screen.getByRole('button');
    expect(root).toHaveAttribute('data-mode', 'persistent');
    fireEvent.click(root);
    expect(root).toHaveAttribute('data-mode', 'persistent');
  });

  it('supports compound slots for custom layouts', () => {
    render(
      <Activity mode="expanded" status="interactive" aria-label="Upload activity" expandable={false}>
        <Activity.Leading>
          <span data-testid="leading">●</span>
        </Activity.Leading>
        <Activity.Content>
          <Activity.Meta>
            <span>Uploading</span>
            <span>Project.zip</span>
          </Activity.Meta>
          <Activity.Actions>
            <button type="button">Cancel</button>
            <button type="button">Details</button>
          </Activity.Actions>
        </Activity.Content>
        <Activity.Trailing>
          <span>80%</span>
        </Activity.Trailing>
      </Activity>,
    );

    expect(screen.getByTestId('leading')).toBeInTheDocument();
    expect(screen.getByText('Uploading')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders leading and trailing props', () => {
    render(
      <Activity
        title="Nightcall"
        description="Kavinsky"
        expandable={false}
        leading={<span data-testid="art">art</span>}
        trailing={<span data-testid="wave">wave</span>}
      />,
    );

    expect(screen.getByTestId('art')).toBeInTheDocument();
    expect(screen.getByTestId('wave')).toBeInTheDocument();
  });

  it('renders an icon prop in the leading slot', () => {
    render(
      <Activity
        title="Uploading"
        description="Project.zip"
        status="progress"
        progress={80}
        expandable={false}
        icon={<span data-testid="upload-icon">↑</span>}
      />,
    );

    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('data-has-icon', 'true');
  });

  it('renders multiple actions with independent handlers', () => {
    const onCancel = vi.fn();
    const onDetails = vi.fn();

    render(
      <Activity
        mode="expanded"
        title="Uploading"
        description="Project.zip"
        expandable={false}
        actions={[
          { label: 'Cancel', onClick: onCancel },
          { label: 'Details', onClick: onDetails, variant: 'primary' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onDetails).toHaveBeenCalledTimes(1);
  });

  it('does not toggle expand when an action button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <Activity
        defaultExpanded
        title="Uploading"
        actions={[{ label: 'Cancel', onClick: onCancel }]}
      />,
    );

    const root = screen.getByRole('button', { name: /uploading/i });
    expect(root).toHaveAttribute('data-mode', 'expanded');

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(root).toHaveAttribute('data-mode', 'expanded');
  });

  it('hides collapsed content as an empty pill until expand', () => {
    render(
      <Activity
        hideCollapsedContent
        title="Uploading"
        description="Project.zip"
        icon="↑"
        expandedSize={{ minHeight: '9rem', height: '9rem' }}
      >
        <span>Detail panel</span>
      </Activity>,
    );

    const root = screen.getByRole('button', { name: /uploading/i });
    expect(root).toHaveAttribute('data-mode', 'collapsed');
    expect(root).toHaveAttribute('data-hide-collapsed-content', 'true');
    expect(screen.getByText('Uploading', { hidden: true }).closest('[data-slot="summary"]')).toHaveAttribute(
      'data-open',
      'false',
    );

    fireEvent.click(root);
    expect(root).toHaveAttribute('data-mode', 'expanded');
    expect(screen.getByText('Uploading')).toBeVisible();
    expect(screen.getByText('Detail panel')).toBeInTheDocument();
  });

  it('applies expandedSize CSS variables', () => {
    render(
      <Activity
        defaultExpanded
        title="Sync"
        expandedSize={{ width: 400, minHeight: '12rem', height: '12rem' }}
      />,
    );

    const root = screen.getByRole('button');
    expect(root).toHaveStyle({
      '--lr-activity-width-expanded': '400px',
      '--lr-activity-min-height-expanded': '12rem',
      '--lr-activity-height-expanded': '12rem',
    });
  });

  it('applies expandDuration CSS variables', () => {
    render(<Activity title="Sync" expandDuration={1200} />);

    const root = screen.getByRole('button');
    expect(root).toHaveStyle({
      '--lr-activity-duration-size': '1200ms',
    });
  });
});
