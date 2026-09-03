import { Button } from '../Button/Button';
import type { CSSProperties } from 'react';
import type { FilePreviewSource } from './types';
import { canPreviewFile } from './utils';
import { PreviewIcon } from './icons';
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';

export interface FilePreviewProps {
  source: FilePreviewSource;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Quick Look-style preview for supported file types.
 * @see https://developer.apple.com/design/human-interface-guidelines/file-management
 */
export function FilePreview({
  source,
  onClose,
  closeLabel = 'Close preview',
  className,
  style,
}: FilePreviewProps) {
  const previewable = canPreviewFile(source);
  const type = (source.type ?? source.extension ?? '').toLowerCase();
  const isImage = type.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(type);

  return (
    <section
      className={[styles.preview, className].filter(Boolean).join(' ')}
      style={style}
      aria-label={`Preview ${source.name}`}
    >
      <div className={styles.previewHeader}>
        <h3 className={styles.previewTitle}>{source.name}</h3>
        {onClose && (
          <Button size="sm" variant="secondary" onClick={onClose}>
            {closeLabel}
          </Button>
        )}
      </div>
      <div className={styles.previewBody}>
        {!previewable && (
          <div className={styles.previewFallback}>
            <PreviewIcon />
            <span>Preview isn&apos;t available for this file type.</span>
          </div>
        )}
        {previewable && source.textContent && (
          <pre className={styles.previewText}>{source.textContent}</pre>
        )}
        {previewable && source.url && isImage && (
          <img className={styles.previewImage} src={source.url} alt={source.name} />
        )}
        {previewable && source.url && !isImage && !source.textContent && (
          <iframe
            title={source.name}
            src={source.url}
            style={{ width: '100%', minHeight: '18rem', border: 0, borderRadius: '0.5rem' }}
          />
        )}
      </div>
    </section>
  );
}
