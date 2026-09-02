# OutlineView

Category: Data

## Props
- `'aria-label'` (string)
- `alternatingRows` (boolean)
- `columns` (Array<string | OutlineColumn>)
- `data` (OutlineNode[])
- `defaultExpandedIds` (string[])
- `defaultSortDirection` (SortDirection)
- `defaultSortKey` (string)
- `editableColumns` (string[])
- `expandedIds` (string[])
- `onCellEdit` ((nodeId: string, columnKey: string, value: string) => void)
- `onExpandedChange` ((expandedIds: string[]) => void)
- `onRowDoubleClick` ((node: OutlineNode) => void)
- `onSelect` ((node: OutlineNode) => void)
- `primaryColumnHeader` (string)
- `resizableColumns` (boolean)
- `searchQuery` (string)
- `selectedId` (string)
- `sortable` (boolean)
- `storageKey` (string) — Persist expansion state across sessions (localStorage).
- `truncate` ('middle' | 'end')

Metadata: /components/outline-view.json
