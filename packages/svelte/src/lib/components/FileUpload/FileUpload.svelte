<script lang="ts">
  import styles from '@larose-ui/styles/components/FileUpload/FileUpload.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label?: string;
    hint?: string;
    error?: string | null;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    buttonLabel?: string;
    class?: string;
    style?: string;
    onFilesChange?: (files: File[]) => void;
  }

  let {
    label,
    hint,
    error = null,
    accept,
    multiple = false,
    disabled = false,
    buttonLabel = 'Choose files or drag here',
    class: className,
    style,
    onFilesChange,
  }: Props = $props();

  let files = $state<File[]>([]);
  let dragOver = $state(false);
  const inputId = `file-upload-${Math.random().toString(36).slice(2)}`;
  const errorMessage = $derived(typeof error === 'string' ? error : null);
  const uiState = $derived(
    disabled ? 'disabled' : errorMessage ? 'error' : dragOver ? 'dragover' : 'default',
  );

  function handleFiles(list: FileList | null) {
    if (!list || disabled) return;
    files = Array.from(list);
    onFilesChange?.(files);
  }
</script>

<div class={cn(styles.wrapper, className)} {style}>
  {#if label}<label for={inputId} class={styles.label}>{label}</label>{/if}
  <label
    for={inputId}
    class={styles.dropzone}
    data-state={uiState}
    ondragover={(e) => {
      e.preventDefault();
      dragOver = true;
    }}
    ondragleave={(e) => {
      e.preventDefault();
      dragOver = false;
    }}
    ondrop={(e) => {
      e.preventDefault();
      dragOver = false;
      handleFiles(e.dataTransfer?.files ?? null);
    }}
  >
    <span>{buttonLabel}</span>
    <input
      id={inputId}
      type="file"
      class={styles.input}
      {accept}
      {multiple}
      {disabled}
      onchange={(e) => handleFiles((e.currentTarget as HTMLInputElement).files)}
    />
  </label>
  {#if files.length}
    <ul class={styles.fileList}>
      {#each files as file (file.name + file.size)}
        <li class={styles.fileItem}>{file.name}</li>
      {/each}
    </ul>
  {/if}
  {#if hint && !errorMessage}<span class={styles.hint}>{hint}</span>{/if}
  {#if errorMessage}<span class={styles.error} role="alert">{errorMessage}</span>{/if}
</div>
