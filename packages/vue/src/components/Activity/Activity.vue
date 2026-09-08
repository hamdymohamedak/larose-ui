<script setup lang="ts">
import { computed, onUnmounted, ref, useSlots, watch } from 'vue';
import styles from '@larose-ui/styles/components/Activity/Activity.module.css';
import { cn } from '../../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  onClick: (event: MouseEvent) => void;
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

// ─── Props / Emits ────────────────────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
    /** Compact pill, detail panel, or always-on persistent strip. */
    mode?: ActivityMode;
    status?: ActivityStatus;
    priority?: ActivityPriority;
    title?: string;
    description?: string;
    /** 0–100; renders a meter when status is `progress` (or whenever value is provided). */
    progress?: number;
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
    /**
     * Auto-expand after this many milliseconds.
     * Useful for "compress then grow" live-activity timing.
     */
    expandAfter?: number;
    /**
     * When true, collapsed state is an empty pill.
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
    role?: string;
    tabIndex?: number;
    'aria-label'?: string;
    class?: string;
    style?: string | Record<string, string>;
  }>(),
  {
    mode: 'collapsed',
    status: 'idle',
    priority: 'important',
    expandable: true,
    hideCollapsedContent: false,
  },
);

const emit = defineEmits<{
  /** Fires when the expanded state changes (controlled or uncontrolled). */
  expandedChange: [expanded: boolean];
}>();

// ─── Slots ────────────────────────────────────────────────────────────────────
//
// Convenience API slots:
//   icon     — leading icon/image node
//   leading  — additional leading content (beside icon)
//   trailing — trailing content
//   default  — body content, shown when expanded
//
// Full composition slots (any one present → composition mode):
//   content, meta, body, actions
//   (leading / trailing are shared between both modes)

const slots = useSlots();

// ─── IDs for aria-labelledby / aria-describedby ───────────────────────────────

const uid = Math.random().toString(36).slice(2, 9);
const labelId = `lr-activity-label-${uid}`;
const descId = `lr-activity-desc-${uid}`;

// ─── Uncontrolled expanded state ──────────────────────────────────────────────

const uncontrolledExpanded = ref(
  Boolean(props.defaultExpanded) || props.mode === 'expanded',
);

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function resolveMode(
  mode: ActivityMode,
  expanded: boolean | undefined,
  expandable: boolean,
  uncontrolled: boolean,
): ActivityMode {
  if (mode === 'persistent') return 'persistent';
  if (typeof expanded === 'boolean') return expanded ? 'expanded' : 'collapsed';
  if (expandable) return uncontrolled ? 'expanded' : 'collapsed';
  return mode;
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

// ─── Computed ─────────────────────────────────────────────────────────────────

const resolvedMode = computed(() =>
  resolveMode(props.mode, props.expanded, props.expandable, uncontrolledExpanded.value),
);

const isExpanded = computed(
  () => resolvedMode.value === 'expanded' || resolvedMode.value === 'persistent',
);

const contentVisible = computed(() => isExpanded.value || !props.hideCollapsedContent);
const showProgress = computed(
  () => typeof props.progress === 'number' || props.status === 'progress',
);
const progressValue = computed(() => clampProgress(props.progress ?? 0));
const hasActions = computed(() => Boolean(props.actions?.length));
const hasIcon = computed(() => Boolean(slots.icon));
const interactive = computed(() => props.expandable);

/**
 * Full composition mode: user provided content/meta/body slots for a
 * fully custom shell layout. When false, the convenience layout is rendered.
 */
const usesComposition = computed(() =>
  Boolean(slots.content || slots.meta || slots.body),
);

const hasBody = computed(
  () => !usesComposition.value && Boolean(slots.default),
);

const resolvedAriaLabel = computed(
  () =>
    props['aria-label'] ??
    (
      [props.title, props.description, showProgress.value ? `${progressValue.value}%` : null]
        .filter(Boolean)
        .join('. ') || 'Live activity'
    ),
);

const useNameLabel = computed(
  () => Boolean(props['aria-label']) || !props.title || !contentVisible.value,
);

const mergedStyle = computed(() => {
  const vars: Record<string, string> = {};
  const size = props.expandedSize;
  const duration = props.expandDuration;

  if (size) {
    if (size.width != null) vars['--lr-activity-width-expanded'] = toCssSize(size.width);
    if (size.height != null) vars['--lr-activity-height-expanded'] = toCssSize(size.height);
    if (size.minWidth != null) vars['--lr-activity-min-width-expanded'] = toCssSize(size.minWidth);
    if (size.minHeight != null) {
      vars['--lr-activity-min-height-expanded'] = toCssSize(size.minHeight);
      if (size.height == null) vars['--lr-activity-height-expanded'] = toCssSize(size.minHeight);
    }
  }
  if (duration != null) {
    const s = toCssTime(duration);
    vars['--lr-activity-duration-size'] = s;
    vars['--lr-activity-duration-content'] = `calc(${s} * 0.62)`;
    vars['--lr-activity-content-delay-in'] = `calc(${s} * 0.18)`;
  }
  return vars;
});

const ACTION_VARIANT_CLASS: Record<ActivityActionVariant, string | undefined> = {
  default: styles.actionDefault,
  primary: styles.actionPrimary,
  danger: styles.actionDanger,
  ghost: styles.actionGhost,
};

function actionClass(variant: ActivityActionVariant = 'default'): string {
  return cn(styles.actionButton, ACTION_VARIANT_CLASS[variant]);
}

// ─── expandAfter timer ────────────────────────────────────────────────────────

let expandTimer: number | null = null;

function clearExpandTimer() {
  if (expandTimer !== null) {
    window.clearTimeout(expandTimer);
    expandTimer = null;
  }
}

function scheduleExpand() {
  clearExpandTimer();
  if (props.expandAfter == null || props.mode === 'persistent') return;

  if (typeof props.expanded === 'boolean') {
    if (props.expanded) return;
    expandTimer = window.setTimeout(() => emit('expandedChange', true), props.expandAfter);
    return;
  }
  if (uncontrolledExpanded.value) return;
  expandTimer = window.setTimeout(() => setExpanded(true), props.expandAfter);
}

// Re-schedule only when expandAfter / mode change (mirrors React's dep array)
watch(() => [props.expandAfter, props.mode] as const, scheduleExpand, { immediate: true });
onUnmounted(clearExpandTimer);

// ─── Event handlers ───────────────────────────────────────────────────────────

function setExpanded(next: boolean) {
  if (props.expanded === undefined) {
    uncontrolledExpanded.value = next;
  }
  emit('expandedChange', next);
}

function toggleExpanded() {
  if (!props.expandable || props.mode === 'persistent') return;
  setExpanded(!isExpanded.value);
}

function handleClick(event: MouseEvent) {
  if (event.defaultPrevented) return;
  toggleExpanded();
}

function handleKeyDown(event: KeyboardEvent) {
  if (!props.expandable) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleExpanded();
  }
}
</script>

<!--
  Floating live-activity shell for durable / interactive work
  (uploads, AI jobs, sync, media, payments) — not transient toasts.

  Starts compact (icon / title / description). Expand to reveal slot content
  centered in the shell — click, keyboard, or expandAfter.

  Slots:
    icon      — leading icon/image (convenience mode)
    leading   — additional leading area content
    trailing  — trailing area content
    default   — body content revealed on expand (convenience mode)
    content   — full custom content column (composition mode)
    meta      — full custom meta block (composition mode)
    body      — full custom body (composition mode)
    actions   — full custom actions row (composition mode)
-->
<template>
  <div
    :class="cn(styles.root, props.class)"
    :style="[mergedStyle, props.style]"
    data-larose="Activity"
    :data-mode="resolvedMode"
    :data-status="status"
    :data-priority="priority"
    :data-has-icon="hasIcon && contentVisible ? 'true' : undefined"
    :data-has-actions="hasActions ? 'true' : undefined"
    :data-has-body="hasBody ? 'true' : undefined"
    :data-expandable="expandable ? 'true' : undefined"
    :data-hide-collapsed-content="hideCollapsedContent ? 'true' : undefined"
    :role="role ?? (interactive ? 'button' : 'status')"
    :tabindex="tabIndex ?? (interactive ? 0 : undefined)"
    :aria-label="useNameLabel ? resolvedAriaLabel : undefined"
    :aria-expanded="expandable && mode !== 'persistent' ? isExpanded : undefined"
    :aria-labelledby="!useNameLabel && title ? labelId : undefined"
    :aria-describedby="contentVisible && description ? descId : undefined"
    @click="interactive ? handleClick($event) : undefined"
    @keydown="interactive ? handleKeyDown($event) : undefined"
  >
    <div :class="styles.shell" :aria-hidden="!contentVisible ? true : undefined">

      <!-- ── Full composition mode ── -->
      <template v-if="usesComposition">
        <div v-if="$slots.leading" :class="styles.leading" data-slot="leading">
          <slot name="leading" />
        </div>
        <div v-if="$slots.content" :class="styles.content" data-slot="content">
          <slot name="content" />
        </div>
        <div v-if="$slots.trailing" :class="styles.trailing" data-slot="trailing">
          <slot name="trailing" />
        </div>
        <div v-if="$slots.meta" :class="styles.meta" data-slot="meta">
          <slot name="meta" />
        </div>
        <div v-if="$slots.actions" :class="styles.actions" data-slot="actions">
          <slot name="actions" />
        </div>
        <div v-if="$slots.body" :class="styles.body" data-slot="body">
          <slot name="body" />
        </div>
      </template>

      <!-- ── Convenience API mode ── -->
      <template v-else>
        <!-- Summary row -->
        <div
          :class="styles.summary"
          data-slot="summary"
          :data-open="contentVisible ? 'true' : 'false'"
          :aria-hidden="!contentVisible"
        >
          <!-- Leading (icon + optional extra leading content) -->
          <div v-if="hasIcon || $slots.leading" :class="styles.leading" data-slot="leading">
            <span v-if="hasIcon" :class="styles.icon" aria-hidden="true">
              <slot name="icon" />
            </span>
            <slot name="leading" />
          </div>

          <!-- Content column -->
          <div :class="styles.content" data-slot="content">
            <div v-if="title || description" :class="styles.meta" data-slot="meta">
              <span v-if="title" :class="styles.title" :id="labelId">{{ title }}</span>
              <span v-if="description" :class="styles.description" :id="descId">
                {{ description }}
              </span>
            </div>
            <div
              v-if="showProgress"
              :class="styles.progress"
              role="progressbar"
              :aria-valuemin="0"
              :aria-valuemax="100"
              :aria-valuenow="progressValue"
              :aria-label="title ? `${title} progress` : 'Activity progress'"
            >
              <span :class="styles.progressFill" :style="{ width: `${progressValue}%` }" />
            </div>
          </div>

          <!-- Trailing -->
          <div v-if="$slots.trailing" :class="styles.trailing" data-slot="trailing">
            <slot name="trailing" />
          </div>
        </div>

        <!-- Body (revealed on expand) -->
        <div
          v-if="hasBody"
          :class="styles.body"
          data-slot="body"
          :data-open="isExpanded ? 'true' : 'false'"
          :aria-hidden="!isExpanded"
        >
          <slot />
        </div>

        <!-- Declarative action buttons -->
        <div
          v-if="hasActions"
          :class="styles.actions"
          data-slot="actions"
          :data-open="contentVisible ? 'true' : 'false'"
          :data-placement="isExpanded ? 'footer' : 'inline'"
          :aria-hidden="!contentVisible"
        >
          <button
            v-for="(action, i) in actions"
            :key="action.id ?? `${action.label}-${i}`"
            type="button"
            :class="actionClass(action.variant)"
            :disabled="action.disabled"
            :aria-label="action['aria-label'] ?? action.label"
            @click.stop="action.onClick($event)"
          >
            {{ action.label }}
          </button>
        </div>
      </template>

    </div>
  </div>
</template>
