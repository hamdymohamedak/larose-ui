import { createDocsWebMcpTools } from '@/webmcp/docs-tools';
import type { ModelContext } from '@/webmcp/model-context';

function resolveModelContext(): ModelContext | undefined {
  if (typeof document !== 'undefined' && document.modelContext) {
    return document.modelContext;
  }
  if (typeof navigator !== 'undefined' && navigator.modelContext) {
    return navigator.modelContext;
  }
  return undefined;
}

let registrationController: AbortController | undefined;

/**
 * Registers laRose docs tools with the WebMCP imperative API on page load.
 * Tools are unregistered when the page is hidden or unloaded.
 */
export function registerDocsWebMcpTools(): void {
  const modelContext = resolveModelContext();
  if (!modelContext?.registerTool) {
    return;
  }

  registrationController?.abort();
  registrationController = new AbortController();
  const { signal } = registrationController;

  const registerAll = async () => {
    for (const tool of createDocsWebMcpTools()) {
      if (signal.aborted) return;
      await modelContext.registerTool(tool, { signal });
    }
  };

  void registerAll().catch((error) => {
    if (signal.aborted) return;
    console.warn('[laRose docs] WebMCP tool registration failed:', error);
  });

  const unregister = () => registrationController?.abort();

  window.addEventListener('pagehide', unregister, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      unregister();
    }
  });
}
