import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import {
  createAcceleratorRegistry,
  detectPlatform,
  matchKeyboardEvent,
  shouldHandleShortcut,
  type Accelerator,
  type AcceleratorHandler,
  type AcceleratorPlatform,
  type AcceleratorRegistry,
  type AcceleratorScope,
} from '@larose-ui/core';

export interface AcceleratorRegistrationOptions {
  id?: string;
  scope?: AcceleratorScope;
  priority?: number;
  allowInEditable?: boolean;
  enabled?: boolean;
}

interface AcceleratorContextValue {
  registry: AcceleratorRegistry;
  platform: AcceleratorPlatform;
  registerMenuHandler: (id: string, handler: (event: KeyboardEvent) => boolean) => () => void;
  setActiveMenuId: (id: string | null) => void;
}

const AcceleratorContext = createContext<AcceleratorContextValue | null>(null);

let registrationCounter = 0;

function nextRegistrationId(prefix: string): string {
  registrationCounter += 1;
  return `${prefix}-${registrationCounter}`;
}

export interface AcceleratorProviderProps {
  children: ReactNode;
  platform?: AcceleratorPlatform;
}

/**
 * Provides a shared accelerator registry and a single global keyboard listener.
 * Wrap your application (or use {@link LaRoseProvider} which includes this).
 */
export function AcceleratorProvider({ children, platform }: AcceleratorProviderProps) {
  const registryRef = useRef<AcceleratorRegistry | null>(null);
  if (!registryRef.current) {
    registryRef.current = createAcceleratorRegistry();
  }
  const registry = registryRef.current;

  const resolvedPlatform = platform ?? detectPlatform();
  const activeMenuIdRef = useRef<string | null>(null);
  const menuHandlersRef = useRef<Map<string, (event: KeyboardEvent) => boolean>>(new Map());

  const setActiveMenuId = useCallback((id: string | null) => {
    activeMenuIdRef.current = id;
  }, []);

  const registerMenuHandler = useCallback((id: string, handler: (event: KeyboardEvent) => boolean) => {
    menuHandlersRef.current.set(id, handler);
    return () => {
      menuHandlersRef.current.delete(id);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Menu-local handlers take precedence via registered menu callbacks
      const activeMenuId = activeMenuIdRef.current;
      if (activeMenuId) {
        const menuHandler = menuHandlersRef.current.get(activeMenuId);
        if (menuHandler?.(event)) return;
      }

      registry.handleEvent(event, {
        platform: resolvedPlatform,
        scopes: ['component', 'global'],
        target: event.target,
      });
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [registry, resolvedPlatform]);

  const value = useMemo(
    (): AcceleratorContextValue => ({
      registry,
      platform: resolvedPlatform,
      registerMenuHandler,
      setActiveMenuId,
    }),
    [registry, registerMenuHandler, resolvedPlatform, setActiveMenuId],
  );

  return <AcceleratorContext.Provider value={value}>{children}</AcceleratorContext.Provider>;
}

export function useAcceleratorContext(): AcceleratorContextValue | null {
  return useContext(AcceleratorContext);
}

/**
 * Register a global or component-scoped keyboard accelerator.
 * Replaces ad-hoc keydown listeners (e.g. command palette ⌘K).
 */
export function useAccelerator(
  accelerator: Accelerator,
  handler: () => void,
  options: AcceleratorRegistrationOptions = {},
): void {
  const context = useAcceleratorContext();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const enabled = options.enabled ?? true;
  const idRef = useRef(options.id ?? nextRegistrationId('accelerator'));

  useEffect(() => {
    if (!enabled) return;

    const invoke = () => handlerRef.current();

    if (context) {
      const entry: AcceleratorHandler = {
        id: idRef.current,
        accelerator,
        handler: invoke,
        scope: options.scope ?? 'global',
        priority: options.priority ?? 0,
        allowInEditable: options.allowInEditable,
        enabled: () => enabled,
      };
      return context.registry.register(entry);
    }

    // Fallback when no AcceleratorProvider is mounted
    const platform = detectPlatform();
    const onKeyDown = (event: KeyboardEvent) => {
      if (!matchKeyboardEvent(event, accelerator, { platform })) return;
      if (
        !shouldHandleShortcut({
          allowInEditable: options.allowInEditable,
          target: event.target,
        })
      ) {
        return;
      }
      event.preventDefault();
      invoke();
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [
    accelerator,
    context,
    enabled,
    options.allowInEditable,
    options.priority,
    options.scope,
  ]);
}

/** Hook for menu components to register menu-local keyboard handling. */
export function useMenuAcceleratorRegistration(
  menuId: string,
  handler: (event: KeyboardEvent) => boolean,
  isOpen: boolean,
): void {
  const context = useAcceleratorContext();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!context || !isOpen) return;

    context.setActiveMenuId(menuId);
    const unregister = context.registerMenuHandler(menuId, (event) =>
      handlerRef.current(event),
    );

    return () => {
      unregister();
      context.setActiveMenuId(null);
    };
  }, [context, isOpen, menuId]);
}
