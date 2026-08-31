/**
 * UI component lifecycle states supported across laRose.
 */
export type UIState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'empty'
  | 'disabled'
  | 'readonly'
  | 'unauthorized'
  | 'offline'
  | 'retrying';

/**
 * Async operation states for state-machine driven components.
 */
export type AsyncState =
  | 'idle'
  | 'loading'
  | 'submitting'
  | 'success'
  | 'error'
  | 'retrying';

export type Density = 'compact' | 'comfortable' | 'spacious';

export type ThemeMode = 'light' | 'dark';

export type Environment =
  | 'development'
  | 'staging'
  | 'production'
  | 'demo'
  | 'readonly'
  | 'maintenance';

export type NetworkCondition =
  | 'online'
  | 'fast'
  | 'offline'
  | 'slow'
  | 'intermittent'
  | 'high-latency'
  | 'failed'
  | 'recovering';

export type PermissionFallback =
  | 'visible'
  | 'hidden'
  | 'disabled'
  | 'readonly'
  | 'forbidden'
  | 'loading';

export type HttpErrorCode = 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503;

export interface ApiError {
  code: HttpErrorCode | number;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

export interface AsyncStateMachine<TData = unknown, TError = ApiError> {
  state: AsyncState;
  data: TData | null;
  error: TError | null;
  retryCount: number;
  send: (event: AsyncEvent) => void;
  reset: () => void;
}

export type AsyncEvent =
  | { type: 'START' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; data?: unknown }
  | { type: 'ERROR'; error?: unknown }
  | { type: 'RETRY' }
  | { type: 'RESET' };

export interface Permission {
  action: string;
  resource?: string;
  allowed: boolean;
  reason?: string;
}

export interface VersionInfo {
  frontend: string;
  backend?: string;
  compatible: boolean;
  warnings: string[];
}

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type Size = 'sm' | 'md' | 'lg';

/** Apple HIG button semantic roles — style, content, and role. */
export type ButtonRole = 'normal' | 'primary' | 'cancel' | 'destructive';

export type TypographyRole =
  | 'display'
  | 'largeTitle'
  | 'title'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption';

export interface ComponentStateProps {
  state?: UIState;
  loading?: boolean;
  error?: string | ApiError | null;
  disabled?: boolean;
  readonly?: boolean;
}

export function classifyHttpError(status: number, message?: string): ApiError {
  const defaultMessage = message ?? 'An unexpected error occurred';
  const retryable = status === 429 || status === 500 || status === 503;

  const messages: Partial<Record<HttpErrorCode, string>> = {
    401: 'You are not authenticated. Please sign in.',
    403: "You don't have permission to perform this action.",
    404: 'The requested resource was not found.',
    409: 'A conflict was detected. The resource may have been modified.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please wait before retrying.',
    500: 'A server error occurred. Please try again.',
    503: 'Service temporarily unavailable. Please try again.',
  };

  const code = status as HttpErrorCode;
  return {
    code: status,
    message: messages[code] ?? defaultMessage,
    retryable,
  };
}

export function createAsyncStateMachine<TData = unknown, TError = ApiError>(
  initialState: AsyncState = 'idle',
): AsyncStateMachine<TData, TError> {
  let state: AsyncState = initialState;
  let data: TData | null = null;
  let error: TError | null = null;
  let retryCount = 0;
  const listeners = new Set<() => void>();

  const notify = () => listeners.forEach((l) => l());

  const machine: AsyncStateMachine<TData, TError> = {
    get state() {
      return state;
    },
    get data() {
      return data;
    },
    get error() {
      return error;
    },
    get retryCount() {
      return retryCount;
    },
    send(event: AsyncEvent) {
      switch (event.type) {
        case 'START':
          state = 'loading';
          error = null;
          break;
        case 'SUBMIT':
          state = 'submitting';
          error = null;
          break;
        case 'SUCCESS':
          state = 'success';
          data = (event.data as TData) ?? data;
          error = null;
          break;
        case 'ERROR':
          state = 'error';
          error = (event.error as TError) ?? error;
          break;
        case 'RETRY':
          retryCount += 1;
          state = 'retrying';
          break;
        case 'RESET':
          state = 'idle';
          data = null;
          error = null;
          retryCount = 0;
          break;
      }
      notify();
    },
    reset() {
      machine.send({ type: 'RESET' });
    },
  };

  return machine;
}

export function resolveUIState(props: ComponentStateProps): UIState {
  if (props.state) return props.state;
  if (props.disabled) return 'disabled';
  if (props.readonly) return 'readonly';
  if (props.loading) return 'loading';
  if (props.error) return 'error';
  return 'idle';
}

export function createEventEmitter<T extends Record<string, unknown>>() {
  const listeners = new Map<keyof T, Set<(payload: T[keyof T]) => void>>();

  return {
    on<K extends keyof T>(event: K, listener: (payload: T[K]) => void) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener as (payload: T[keyof T]) => void);
      return () => listeners.get(event)?.delete(listener as (payload: T[keyof T]) => void);
    },
    emit<K extends keyof T>(event: K, payload: T[K]) {
      listeners.get(event)?.forEach((l) => l(payload));
    },
  };
}

export const LAROSE_VERSION = '0.1.0';

export { warnDeprecation, resetDeprecationWarnings } from './deprecation';

export type {
  SessionState,
  UserContext,
  TenantContext,
  FeatureFlagResult,
  A11yPreferences,
  VersionMatrix,
  NetworkSnapshot,
  PermissionSnapshot,
  FeatureFlagSnapshot,
  OfflineSnapshot,
  LocaleSnapshot,
  ThemeSnapshot,
  LaRoseRuntimeContext,
} from './runtime/types';
export { createDefaultRuntimeContext } from './runtime/types';

export type { RuntimeEventType, RuntimeEvent, RuntimeEventBus } from './runtime/eventBus';
export { createRuntimeEventBus } from './runtime/eventBus';

export type { SessionEvent, SessionStateMachine } from './runtime/session';
export { createSessionStateMachine } from './runtime/session';

export type {
  FeatureFlagEvaluationContext,
  FeatureFlagEvaluator,
  StaticFeatureFlagValue,
  PercentageRolloutConfig,
} from './runtime/featureFlags';
export {
  createStaticFeatureFlagEvaluator,
  createPercentageRolloutEvaluator,
  createCompositeFeatureFlagEvaluator,
} from './runtime/featureFlags';

export { detectA11yPreferences, subscribeA11yPreferences } from './runtime/a11y';

export type {
  SpringConfig,
  SpringPresetName,
  SpringState,
  ReducedMotionPolicy,
  MotionSemanticPreset,
} from './motion';
export {
  SPRING_PRESETS,
  getSpringPreset,
  stepSpring,
  isSpringSettled,
  animateSpringToTarget,
  springResponseTime,
  resolveReducedMotion,
  motionDuration,
} from './motion';

export { sanitizeNavigationUrl, isSafeRedirectPath } from './security/url';

export type {
  Accelerator,
  AcceleratorConflict,
  AcceleratorFormatOptions,
  AcceleratorHandler,
  AcceleratorMatchOptions,
  AcceleratorPlatform,
  AcceleratorScope,
  HandleAcceleratorEventOptions,
  RegisteredAccelerator,
  ShouldHandleShortcutOptions,
  StandardAcceleratorId,
} from './accelerator';
export {
  AcceleratorRegistry,
  STANDARD_ACCELERATORS,
  STANDARD_SHORTCUTS,
  acceleratorsEqual,
  acceleratorToId,
  createAcceleratorRegistry,
  detectPlatform,
  formatAccelerator,
  formatAriaKeyshortcuts,
  isAltMnemonicEvent,
  isEditableTarget,
  isModPressed,
  isValidAccelerator,
  looksLikeShortcutLabel,
  matchKeyboardEvent,
  matchTypeAheadPrefix,
  matchesMnemonicKey,
  normalizeAccelerator,
  normalizeEventKey,
  normalizeKey,
  parseAccelerator,
  parseMnemonicLabel,
  resolveMnemonicKey,
  resolveModRequirement,
  shouldHandleShortcut,
  stripMnemonicMarker,
} from './accelerator';
export type { ParsedMnemonic } from './accelerator';
