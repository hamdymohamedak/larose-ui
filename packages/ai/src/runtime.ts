import type { AIAdapter, FormFillResult, TableFilterResult } from './adapter';
import { parseIntent, type AIIntent } from './intent';
import { checkActionPermission } from './permissions';

export interface AIAuditEvent {
  intent: AIIntent;
  action: 'table.filter' | 'form.populate';
  allowed: boolean;
  permission?: string;
  timestamp: number;
}

export interface AIExecutionResult<T> {
  allowed: boolean;
  intent: AIIntent;
  permission?: string;
  denialReason?: string;
  result?: T;
}

export interface AIRuntimeConfig {
  adapter: AIAdapter;
  grantedPermissions?: string[];
  onAudit?: (event: AIAuditEvent) => void;
}

export interface AIRuntime {
  parseIntent: typeof parseIntent;
  filterTable: <T extends Record<string, unknown>>(
    query: string,
    data: T[],
    columns: Array<{ key: string; header: string }>,
    permission?: string,
  ) => Promise<AIExecutionResult<TableFilterResult<T>>>;
  populateForm: (
    query: string,
    fields: Array<{ name: string; label: string }>,
    permission?: string,
  ) => Promise<AIExecutionResult<FormFillResult>>;
}

export function createAIRuntime(config: AIRuntimeConfig): AIRuntime {
  const granted = config.grantedPermissions ?? [];

  const audit = (
    intent: AIIntent,
    action: AIAuditEvent['action'],
    allowed: boolean,
    permission?: string,
  ) => {
    config.onAudit?.({
      intent,
      action,
      allowed,
      permission,
      timestamp: Date.now(),
    });
  };

  return {
    parseIntent,

    async filterTable(query, data, columns, permission) {
      const intent = parseIntent(query);
      const access = checkActionPermission('table.filter', granted, permission);
      audit(intent, 'table.filter', access.allowed, access.permission);

      if (!access.allowed) {
        return {
          allowed: false,
          intent,
          permission: access.permission,
          denialReason: access.reason,
        };
      }

      const result = await config.adapter.filterTable(query, data, columns);
      return { allowed: true, intent, permission: access.permission, result };
    },

    async populateForm(query, fields, permission) {
      const intent = parseIntent(query);
      const access = checkActionPermission('form.populate', granted, permission);
      audit(intent, 'form.populate', access.allowed, access.permission);

      if (!access.allowed) {
        return {
          allowed: false,
          intent,
          permission: access.permission,
          denialReason: access.reason,
        };
      }

      const result = await config.adapter.populateForm(query, fields);
      return { allowed: true, intent, permission: access.permission, result };
    },
  };
}
