/** @typedef {import('../../packages/contracts/src/types.ts').ComponentContract} ComponentContract */
/** @typedef {import('../../packages/contracts/src/types.ts').ComponentContractProp} ComponentContractProp */

const KEYBOARD_BEHAVIORS = {
  Menu: ['arrow-navigation', 'type-ahead', 'mnemonics', 'accelerators', 'escape-close'],
  MenuBar: ['arrow-navigation', 'mnemonics', 'accelerators', 'submenu-scoping'],
  CommandPalette: ['arrow-navigation', 'type-ahead', 'escape-close', 'enter-activation'],
  Dialog: ['escape-close', 'focus-trap', 'restore-focus'],
  Modal: ['escape-close', 'focus-trap', 'restore-focus'],
  AlertDialog: ['escape-close', 'focus-trap', 'restore-focus'],
  Drawer: ['escape-close', 'focus-trap'],
  Popover: ['escape-close', 'arrow-navigation'],
  Select: ['arrow-navigation', 'type-ahead', 'enter-activation'],
  Tabs: ['arrow-navigation', 'roving-focus'],
  Combobox: ['arrow-navigation', 'type-ahead', 'enter-activation'],
};

const CONTROLLED_PAIRS = [
  { value: 'value', change: 'onChange', uncontrolled: 'defaultValue' },
  { value: 'checked', change: 'onChange', uncontrolled: 'defaultChecked' },
  { value: 'open', change: 'onOpenChange', uncontrolled: 'defaultOpen' },
  { value: 'selected', change: 'onSelect', uncontrolled: 'defaultSelected' },
];

/**
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 */
export function inferControlledBehavior(props) {
  const names = new Set(props.map((prop) => prop.name));
  /** @type {string[]} */
  const controlled = [];
  /** @type {string[]} */
  const uncontrolled = [];

  for (const pair of CONTROLLED_PAIRS) {
    if (names.has(pair.value) && names.has(pair.change)) {
      controlled.push(pair.value);
    }
    if (names.has(pair.uncontrolled)) {
      uncontrolled.push(pair.value);
    }
  }

  return { controlled, uncontrolled };
}

/**
 * @param {string} componentName
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 * @param {string[]} accessibilityNotes
 */
export function buildKeyboardContract(componentName, props, accessibilityNotes) {
  /** @type {string[]} */
  const behavior = [...(KEYBOARD_BEHAVIORS[componentName] ?? [])];
  const propNames = new Set(props.map((prop) => prop.name));

  if (propNames.has('enableTypeAhead') && !behavior.includes('type-ahead')) {
    behavior.push('type-ahead');
  }
  if (propNames.has('enableMnemonics') && !behavior.includes('mnemonics')) {
    behavior.push('mnemonics');
  }
  if (propNames.has('accelerator') && !behavior.includes('accelerators')) {
    behavior.push('accelerators');
  }
  if (props.some((prop) => prop.name.startsWith('onKey')) && !behavior.includes('custom-keyboard')) {
    behavior.push('custom-keyboard');
  }

  /** @type {string[]} */
  const keys = [];
  if (behavior.includes('escape-close')) keys.push('Escape');
  if (behavior.includes('enter-activation')) keys.push('Enter');
  if (behavior.includes('arrow-navigation')) keys.push('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');

  if (accessibilityNotes.length && !behavior.length) {
    behavior.push('keyboard-accessible');
  }

  return {
    keys: keys.length ? keys : undefined,
    behavior: behavior.length ? behavior : undefined,
  };
}

/**
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 */
export function propsToContractProps(props) {
  return props
    .filter((prop) => !prop.inherited)
    .map(
      /** @returns {ComponentContractProp} */ (prop) => ({
        name: prop.name,
        type: prop.type,
        required: prop.required,
        default: prop.default,
        description: prop.description,
      }),
    );
}

/**
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 */
export function propsToContractEvents(props) {
  return props
    .filter((prop) => prop.name.startsWith('on') && prop.name.length > 2)
    .map((prop) => ({
      name: prop.name,
      payload: prop.type,
      description: prop.description,
    }));
}

/**
 * @param {string} componentName
 * @param {{
 *   props: import('./extract-component-api.mjs').DocsPropEntry[];
 *   events: import('./extract-component-api.mjs').DocsPropEntry[];
 *   accessibility: string[];
 * }} api
 * @param {Record<string, { slots?: string[]; states?: string[]; structure?: string[] }>} anatomy
 * @param {'react' | 'vue' | 'svelte' | 'neutral'} [framework]
 * @returns {ComponentContract}
 */
export function toComponentContract(componentName, api, anatomy = {}, framework = 'react') {
  const meta = anatomy[componentName] ?? {};
  const props = propsToContractProps(api.props);
  const events = propsToContractEvents(api.props);
  const { controlled, uncontrolled } = inferControlledBehavior(api.props);
  const keyboard = buildKeyboardContract(componentName, api.props, api.accessibility);

  /** @type {Record<string, string>} */
  const defaults = {};
  for (const prop of props) {
    if (prop.default !== undefined) defaults[prop.name] = prop.default;
  }

  /** @type {ComponentContract} */
  const contract = {
    name: componentName,
    version: '1',
    framework,
    props,
    events,
    slots: meta.slots,
    states: meta.states,
    defaults: Object.keys(defaults).length ? defaults : undefined,
    accessibility: {
      requirements: api.accessibility.length ? api.accessibility : undefined,
      aria: api.props.filter((p) => p.name.startsWith('aria-')).map((p) => p.name),
    },
    keyboard,
    controlled: controlled.length ? controlled : undefined,
    uncontrolled: uncontrolled.length ? uncontrolled : undefined,
  };

  if (contract.accessibility && !contract.accessibility.requirements && !contract.accessibility.aria?.length) {
    delete contract.accessibility;
  }

  return contract;
}
