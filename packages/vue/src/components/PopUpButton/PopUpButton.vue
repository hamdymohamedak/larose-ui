<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch, type CSSProperties } from 'vue';
import type { PopUpCustomOption, PopUpOption } from '../../PopUpButton/types';
import {
  buildPopUpMenuEntries,
  resolveDefaultValue,
  resolvePopUpLabel,
} from '../../PopUpButton/utils';
import styles from '@larose-ui/styles/components/PopUpButton/PopUpButton.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label?: string;
    options: PopUpOption[];
    modelValue?: string;
    defaultValue?: string;
    placeholder?: string;
    customOption?: PopUpCustomOption;
    explanatoryText?: string;
    disabled?: boolean;
    id?: string;
    class?: string;
    style?: CSSProperties;
  }>(),
  {
    placeholder: 'Select…',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [string];
  valueChange: [string];
}>();

const menuId = useId();
const triggerRef = ref<HTMLButtonElement | null>(null);
const internalValue = ref(resolveDefaultValue(props.options, props.defaultValue) ?? '');
const open = ref(false);
const position = ref({ x: 0, y: 0 });

const currentValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internalValue.value,
);
const menuEntries = computed(() =>
  buildPopUpMenuEntries(props.options, currentValue.value, props.customOption),
);
const displayLabel = computed(() =>
  resolvePopUpLabel(props.options, currentValue.value, props.placeholder),
);
const triggerId = computed(() => props.id ?? `popup-${menuId}`);

function setValue(next: string) {
  if (props.modelValue === undefined) internalValue.value = next;
  emit('update:modelValue', next);
  emit('valueChange', next);
}

function openMenu() {
  const rect = triggerRef.value?.getBoundingClientRect();
  if (!rect) return;
  position.value = { x: rect.left, y: rect.bottom + 4 };
  open.value = true;
}

function close() {
  open.value = false;
}

function handleSelect(entryId: string) {
  if (props.customOption && entryId === props.customOption.value) {
    props.customOption.onSelect?.();
  }
  setValue(entryId);
  close();
}

let keyHandler: ((event: KeyboardEvent) => void) | null = null;

watch(open, (isOpen) => {
  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }
  if (!isOpen) return;
  keyHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  document.addEventListener('keydown', keyHandler);
});

onBeforeUnmount(() => {
  if (keyHandler) document.removeEventListener('keydown', keyHandler);
});
</script>

<template>
  <div :class="cn(styles.wrap, props.class)" :style="props.style">
    <div v-if="label || explanatoryText" :class="styles.labelRow">
      <label v-if="label" :class="styles.fieldLabel" :for="triggerId">{{ label }}</label>
      <p v-if="explanatoryText && !open" :class="styles.explanatory">{{ explanatoryText }}</p>
    </div>

    <button
      ref="triggerRef"
      :id="triggerId"
      type="button"
      :class="styles.trigger"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="open ? menuId : undefined"
      @click="open ? close() : openMenu()"
    >
      <span :class="styles.triggerLabel">{{ displayLabel }}</span>
      <svg :class="styles.chevron" viewBox="0 0 12 12" aria-hidden="true">
        <path
          d="M2.5 4.5 6 8l3.5-3.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <Teleport to="[data-lr-portal-root], [data-lr-provider], body">
      <div v-if="open">
        <div :class="styles.menuBackdrop" role="presentation" @click="close" />
        <div
          :id="menuId"
          :class="styles.menuPanel"
          role="listbox"
          :aria-label="label ?? 'Options'"
          :style="{
            left: `${position.x}px`,
            top: `${position.y}px`,
            position: 'fixed',
            zIndex: 1000,
          }"
          @click.stop
        >
          <ul :class="styles.list">
            <template
              v-for="(entry, index) in menuEntries"
              :key="('id' in entry && entry.id) || `sep-${index}`"
            >
              <li
                v-if="entry.type === 'separator'"
                :class="styles.separator"
                role="separator"
              />
              <li v-else-if="entry.type !== 'submenu'">
                <button
                  type="button"
                  :class="styles.item"
                  role="option"
                  :aria-selected="'selected' in entry && entry.selected ? true : undefined"
                  :disabled="'disabled' in entry ? entry.disabled : undefined"
                  @click="handleSelect(String(entry.id))"
                >
                  <span :class="styles.checkmark" aria-hidden="true">
                    {{ 'selected' in entry && entry.selected ? '✓' : '' }}
                  </span>
                  <span :class="styles.itemLabel">
                    {{ 'label' in entry ? entry.label : '' }}
                  </span>
                </button>
              </li>
            </template>
          </ul>
          <p
            v-if="explanatoryText"
            :class="styles.explanatory"
            style="padding: 0.5rem 0.75rem 0.25rem"
          >
            {{ explanatoryText }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
