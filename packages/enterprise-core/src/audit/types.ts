export interface AuditEntry {
  id: string;
  field: string;
  actor: string;
  before: string;
  after: string;
  timestamp: string;
  resourceId?: string;
}

export interface AuditContextValue {
  actor: string;
  entries: AuditEntry[];
  recordChange: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'actor'>) => void;
  getHistory: (field: string, resourceId?: string) => AuditEntry[];
}
