import type { AIIntent, AIIntentType } from './intent';

export interface IntentPermissionResult {
  allowed: boolean;
  permission?: string;
  reason?: string;
}

const DEFAULT_INTENT_PERMISSIONS: Partial<Record<AIIntentType, string>> = {
  'table.filter': 'employees.read',
  'form.populate': 'employees.write',
};

export function resolveIntentPermission(
  intent: AIIntent,
  override?: string,
): string | undefined {
  if (override) return override;
  return DEFAULT_INTENT_PERMISSIONS[intent.type];
}

export function checkActionPermission(
  action: AIIntentType,
  granted: string[],
  requiredPermission?: string,
): IntentPermissionResult {
  const intent: AIIntent = {
    type: action,
    raw: '',
    sanitized: '',
    confidence: 'high',
    keywords: [],
  };
  return checkIntentPermission(intent, granted, requiredPermission);
}

export function checkIntentPermission(
  intent: AIIntent,
  granted: string[],
  requiredPermission?: string,
): IntentPermissionResult {
  const permission = resolveIntentPermission(intent, requiredPermission);

  if (intent.type === 'unknown') {
    return {
      allowed: false,
      reason: 'Could not determine intent — try a clearer prompt',
    };
  }

  if (!permission) {
    return { allowed: true };
  }

  if (granted.includes(permission)) {
    return { allowed: true, permission };
  }

  return {
    allowed: false,
    permission,
    reason: `Missing permission: ${permission}`,
  };
}
