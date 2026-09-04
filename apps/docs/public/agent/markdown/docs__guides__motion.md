# Motion system

# laRose Motion System

Apple-inspired motion for laRose UI — calm, responsive, natural, and precise.

## Philosophy

Motion answers one of:

1. Where did this come from?
2. Where did this go?
3. What changed?
4. What did the user interact with?
5. What should the user focus on?

If an animation does not answer one of these, reconsider it.

## Architecture

```text
Motion System
├── Motion Tokens (@larose-ui/tokens)     — CSS variables, durations, easings, springs
├── Spring Physics (@larose-ui/core)      — stiffness, damping, interruptible simulation
├── Motion Primitives (@larose-ui/react)  — Presence, Collapse, MotionProvider
└── Component integration                 — Toast, Modal, Drawer, Popover, etc.
```

## Motion tokens

Imported via `@larose-ui/tokens/styles.css`:

| Token | Purpose |
|-------|---------|
| `--lr-motion-duration-*` | instant, fast, normal, slow, enter, exit, layout |
| `--lr-motion-easing-*` | standard, enter, exit, emphasized |
| `--lr-motion-spring-*` | snappy, smooth, gentle, responsive, bouncy |
| `--lr-motion-distance-*` | xs, sm, md translation distances |
| `--lr-motion-scale-*` | enter, exit, press, modal-enter scales |

Reduced motion zeroes all motion durations at the token level via `@media (prefers-reduced-motion: reduce)`.

## Global configuration

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';

<LaRoseProvider
  motion={{
    preset: 'smooth',        // snappy | smooth | gentle | responsive | bouncy | none
    reducedMotion: 'system', // system | always | never
  }}
>
  {children}
</LaRoseProvider>
```

Runtime provider (`@larose-ui/runtime-react`) accepts the same `motion` prop.

## Presence

Use `Presence` for enter/exit mount cycles:

```tsx
import { Presence } from '@larose-ui/react';

<Presence present={open} variant="popover" placement="bottom">
  <div className={styles.panel}>{content}</div>
</Presence>
```

Variants: `fade`, `fade-scale`, `modal`, `backdrop`, `toast`, `popover`, `drawer-left`, `drawer-right`.

## Spring physics (advanced)

```ts
import { getSpringPreset, stepSpring, animateSpringToTarget } from '@larose-ui/core';

const config = getSpringPreset('gentle');
const state = animateSpringToTarget(0, 1, config);
```

Use `useSpringAnimation` in React for interruptible gesture release (drawers).

## Collapse

```tsx
import { Collapse } from '@larose-ui/react';

<Collapse open={expanded}>{content}</Collapse>
```

## Performance

- Prefer `transform` and `opacity`
- Avoid animating layout properties when transform suffices
- Motion CSS uses `will-change` sparingly on drawers
- Presence cleans up on unmount — no leaked timers

## When NOT to animate

- Static labels and typography
- Data that updates frequently (tables, live counters)
- Decorative motion without informational purpose
- Large scale transforms on buttons (keep press subtle)

## Accessibility

- `prefers-reduced-motion` is respected globally
- Focus indicators are never replaced by motion
- `motion.reducedMotion: 'always'` disables all animations for testing

## Component coverage

| Component | Motion |
|-----------|--------|
| Toast | Enter/exit + stack layout transition |
| Modal / AlertDialog | Backdrop fade + dialog scale/fade |
| Drawer | Slide + backdrop sync |
| Popover / Tooltip / Menu | Spatial popover motion |
| Accordion | Height collapse |
| Button | Existing press micro-motion (token-based) |
