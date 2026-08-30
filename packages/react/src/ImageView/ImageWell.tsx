import {
  useCallback,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { ImageView } from './ImageView';
import styles from './ImageView.module.css';

export interface ImageWellProps {
  label?: string;
  src?: string;
  onImageChange?: (file: File | null, previewUrl: string | null) => void;
  accept?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Editable image well — supports paste, drag-and-drop, and Delete to clear (macOS HIG).
 * @see https://developer.apple.com/design/human-interface-guidelines/image-views
 */
export function ImageWell({
  label = 'Image',
  src,
  onImageChange,
  accept = 'image/*',
  placeholder = 'Drop an image, paste, or click to choose',
  disabled = false,
}: ImageWellProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(src);
  const [dragOver, setDragOver] = useState(false);

  const applyFile = useCallback(
    (file: File | null) => {
      if (!file) {
        setPreview(undefined);
        onImageChange?.(null, null);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageChange?.(file, url);
    },
    [onImageChange],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length || disabled) return;
      applyFile(files[0] ?? null);
    },
    [applyFile, disabled],
  );

  const onPaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const item = Array.from(event.clipboardData.items).find((entry) =>
        entry.type.startsWith('image/'),
      );
      const file = item?.getAsFile();
      if (file) {
        event.preventDefault();
        applyFile(file);
      }
    },
    [applyFile, disabled],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        applyFile(null);
      }
    },
    [applyFile, disabled],
  );

  return (
    <div
      className={styles.well}
      data-state={dragOver ? 'dragover' : 'default'}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className={styles.wellInput}
        accept={accept}
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
      />
      {preview ? (
        <ImageView src={preview} alt={label} fit="contain" background="transparent" />
      ) : (
        <span className={styles.wellPlaceholder}>{placeholder}</span>
      )}
    </div>
  );
}
