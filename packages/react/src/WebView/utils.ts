export interface WebViewHistoryState {
  stack: string[];
  index: number;
  canGoBack: boolean;
  canGoForward: boolean;
  current: string;
}

export function createWebViewHistory(initial: string): WebViewHistoryState {
  return {
    stack: [initial],
    index: 0,
    canGoBack: false,
    canGoForward: false,
    current: initial,
  };
}

export function navigateWebViewHistory(state: WebViewHistoryState, url: string): WebViewHistoryState {
  const stack = [...state.stack.slice(0, state.index + 1), url];
  const index = stack.length - 1;
  return {
    stack,
    index,
    canGoBack: index > 0,
    canGoForward: false,
    current: url,
  };
}

export function backWebViewHistory(state: WebViewHistoryState): WebViewHistoryState {
  if (state.index <= 0) return state;
  const index = state.index - 1;
  return {
    ...state,
    index,
    canGoBack: index > 0,
    canGoForward: true,
    current: state.stack[index] ?? state.current,
  };
}

export function forwardWebViewHistory(state: WebViewHistoryState): WebViewHistoryState {
  if (state.index >= state.stack.length - 1) return state;
  const index = state.index + 1;
  return {
    ...state,
    index,
    canGoBack: true,
    canGoForward: index < state.stack.length - 1,
    current: state.stack[index] ?? state.current,
  };
}

export function buildSandboxAttribute(options?: {
  allowScripts?: boolean;
  allowForms?: boolean;
  allowSameOrigin?: boolean;
}): string | undefined {
  const flags: string[] = [];
  if (options?.allowScripts) flags.push('allow-scripts');
  if (options?.allowForms) flags.push('allow-forms');
  if (options?.allowSameOrigin) flags.push('allow-same-origin');
  return flags.length > 0 ? flags.join(' ') : undefined;
}
