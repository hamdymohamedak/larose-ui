# laRose Customization Architecture

laRose is **beautiful by default** and **customizable by design**.

The default experience is the Apple-inspired **Refined** preset. No configuration is required to get the current laRose look and feel.

## Customization hierarchy

```text
Library defaults
      ↓
Theme preset (refined, ocean, forest, sunset, …)
      ↓
Global theme tokens
      ↓
Component tokens
      ↓
Component defaults
      ↓
Instance props
      ↓
Resolved CSS variables
      ↓
Components
```

Higher layers win over lower layers **except** instance props, which always override component defaults.

## 1. Default experience

```tsx
import { LaRoseProvider } from '@larose-ui/react';

<LaRoseProvider>
  <App />
</LaRoseProvider>
```

This uses the Refined preset automatically.

## 2. Small overrides (~10%)

```tsx
<LaRoseProvider
  themeConfig={{
    colors: { primary: '#6C5CE7' },
    radius: { md: '10px' },
  }}
>
  <App />
</LaRoseProvider>
```

## 3. Custom themes

```tsx
import { createTheme, LaRoseProvider } from '@larose-ui/react';

const customTheme = createTheme({
  base: 'refined',
  colors: {
    primary: '#6C5CE7',
    secondary: '#00CEC9',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  motion: {
    preset: 'snappy',
    duration: { normal: '180ms' },
  },
});

<LaRoseProvider themeConfig={customTheme}>
  <App />
</LaRoseProvider>
```

## 4. Component tokens

Component tokens control visual properties for a specific component family.

```tsx
<LaRoseProvider
  components={{
    Button: {
      tokens: {
        radius: '4px',
        heightMd: '42px',
      },
    },
    Card: {
      tokens: {
        radius: '8px',
        shadow: 'none',
      },
    },
    Modal: {
      tokens: {
        radius: '20px',
      },
    },
  }}
>
  <App />
</LaRoseProvider>
```

Supported component token namespaces:

- `Button`
- `Input`
- `Card`
- `Modal`
- `Drawer`
- `Popover`
- `Dialog`
- `Picker`

## 5. Component defaults

Change application-wide defaults without wrapping every component.

```tsx
<LaRoseProvider
  components={{
    Button: {
      defaultProps: {
        variant: 'secondary',
        size: 'lg',
      },
    },
    Input: {
      defaultProps: {
        inputSize: 'sm',
      },
    },
  }}
>
  <App />
</LaRoseProvider>
```

Then:

```tsx
<Button />                  // secondary + lg
<Button variant="primary" />  // primary + lg
```

## 6. Motion customization

Global motion:

```tsx
<LaRoseProvider motion={{ preset: 'smooth', reducedMotion: 'system' }}>
  <App />
</LaRoseProvider>
```

Theme-level motion tokens:

```tsx
<LaRoseProvider
  themeConfig={{
    motion: {
      duration: { fast: '100ms', normal: '240ms', slow: '400ms' },
    },
  }}
>
  <App />
</LaRoseProvider>
```

Component-level motion:

```tsx
<Modal open motion={{ duration: 180 }} />
```

Accessibility always wins: reduced motion zeroes animation durations.

## 7. Structural customization (slots)

`Card` supports compound composition:

```tsx
<Card padding="lg">
  <Card.Header>
    <Card.Title>Users</Card.Title>
    <Card.Description>All users in your workspace</Card.Description>
  </Card.Header>
  <Card.Content>{/* ... */}</Card.Content>
  <Card.Footer>{/* ... */}</Card.Footer>
</Card>
```

Legacy props (`title`, `description`, `footer`) remain supported.

## 8. Escape hatches

Use `className` and `style` when you need one-off adjustments:

```tsx
<Card className="my-card" style={{ maxWidth: 480 }} />
<Modal contentClassName="my-modal-panel" />
<Drawer panelClassName="my-drawer-panel" />
```

Prefer tokens and theme configuration for systematic customization.

## 9. CSS variable reference

Global examples:

```css
--lr-color-primary
--lr-radius-md
--lr-space-md
--lr-motion-duration-normal
```

Component examples:

```css
--lr-button-radius
--lr-card-shadow
--lr-modal-radius
--lr-drawer-width
```

## 10. Backward compatibility

Existing APIs continue to work:

- `brandColors`
- `themePreset`
- `motion`
- Component props such as `variant`, `size`, `inputSize`

Prefer `themeConfig` and `components` for new work.

## Design principle

```text
Props            → behavior and semantic variants
Theme tokens     → global visual customization
Component tokens → component-specific visual customization
Component defaults → application-wide defaults
Slots            → structural customization
className/style  → escape hatch
```

Customization changes appearance — never accessibility, keyboard behavior, focus management, or component semantics.
