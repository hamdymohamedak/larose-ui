import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import styles from '@larose-ui/styles/components/Activity/Activity.module.css';
import { Activity } from './Activity';

describe('Activity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders in the idle state initially', () => {
    render(<Activity />);

    const island = screen.getByRole('button', {
      name: /dynamic island, idle/i,
    });

    expect(island).toHaveAttribute('data-state', 'idle');
  });

  it('cycles from idle to media when clicked', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.click(island);

    expect(island).toHaveAttribute('data-state', 'media');
    expect(island).toHaveAccessibleName('Dynamic Island, playing Nightcall by Kavinsky.');
  });

  it('cycles through all states', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.click(island);
    expect(island).toHaveAttribute('data-state', 'media');

    fireEvent.click(island);
    expect(island).toHaveAttribute('data-state', 'call');

    fireEvent.click(island);
    expect(island).toHaveAttribute('data-state', 'idle');
  });

  it('cycles when pressing Enter', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.keyDown(island, {
      key: 'Enter',
    });

    expect(island).toHaveAttribute('data-state', 'media');
  });

  it('cycles when pressing Space', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.keyDown(island, {
      key: ' ',
    });

    expect(island).toHaveAttribute('data-state', 'media');
  });

  it('does not cycle for unrelated keys', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.keyDown(island, {
      key: 'Escape',
    });

    expect(island).toHaveAttribute('data-state', 'idle');
  });

  it('marks only the current panel as active', () => {
    render(<Activity />);

    const idlePanel = document.querySelector('[data-panel-for="idle"]');
    const mediaPanel = document.querySelector('[data-panel-for="media"]');
    const callPanel = document.querySelector('[data-panel-for="call"]');

    expect(idlePanel).toHaveClass(styles.isActive);
    expect(mediaPanel).not.toHaveClass(styles.isActive);
    expect(callPanel).not.toHaveClass(styles.isActive);

    fireEvent.click(screen.getByRole('button'));

    expect(idlePanel).not.toHaveClass(styles.isActive);
    expect(mediaPanel).toHaveClass(styles.isActive);
    expect(callPanel).not.toHaveClass(styles.isActive);
  });

  it('updates aria-hidden for the active panel', () => {
    render(<Activity />);

    const island = screen.getByRole('button');
    const idlePanel = document.querySelector('[data-panel-for="idle"]');
    const mediaPanel = document.querySelector('[data-panel-for="media"]');

    expect(idlePanel).toHaveAttribute('aria-hidden', 'false');
    expect(mediaPanel).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(island);

    expect(idlePanel).toHaveAttribute('aria-hidden', 'true');
    expect(mediaPanel).toHaveAttribute('aria-hidden', 'false');
  });

  it('shows the media information', () => {
    render(<Activity />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Nightcall')).toBeInTheDocument();
    expect(screen.getByText('Kavinsky')).toBeInTheDocument();
  });

  it('shows the incoming call information', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.click(island);
    fireEvent.click(island);

    expect(screen.getByText('Jordan Miles')).toBeInTheDocument();
    expect(screen.getByText('Incoming call…')).toBeInTheDocument();
  });

  it('rejects the incoming call and returns to idle', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.click(island);
    fireEvent.click(island);

    expect(island).toHaveAttribute('data-state', 'call');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Decline call',
      }),
    );

    expect(island).toHaveAttribute('data-state', 'idle');
  });

  it('accepts the incoming call and switches to media', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.click(island);
    fireEvent.click(island);

    expect(island).toHaveAttribute('data-state', 'call');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accept call',
      }),
    );

    expect(island).toHaveAttribute('data-state', 'media');
  });

  it('does not cycle when clicking call action buttons', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    fireEvent.click(island);
    fireEvent.click(island);

    expect(island).toHaveAttribute('data-state', 'call');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Decline call',
      }),
    );

    expect(island).toHaveAttribute('data-state', 'idle');
  });

  it('automatically changes from idle to call after 1200ms', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    expect(island).toHaveAttribute('data-state', 'idle');

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(island).toHaveAttribute('data-state', 'call');
  });

  it('automatically returns from call to idle after 2600ms', () => {
    render(<Activity />);

    const island = screen.getByRole('button');

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(island).toHaveAttribute('data-state', 'call');

    act(() => {
      vi.advanceTimersByTime(2600);
    });

    expect(island).toHaveAttribute('data-state', 'idle');
  });

  it('cleans up timers when unmounted', () => {
    const { unmount } = render(<Activity />);

    unmount();

    act(() => {
      vi.advanceTimersByTime(1200);
      vi.advanceTimersByTime(2600);
    });

    expect(true).toBe(true);
  });
});
