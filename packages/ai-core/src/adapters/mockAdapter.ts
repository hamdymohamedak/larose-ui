import type { AIAdapter, FormFillResult, TableFilterResult } from '../adapter';

function extractNumber(text: string, fallback: number): number {
  const match = text.match(/(\d+)/);
  return match ? Number(match[1]) : fallback;
}

function extractName(text: string): string | null {
  const match = text.match(/(?:for|named|called)\s+([A-Za-z\u0600-\u06FF\s]+)/i);
  return match?.[1]?.trim() ?? null;
}

export function createMockAdapter(): AIAdapter {
  return {
    async filterTable(query, data, columns) {
      const lower = query.toLowerCase();

      if (lower.includes('late') && lower.includes('more than')) {
        const threshold = extractNumber(lower, 3);
        const key = columns.find((c) => c.key.includes('late'))?.key ?? 'lateCount';
        const filtered = data.filter((row) => Number(row[key] ?? 0) > threshold);
        return {
          data: filtered,
          explanation: `Showing records where ${key} > ${threshold}`,
        };
      }

      if (lower.includes('department')) {
        const deptMatch = lower.match(/department\s+(\w+)/);
        const dept = deptMatch?.[1];
        if (dept) {
          const filtered = data.filter(
            (row) => String(row.department ?? '').toLowerCase() === dept.toLowerCase(),
          );
          return {
            data: filtered,
            explanation: `Filtered by department: ${dept}`,
          };
        }
      }

      const nameKey = columns.find((c) => c.key === 'name')?.key ?? 'name';
      const term = lower.replace(/show|employees|who|were|this|month|the|that/g, '').trim();
      if (term.length > 2) {
        const filtered = data.filter((row) =>
          String(row[nameKey] ?? '').toLowerCase().includes(term),
        );
        if (filtered.length > 0) {
          return { data: filtered, explanation: `Matched name containing "${term}"` };
        }
      }

      return { data, explanation: 'No filter applied — showing all records' };
    },

    async populateForm(query, fields) {
      const lower = query.toLowerCase();
      const values: Record<string, string> = {};
      let explanation = 'Populated fields from natural language';

      const name = extractName(query);
      if (name) {
        const nameField = fields.find((f) => f.name === 'name' || f.label.toLowerCase().includes('name'));
        if (nameField) values[nameField.name] = name;
      }

      if (lower.includes('engineer') || lower.includes('developer')) {
        const roleField = fields.find((f) => f.name === 'role' || f.label.toLowerCase().includes('role'));
        if (roleField) values[roleField.name] = 'Engineer';
      }

      if (lower.includes('hr') || lower.includes('human resources')) {
        const deptField = fields.find((f) => f.name === 'department');
        if (deptField) values[deptField.name] = 'HR';
      }

      if (Object.keys(values).length === 0) {
        explanation = 'Could not infer fields — try "Create employee for Ahmed Mohamed"';
      }

      return { values, explanation };
    },
  };
}

export type { TableFilterResult, FormFillResult };
