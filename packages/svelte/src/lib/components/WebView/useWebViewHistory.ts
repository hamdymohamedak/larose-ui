import { writable, derived, type Readable } from 'svelte/store';
import {
  backWebViewHistory,
  createWebViewHistory,
  forwardWebViewHistory,
  navigateWebViewHistory,
} from '../../WebView/utils';

export function useWebViewHistory(initialUrl: string) {
  const state = writable(createWebViewHistory(initialUrl));

  return {
    currentUrl: derived(state, (value) => value.current) as Readable<string>,
    canGoBack: derived(state, (value) => value.canGoBack) as Readable<boolean>,
    canGoForward: derived(state, (value) => value.canGoForward) as Readable<boolean>,
    navigate: (url: string) => state.update((current) => navigateWebViewHistory(current, url)),
    back: () => state.update((current) => backWebViewHistory(current)),
    forward: () => state.update((current) => forwardWebViewHistory(current)),
  };
}
