<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import styles from '@larose-ui/styles/components/Activity/Activity.module.css';
  import { cn } from '../../utils/cn';

  /** Layout density of the floating activity shell. */
  export type ActivityMode = 'collapsed' | 'expanded' | 'persistent';

  /**
   * Semantic lifecycle of a live activity.
   * Transient noise should stay as Toast — Activity is for durable / interactive work.
   */
  export type ActivityStatus = 'idle' | 'progress' | 'success' | 'error' | 'interactive';

  /** Hint for a future Activity manager queue (not enforced by this shell). */
  export type ActivityPriority =
    | 'critical'
    | 'interactive'
    | 'long-running'
    | 'important'
    | 'transient';

  export type ActivityActionVariant = 'default' | 'primary' | 'danger' | 'ghost';

  /** Declarative action button for self-closing usage. */
  export interface ActivityAction {
    /** Stable key when labels repeat */
    id?: string;
    label: string;
    onclick: (event: MouseEvent) => void;
    variant?: ActivityActionVariant;
    disabled?: boolean;
    'aria-label'?: string;
  }

  /** Custom expanded shell size. `minHeight` defaults to `9rem` in CSS. */
  export interface ActivityExpandedSize {
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    /** Defaults to `9rem` when omitted. */
    minHeight?: string | number;
  }

  interface Props {
    /** Compact pill, detail panel, or always-on persistent strip. */
    mode?: ActivityMode;
    status?: ActivityStatus;
    priority?: ActivityPriority;
    title?: string;
    description?: string;
    /** 0–100; renders a meter when status is `progress` (or whenever value is provided). */
    progress?: number;
    /** Leading visual — icon snippet. */
    icon?: Snippet;
    /** Additional leading content snippet. */
    leading?: Snippet;
    /** Trailing content snippet. */
    trailing?: Snippet;
    /** Declarative action buttons. */
    actions?: ActivityAction[];
    /**
     * Allow click/keyboard to toggle collapsed ↔ expanded.
     * Defaults to `true`. Pass `false` to lock size.
     */
    expandable?: boolean;
    /** Controlled expanded state (overrides `mode` between collapsed/expanded). */
    expanded?: boolean;
    defaultExpanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /**
     * Auto-expand after this many milliseconds.
     * Useful for "compress then grow" live-activity timing.
     */
    expandAfter?: number;
    /**
     * When true, collapsed state is an empty pill (no icon/title/body).
     * Content is revealed only after expand.
     */
    hideCollapsedContent?: boolean;
    /** Expanded shell size. Default `minHeight` is `9rem`. */
    expandedSize?: ActivityExpandedSize;
    /**
     * Expand/collapse morph duration. Number = milliseconds; string = any CSS time.
     * @default 780 (0.78s)
     */
    expandDuration?: number | string;
    onclick?: (event: MouseEvent) => void;
    onkeydown?: (event: KeyboardEvent) => void;
    role?: string;
    tabindex?: number;
    'aria-label'?: string;
    class?: string;
    style?: string;
    /** Body content shown when expanded (convenience API). */
    children?: Snippet;
    /**
     * Named snippets for full composition mode.
     * When any of these are provided, the shell renders them directly
     * instead of the convenience layout.
     */
    leadingSnippet?: Snippet;
    contentSnippet?: Snippet;
    trailingSnippet?: Snippet;
    metaSnippet?: Snippet;
    actionsSnippet?: Snippet;
    bodySnippet?: Snippet;
  }

  let {
    mode = 'collapsed',
    status = 'idle',
    priority = 'important',
    title,
    description,
    progress,
    icon,
    leading,
    trailing,
    actions,
    expandable = true,
    expanded,
    defaultExpanded,
    onExpandedChange,
    expandAfter,
    hideCollapsedContent = false,
    expandedSize,
    expandDuration,
    onclick,
    onkeydown,
    role,
    tabindex,
    'aria-label': ariaLabel,
    class: className,
    style,
    children,
    leadingSnippet,
    contentSnippet,
    trailingSnippet,
    metaSnippet,
    actionsSnippet,
    bodySnippet,
  }: Props = $props();

  // Unique IDs for aria-labelledby / aria-describedby
  const uid = Math.random().toString(36).slice(2, 9);
  const labelId = `lr-activity-label-${uid}`;
  const descId = `lr-activity-desc-${uid}`;

  // Uncontrolled expanded state — intentionally reads props once at mount
  // (mirrors React's useState initialiser — only the initial value matters here)
  let uncontrolledExpanded = $state(untrack(() => Boolean(defaultExpanded) || mode === 'expanded'));

  // ─── Derived ──────────────────────────────────────────────────────────────

  const resolvedMode = $derived((() => {
    if (mode === 'persistent') return 'persistent' as ActivityMode;
    if (typeof expanded === 'boolean') return (expanded ? 'expanded' : 'collapsed') as ActivityMode;
    if (expandable) return (uncontrolledExpanded ? 'expanded' : 'collapsed') as ActivityMode;
    return mode;
  })());

  const isExpanded = $derived(resolvedMode === 'expanded' || resolvedMode === 'persistent');
  const contentVisible = $derived(isExpanded || !hideCollapsedContent);
  const showProgress = $derived(typeof progress === 'number' || status === 'progress');
  const progressValue = $derived(clampProgress(progress ?? 0));
  const hasActions = $derived(Boolean(actions?.length));
  const hasIcon = $derived(icon != null);
  const interactive = $derived(expandable || onclick != null);

  /** Full composition mode: any named layout snippet is present. */
  const usesComposition = $derived(
    Boolean(leadingSnippet || contentSnippet || trailingSnippet || metaSnippet || actionsSnippet || bodySnippet),
  );
  const hasBody = $derived(!usesComposition && (Boolean(children) || Boolean(bodySnippet)));

  const resolvedAriaLabel = $derived(
    ariaLabel ??
    (
      [title, description, showProgress ? `${progressValue}%` : null]
        .filter(Boolean)
        .join('. ') || 'Live activity'
    ),
  );
  const useNameLabel = $derived(Boolean(ariaLabel) || !title || !contentVisible);

  const mergedStyle = $derived(buildStyle(expandedSize, expandDuration, style));

  const ACTION_VARIANT_CLASS: Record<ActivityActionVariant, string | undefined> = {
    default: styles.actionDefault,
    primary: styles.actionPrimary,
    danger: styles.actionDanger,
    ghost: styles.actionGhost,
  };

  // ─── expandAfter timer ────────────────────────────────────────────────────

  $effect(() => {
    const delay = expandAfter;
    const currentMode = mode;
    if (delay == null || currentMode === 'persistent') return;

    if (typeof expanded === 'boolean') {
      if (expanded) return;
      const id = window.setTimeout(() => onExpandedChange?.(true), delay);
      return () => window.clearTimeout(id);
    }
    // Intentional one-shot: only read uncontrolledExpanded without tracking it
    if (untrack(() => uncontrolledExpanded)) return;
    const id = window.setTimeout(() => setExpandedState(true), delay);
    return () => window.clearTimeout(id);
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function clampProgress(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.min(100, Math.max(0, value));
  }

  function toCssSize(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  function toCssTime(value: string | number): string {
    return typeof value === 'number' ? `${value}ms` : value;
  }

  function buildStyle(
    size: ActivityExpandedSize | undefined,
    duration: number | string | undefined,
    userStyle: string | undefined,
  ): string | undefined {
    const vars: string[] = [];
    if (size) {
      if (size.width != null) vars.push(`--lr-activity-width-expanded: ${toCssSize(size.width)}`);
      if (size.height != null) vars.push(`--lr-activity-height-expanded: ${toCssSize(size.height)}`);
      if (size.minWidth != null) vars.push(`--lr-activity-min-width-expanded: ${toCssSize(size.minWidth)}`);
      if (size.minHeight != null) {
        vars.push(`--lr-activity-min-height-expanded: ${toCssSize(size.minHeight)}`);
        if (size.height == null) vars.push(`--lr-activity-height-expanded: ${toCssSize(size.minHeight)}`);
      }
    }
    if (duration != null) {
      const s = toCssTime(duration);
      vars.push(`--lr-activity-duration-size: ${s}`);
      vars.push(`--lr-activity-duration-content: calc(${s} * 0.62)`);
      vars.push(`--lr-activity-content-delay-in: calc(${s} * 0.18)`);
    }
    const parts = [...vars];
    if (userStyle) parts.push(userStyle);
    return parts.length ? parts.join('; ') : undefined;
  }

  function setExpandedState(next: boolean) {
    if (expanded === undefined) {
      uncontrolledExpanded = next;
    }
    onExpandedChange?.(next);
  }

  function toggleExpanded() {
    if (!expandable || mode === 'persistent') return;
    setExpandedState(!isExpanded);
  }

  function handleClick(event: MouseEvent) {
    onclick?.(event);
    if (event.defaultPrevented) return;
    toggleExpanded();
  }

  function handleKeyDown(event: KeyboardEvent) {
    onkeydown?.(event);
    if (event.defaultPrevented) return;
    if (!expandable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!--
  Floating live-activity shell for durable / interactive work
  (uploads, AI jobs, sync, media, payments) — not transient toasts.

  Starts compact (icon / title / description). Expand to reveal children
  centered in the shell — click, keyboard, or expandAfter.
-->
<div
  class={cn(styles.root, className)}
  style={mergedStyle}
  data-larose="Activity"
  data-mode={resolvedMode}
  data-status={status}
  data-priority={priority}
  data-has-icon={hasIcon && contentVisible ? 'true' : undefined}
  data-has-actions={hasActions ? 'true' : undefined}
  data-has-body={hasBody ? 'true' : undefined}
  data-expandable={expandable ? 'true' : undefined}
  data-hide-collapsed-content={hideCollapsedContent ? 'true' : undefined}
  role={role ?? (interactive ? 'button' : 'status')}
  tabindex={tabindex ?? (interactive ? 0 : undefined)}
  aria-label={useNameLabel ? resolvedAriaLabel : undefined}
  aria-expanded={expandable && mode !== 'persistent' ? isExpanded : undefined}
  aria-labelledby={!useNameLabel && title ? labelId : undefined}
  aria-describedby={contentVisible && description ? descId : undefined}
  onclick={interactive ? handleClick : onclick}
  onkeydown={interactive ? handleKeyDown : onkeydown}
>
  <div class={styles.shell} aria-hidden={!contentVisible || undefined}>

    {#if usesComposition}
      <!-- ── Full composition mode: render named snippets directly ── -->
      {#if leadingSnippet}
        <div class={styles.leading} data-slot="leading">{@render leadingSnippet()}</div>
      {/if}
      {#if contentSnippet}
        <div class={styles.content} data-slot="content">{@render contentSnippet()}</div>
      {/if}
      {#if trailingSnippet}
        <div class={styles.trailing} data-slot="trailing">{@render trailingSnippet()}</div>
      {/if}
      {#if metaSnippet}
        <div class={styles.meta} data-slot="meta">{@render metaSnippet()}</div>
      {/if}
      {#if actionsSnippet}
        <div class={styles.actions} data-slot="actions">{@render actionsSnippet()}</div>
      {/if}
      {#if bodySnippet}
        <div class={styles.body} data-slot="body">{@render bodySnippet()}</div>
      {/if}

    {:else}
      <!-- ── Convenience API mode ── -->

      <!-- Summary row -->
      <div
        class={styles.summary}
        data-slot="summary"
        data-open={contentVisible ? 'true' : 'false'}
        aria-hidden={!contentVisible}
      >
        {#if hasIcon || leading}
          <div class={styles.leading} data-slot="leading">
            {#if hasIcon}
              <span class={styles.icon} aria-hidden="true">{@render icon!()}</span>
            {/if}
            {#if leading}{@render leading()}{/if}
          </div>
        {/if}

        <div class={styles.content} data-slot="content">
          {#if title || description}
            <div class={styles.meta} data-slot="meta">
              {#if title}<span class={styles.title} id={labelId}>{title}</span>{/if}
              {#if description}<span class={styles.description} id={descId}>{description}</span>{/if}
            </div>
          {/if}
          {#if showProgress}
            <div
              class={styles.progress}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressValue}
              aria-label={title ? `${title} progress` : 'Activity progress'}
            >
              <span class={styles.progressFill} style="width: {progressValue}%"></span>
            </div>
          {/if}
        </div>

        {#if trailing}
          <div class={styles.trailing} data-slot="trailing">{@render trailing()}</div>
        {/if}
      </div>

      <!-- Body (expanded content) -->
      {#if hasBody}
        <div
          class={styles.body}
          data-slot="body"
          data-open={isExpanded ? 'true' : 'false'}
          aria-hidden={!isExpanded}
        >
          {#if children}{@render children()}{/if}
        </div>
      {/if}

      <!-- Action buttons -->
      {#if hasActions}
        <div
          class={styles.actions}
          data-slot="actions"
          data-open={contentVisible ? 'true' : 'false'}
          data-placement={isExpanded ? 'footer' : 'inline'}
          aria-hidden={!contentVisible}
        >
          {#each actions! as action, i (action.id ?? `${action.label}-${i}`)}
            <button
              type="button"
              class={cn(styles.actionButton, ACTION_VARIANT_CLASS[action.variant ?? 'default'])}
              disabled={action.disabled}
              aria-label={action['aria-label'] ?? action.label}
              onclick={(e) => { e.stopPropagation(); action.onclick(e); }}
            >
              {action.label}
            </button>
          {/each}
        </div>
      {/if}
    {/if}

  </div>
</div>
