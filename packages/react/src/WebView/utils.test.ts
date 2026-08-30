import { describe, expect, it } from 'vitest';
import {
  backWebViewHistory,
  createWebViewHistory,
  forwardWebViewHistory,
  navigateWebViewHistory,
} from './utils';

describe('WebView utils', () => {
  it('creates initial history', () => {
    const state = createWebViewHistory('https://example.com/a');
    expect(state.current).toBe('https://example.com/a');
    expect(state.canGoBack).toBe(false);
  });

  it('navigates forward through pages', () => {
    let state = createWebViewHistory('https://example.com/a');
    state = navigateWebViewHistory(state, 'https://example.com/b');
    expect(state.current).toBe('https://example.com/b');
    expect(state.canGoBack).toBe(true);
  });

  it('supports back and forward', () => {
    let state = createWebViewHistory('https://example.com/a');
    state = navigateWebViewHistory(state, 'https://example.com/b');
    state = backWebViewHistory(state);
    expect(state.current).toBe('https://example.com/a');
    expect(state.canGoForward).toBe(true);
    state = forwardWebViewHistory(state);
    expect(state.current).toBe('https://example.com/b');
  });
});
