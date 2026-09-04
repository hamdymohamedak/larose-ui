<script setup lang="ts">
import { ref, useId, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/FileUpload/FileUpload.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    error?: string | null;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    buttonLabel?: string;
    class?: string;
    style?: CSSProperties;
  }>(),
  { error: null, multiple: false, disabled: false, buttonLabel: 'Choose files or drag here' },
);

const emit = defineEmits<{ filesChange: [files: File[]] }>();
const inputId = useId();
const files = ref<File[]>([]);
const dragOver = ref(false);
const errorMessage = () => (typeof props.error === 'string' ? props.error : null);
const uiState = () =>
  props.disabled ? 'disabled' : errorMessage() ? 'error' : dragOver.value ? 'dragover' : 'default';

function update(next: File[]) {
  files.value = next;
  emit('filesChange', next);
}

function handleFiles(list: FileList | null) {
  if (!list || props.disabled) return;
  update(Array.from(list));
}
</script>

<template>
  <div :class="cn(styles.wrapper, props.class)" :style="props.style">
    <label v-if="label" :for="inputId" :class="styles.label">{{ label }}</label>
    <label
      :for="inputId"
      :class="styles.dropzone"
      :data-state="uiState()"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="
        dragOver = false;
        handleFiles(($event as DragEvent).dataTransfer?.files ?? null);
      "
    >
      <span>{{ buttonLabel }}</span>
      <input
        :id="inputId"
        type="file"
        :class="styles.input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="handleFiles(($event.target as HTMLInputElement).files)"
      />
    </label>
    <ul v-if="files.length" :class="styles.fileList">
      <li v-for="file in files" :key="file.name + file.size" :class="styles.fileItem">{{ file.name }}</li>
    </ul>
    <span v-if="hint && !errorMessage()" :class="styles.hint">{{ hint }}</span>
    <span v-if="errorMessage()" :class="styles.error" role="alert">{{ errorMessage() }}</span>
  </div>
</template>
