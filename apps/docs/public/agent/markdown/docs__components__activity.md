# Activity

Category: Other

## Props
- `actions` (ActivityAction[]) — Action buttons for self-closing usage.
- `defaultExpanded` (boolean)
- `description` (string)
- `expandable` (boolean) — Allow click/keyboard to toggle collapsed ↔ expanded.
Defaults to `true` (Activity is expandable by design). Pass `false` to lock size.
- `expandAfter` (number) — Auto-expand after this many milliseconds (uncontrolled, or fires `onExpandedChange`).
Useful for “compress then grow” live-activity timing.
- `expandDuration` (number | string) — Expand/collapse morph duration. Number = milliseconds; string = any CSS time.
- `expanded` (boolean) — Controlled expanded state (overrides `mode` between collapsed/expanded).
- `expandedSize` (ActivityExpandedSize) — Expanded shell size. Default `minHeight` is `9rem`.
- `hideCollapsedContent` (boolean) — When true, collapsed state is an empty pill (no icon/title/body).
Content is revealed only after expand.
- `icon` (ReactNode) — Leading visual — any icon, emoji, SVG, or image node.
- `leading` (ReactNode)
- `mode` (ActivityMode) — Compact pill, detail panel, or always-on persistent strip.
- `onExpandedChange` ((expanded: boolean) => void)
- `priority` (ActivityPriority)
- `progress` (number) — 0–100; renders a meter when status is `progress` (or whenever value is provided).
- `status` (ActivityStatus)
- `trailing` (ReactNode)

Metadata: /components/activity.json
