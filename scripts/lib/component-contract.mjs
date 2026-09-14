/** @typedef {import('../../packages/contracts/src/types.ts').ComponentContract} ComponentContract */
/** @typedef {import('../../packages/contracts/src/types.ts').ComponentContractProp} ComponentContractProp */
/** @typedef {import('../../packages/contracts/src/types.ts').ComponentContractEvent} ComponentContractEvent */

const KEYBOARD_BEHAVIORS = {
  Menu: ['arrow-navigation', 'type-ahead', 'mnemonics', 'accelerators', 'escape-close'],
  MenuBar: ['arrow-navigation', 'mnemonics', 'accelerators', 'submenu-scoping'],
  CommandPalette: ['arrow-navigation', 'type-ahead', 'escape-close', 'enter-activation'],
  Dialog: ['escape-close', 'focus-trap', 'restore-focus'],
  Modal: ['escape-close', 'focus-trap', 'restore-focus'],
  AlertDialog: ['escape-close', 'focus-trap', 'restore-focus'],
  Drawer: ['escape-close', 'focus-trap', 'restore-focus'],
  Popover: ['escape-close', 'arrow-navigation'],
  Select: ['arrow-navigation', 'type-ahead', 'enter-activation'],
  Tabs: ['arrow-navigation', 'roving-focus'],
  Combobox: ['arrow-navigation', 'type-ahead', 'enter-activation'],
  Tooltip: ['escape-close'],
  Accordion: ['arrow-navigation', 'enter-activation'],
  Switch: ['keyboard-accessible'],
  Checkbox: ['keyboard-accessible'],
  Button: ['keyboard-accessible'],
};

/** Neutral event name from React-style onFoo / Vue emit / Svelte onfoo. */
export function toNeutralEventName(name) {
  if (!name) return name;
  if (name.startsWith('on') && name.length > 2 && name[2] === name[2].toUpperCase()) {
    const rest = name.slice(2);
    return rest.charAt(0).toLowerCase() + rest.slice(1);
  }
  return name;
}

/** Neutral prop name (className → class, defaultValue stays). */
export function toNeutralPropName(name) {
  if (name === 'className') return 'class';
  if (name.endsWith('ClassName')) return `${name.slice(0, -'ClassName'.length)}Class`;
  return name;
}

/** Neutral slot name. */
export function toNeutralSlotName(name) {
  if (name === 'children') return 'default';
  return name;
}

/**
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 */
export function inferControlledBehavior(props) {
  const names = new Set(props.map((prop) => toNeutralPropName(prop.name)));
  /** @type {string[]} */
  const controlled = [];
  /** @type {string[]} */
  const uncontrolled = [];

  const pairs = [
    { value: 'value', change: 'onChange', uncontrolled: 'defaultValue' },
    { value: 'checked', change: 'onChange', uncontrolled: 'defaultChecked' },
    { value: 'open', change: 'onOpenChange', uncontrolled: 'defaultOpen' },
    { value: 'selected', change: 'onSelect', uncontrolled: 'defaultSelected' },
  ];

  for (const pair of pairs) {
    const hasValue = names.has(pair.value);
    const hasChange = props.some((p) => toNeutralEventName(p.name) === toNeutralEventName(pair.change));
    if (hasValue && hasChange) controlled.push(pair.value);
    if (names.has(pair.uncontrolled)) uncontrolled.push(pair.value);
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
  if (behavior.includes('arrow-navigation')) {
    keys.push('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');
  }

  if ((accessibilityNotes.length || isInteractiveName(componentName)) && !behavior.length) {
    behavior.push('keyboard-accessible');
  }
  if (!behavior.length) {
    behavior.push('not-focusable');
  }

  return {
    keys: keys.length ? keys : undefined,
    behavior: behavior.length ? behavior : undefined,
  };
}

function isInteractiveName(name) {
  return /Button|Dialog|Modal|Menu|Select|Switch|Checkbox|Input|Field|Picker|Tabs|Drawer|Popover|Tooltip|Accordion|Palette/i.test(
    name,
  );
}

/**
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 */
export function propsToContractProps(props) {
  return props
    .filter((prop) => !prop.inherited)
    .filter((prop) => !(prop.name.startsWith('on') && prop.name.length > 2 && /[A-Z]/.test(prop.name[2])))
    .map(
      /** @returns {ComponentContractProp} */ (prop) => ({
        name: toNeutralPropName(prop.name),
        type: normalizeContractType(prop.type),
        required: prop.required,
        default: prop.default,
        description: prop.description,
      }),
    );
}

/**
 * Map framework-specific types to neutral contract types.
 * @param {string | undefined} type
 */
export function normalizeContractType(type) {
  if (!type) return type;
  return type
    .replace(/\bReactNode\b/g, 'Node')
    .replace(/\bReact\.ReactNode\b/g, 'Node')
    .replace(/\bCSSProperties\b/g, 'Style')
    .replace(/\bReact\.CSSProperties\b/g, 'Style')
    .replace(/\bElementType\b/g, 'ElementTag')
    .replace(/\bReact\.ElementType\b/g, 'ElementTag')
    .replace(/\bHTMLAttributes<[^>]+>/g, 'HtmlAttributes')
    .replace(/\bButtonHTMLAttributes<[^>]+>/g, 'ButtonAttributes')
    .replace(/\bInputHTMLAttributes<[^>]+>/g, 'InputAttributes')
    .replace(/\bChangeEvent<[^>]+>/g, 'ChangeEvent')
    .replace(/\bMouseEvent<[^>]+>/g, 'MouseEvent')
    .replace(/\bKeyboardEvent<[^>]+>/g, 'KeyboardEvent')
    .replace(/\bFormEvent<[^>]+>/g, 'FormEvent')
    .replace(/\bRefObject<[^>]+>/g, 'Ref')
    .replace(/\bMutableRefObject<[^>]+>/g, 'Ref')
    .replace(/\bForwardedRef<[^>]+>/g, 'Ref');
}

/**
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 * @returns {ComponentContractEvent[]}
 */
export function propsToContractEvents(props) {
  return props
    .filter((prop) => prop.name.startsWith('on') && prop.name.length > 2 && /[A-Z]/.test(prop.name[2]))
    .map((prop) => ({
      name: toNeutralEventName(prop.name),
      payload: normalizeContractType(prop.type),
      description: prop.description,
    }));
}

/**
 * Infer baseline states when anatomy omits them.
 * @param {string} componentName
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 * @param {string[] | undefined} anatomyStates
 */
export function inferStates(componentName, props, anatomyStates) {
  if (anatomyStates?.length) {
    return anatomyStates.map((s) => (s === 'leaving' ? 'exiting' : s));
  }
  const names = new Set(props.map((p) => p.name));
  /** @type {string[]} */
  const states = ['default'];
  if (names.has('open') || names.has('defaultOpen')) {
    states.push('open', 'closed');
  }
  if (names.has('disabled')) states.push('disabled');
  if (names.has('loading')) states.push('loading');
  if (names.has('error')) states.push('error');
  if (KEYBOARD_BEHAVIORS[componentName]?.includes('focus-trap')) {
    if (!states.includes('entering')) states.push('entering', 'exiting');
  }
  return [...new Set(states)];
}

/**
 * @param {string} componentName
 * @param {string[]} accessibilityNotes
 * @param {import('./extract-component-api.mjs').DocsPropEntry[]} props
 */
export function buildAccessibilityContract(componentName, accessibilityNotes, props) {
  /** @type {string[]} */
  const requirements = [...accessibilityNotes];
  if (!requirements.length) {
    requirements.push('Supports ARIA attributes via standard HTML element props.');
    if (isInteractiveName(componentName)) {
      requirements.push('Keyboard accessible; disabled and loading states must be announced.');
    }
  }
  if (KEYBOARD_BEHAVIORS[componentName]?.includes('focus-trap')) {
    if (!requirements.some((r) => /focus/i.test(r))) {
      requirements.push('Focus is trapped while open and restored on close.');
    }
  }
  const aria = props.filter((p) => p.name.startsWith('aria-')).map((p) => p.name);
  return { requirements, aria };
}

/**
 * @param {string} componentName
 * @param {{
 *   props: import('./extract-component-api.mjs').DocsPropEntry[];
 *   events: import('./extract-component-api.mjs').DocsPropEntry[];
 *   accessibility: string[];
 * }} api
 * @param {Record<string, { slots?: string[]; states?: string[]; structure?: string[]; summary?: string; composition?: string }>} anatomy
 * @param {'react' | 'vue' | 'svelte' | 'neutral'} [_framework]
 * @returns {ComponentContract}
 */
export function toComponentContract(componentName, api, anatomy = {}, _framework = 'neutral') {
  const meta = anatomy[componentName] ?? {};
  const props = propsToContractProps(api.props);
  const events = propsToContractEvents(api.props);
  const { controlled, uncontrolled } = inferControlledBehavior(api.props);
  const keyboard = buildKeyboardContract(componentName, api.props, api.accessibility);
  const states = inferStates(componentName, api.props, meta.states);
  const accessibility = buildAccessibilityContract(componentName, api.accessibility, api.props);

  /** @type {Record<string, string>} */
  const defaults = {};
  for (const prop of props) {
    if (prop.default !== undefined) defaults[prop.name] = prop.default;
  }

  const slots = (meta.slots ?? []).map(toNeutralSlotName);

  /** @type {ComponentContract} */
  const contract = {
    name: componentName,
    version: '1',
    framework: 'neutral',
    purpose: meta.summary ?? `${componentName} component — see composition and states for behavior.`,
    composition: meta.composition,
    interactions: meta.structure,
    props,
    events,
    slots: slots.length ? slots : undefined,
    states,
    defaults: Object.keys(defaults).length ? defaults : undefined,
    accessibility,
    keyboard,
    controlled: controlled.length ? controlled : undefined,
    uncontrolled: uncontrolled.length ? uncontrolled : undefined,
    focus: KEYBOARD_BEHAVIORS[componentName]?.includes('focus-trap')
      ? ['trap-while-open', 'restore-on-close']
      : undefined,
    motion: KEYBOARD_BEHAVIORS[componentName]?.includes('focus-trap')
      ? ['enter', 'exit', 'reduced-motion']
      : undefined,
  };

  return contract;
}
