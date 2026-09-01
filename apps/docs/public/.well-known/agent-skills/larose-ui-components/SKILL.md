---
name: larose-ui-components
description: Look up laRose UI React component props, examples, and accessibility notes. Use when implementing UI with @larose-ui/react or documenting component APIs.
license: MIT
metadata:
  author: hamdymohamedak
  version: "0.1.1"
---

# laRose UI Components

Use this skill when you need component-level API details for laRose UI.

## Machine-readable metadata

Each component publishes JSON at:

```
/components/{slug}.json
```

Example: `/components/button.json`

## Human documentation

Component docs live at:

```
/docs/components/{slug}
```

## Workflow

1. List components from `/docs/components` or `/llms.txt`.
2. Fetch `/components/{slug}.json` for props, examples, and accessibility notes.
3. Cross-check the rendered docs page at `/docs/components/{slug}` when examples matter.
4. Import from `@larose-ui/react` using the `import` field in the JSON metadata.

## Conventions

- Slugs are kebab-case (`Button` → `button`, `DatePicker` → `date-picker`).
- Shared styles: `@larose-ui/tokens/styles.css`, `@larose-ui/styles/styles.css`, `@larose-ui/react/styles.css`.
