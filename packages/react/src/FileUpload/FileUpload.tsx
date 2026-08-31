import { useCallback, useId, useRef, useState, type DragEvent } from 'react';
import styles from '@larose-ui/styles/components/FileUpload/FileUpload.module.css';

export interface FileUploadProps {
  label?: string;
  hint?: string;
  error?: string | null;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label,
  hint,
  error = null,
  accept,
  multiple = false,
  disabled = false,
  buttonLabel = 'Choose files or drag here',
  onFilesChange,
  className,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const errorMessage = typeof error === 'string' ? error : null;
  const uiState = disabled ? 'disabled' : errorMessage ? 'error' : dragOver ? 'dragover' : 'default';

  const updateFiles = useCallback(
    (next: File[]) => {
      setFiles(next);
      onFilesChange?.(next);
    },
    [onFilesChange],
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;
      updateFiles(Array.from(fileList));
    },
    [disabled, updateFiles],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragOver(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-state={uiState}>
      {label && (
        <span id={`${inputId}-label`} className={styles.label}>
          {label}
        </span>
      )}
      <label
        htmlFor={inputId}
        className={styles.dropzone}
        data-state={uiState}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className={styles.input}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={
            errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          aria-labelledby={label ? `${inputId}-label` : undefined}
          onChange={(event) => handleFiles(event.target.files)}
        />
        <span>{buttonLabel}</span>
      </label>
      {files.length > 0 && (
        <ul className={styles.fileList} aria-label="Selected files">
          {files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`} className={styles.fileItem}>
              {file.name}
            </li>
          ))}
        </ul>
      )}
      {hint && !errorMessage && (
        <span id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
      {errorMessage && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
