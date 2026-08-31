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
  /** Source framework used to author the contract (neutral = hand-written). */
  framework?: 'react' | 'vue' | 'svelte' | 'neutral';
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
  | 'invalid_schema';

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
