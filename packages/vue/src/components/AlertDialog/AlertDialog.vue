<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import {
  createPresenceController,
  presenceMotionClassKey,
  type PresencePhase,
} from '@larose-ui/component-logic/overlay';
import type {
  AlertDialogAction,
  AlertDialogPresentation,
  AlertDialogSuppression,
  AlertDialogTextField,
} from '../../AlertDialog/types';
import {
  formatAlertTitle,
  orderAlertActions,
  resolveCancelAction,
  shouldStyleDestructive,
  validateAlertActions,
  warnIfAlertTitleTooLong,
} from '../../AlertDialog/utils';
import styles from '@larose-ui/styles/components/AlertDialog/AlertDialog.module.css';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message?: string;
    actions: AlertDialogAction[];
    presentation?: AlertDialogPresentation;
    icon?: unknown;
    showCautionIcon?: boolean;
    textField?: AlertDialogTextField;
    suppression?: AlertDialogSuppression;
    helpUrl?: string;
    accessory?: unknown;
    defaultActionId?: string;
    class?: string;
    style?: CSSProperties;
  }>(),
  {
    presentation: 'compact',
    showCautionIcon: false,
  },
);

const emit = defineEmits<{
  openChange: [open: boolean];
}>();

const titleId = useId();
const messageId = useId();
const dialogRef = ref<HTMLDivElement | null>(null);
const internalText = ref(props.textField?.defaultValue ?? '');
const suppressed = ref(props.suppression?.defaultChecked ?? false);

const textValue = computed(() => props.textField?.value ?? internalText.value);
const suppressionChecked = computed(() => props.suppression?.checked ?? suppressed.value);

const layoutResult = computed(() => orderAlertActions(props.actions, props.presentation));
const resolvedDefaultId = computed(
  () =>
    props.defaultActionId ??
    layoutResult.value.ordered.find((action) => action.role === 'default')?.id,
);

function close() {
  emit('openChange', false);
}

function runAction(action: AlertDialogAction) {
  action.onSelect?.();
  if (action.role !== 'cancel') close();
}

function onTextInput(event: Event) {
  const next = (event.target as HTMLInputElement).value;
  if (props.textField?.value === undefined) internalText.value = next;
  props.textField?.onChange?.(next);
}

function onSuppressionChange(event: Event) {
  const next = (event.target as HTMLInputElement).checked;
  if (props.suppression?.checked === undefined) suppressed.value = next;
  props.suppression?.onChange?.(next);
}

function openHelp() {
  if (props.helpUrl) {
    globalThis.window.open(props.helpUrl, '_blank', 'noopener,noreferrer');
  }
}

const controller = createPresenceController(props.open);
const phase = shallowRef<PresencePhase>(controller.getSnapshot().phase);
const shouldRender = shallowRef(controller.getSnapshot().shouldRender);

const unsub = controller.subscribe(() => {
  const snap = controller.getSnapshot();
  phase.value = snap.phase;
  shouldRender.value = snap.shouldRender;
});

onBeforeUnmount(() => {
  unsub();
  controller.dispose();
});

function onAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget) return;
  controller.handleAnimationEnd();
}

watch(
  () => props.open,
  (open) => controller.setPresent(open),
  { immediate: true },
);

watch(
  () => props.open,
  async (open, _prev, onCleanup) => {
    if (!open) return;
    validateAlertActions(props.actions);
    warnIfAlertTitleTooLong(props.title);
    await nextTick();
    dialogRef.value?.focus();
    const deactivate = activateOverlayFocus({
      container: dialogRef.value,
      onEscape: () => {
        const cancel = resolveCancelAction(props.actions);
        if (cancel) runAction(cancel);
        else close();
      },
      autoFocus: false,
    });
    onCleanup(() => deactivate());
  },
);

const overlayClass = computed(() => {
  const key = presenceMotionClassKey('backdrop', phase.value);
  return cn(styles.overlay, key ? motionStyles[key as keyof typeof motionStyles] : undefined);
});

const alertClass = computed(() => {
  const key = presenceMotionClassKey('modal', phase.value);
  return cn(
    styles.alert,
    props.class,
    key ? motionStyles[key as keyof typeof motionStyles] : undefined,
  );
});
</script>

<template>
  <Teleport v-if="shouldRender" to="[data-lr-portal-root], [data-lr-provider], body">
    <div
      :class="overlayClass"
      :data-presentation="presentation"
      :data-presence="phase"
      role="presentation"
      @animationend="onAnimationEnd"
    >
      <div
        ref="dialogRef"
        :class="alertClass"
        :style="style"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="message ? messageId : undefined"
        :data-presentation="presentation"
        :data-presence="phase"
        tabindex="-1"
        @animationend="onAnimationEnd"
      >
        <div :class="styles.body">
          <div :class="styles.header">
            <svg
              v-if="showCautionIcon"
              :class="styles.caution"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 8v5M12 16h.01M10.29 4.86 2.82 18a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3L13.71 4.86a2 2 0 0 0-3.42 0z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span v-if="$slots.icon" :class="styles.icon">
              <slot name="icon" />
            </span>
            <div>
              <h2 :id="titleId" :class="styles.title">{{ formatAlertTitle(title) }}</h2>
            </div>
          </div>

          <p v-if="message" :id="messageId" :class="styles.message">{{ message }}</p>

          <div v-if="$slots.accessory" :class="styles.accessory">
            <slot name="accessory" />
          </div>

          <label v-if="textField" :class="styles.field">
            <span v-if="textField.label" :class="styles.fieldLabel">{{ textField.label }}</span>
            <input
              :class="styles.input"
              :type="textField.secure ? 'password' : 'text'"
              :placeholder="textField.placeholder"
              :value="textValue"
              @input="onTextInput"
            />
          </label>

          <label v-if="suppression" :class="styles.suppression">
            <input type="checkbox" :checked="suppressionChecked" @change="onSuppressionChange" />
            <span>{{ suppression.label }}</span>
          </label>
        </div>

        <div :class="styles.actions" :data-layout="layoutResult.layout">
          <button
            v-for="action in layoutResult.ordered"
            :key="action.id"
            type="button"
            :class="styles.action"
            :data-role="action.role ?? 'default'"
            :data-destructive="shouldStyleDestructive(action) ? 'true' : undefined"
            :data-default-focus="resolvedDefaultId === action.id ? 'true' : undefined"
            @click="runAction(action)"
          >
            {{ action.label }}
          </button>
        </div>

        <div v-if="helpUrl" :class="styles.footer">
          <button type="button" :class="styles.help" @click="openHelp">Help</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
