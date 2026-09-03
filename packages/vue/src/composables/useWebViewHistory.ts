import { computed, ref } from 'vue';
import {
  backWebViewHistory,
  createWebViewHistory,
  forwardWebViewHistory,
  navigateWebViewHistory,
  type WebViewHistoryState,
} from '../WebView/utils';

export function useWebViewHistory(initialUrl: string) {
  const state = ref<WebViewHistoryState>(createWebViewHistory(initialUrl));

  return {
    currentUrl: computed(() => state.value.current),
    canGoBack: computed(() => state.value.canGoBack),
    canGoForward: computed(() => state.value.canGoForward),
    navigate: (url: string) => {
      state.value = navigateWebViewHistory(state.value, url);
    },
    back: () => {
      state.value = backWebViewHistory(state.value);
    },
    forward: () => {
      state.value = forwardWebViewHistory(state.value);
    },
  };
}
