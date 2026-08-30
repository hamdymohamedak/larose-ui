import { useCallback, useState } from 'react';
import type { WebViewHistoryState } from './utils';
import {
  backWebViewHistory,
  createWebViewHistory,
  forwardWebViewHistory,
  navigateWebViewHistory,
} from './utils';

export function useWebViewHistory(initialUrl: string) {
  const [state, setState] = useState<WebViewHistoryState>(() => createWebViewHistory(initialUrl));

  const navigate = useCallback((url: string) => {
    setState((current) => navigateWebViewHistory(current, url));
  }, []);

  const back = useCallback(() => {
    setState((current) => backWebViewHistory(current));
  }, []);

  const forward = useCallback(() => {
    setState((current) => forwardWebViewHistory(current));
  }, []);

  return {
    currentUrl: state.current,
    canGoBack: state.canGoBack,
    canGoForward: state.canGoForward,
    navigate,
    back,
    forward,
  };
}
