import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import styles from '@larose-ui/styles/components/Activity/Activity.module.css';

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

/** Declarative action button for self-closing `<Activity actions={[...]} />` usage. */
export interface ActivityAction {
  /** Stable key when labels repeat */
  id?: string;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
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

export interface ActivityProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Detail content shown when expanded.
   * Collapsed summary still comes from `icon` / `title` / `description` / `progress`.
   */
  children?: ReactNode;
  /** Compact pill, detail panel, or always-on persistent strip. */
  mode?: ActivityMode;
  status?: ActivityStatus;
  priority?: ActivityPriority;
  title?: string;
  description?: string;
  /** 0–100; renders a meter when status is `progress` (or whenever value is provided). */
  progress?: number;
  /** Leading visual — any icon, emoji, SVG, or image node. */
  icon?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /**
   * Action buttons for self-closing usage.
   * @example
   * <Activity
   *   title="Uploading"
   *   actions={[
   *     { label: 'Cancel', onClick: () => cancel() },
   *     { label: 'Details', onClick: () => open(), variant: 'primary' },
   *   ]}
   * />
   */
  actions?: ActivityAction[];
  /**
   * Allow click/keyboard to toggle collapsed ↔ expanded.
   * Defaults to `true` (Activity is expandable by design). Pass `false` to lock size.
   */
  expandable?: boolean;
  /** Controlled expanded state (overrides `mode` between collapsed/expanded). */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Auto-expand after this many milliseconds (uncontrolled, or fires `onExpandedChange`).
   * Useful for “compress then grow” live-activity timing.
   */
  expandAfter?: number;
  /**
   * When true, collapsed state is an empty pill (no icon/title/body).
   * Content is revealed only after expand.
   */
  hideCollapsedContent?: boolean;
  /**
   * Expanded shell size. Default `minHeight` is `9rem`.
   * @example expandedSize={{ width: 380, minHeight: '12rem', height: '12rem' }}
   */
  expandedSize?: ActivityExpandedSize;
  /**
   * Expand/collapse morph duration. Number = milliseconds; string = any CSS time.
   * @default 780 (0.78s)
   * @example expandDuration={1200}
   * @example expandDuration="1.2s"
   */
  expandDuration?: number | string;
  className?: string;
  style?: CSSProperties;
}

export interface ActivitySectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function mergeClassName(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}

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

function expandedSizeStyle(size: ActivityExpandedSize | undefined): CSSProperties | undefined {
  if (!size) return undefined;
  const next: CSSProperties = {};
  if (size.width != null) {
    (next as Record<string, string>)['--lr-activity-width-expanded'] = toCssSize(size.width);
  }
  if (size.height != null) {
    (next as Record<string, string>)['--lr-activity-height-expanded'] = toCssSize(size.height);
  }
  if (size.minWidth != null) {
    (next as Record<string, string>)['--lr-activity-min-width-expanded'] = toCssSize(size.minWidth);
  }
  if (size.minHeight != null) {
    (next as Record<string, string>)['--lr-activity-min-height-expanded'] = toCssSize(size.minHeight);
    // Keep the morph height in sync when only minHeight is customized.
    if (size.height == null) {
      (next as Record<string, string>)['--lr-activity-height-expanded'] = toCssSize(size.minHeight);
    }
  }
  return next;
}

/** Maps `expandDuration` onto the CSS timing variables used by the morph. */
function expandDurationStyle(duration: number | string | undefined): CSSProperties | undefined {
  if (duration == null) return undefined;
  const size = toCssTime(duration);
  const next: Record<string, string> = {
    '--lr-activity-duration-size': size,
    '--lr-activity-duration-content': `calc(${size} * 0.62)`,
    '--lr-activity-content-delay-in': `calc(${size} * 0.18)`,
  };
  return next as CSSProperties;
}

const ACTION_VARIANT_CLASS: Record<ActivityActionVariant, string | undefined> = {
  default: styles.actionDefault,
  primary: styles.actionPrimary,
  danger: styles.actionDanger,
  ghost: styles.actionGhost,
};

function renderActionButtons(actions: ActivityAction[]): ReactNode {
  return actions.map((action, index) => {
    const variant = action.variant ?? 'default';
    return (
      <button
        key={action.id ?? `${action.label}-${index}`}
        type="button"
        className={mergeClassName(styles.actionButton, ACTION_VARIANT_CLASS[variant])}
        disabled={action.disabled}
        aria-label={action['aria-label'] ?? action.label}
        onClick={(event) => {
          event.stopPropagation();
          action.onClick(event);
        }}
      >
        {action.label}
      </button>
    );
  });
}

function ActivityLeading({ children, className, style, ...props }: ActivitySectionProps) {
  return (
    <div className={mergeClassName(styles.leading, className)} style={style} data-slot="leading" {...props}>
      {children}
    </div>
  );
}

function ActivityContent({ children, className, style, ...props }: ActivitySectionProps) {
  return (
    <div className={mergeClassName(styles.content, className)} style={style} data-slot="content" {...props}>
      {children}
    </div>
  );
}

function ActivityTrailing({ children, className, style, ...props }: ActivitySectionProps) {
  return (
    <div className={mergeClassName(styles.trailing, className)} style={style} data-slot="trailing" {...props}>
      {children}
    </div>
  );
}

function ActivityMeta({ children, className, style, ...props }: ActivitySectionProps) {
  return (
    <div className={mergeClassName(styles.meta, className)} style={style} data-slot="meta" {...props}>
      {children}
    </div>
  );
}

function ActivityActions({ children, className, style, ...props }: ActivitySectionProps) {
  return (
    <div className={mergeClassName(styles.actions, className)} style={style} data-slot="actions" {...props}>
      {children}
    </div>
  );
}

function ActivityBody({ children, className, style, ...props }: ActivitySectionProps) {
  return (
    <div className={mergeClassName(styles.body, className)} style={style} data-slot="body" {...props}>
      {children}
    </div>
  );
}

const COMPOUND_TYPES = new Set([
  ActivityLeading,
  ActivityContent,
  ActivityTrailing,
  ActivityMeta,
  ActivityActions,
  ActivityBody,
]);

function isCompoundChild(child: ReactNode): boolean {
  return isValidElement(child) && COMPOUND_TYPES.has(child.type as typeof ActivityLeading);
}

function resolveMode(
  mode: ActivityMode,
  expanded: boolean | undefined,
  expandable: boolean,
  uncontrolledExpanded: boolean,
): ActivityMode {
  if (mode === 'persistent') return 'persistent';
  if (typeof expanded === 'boolean') return expanded ? 'expanded' : 'collapsed';
  if (expandable) return uncontrolledExpanded ? 'expanded' : 'collapsed';
  return mode;
}

function ActivityRoot({
  children,
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
  onClick,
  onKeyDown,
  className,
  style,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  ...props
}: ActivityProps) {
  const labelId = useId();
  const descId = useId();
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(
    () => Boolean(defaultExpanded) || mode === 'expanded',
  );
  const resolvedMode = resolveMode(mode, expanded, expandable, uncontrolledExpanded);
  const isExpanded = resolvedMode === 'expanded' || resolvedMode === 'persistent';
  const contentVisible = isExpanded || !hideCollapsedContent;
  const showProgress = typeof progress === 'number' || status === 'progress';
  const progressValue = clampProgress(progress ?? 0);
  const childArray = Children.toArray(children);
  const usesComposition = childArray.some(isCompoundChild);
  const freeChildren = usesComposition ? null : children;
  const hasBody = Boolean(freeChildren) || childArray.some(
    (child) => isValidElement(child) && child.type === ActivityBody,
  );
  const interactive = expandable || typeof onClick === 'function' || role === 'button';
  const hasIcon = icon != null;
  const hasActions = Boolean(actions?.length);
  const mergedStyle = {
    ...expandedSizeStyle(expandedSize),
    ...expandDurationStyle(expandDuration),
    ...style,
  };

  const setExpanded = (next: boolean) => {
    if (expanded === undefined) {
      setUncontrolledExpanded(next);
    }
    onExpandedChange?.(next);
  };

  useEffect(() => {
    if (expandAfter == null || mode === 'persistent') return;
    if (typeof expanded === 'boolean') {
      if (expanded) return;
      const id = window.setTimeout(() => onExpandedChange?.(true), expandAfter);
      return () => window.clearTimeout(id);
    }
    if (uncontrolledExpanded) return;
    const id = window.setTimeout(() => setExpanded(true), expandAfter);
    return () => window.clearTimeout(id);
    // Only schedule once when expandAfter is set / remounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot timer from expandAfter
  }, [expandAfter, mode]);

  const toggleExpanded = () => {
    if (!expandable || mode === 'persistent') return;
    setExpanded(!isExpanded);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    toggleExpanded();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (!expandable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  };

  const resolvedAriaLabel =
    ariaLabel ??
    ([title, description, showProgress ? `${progressValue}%` : null].filter(Boolean).join('. ') ||
      'Live activity');

  const leadingNode =
    hasIcon || leading != null ? (
      <ActivityLeading>
        {hasIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {leading}
      </ActivityLeading>
    ) : null;

  const actionButtons = hasActions ? renderActionButtons(actions!) : null;

  const trailingNode =
    trailing != null ? (
      <ActivityTrailing>
        {trailing}
      </ActivityTrailing>
    ) : null;

  const progressNode = showProgress ? (
    <div
      className={styles.progress}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressValue}
      aria-label={title ? `${title} progress` : 'Activity progress'}
    >
      <span className={styles.progressFill} style={{ width: `${progressValue}%` }} />
    </div>
  ) : null;

  const summaryMeta =
    title || description ? (
      <ActivityMeta>
        {title ? (
          <span className={styles.title} id={labelId}>
            {title}
          </span>
        ) : null}
        {description ? (
          <span className={styles.description} id={descId}>
            {description}
          </span>
        ) : null}
      </ActivityMeta>
    ) : null;

  const body = usesComposition ? (
    children
  ) : (
    <>
      <div
        className={styles.summary}
        data-slot="summary"
        data-open={contentVisible ? 'true' : 'false'}
        aria-hidden={!contentVisible}
      >
        {leadingNode}
        <ActivityContent>
          {summaryMeta}
          {progressNode}
        </ActivityContent>
        {trailingNode}
      </div>
      {hasBody ? (
        <ActivityBody data-open={isExpanded ? 'true' : 'false'} aria-hidden={!isExpanded}>
          {freeChildren}
        </ActivityBody>
      ) : null}
      {hasActions ? (
        <ActivityActions
          data-open={contentVisible ? 'true' : 'false'}
          data-placement={isExpanded ? 'footer' : 'inline'}
          aria-hidden={!contentVisible}
        >
          {actionButtons}
        </ActivityActions>
      ) : null}
    </>
  );

  const useNameLabel = Boolean(ariaLabel) || !title || !contentVisible;

  return (
    <div
      {...props}
      className={mergeClassName(styles.root, className)}
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
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      aria-label={useNameLabel ? resolvedAriaLabel : undefined}
      aria-expanded={expandable && mode !== 'persistent' ? isExpanded : undefined}
      aria-labelledby={!useNameLabel && title ? labelId : undefined}
      aria-describedby={contentVisible && description ? descId : undefined}
      onClick={interactive ? handleClick : onClick}
      onKeyDown={interactive ? handleKeyDown : onKeyDown}
    >
      <div className={styles.shell} aria-hidden={!contentVisible || undefined}>
        {body}
      </div>
    </div>
  );
}

/**
 * Floating live-activity shell for durable / interactive work
 * (uploads, AI jobs, sync, media, payments) — not transient toasts.
 *
 * Starts compact (icon / title / description). Expand to reveal `children`
 * centered in the shell — click, keyboard, or `expandAfter`.
 */
export const Activity = Object.assign(ActivityRoot, {
  Leading: ActivityLeading,
  Content: ActivityContent,
  Trailing: ActivityTrailing,
  Meta: ActivityMeta,
  Actions: ActivityActions,
  Body: ActivityBody,
});
