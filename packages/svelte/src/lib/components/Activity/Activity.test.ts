import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Activity from './Activity.svelte';

describe('Activity', () => {
  it('renders stub root', () => {
    render(Activity, { props: {} });
    expect(document.querySelector('[data-larose="Activity"]')).toBeTruthy();
    void screen;
  });
});
