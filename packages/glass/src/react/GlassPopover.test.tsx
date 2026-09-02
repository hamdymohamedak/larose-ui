import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { GlassPopover } from './GlassPopover';

describe('GlassPopover', () => {
  afterEach(() => {
    cleanup();
    document.getElementById('larose-glass-defs')?.remove();
    document.body.querySelectorAll('[role="dialog"]').forEach((el) => el.remove());
  });

  it('renders panel in document.body portal by default', async () => {
    render(
      <GlassPopover trigger={<span>Open</span>}>
        Popover body
      </GlassPopover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeTruthy();
      expect(document.body.contains(dialog)).toBe(true);
      expect(screen.getByText('Popover body')).toBeTruthy();
    });
  });

  it('closes on Escape', async () => {
    render(
      <GlassPopover trigger={<span>Menu</span>}>
        Content
      </GlassPopover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('returns focus to trigger after close', async () => {
    render(
      <GlassPopover trigger={<span>Focus test</span>}>
        Content
      </GlassPopover>,
    );

    const trigger = screen.getByRole('button', { name: 'Focus test' });
    trigger.focus();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});
