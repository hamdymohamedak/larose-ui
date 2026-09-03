/**
 * Compact parity definitions — prefer defineSlotParity / definePropsParity here.
 * Complex demos stay in demos.tsx.
 */
import {
  Alert,
  AsyncButton,
  Badge,
  Box,
  Breadcrumb,
  Button,
  Card,
  Chart,
  Checkbox,
  Collection,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  EmptyState,
  FilePreview,
  FileUpload,
  FormContinue,
  HelpButton,
  ImageButton,
  ImageView,
  ImageWell,
  Input,
  Label,
  LiquidGlassButton,
  LiquidGlassCheckbox,
  LiquidGlassProgress,
  LiquidGlassRange,
  LiquidGlassSwitch,
  LockupCard,
  MenuBar,
  Monogram,
  Ornament,
  OutlineView,
  Pagination,
  PathControl,
  Picker,
  PopUpButton,
  Poster,
  Progress,
  PullDownButton,
  Radio,
  SearchField,
  SecureField,
  Select,
  ShareButton,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
  TextView,
  TimePicker,
  TokenField,
  Toolbar,
  Typography,
  UnsavedIndicator,
  WheelPicker,
  CaptionButton,
  CollaborationButton,
  DisclosureTriangle,
} from '@larose-ui/react';
import type { CrossFrameworkComponentDefinition } from '../types';
import { defineSlotParity, definePropsParity } from '../defineParity';
import {
  DEFAULT_CHART_DATA,
  DEFAULT_COLLABORATORS,
  DEFAULT_COLLECTION_ITEMS,
  DEFAULT_OUTLINE_NODES,
  DEFAULT_PATH_SEGMENTS,
  DEFAULT_PICKER_COLUMNS,
  DEFAULT_POPUP_OPTIONS,
  DEFAULT_PULLDOWN_ENTRIES,
  DEFAULT_SAMPLE_IMAGE,
  DEFAULT_TOKENS,
  DEFAULT_WHEEL_COLUMNS,
} from './defaults';

export const foundationRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  badge: defineSlotParity({
    id: 'badge',
    displayName: 'Badge',
    defaultSlot: 'Draft',
    propKeys: ['variant'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['default', 'info', 'success', 'warning', 'error'],
      },
    },
    Component: Badge,
  }),

  button: defineSlotParity({
    id: 'button',
    displayName: 'Button',
    defaultSlot: 'Save',
    propKeys: ['variant', 'size', 'buttonRole', 'loading', 'disabled'],
    defaultProps: { variant: 'primary', size: 'md', buttonRole: 'normal' },
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      },
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
      buttonRole: {
        control: 'select',
        options: ['normal', 'primary', 'cancel', 'destructive'],
      },
      loading: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    Component: Button,
  }),

  label: defineSlotParity({
    id: 'label',
    displayName: 'Label',
    defaultSlot: 'Email',
    propKeys: ['importance', 'htmlFor'],
    argTypes: {
      importance: { control: 'select', options: ['primary', 'secondary'] },
      htmlFor: { control: 'text' },
    },
    Component: Label,
  }),

  spinner: definePropsParity({
    id: 'spinner',
    displayName: 'Spinner',
    propKeys: ['size'],
    argTypes: {
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
    Component: Spinner,
  }),

  input: definePropsParity({
    id: 'input',
    displayName: 'Input',
    propKeys: ['label', 'value', 'placeholder', 'disabled', 'error', 'hint'],
    defaultProps: { label: 'Email', value: '' },
    mapExtraProps: (args) => ({
      modelValue: typeof args.value === 'string' ? args.value : '',
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      placeholder: { control: 'text' },
      disabled: { control: 'boolean' },
      error: { control: 'text' },
      hint: { control: 'text' },
    },
    Component: Input,
  }),

  textarea: definePropsParity({
    id: 'textarea',
    displayName: 'Textarea',
    propKeys: ['label', 'value', 'rows', 'disabled'],
    defaultProps: { label: 'Notes', value: '' },
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      rows: { control: 'number' },
      disabled: { control: 'boolean' },
    },
    Component: Textarea,
  }),

  checkbox: definePropsParity({
    id: 'checkbox',
    displayName: 'Checkbox',
    propKeys: ['label', 'checked', 'disabled'],
    defaultProps: { label: 'Accept terms' },
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    Component: Checkbox,
  }),

  radio: definePropsParity({
    id: 'radio',
    displayName: 'Radio',
    propKeys: ['label', 'name', 'value', 'checked', 'disabled'],
    defaultProps: { label: 'Option A', name: 'demo', value: 'a' },
    argTypes: {
      label: { control: 'text' },
      name: { control: 'text' },
      value: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    Component: Radio,
  }),

  switch: definePropsParity({
    id: 'switch',
    displayName: 'Switch',
    propKeys: ['label', 'checked', 'disabled'],
    defaultProps: { label: 'Notifications' },
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    Component: Switch,
  }),

  select: definePropsParity({
    id: 'select',
    displayName: 'Select',
    propKeys: ['label', 'value', 'disabled', 'options'],
    defaultProps: {
      label: 'Country',
      value: 'us',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'de', label: 'Germany' },
        { value: 'eg', label: 'Egypt' },
      ],
    },
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      disabled: { control: 'boolean' },
    },
    Component: Select,
  }),

  progress: definePropsParity({
    id: 'progress',
    displayName: 'Progress',
    propKeys: ['value', 'max', 'variant', 'label'],
    defaultProps: { value: 40, max: 100 },
    argTypes: {
      value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
      max: { control: 'number' },
      variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
      label: { control: 'text' },
    },
    Component: Progress,
  }),

  alert: defineSlotParity({
    id: 'alert',
    displayName: 'Alert',
    defaultSlot: 'Something went wrong',
    propKeys: ['variant', 'title'],
    argTypes: {
      title: { control: 'text' },
      variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    },
    Component: Alert,
  }),

  card: defineSlotParity({
    id: 'card',
    displayName: 'Card',
    defaultSlot: 'Card body content',
    propKeys: ['title', 'description'],
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
    },
    Component: Card,
  }),

  skeleton: definePropsParity({
    id: 'skeleton',
    displayName: 'Skeleton',
    propKeys: ['width', 'height', 'variant', 'lines'],
    defaultProps: { width: 200 },
    argTypes: {
      width: { control: 'number' },
      height: { control: 'number' },
      variant: { control: 'select', options: ['text', 'circular', 'rectangular'] },
      lines: { control: 'number' },
    },
    Component: Skeleton,
  }),

  emptyState: definePropsParity({
    id: 'emptyState',
    displayName: 'EmptyState',
    propKeys: ['title', 'description', 'actionLabel', 'state'],
    defaultProps: {
      title: 'No results',
      description: 'Try adjusting your filters.',
    },
    withNoopHandlers: ['onAction'],
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      actionLabel: { control: 'text' },
      state: { control: 'select', options: ['empty', 'offline', 'unauthorized', 'error'] },
    },
    Component: EmptyState,
  }),

  chart: definePropsParity({
    id: 'chart',
    displayName: 'Chart',
    propKeys: ['mark', 'title', 'subtitle', 'data', 'showPoints'],
    defaultProps: {
      mark: 'bar',
      title: 'Activity',
      data: DEFAULT_CHART_DATA,
    },
    argTypes: {
      mark: { control: 'select', options: ['bar', 'line', 'point'] },
      title: { control: 'text' },
      subtitle: { control: 'text' },
      showPoints: { control: 'boolean' },
    },
    Component: Chart,
  }),

  asyncButton: defineSlotParity({
    id: 'asyncButton',
    displayName: 'AsyncButton',
    defaultSlot: 'Save',
    Component: AsyncButton,
  }),

  typography: defineSlotParity({
    id: 'typography',
    displayName: 'Typography',
    defaultSlot: 'Typography',
    propKeys: ['variant'],
    Component: Typography,
  }),

  liquidGlassButton: defineSlotParity({
    id: 'liquidGlassButton',
    displayName: 'LiquidGlassButton',
    componentName: 'LiquidGlassButtonDemo',
    defaultSlot: 'Continue',
    Component: LiquidGlassButton,
  }),

  liquidGlassSwitch: definePropsParity({
    id: 'liquidGlassSwitch',
    displayName: 'LiquidGlassSwitch',
    propKeys: ['checked', 'defaultChecked'],
    defaultProps: { defaultChecked: true },
    mapExtraProps: (args) => ({
      checked: args.checked ?? args.defaultChecked ?? true,
    }),
    Component: LiquidGlassSwitch,
  }),

  liquidGlassCheckbox: definePropsParity({
    id: 'liquidGlassCheckbox',
    displayName: 'LiquidGlassCheckbox',
    propKeys: ['checked', 'defaultChecked'],
    defaultProps: { defaultChecked: false },
    mapExtraProps: (args) => ({
      checked: args.checked ?? args.defaultChecked ?? false,
    }),
    Component: LiquidGlassCheckbox,
  }),

  liquidGlassProgress: definePropsParity({
    id: 'liquidGlassProgress',
    displayName: 'LiquidGlassProgress',
    propKeys: ['value', 'max'],
    defaultProps: { value: 62, max: 100 },
    Component: LiquidGlassProgress,
  }),

  liquidGlassRange: definePropsParity({
    id: 'liquidGlassRange',
    displayName: 'LiquidGlassRange',
    propKeys: ['value', 'defaultValue'],
    defaultProps: { defaultValue: 50 },
    mapExtraProps: (args) => ({
      value: args.value ?? args.defaultValue ?? 50,
    }),
    Component: LiquidGlassRange,
  }),

  datePicker: definePropsParity({
    id: 'datePicker',
    displayName: 'DatePicker',
    propKeys: ['label', 'value', 'hint', 'error'],
    defaultProps: { label: 'Start date', value: '2026-08-29' },
    mapExtraProps: (args) => ({
      modelValue: typeof args.value === 'string' ? args.value : '2026-08-29',
    }),
    Component: DatePicker,
  }),

  timePicker: definePropsParity({
    id: 'timePicker',
    displayName: 'TimePicker',
    propKeys: ['label', 'value'],
    defaultProps: { label: 'Meeting time', value: '09:30' },
    mapExtraProps: (args) => ({
      modelValue: typeof args.value === 'string' ? args.value : '09:30',
    }),
    Component: TimePicker,
  }),

  dateRangePicker: definePropsParity({
    id: 'dateRangePicker',
    displayName: 'DateRangePicker',
    propKeys: ['label', 'value', 'hint'],
    defaultProps: {
      label: 'Reporting period',
      value: { startDate: '2026-08-01', endDate: '2026-08-29' },
    },
    mapExtraProps: (args) => ({
      modelValue: args.value ?? {
        startDate: '2026-08-01',
        endDate: '2026-08-29',
      },
    }),
    Component: DateRangePicker,
  }),

  dateTimePicker: definePropsParity({
    id: 'dateTimePicker',
    displayName: 'DateTimePicker',
    propKeys: ['label', 'mode'],
    defaultProps: { label: 'Appointment', mode: 'datetime' },
    Component: DateTimePicker,
  }),

  popUpButton: definePropsParity({
    id: 'popUpButton',
    displayName: 'PopUpButton',
    propKeys: ['label', 'options', 'value'],
    defaultProps: {
      label: 'Repeat',
      options: DEFAULT_POPUP_OPTIONS,
      value: 'never',
    },
    Component: PopUpButton,
  }),

  pullDownButton: definePropsParity({
    id: 'pullDownButton',
    displayName: 'PullDownButton',
    propKeys: ['label', 'entries'],
    defaultProps: { label: 'Add', entries: DEFAULT_PULLDOWN_ENTRIES },
    Component: PullDownButton,
  }),

  fileUpload: definePropsParity({
    id: 'fileUpload',
    displayName: 'FileUpload',
    propKeys: ['label', 'hint', 'buttonLabel'],
    defaultProps: { label: 'Import document', hint: 'PDF, Pages, or Numbers' },
    Component: FileUpload,
  }),

  searchField: definePropsParity({
    id: 'searchField',
    displayName: 'SearchField',
    propKeys: ['value', 'placeholder', 'suggestions'],
    defaultProps: { value: '', suggestions: [] },
    mapExtraProps: (args) => ({
      modelValue: typeof args.value === 'string' ? args.value : '',
    }),
    Component: SearchField,
  }),

  pagination: definePropsParity({
    id: 'pagination',
    displayName: 'Pagination',
    propKeys: ['page', 'totalPages'],
    defaultProps: { page: 1, totalPages: 12 },
    withNoopHandlers: ['onPageChange'],
    Component: Pagination,
  }),

  breadcrumb: definePropsParity({
    id: 'breadcrumb',
    displayName: 'Breadcrumb',
    propKeys: ['items'],
    defaultProps: {
      items: [
        { label: 'Home', href: '#' },
        { label: 'Employees', href: '#' },
        { label: 'Ahmed', current: true },
      ],
    },
    Component: Breadcrumb,
  }),

  secureField: definePropsParity({
    id: 'secureField',
    displayName: 'SecureField',
    propKeys: ['label', 'value'],
    defaultProps: { label: 'Password', value: '' },
    mapExtraProps: (args) => ({
      modelValue: typeof args.value === 'string' ? args.value : '',
    }),
    Component: SecureField,
  }),

  monogram: definePropsParity({
    id: 'monogram',
    displayName: 'Monogram',
    propKeys: ['name', 'imageUrl'],
    defaultProps: { name: 'Sara Ali' },
    Component: Monogram,
  }),

  menuBar: definePropsParity({
    id: 'menuBar',
    displayName: 'MenuBar',
    propKeys: ['appName', 'revealed', 'platform'],
    defaultProps: { appName: 'laRose', revealed: true, platform: 'macos' },
    Component: MenuBar,
  }),

  box: defineSlotParity({
    id: 'box',
    displayName: 'Box',
    defaultSlot: 'Box content',
    propKeys: ['title', 'variant'],
    defaultProps: { title: 'Export options', variant: 'secondary' },
    Component: Box,
  }),

  ornament: defineSlotParity({
    id: 'ornament',
    displayName: 'Ornament',
    defaultSlot: 'Now Playing',
    Component: Ornament,
  }),

  shareButton: definePropsParity({
    id: 'shareButton',
    displayName: 'ShareButton',
    propKeys: ['label'],
    defaultProps: { label: 'Share' },
    Component: ShareButton,
  }),

  toolbar: definePropsParity({
    id: 'toolbar',
    displayName: 'Toolbar',
    propKeys: ['title', 'platform', 'largeTitle'],
    defaultProps: { title: 'Notes', platform: 'macos', largeTitle: false },
    Component: Toolbar,
  }),

  helpButton: definePropsParity({
    id: 'helpButton',
    displayName: 'HelpButton',
    propKeys: ['helpTopic', 'ariaLabel'],
    defaultProps: { helpTopic: 'Learn about deleting items', ariaLabel: 'Help' },
    Component: HelpButton,
  }),

  formContinue: defineSlotParity({
    id: 'formContinue',
    displayName: 'FormContinue',
    defaultSlot: 'Continue',
    propKeys: ['complete'],
    defaultProps: { complete: true },
    Component: FormContinue,
  }),

  unsavedIndicator: definePropsParity({
    id: 'unsavedIndicator',
    displayName: 'UnsavedIndicator',
    propKeys: ['title', 'edited', 'autosaveEnabled'],
    defaultProps: { title: 'Untitled', edited: true, autosaveEnabled: true },
    Component: UnsavedIndicator,
  }),

  collection: definePropsParity({
    id: 'collection',
    displayName: 'Collection',
    propKeys: ['items', 'layout', 'columns'],
    defaultProps: { items: DEFAULT_COLLECTION_ITEMS, layout: 'grid', columns: 4 },
    Component: Collection,
  }),

  filePreview: definePropsParity({
    id: 'filePreview',
    displayName: 'FilePreview',
    propKeys: ['source'],
    defaultProps: {
      source: {
        name: 'Release Notes.md',
        textContent: '# Release Notes\n\n- Autosave improvements\n- New document launcher',
        type: 'text/markdown',
      },
    },
    Component: FilePreview,
  }),

  imageView: definePropsParity({
    id: 'imageView',
    displayName: 'ImageView',
    propKeys: ['src', 'alt', 'fit'],
    defaultProps: { src: DEFAULT_SAMPLE_IMAGE, alt: 'Sample image', fit: 'contain' },
    wrapReact: (node) => (
      <div style={{ height: '10rem', width: '16rem' }}>{node}</div>
    ),
    Component: ImageView,
  }),

  imageWell: definePropsParity({
    id: 'imageWell',
    displayName: 'ImageWell',
    propKeys: ['placeholder'],
    defaultProps: { placeholder: 'Drop image' },
    Component: ImageWell,
  }),

  imageButton: definePropsParity({
    id: 'imageButton',
    displayName: 'ImageButton',
    propKeys: ['src', 'alt'],
    defaultProps: { src: DEFAULT_SAMPLE_IMAGE, alt: 'Preview' },
    Component: ImageButton,
  }),

  textView: definePropsParity({
    id: 'textView',
    displayName: 'TextView',
    propKeys: ['value', 'selectable', 'editable', 'maxHeight'],
    defaultProps: {
      value: 'Selectable reference text',
      selectable: true,
      editable: false,
      maxHeight: '12rem',
    },
    mapExtraProps: (args) => ({
      modelValue: typeof args.value === 'string' ? args.value : 'Selectable reference text',
    }),
    Component: TextView,
  }),

  pathControl: definePropsParity({
    id: 'pathControl',
    displayName: 'PathControl',
    propKeys: ['segments', 'selectedId', 'variant'],
    defaultProps: {
      segments: DEFAULT_PATH_SEGMENTS,
      selectedId: 'file',
      variant: 'standard',
    },
    mapExtraProps: (args) => ({
      modelValue: args.selectedId ?? 'file',
    }),
    Component: PathControl,
  }),

  outlineView: definePropsParity({
    id: 'outlineView',
    displayName: 'OutlineView',
    propKeys: ['data', 'primaryColumnHeader', 'defaultExpandedIds'],
    defaultProps: {
      data: DEFAULT_OUTLINE_NODES,
      primaryColumnHeader: 'Name',
      defaultExpandedIds: ['docs'],
    },
    Component: OutlineView,
  }),

  picker: definePropsParity({
    id: 'picker',
    displayName: 'Picker',
    propKeys: ['label', 'columns', 'value', 'appearance'],
    defaultProps: {
      label: 'Country',
      columns: DEFAULT_PICKER_COLUMNS,
      value: { country: 'eg' },
      appearance: 'wheels',
    },
    mapExtraProps: (args) => ({
      modelValue: args.value ?? { country: 'eg' },
      style: args.appearance ?? 'wheels',
    }),
    Component: Picker,
  }),

  wheelPicker: definePropsParity({
    id: 'wheelPicker',
    displayName: 'WheelPicker',
    propKeys: ['columns', 'value', 'modelValue'],
    defaultProps: {
      columns: DEFAULT_WHEEL_COLUMNS,
      value: { fruit: 'apple' },
      modelValue: { fruit: 'apple' },
    },
    withNoopHandlers: ['onChange'],
    Component: WheelPicker,
  }),

  disclosureTriangle: defineSlotParity({
    id: 'disclosureTriangle',
    displayName: 'DisclosureTriangle',
    defaultSlot: 'Hidden details go here.',
    propKeys: ['label', 'expanded'],
    defaultProps: { label: 'Advanced options', expanded: false },
    mapExtraProps: (args) => ({
      defaultExpanded: args.expanded ?? false,
    }),
    withNoopHandlers: ['onExpandedChange'],
    Component: DisclosureTriangle,
  }),

  tokenField: definePropsParity({
    id: 'tokenField',
    displayName: 'TokenField',
    propKeys: ['tokens', 'value', 'suggestions', 'placeholder'],
    defaultProps: {
      tokens: DEFAULT_TOKENS,
      value: DEFAULT_TOKENS,
      suggestions: DEFAULT_TOKENS,
      placeholder: 'Add…',
    },
    mapExtraProps: (args) => {
      const resolved = args.tokens ?? args.value ?? DEFAULT_TOKENS;
      return { tokens: resolved, value: resolved, modelValue: resolved };
    },
    Component: TokenField,
  }),

  captionButton: definePropsParity({
    id: 'captionButton',
    displayName: 'CaptionButton',
    propKeys: ['title', 'subtitle', 'label'],
    defaultProps: {
      title: 'Watch Now',
      subtitle: 'Resume S1 E3',
      label: 'Watch Now',
    },
    Component: CaptionButton,
  }),

  poster: definePropsParity({
    id: 'poster',
    displayName: 'Poster',
    propKeys: ['title', 'subtitle', 'imageUrl'],
    defaultProps: {
      title: 'Northern Lights',
      subtitle: 'Documentary · 2024',
      imageUrl: DEFAULT_SAMPLE_IMAGE,
    },
    Component: Poster,
  }),

  lockupCard: definePropsParity({
    id: 'lockupCard',
    displayName: 'LockupCard',
    propKeys: ['title', 'rating', 'review'],
    defaultProps: {
      title: 'Critics',
      rating: 4.5,
      review: 'A thoughtful exploration of place and memory.',
    },
    Component: LockupCard,
  }),

  collaborationButton: definePropsParity({
    id: 'collaborationButton',
    displayName: 'CollaborationButton',
    propKeys: ['label', 'collaborators', 'maxVisible'],
    defaultProps: {
      label: 'Collaboration',
      collaborators: DEFAULT_COLLABORATORS,
    },
    Component: CollaborationButton,
  }),
};
