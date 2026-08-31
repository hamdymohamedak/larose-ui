import type {
  ContractSchema,
  ContractValidationResult,
  ContractMismatch,
} from './types';

export function validateContract(
  ui: ContractSchema,
  api: ContractSchema,
): ContractValidationResult {
  const mismatches: ContractMismatch[] = [];
  const apiFields = new Map(api.fields.map((f) => [f.name, f]));
  const uiFields = new Map(ui.fields.map((f) => [f.name, f]));

  for (const uiField of ui.fields) {
    const apiField = apiFields.get(uiField.name);
    if (!apiField) {
      mismatches.push({
        field: uiField.name,
        issue: 'missing_in_api',
        message: `UI expects "${uiField.name}" but API schema does not include it`,
        severity: uiField.required ? 'error' : 'warning',
      });
      continue;
    }
    if (uiField.type && apiField.type && uiField.type !== apiField.type) {
      mismatches.push({
        field: uiField.name,
        issue: 'type_mismatch',
        message: `Type mismatch for "${uiField.name}": UI=${uiField.type}, API=${apiField.type}`,
        severity: 'error',
      });
    }
    if (uiField.required && !apiField.required) {
      mismatches.push({
        field: uiField.name,
        issue: 'required_mismatch',
        message: `"${uiField.name}" is required in UI but optional in API`,
        severity: 'warning',
      });
    }
  }

  for (const apiField of api.fields) {
    if (!uiFields.has(apiField.name) && apiField.required) {
      mismatches.push({
        field: apiField.name,
        issue: 'missing_in_ui',
        message: `API requires "${apiField.name}" but UI schema does not include it`,
        severity: 'error',
      });
    }
  }

  return {
    valid: mismatches.filter((m) => m.severity === 'error').length === 0,
    mismatches,
  };
}

export function formatContractReport(result: ContractValidationResult): string {
  if (result.valid && result.mismatches.length === 0) {
    return 'Contract validation passed.';
  }

  const lines = ['Contract validation report:', ''];
  for (const m of result.mismatches) {
    lines.push(`[${m.severity.toUpperCase()}] ${m.field}: ${m.message}`);
  }
  lines.push('');
  lines.push(result.valid ? 'Result: PASS (warnings only)' : 'Result: FAIL');
  return lines.join('\n');
}
