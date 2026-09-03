// Shared demo fixtures for cross-framework Storybook registry entries.

export const DEFAULT_CHART_DATA = [
  { x: 'Mon', y: 40 },
  { x: 'Tue', y: 65 },
  { x: 'Wed', y: 52 },
  { x: 'Thu', y: 80 },
  { x: 'Fri', y: 58 },
];

export const DEFAULT_COMMANDS = [
  { id: 'new', label: 'New document', group: 'File', keywords: ['create'] },
  { id: 'open', label: 'Open…', group: 'File', keywords: ['import'] },
  { id: 'save', label: 'Save', group: 'File' },
  { id: 'undo', label: 'Undo', group: 'Edit', keywords: ['revert'] },
  { id: 'find', label: 'Find in page', group: 'Edit', keywords: ['search'] },
  { id: 'theme', label: 'Toggle theme', group: 'View' },
];

export const DEFAULT_POPUP_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Every Day' },
  { value: 'weekly', label: 'Every Week' },
  { value: 'monthly', label: 'Every Month' },
];

export const DEFAULT_PULLDOWN_ENTRIES = [
  { id: 'note', label: 'New Note' },
  { id: 'checklist', label: 'New Checklist' },
  { id: 'scan', label: 'Scan Document' },
];

export const DEFAULT_PATH_SEGMENTS = [
  { id: 'disk', label: 'Macintosh HD' },
  { id: 'users', label: 'Users' },
  { id: 'me', label: 'me' },
  { id: 'docs', label: 'Documents' },
  { id: 'file', label: 'HIG Design.pages' },
];

export const DEFAULT_TABLE_ROWS = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
];

export const DEFAULT_TABLE_COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

export const DEFAULT_PICKER_COLUMNS = [
  {
    id: 'country',
    label: 'Country',
    options: [
      { value: 'eg', label: 'Egypt' },
      { value: 'de', label: 'Germany' },
      { value: 'us', label: 'United States' },
    ],
  },
];

export const DEFAULT_MENU_ENTRIES = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { type: 'separator' },
  { id: 'select-all', label: 'Select All' },
];

export const DEFAULT_QUICK_ACTIONS = [
  { id: 'inbox', label: 'All Inboxes' },
  { id: 'compose', label: 'New Message' },
  { id: 'vip', label: 'VIP' },
];

export const DEFAULT_CONTEXT_ENTRIES = [
  { id: 'reply', label: 'Reply' },
  { id: 'forward', label: 'Forward' },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', destructive: true },
];

export const DEFAULT_OUTLINE_NODES = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'notes', label: 'Notes' },
      { id: 'reports', label: 'Reports' },
    ],
  },
  { id: 'downloads', label: 'Downloads' },
];

export const DEFAULT_ACTIVITIES = [
  { id: 'messages', title: 'Messages', kind: 'share' as const },
  { id: 'mail', title: 'Mail', kind: 'share' as const },
  { id: 'copy', title: 'Copy', kind: 'action' as const },
];

export const DEFAULT_TOKENS = [
  { id: 'design', label: 'Design' },
  { id: 'eng', label: 'Engineering' },
];

export const DEFAULT_DRAG_ITEMS = [
  { id: '1', label: 'Review designs' },
  { id: '2', label: 'Update copy' },
  { id: '3', label: 'Ship release' },
];

export const DEFAULT_SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0071e3"/><stop offset="1" stop-color="#af52de"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="520" cy="90" r="48" fill="rgb(255 255 255 / 0.35)"/></svg>`,
  );

export const DEFAULT_FILE_BROWSER_FILES = [
  {
    id: '1',
    name: 'Quarterly Report.numbers',
    extension: 'numbers',
    size: 245_760,
    modifiedAt: '2026-08-29T14:22:00',
    location: 'icloud' as const,
    syncStatus: 'synced' as const,
  },
  {
    id: '2',
    name: 'Launch Brief.key',
    extension: 'key',
    size: 512_000,
    modifiedAt: '2026-08-28T09:10:00',
    location: 'local' as const,
    syncStatus: 'syncing' as const,
    shared: true,
  },
  {
    id: '3',
    name: 'Wireframes.pdf',
    extension: 'pdf',
    size: 1_024_000,
    modifiedAt: '2026-08-27T18:45:00',
    location: 'remote' as const,
    syncStatus: 'error' as const,
    shared: true,
  },
];

export const DEFAULT_COLLECTION_ITEMS = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  label: `Album ${index + 1}`,
  imageUrl: DEFAULT_SAMPLE_IMAGE,
}));

export const DEFAULT_COLUMN_HIERARCHY = [
  {
    id: 'icloud',
    label: 'iCloud Drive',
    children: [
      {
        id: 'design',
        label: 'Design',
        children: [
          {
            id: 'hero',
            label: 'Hero.png',
            meta: { Kind: 'PNG image', Size: '1.2 MB', Modified: 'Aug 29, 2026' },
          },
          {
            id: 'logo',
            label: 'Logo.svg',
            meta: { Kind: 'SVG image', Size: '24 KB', Modified: 'Aug 20, 2026' },
          },
        ],
      },
      {
        id: 'docs',
        label: 'Documents',
        children: [{ id: 'brief', label: 'Brief.pages', meta: { Kind: 'Document', Size: '420 KB' } }],
      },
    ],
  },
  {
    id: 'local',
    label: 'On My Mac',
    children: [{ id: 'downloads', label: 'Downloads' }],
  },
];

export const DEFAULT_COLLABORATORS = [
  { id: '1', name: 'Sara Ali', initials: 'SA' },
  { id: '2', name: 'Omar Hassan', initials: 'OH' },
  { id: '3', name: 'Lina Koch', initials: 'LK' },
  { id: '4', name: 'Alex Kim', initials: 'AK' },
];

export const DEFAULT_DISCLOSURE_LIST_ITEMS = [
  {
    id: 'work',
    label: 'Work',
    children: [
      { id: 'brief', label: 'Brief.pages' },
      { id: 'assets', label: 'Assets', children: [{ id: 'hero', label: 'Hero.png' }] },
    ],
  },
  { id: 'personal', label: 'Personal' },
];

export const DEFAULT_WHEEL_COLUMNS = [
  {
    id: 'fruit',
    label: 'Fruit',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
  },
];
