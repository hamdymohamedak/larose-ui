/** Legacy UI ↔ API field contract (forms / data layer). */
export interface ContractField {
  name: string;
  type?: string;
  required?: boolean;
}

export interface ContractSchema {
  name: string;
  fields: ContractField[];
}

export interface ContractMismatch {
  field: string;
  issue: 'missing_in_api' | 'missing_in_ui' | 'type_mismatch' | 'required_mismatch';
  message: string;
  severity: 'error' | 'warning';
}

export interface ContractValidationResult {
  valid: boolean;
  mismatches: ContractMismatch[];
}

/** Framework-neutral component contract — canonical API surface. */
export interface ComponentContractProp {
  name: string;
  type?: string;
  required?: boolean;
  default?: string;
  description?: string;
}

export interface ComponentContractEvent {
  name: string;
  payload?: string;
  description?: string;
}

export interface ComponentContractAccessibility {
  role?: string;
  requirements?: string[];
  aria?: string[];
}

export interface ComponentContractKeyboard {
  keys?: string[];
  behavior?: string[];
}

export interface ComponentContract {
  name: string;
  version?: string;
  /** Canonical contracts are framework-agnostic (`neutral`). */
  framework?: 'react' | 'vue' | 'svelte' | 'neutral';
  /** What the component does (framework-independent). */
  purpose?: string;
  /** Composition / nesting guidance. */
  composition?: string;
  /** Structural / interaction outline. */
  interactions?: string[];
  props: ComponentContractProp[];
  events: ComponentContractEvent[];
  slots?: string[];
  variants?: Record<string, string[]>;
  states?: string[];
  defaults?: Record<string, string>;
  accessibility?: ComponentContractAccessibility;
  keyboard?: ComponentContractKeyboard;
  controlled?: string[];
  uncontrolled?: string[];
  /** Focus ownership rules. */
  focus?: string[];
  /** Motion semantics to preserve across frameworks. */
  motion?: string[];
}

export type ComponentContractIssue =
  | 'missing_prop'
  | 'extra_prop'
  | 'type_mismatch'
  | 'required_mismatch'
  | 'default_mismatch'
  | 'missing_event'
  | 'extra_event'
  | 'missing_state'
  | 'accessibility_regression'
  | 'keyboard_divergence'
  | 'invalid_schema'
  | 'missing_purpose'
  | 'missing_accessibility'
  | 'missing_keyboard';

export interface ComponentContractMismatch {
  path: string;
  issue: ComponentContractIssue;
  message: string;
  severity: 'error' | 'warning';
}

export interface ComponentContractValidationResult {
  valid: boolean;
  mismatches: ComponentContractMismatch[];
}

/** Behavioral parity checklist row for one component across frameworks. */
export type ParityStatus = 'pass' | 'fail' | 'partial' | 'n/a' | 'unverified';

export interface ComponentParityBehaviors {
  initialState: ParityStatus;
  openClose: ParityStatus;
  keyboard: ParityStatus;
  focus: ParityStatus;
  accessibility: ParityStatus;
  controlledState: ParityStatus;
  uncontrolledState: ParityStatus;
  events: ParityStatus;
  motion: ParityStatus;
  portal: ParityStatus;
  visual: ParityStatus;
}

export interface ComponentParityMatrixEntry {
  component: string;
  frameworks: {
    react: boolean;
    vue: boolean;
    svelte: boolean;
  };
  behaviors: ComponentParityBehaviors;
  /** Shared component-logic module path when present. */
  sharedLogic?: string | null;
  notes?: string[];
}

export interface ComponentParityMatrix {
  version: number;
  updatedAt: string;
  behaviors: (keyof ComponentParityBehaviors)[];
  entries: ComponentParityMatrixEntry[];
}
