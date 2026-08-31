/** Playground controls — only safe, meaningful props per component. */
export const PLAYGROUND_CONTROLS = {
  Button: {
    children: { control: 'text', default: 'Save changes', label: 'Label' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      default: 'primary',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
    shape: { control: 'select', options: ['capsule', 'circle', 'roundedRect'], default: 'capsule' },
    buttonRole: {
      control: 'select',
      options: ['normal', 'primary', 'cancel', 'destructive'],
      default: 'normal',
    },
    disabled: { control: 'boolean', default: false },
    loading: { control: 'boolean', default: false },
    fullWidth: { control: 'boolean', default: false },
    iconOnly: { control: 'boolean', default: false },
  },
  Input: {
    label: { control: 'text', default: 'Email', label: 'Label' },
    placeholder: { control: 'text', default: 'you@company.com' },
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
    required: { control: 'boolean', default: false },
    disabled: { control: 'boolean', default: false },
    error: { control: 'text', default: '' },
  },
  Badge: {
    children: { control: 'text', default: 'Beta', label: 'Label' },
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
      default: 'info',
    },
  },
  Checkbox: {
    label: { control: 'text', default: 'Accept terms' },
    checked: { control: 'boolean', default: false },
    disabled: { control: 'boolean', default: false },
  },
  Switch: {
    label: { control: 'text', default: 'Notifications' },
    checked: { control: 'boolean', default: true },
    disabled: { control: 'boolean', default: false },
  },
  Progress: {
    value: { control: 'number', default: 65, min: 0, max: 100 },
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'], default: 'default' },
  },
  Alert: {
    children: { control: 'text', default: 'Your changes were saved.', label: 'Message' },
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
  },
  Card: {
    title: { control: 'text', default: 'Employee profile' },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
  },
  Select: {
    label: { control: 'text', default: 'Department' },
    placeholder: { control: 'text', default: 'Choose department' },
    disabled: { control: 'boolean', default: false },
  },
  Typography: {
    children: { control: 'text', default: 'Refined typography', label: 'Text' },
    role: {
      control: 'select',
      options: ['body', 'headline', 'title', 'subheadline', 'footnote', 'caption'],
      default: 'body',
    },
    muted: { control: 'boolean', default: false },
  },
};

/** Component anatomy for complex components. */
export const COMPONENT_ANATOMY = {
  Modal: {
    summary: 'Modal renders a portal overlay with focus trap and optional title/description.',
    structure: ['Modal (root portal)', 'Overlay', 'Content', 'Title', 'Description', 'Body (children)'],
    composition: 'Control open state externally. Provide title and description for accessible naming.',
    slots: ['children', 'overlay', 'content'],
    states: ['closed', 'open', 'entering', 'leaving'],
  },
  Drawer: {
    summary: 'Drawer slides in from the left or right edge with overlay dismissal.',
    structure: ['Drawer (root)', 'Overlay', 'Panel', 'Header', 'Body (children)'],
    composition: 'Pair with Button triggers. Configure side via defaultProps or prop.',
    slots: ['children'],
    states: ['closed', 'open'],
  },
  Dialog: {
    summary: 'Dialog is a lightweight modal surface for confirmations and forms.',
    structure: ['Dialog', 'Header', 'Title', 'Description', 'Actions'],
    composition: 'Use for focused tasks smaller than full Modal layouts.',
    slots: ['children'],
    states: ['closed', 'open'],
  },
  Popover: {
    summary: 'Popover anchors floating content to a trigger with collision handling.',
    structure: ['Popover', 'Trigger', 'Content'],
    composition: 'Keep content concise; prefer Tooltip for single-line hints.',
    slots: ['trigger', 'children'],
    states: ['closed', 'open'],
  },
  Card: {
    summary: 'Card groups related content with optional title and padding tokens.',
    structure: ['Card', 'Header/Title', 'Body', 'Footer actions'],
    composition: 'Use padding tokens or Card defaultProps for density consistency.',
    slots: ['children', 'title'],
    states: ['default'],
  },
  Select: {
    summary: 'Select provides a styled native-like picker with validation states.',
    structure: ['Select', 'Label', 'Trigger', 'Options list'],
    composition: 'Pass options array; pair with forms and validation messages.',
    slots: ['label'],
    states: ['default', 'disabled', 'error'],
  },
  CommandPalette: {
    summary: 'CommandPalette offers searchable command discovery with keyboard navigation.',
    structure: ['CommandPalette', 'Search input', 'Results groups', 'Items'],
    composition: 'Register commands with labels and onSelect handlers.',
    slots: ['commands'],
    states: ['closed', 'open'],
  },
  Picker: {
    summary: 'Picker covers date/time selection with wheel and calendar variants.',
    structure: ['Picker', 'Trigger', 'Panel', 'CalendarGrid / WheelColumn'],
    composition: 'Choose the picker variant matching platform expectations.',
    slots: ['label', 'value'],
    states: ['closed', 'open'],
  },
};

/** Components with story-driven example galleries. */
export const STORY_COMPONENT_MAP = {
  Button: 'Button.stories.tsx',
  Badge: 'Badge.stories.tsx',
  Checkbox: 'Checkbox.stories.tsx',
  Modal: 'Modal.stories.tsx',
  Drawer: 'Drawer.stories.tsx',
  Select: 'Select.stories.tsx',
  Switch: 'Switch.stories.tsx',
  Progress: 'Progress.stories.tsx',
  Popover: 'Popover.stories.tsx',
  Tooltip: 'Tooltip.stories.tsx',
  Textarea: 'Textarea.stories.tsx',
  Radio: 'Radio.stories.tsx',
};
