# laRose UI — Cross-Framework Component Engineering

## Purpose

Build laRose UI components so that they provide a **consistent user experience, behavior, accessibility model, and public contract across frameworks**, while remaining idiomatic to each framework.

Supported frameworks may include:

* React
* Vue
* Svelte

The architecture must also remain extensible to future frameworks such as Angular or others.

---

# Core Principle

## Same Behavior, Different Implementation

Never treat one framework implementation as a template to mechanically translate into another framework.

Do **not**:

```text
React implementation
        ↓
literal conversion
        ↓
Vue implementation
```

Instead:

```text
                    ┌── React implementation
                    │
Component Contract ─┼── Vue implementation
                    │
                    ├── Svelte implementation
                    │
                    └── Future framework implementations
```

The shared source of truth is the **component contract and behavior**, not the framework-specific implementation.

---

# 1. Component Contract Is the Source of Truth

Before implementing a component, identify its framework-independent contract.

The contract should define:

* Component purpose
* Supported states
* User interactions
* Inputs / props
* Outputs / events
* Keyboard behavior
* Focus behavior
* Accessibility requirements
* Loading behavior
* Error behavior
* Empty behavior
* Disabled behavior
* Controlled vs uncontrolled behavior
* Async behavior
* Visual states
* Motion behavior
* Responsive behavior
* Slot/content requirements
* Composition rules

The contract must describe **what the component does**, not how a particular framework implements it.

Example:

```text
Dialog

Contract:
- Opens and closes
- Supports controlled and uncontrolled usage
- Traps focus while open
- Restores focus when closed
- Closes on Escape when enabled
- Supports modal and non-modal modes
- Prevents interaction with background content when modal
- Announces itself correctly to assistive technology
```

Do not define the contract using React-specific concepts such as:

```text
useState
useEffect
useRef
```

Those belong to the implementation layer.

---

# 2. Frameworks Have Different Behavioral Models

Frameworks are not interchangeable.

The Agent must assume that equivalent-looking APIs can have different runtime behavior.

Examples:

```text
React:
useEffect
useRef
controlled props
synthetic events
re-render lifecycle
```

```text
Vue:
ref
reactive
watch
computed
emits
slots
```

```text
Svelte:
$state
$derived
$effect
events
bindings
snippets
```

These should not be treated as simple syntax equivalents.

The Agent must understand the framework's native:

* lifecycle
* reactivity
* event system
* rendering model
* DOM update timing
* state ownership
* component composition
* accessibility patterns
* cleanup semantics

before implementing the component.

---

# 3. Never Perform Literal Framework Translation

Avoid transformations such as:

```text
useState → ref
useEffect → watch
useMemo → computed
children → slot
onClick → @click
```

as an automatic conversion strategy.

These mappings may be syntactically valid while producing incorrect behavior.

For every feature ask:

> What is the idiomatic way to implement this behavior in the target framework?

not:

> What is the equivalent API of this React code?

---

# 4. Preserve Observable Behavior

Cross-framework parity means preserving **observable behavior**, not preserving source code.

Users should experience the component as the same component regardless of framework.

For example:

```text
React Dialog
Vue Dialog
Svelte Dialog
```

should have equivalent:

* opening behavior
* closing behavior
* focus management
* keyboard interaction
* ARIA semantics
* disabled behavior
* loading behavior
* error handling
* animation semantics
* controlled/uncontrolled behavior

The internal implementation may be completely different.

That is acceptable and expected.

---

# 5. React Is Not the Default Architecture

Do not assume React is the canonical implementation.

React may be implemented first, but that does not make React behavior automatically correct for every framework.

When adding Vue or Svelte:

1. Read the component contract.
2. Read shared component logic.
3. Read shared primitives.
4. Understand the target framework's rendering and reactivity model.
5. Re-implement the component idiomatically.
6. Verify observable behavior against the contract.

React code may be used as a **behavioral reference**, not as a source-code template.

---

# 6. Shared Logic Must Remain Framework-Neutral

Whenever possible, reusable behavior should live outside framework-specific components.

Prefer:

```text
component contract
        ↓
component-logic
        ↓
framework adapter
        ↓
rendering
```

rather than:

```text
React component
        ↓
copy
        ↓
Vue component
        ↓
copy
        ↓
Svelte component
```

Shared logic should contain things such as:

* state machines
* validation
* data transformations
* state transitions
* interaction rules
* keyboard rules
* selection algorithms
* filtering
* sorting
* positioning calculations
* business-independent component behavior

It must not depend on:

* React hooks
* Vue reactivity
* Svelte runes
* framework-specific component APIs

unless that dependency explicitly belongs in the framework adapter.

---

# 7. Primitives Must Respect Framework Runtime Semantics

Shared primitives may define behavior such as:

```text
focus management
keyboard navigation
typeahead
roving tabindex
menu navigation
selection
dismissal
pointer interaction
```

However, framework adapters must integrate those behaviors according to the target framework's lifecycle and DOM semantics.

Do not assume that DOM timing is identical across frameworks.

Pay special attention to:

* mounting
* unmounting
* DOM availability
* refs
* event registration
* cleanup
* focus timing
* transitions
* asynchronous rendering

---

# 8. Controlled and Uncontrolled State

Every stateful component must explicitly define its state ownership model.

For example:

```text
Controlled:
value comes from the consumer.

Uncontrolled:
component owns internal state.

Hybrid:
consumer may control the state, otherwise component manages it internally.
```

Each framework must preserve the same public behavior.

However, implementation must follow framework conventions.

Do not force a React-style controlled-state pattern into Vue or Svelte if the framework has a more idiomatic mechanism.

---

# 9. Event Semantics Must Be Preserved

Do not only translate event names.

Analyze:

* event timing
* event propagation
* bubbling
* cancellation
* default behavior
* payload shape
* keyboard events
* pointer events
* focus events
* composition events

The public contract should remain consistent.

Example:

```text
onChange(value)
```

should produce the same conceptual result across frameworks even if the framework-specific event implementation differs.

---

# 10. DOM Timing Is Critical

Never assume:

```text
state change
→ DOM update
→ effect
```

behaves identically across frameworks.

Features involving:

* focus
* measurement
* portals
* positioning
* scroll locking
* animations
* element dimensions
* popovers
* dialogs
* menus

must be implemented according to the target framework's rendering lifecycle.

If a component depends on the DOM being updated, explicitly account for the framework's update timing.

---

# 11. Accessibility Is a Cross-Framework Contract

Accessibility behavior must remain equivalent.

Verify:

* semantic HTML
* ARIA roles
* ARIA states
* ARIA relationships
* keyboard navigation
* focus management
* focus restoration
* screen-reader announcements
* disabled states
* loading states
* error states

Do not assume that matching markup automatically guarantees matching accessibility behavior.

Test interaction behavior, not just rendered HTML.

---

# 12. Styling Must Not Depend on Framework Assumptions

The visual result should be consistent across frameworks.

Prefer shared:

* tokens
* CSS
* design primitives
* component styles
* motion definitions
* responsive rules

Avoid duplicating visual logic unnecessarily inside framework adapters.

Framework implementations should primarily control:

```text
behavior + rendering
```

while shared styles control:

```text
visual language
```

---

# 13. Motion Must Preserve User Experience

Animations should feel equivalent across frameworks.

Do not blindly copy animation code if lifecycle behavior differs.

Verify:

* enter timing
* exit timing
* interruption
* state changes during animation
* reduced motion
* unmount behavior
* transition cleanup

A component that visually looks identical but has different animation interruption behavior is not necessarily framework-parity compliant.

---

# 14. Framework-Specific APIs Are Allowed

Cross-framework consistency does **not** mean identical APIs everywhere.

Framework conventions should be respected.

For example, a component may expose:

```text
React:
props + callbacks
```

```text
Vue:
props + emits + slots
```

```text
Svelte:
props + events + snippets/bindings
```

The API should feel native to each framework while representing the same conceptual contract.

Do not introduce awkward APIs solely to make framework syntax identical.

---

# 15. Future Framework Compatibility

When designing a component, ask:

> Could this behavior be implemented cleanly in another framework without rewriting the conceptual model?

Avoid architecture that assumes:

```text
React is the center of the universe.
```

Instead design:

```text
Framework-neutral contract
        ↓
Framework-neutral logic
        ↓
Framework-specific adapter
        ↓
Framework-native rendering
```

This allows future support for frameworks such as:

```text
Angular
Solid
Qwik
Lit
```

without requiring the component's conceptual behavior to be redesigned.

---

# 16. Cross-Framework Implementation Workflow

When creating a new component:

## Step 1 — Define the contract

Document:

```text
Purpose
Props
Events
States
Interactions
Keyboard behavior
Accessibility
Focus behavior
Motion
Composition
```

---

## Step 2 — Identify reusable logic

Ask:

> Which parts are pure behavior and can be framework-neutral?

Move those into:

```text
component-logic
```

when appropriate.

---

## Step 3 — Identify reusable primitives

Check whether the component needs:

```text
focus management
keyboard navigation
typeahead
dismissal
positioning
portal behavior
```

Reuse existing primitives rather than reimplementing them.

---

## Step 4 — Implement each framework independently

Create idiomatic implementations for:

```text
React
Vue
Svelte
```

Do not copy the React implementation and translate syntax.

---

## Step 5 — Compare behavior

Create a behavioral parity checklist.

Example:

```text
[ ] Same initial state
[ ] Same state transitions
[ ] Same keyboard behavior
[ ] Same focus behavior
[ ] Same accessibility semantics
[ ] Same disabled behavior
[ ] Same loading behavior
[ ] Same error behavior
[ ] Same empty behavior
[ ] Same controlled behavior
[ ] Same uncontrolled behavior
[ ] Same events
[ ] Same visual states
[ ] Same motion behavior
```

---

# 17. Test the Contract, Not the Implementation

Cross-framework tests should primarily verify observable behavior.

Bad test:

```text
React uses useState.
Vue uses ref.
Svelte uses $state.
```

Good test:

```text
Opening the component changes its open state.

Escape closes it.

Focus moves to the expected element.

Closing restores focus.

Disabled interaction does not change state.
```

The implementation can differ completely while the behavioral test remains the same.

---

# 18. Cross-Framework Parity Matrix

Every component should be evaluated across all supported frameworks.

Example:

| Behavior           | React | Vue | Svelte |
| ------------------ | ----- | --- | ------ |
| Initial state      | ✓     | ✓   | ✓      |
| Open/close         | ✓     | ✓   | ✓      |
| Keyboard           | ✓     | ✓   | ✓      |
| Focus              | ✓     | ✓   | ✓      |
| Accessibility      | ✓     | ✓   | ✓      |
| Controlled state   | ✓     | ✓   | ✓      |
| Uncontrolled state | ✓     | ✓   | ✓      |
| Events             | ✓     | ✓   | ✓      |
| Motion             | ✓     | ✓   | ✓      |

A component is not considered complete until the contract is implemented across all supported frameworks.

---

# 19. When Framework Behavior Differs

Framework differences are expected.

If a framework requires a different implementation to achieve the same behavior:

**Prefer the idiomatic implementation.**

Do not introduce unnecessary abstraction just to force identical source code.

Correct:

```text
Same contract
Different implementation
Same observable result
```

Incorrect:

```text
Same source pattern
Different runtime behavior
```

---

# 20. Do Not Hide Framework Differences in Bad Abstractions

Avoid creating abstractions such as:

```text
useFrameworkUniversalState()
```

or fake universal lifecycle APIs simply to make implementations look identical.

Abstractions are justified when they represent real shared behavior.

They are not justified when they only hide framework differences.

---

# 21. Definition of Cross-Framework Parity

A component has parity when:

> A consumer using the component should receive the same conceptual API, interaction model, accessibility behavior, state model, visual language, and UX regardless of the framework.

Parity does **not** mean:

* identical source code
* identical hooks
* identical lifecycle APIs
* identical internal architecture
* identical framework syntax

Parity means:

```text
Same contract
+
Same behavior
+
Same UX
+
Same accessibility
+
Same design language
```

with:

```text
Framework-native implementation
```

---

# 22. Agent Decision Rule

Before writing framework-specific code, the Agent must ask itself:

```text
1. What is the framework-independent behavior?

2. What belongs in component-logic?

3. What existing primitives can be reused?

4. What is framework-specific?

5. How does the target framework handle this behavior idiomatically?

6. Could this implementation behave differently because of the framework's
   lifecycle, reactivity, event, or rendering model?

7. How will I verify parity with the other frameworks?
```

If these questions cannot be answered, implementation should not proceed blindly.

---

# 23. Anti-Patterns

Never:

```text
Copy React → replace syntax → call it Vue.
```

Never:

```text
Copy Vue → mechanically translate → call it Svelte.
```

Never:

```text
Assume matching JSX/template markup means behavioral parity.
```

Never:

```text
Assume equivalent lifecycle APIs have identical timing.
```

Never:

```text
Optimize for identical source code over idiomatic framework behavior.
```

Never:

```text
Put framework-specific behavior into shared component logic.
```

Never:

```text
Declare parity based only on visual similarity.
```

---

# Final Rule

## Build the component once conceptually, not once in source code.

The goal of laRose UI is:

```text
One Design Contract
        +
One Behavioral Contract
        +
Shared Framework-Neutral Logic
        +
Native Framework Implementations
        ↓
Consistent Cross-Framework UX
```

React, Vue, Svelte, and future frameworks are **different renderers and runtimes for the same component system**.

The Agent must preserve the component's **meaning and behavior**, not its original source code.
