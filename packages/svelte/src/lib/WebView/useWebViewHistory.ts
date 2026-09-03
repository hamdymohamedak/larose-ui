import { writable, derived, type Readable } from 'svelte/store';
import {
  backWebViewHistory,
  createWebViewHistory,
  forwardWebViewHistory,
  navigateWebViewHistory,
  type WebViewHistoryState,
} from './utils';

export function useWebViewHistory(initialUrl: string) {
  const state = writable<WebViewHistoryState>(createWebViewHistory(initialUrl));

  return {
    currentUrl: derived(state, ($s) => $s.current) as Readable<string>,
    canGoBack: derived(state, ($s) => $s.canGoBack),
    canGoForward: derived(state, ($s) => $s.canGoForward),
    navigate: (url: string) => state.update((current) => navigateWebViewHistory(current, url)),
    back: () => state.update((current) => backWebViewHistory(current)),
    forward: () => state.update((current) => forwardWebViewHistory(current)),
  };
}
