import type {
  ComponentContract,
  ComponentContractMismatch,
  ComponentContractProp,
  ComponentContractValidationResult,
} from './types';

const DOM_INHERITED_PROPS = new Set([
  'className',
  'style',
  'id',
  'role',
  'tabIndex',
  'children',
  'ref',
  'key',
  'title',
  'lang',
  'dir',
  'hidden',
  'slot',
]);

export function isComponentContract(value: unknown): value is ComponentContract {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.name === 'string' && Array.isArray(record.props);
}

export function isDataContract(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    record.ui !== undefined &&
    record.api !== undefined &&
    !Array.isArray(record.props)
  );
}

/** Structural validation for stored component contract JSON. */
export function validateComponentContractSchema(
  contract: unknown,
): ComponentContractValidationResult {
  const mismatches: ComponentContractMismatch[] = [];

  if (!isComponentContract(contract)) {
    return {
      valid: false,
      mismatches: [
        {
          path: 'root',
          issue: 'invalid_schema',
          message: 'Contract must include name (string) and props (array)',
          severity: 'error',
        },
      ],
    };
  }

  if (!contract.name.trim()) {
    mismatches.push({
      path: 'name',
      issue: 'invalid_schema',
      message: 'Contract name must be non-empty',
      severity: 'error',
    });
  }

  for (const [index, prop] of contract.props.entries()) {
    if (!prop.name?.trim()) {
      mismatches.push({
        path: `props[${index}].name`,
        issue: 'invalid_schema',
        message: 'Prop name must be non-empty',
        severity: 'error',
      });
    }
  }

  if (contract.events) {
    for (const [index, event] of contract.events.entries()) {
      if (!event.name?.trim()) {
        mismatches.push({
          path: `events[${index}].name`,
          issue: 'invalid_schema',
          message: 'Event name must be non-empty',
          severity: 'error',
        });
      }
    }
  }

  return {
    valid: mismatches.filter((m) => m.severity === 'error').length === 0,
    mismatches,
  };
}

export interface CompareComponentContractsOptions {
  /** Prop names ignored when comparing (DOM passthrough). Default: inherited DOM props. */
  ignoreProps?: Set<string>;
  /** When true, extra implementation props are errors. Default: warnings. */
  strictExtraProps?: boolean;
}

/**
 * Compare a framework implementation against the canonical component contract.
 * Used by Doctor and future Vue/Svelte conformance tests.
 */
export function compareComponentContracts(
  implementation: ComponentContract,
  canonical: ComponentContract,
  options: CompareComponentContractsOptions = {},
): ComponentContractValidationResult {
  const ignoreProps = options.ignoreProps ?? DOM_INHERITED_PROPS;
  const mismatches: ComponentContractMismatch[] = [];

  const canonicalProps = indexProps(canonical.props, ignoreProps);
  const implProps = indexProps(implementation.props, ignoreProps);

  for (const [name, canonicalProp] of canonicalProps) {
    const implProp = implProps.get(name);
    if (!implProp) {
      mismatches.push({
        path: `props.${name}`,
        issue: 'missing_prop',
        message: `Implementation missing prop "${name}" defined in contract`,
        severity: canonicalProp.required ? 'error' : 'warning',
      });
      continue;
    }

    if (canonicalProp.type && implProp.type && canonicalProp.type !== implProp.type) {
      mismatches.push({
        path: `props.${name}.type`,
        issue: 'type_mismatch',
        message: `Type mismatch for "${name}": contract=${canonicalProp.type}, implementation=${implProp.type}`,
        severity: 'error',
      });
    }

    if (canonicalProp.required && !implProp.required) {
      mismatches.push({
        path: `props.${name}.required`,
        issue: 'required_mismatch',
        message: `"${name}" is required in contract but optional in implementation`,
        severity: 'warning',
      });
    }

    if (
      canonicalProp.default !== undefined &&
      implProp.default !== undefined &&
      canonicalProp.default !== implProp.default
    ) {
      mismatches.push({
        path: `props.${name}.default`,
        issue: 'default_mismatch',
        message: `Default mismatch for "${name}": contract=${canonicalProp.default}, implementation=${implProp.default}`,
        severity: 'warning',
      });
    }
  }

  for (const name of implProps.keys()) {
    if (canonicalProps.has(name)) continue;
    mismatches.push({
      path: `props.${name}`,
      issue: 'extra_prop',
      message: `Implementation exposes undeclared prop "${name}"`,
      severity: options.strictExtraProps ? 'error' : 'warning',
    });
  }

  const canonicalEvents = new Map(canonical.events.map((e) => [e.name, e]));
  const implEvents = new Map(implementation.events.map((e) => [e.name, e]));

  for (const [name, event] of canonicalEvents) {
    if (!implEvents.has(name)) {
      mismatches.push({
        path: `events.${name}`,
        issue: 'missing_event',
        message: `Implementation missing event "${name}" (${event.description ?? 'no description'})`,
        severity: 'error',
      });
    }
  }

  for (const name of implEvents.keys()) {
    if (!canonicalEvents.has(name)) {
      mismatches.push({
        path: `events.${name}`,
        issue: 'extra_event',
        message: `Implementation exposes undeclared event "${name}"`,
        severity: 'warning',
      });
    }
  }

  if (canonical.states?.length) {
    const implStates = new Set(implementation.states ?? []);
    for (const state of canonical.states) {
      if (!implStates.has(state)) {
        mismatches.push({
          path: `states.${state}`,
          issue: 'missing_state',
          message: `Implementation missing documented state "${state}"`,
          severity: 'warning',
        });
      }
    }
  }

  const canonicalA11y = new Set(canonical.accessibility?.requirements ?? []);
  const implA11y = new Set(implementation.accessibility?.requirements ?? []);
  for (const requirement of canonicalA11y) {
    if (!implA11y.has(requirement)) {
      mismatches.push({
        path: `accessibility.requirements`,
        issue: 'accessibility_regression',
        message: `Missing accessibility requirement: ${requirement}`,
        severity: 'error',
      });
    }
  }

  const canonicalKeyboard = new Set(canonical.keyboard?.behavior ?? []);
  const implKeyboard = new Set(implementation.keyboard?.behavior ?? []);
  for (const behavior of canonicalKeyboard) {
    if (!implKeyboard.has(behavior)) {
      mismatches.push({
        path: `keyboard.behavior`,
        issue: 'keyboard_divergence',
        message: `Missing keyboard behavior: ${behavior}`,
        severity: 'error',
      });
    }
  }

  return {
    valid: mismatches.filter((m) => m.severity === 'error').length === 0,
    mismatches,
  };
}

export function formatComponentContractReport(
  result: ComponentContractValidationResult,
): string {
  if (result.valid && result.mismatches.length === 0) {
    return 'Component contract validation passed.';
  }

  const lines = ['Component contract validation report:', ''];
  for (const m of result.mismatches) {
    lines.push(`[${m.severity.toUpperCase()}] ${m.path}: ${m.message}`);
  }
  lines.push('');
  lines.push(result.valid ? 'Result: PASS (warnings only)' : 'Result: FAIL');
  return lines.join('\n');
}

function indexProps(
  props: ComponentContractProp[],
  ignore: Set<string>,
): Map<string, ComponentContractProp> {
  const map = new Map<string, ComponentContractProp>();
  for (const prop of props) {
    if (ignore.has(prop.name)) continue;
    if (prop.name.startsWith('aria-') || prop.name.startsWith('data-')) continue;
    map.set(prop.name, prop);
  }
  return map;
}
