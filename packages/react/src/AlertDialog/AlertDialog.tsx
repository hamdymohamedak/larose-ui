import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePresence } from '../Motion/usePresence';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import type { AlertDialogAction, AlertDialogProps } from './types';
import {
  formatAlertTitle,
  orderAlertActions,
  resolveCancelAction,
  shouldStyleDestructive,
  validateAlertActions,
  warnIfAlertTitleTooLong,
} from './utils';
import styles from '@larose-ui/styles/components/AlertDialog/AlertDialog.module.css';

function CautionIcon() {
  return (
    <svg className={styles.caution} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 8v5M12 16h.01M10.29 4.86 2.82 18a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3L13.71 4.86a2 2 0 0 0-3.42 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Modal alert — critical, actionable interruption with up to three buttons.
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  message,
  actions,
  presentation = 'compact',
  icon,
  showCautionIcon = false,
  textField,
  suppression,
  helpUrl,
  accessory,
  defaultActionId,
  className,
}: AlertDialogProps) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [internalText, setInternalText] = useState(textField?.defaultValue ?? '');
  const [suppressed, setSuppressed] = useState(suppression?.defaultChecked ?? false);

  const textValue = textField?.value ?? internalText;

  useEffect(() => {
    if (open) {
      validateAlertActions(actions);
      warnIfAlertTitleTooLong(title);
    }
  }, [actions, open, title]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const runAction = useCallback(
    (action: AlertDialogAction) => {
      action.onSelect?.();
      if (action.role !== 'cancel') close();
    },
    [close],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      const cancel = resolveCancelAction(actions);
      if (cancel) runAction(cancel);
      else close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [actions, close, open, runAction]);

  const { phase, shouldRender, onAnimationEnd } = usePresence({ present: open });

  if (!shouldRender) return null;

  const { ordered, layout } = orderAlertActions(actions, presentation);
  const resolvedDefaultId =
    defaultActionId ?? ordered.find((action) => action.role === 'default')?.id;

  return createPortal(
    <div
      className={[
        styles.overlay,
        phase === 'entering' || phase === 'exiting'
          ? motionStyles[`backdrop-${phase}` as keyof typeof motionStyles]
          : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      data-presentation={presentation}
      role="presentation"
      data-presence={phase}
      onAnimationEnd={onAnimationEnd}
    >
      <div
        ref={dialogRef}
        className={[
          styles.alert,
          className,
          phase === 'entering' || phase === 'exiting'
            ? motionStyles[`modal-${phase}` as keyof typeof motionStyles]
            : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
        data-presentation={presentation}
        data-presence={phase}
        tabIndex={-1}
        onAnimationEnd={onAnimationEnd}
      >
        <div className={styles.body}>
          <div className={styles.header}>
            {showCautionIcon && <CautionIcon />}
            {icon && <span className={styles.icon}>{icon}</span>}
            <div>
              <h2 id={titleId} className={styles.title}>
                {formatAlertTitle(title)}
              </h2>
            </div>
          </div>

          {message && (
            <p id={messageId} className={styles.message}>
              {message}
            </p>
          )}

          {accessory && <div className={styles.accessory}>{accessory}</div>}

          {textField && (
            <label className={styles.field}>
              {textField.label && <span className={styles.fieldLabel}>{textField.label}</span>}
              <input
                className={styles.input}
                type={textField.secure ? 'password' : 'text'}
                placeholder={textField.placeholder}
                value={textValue}
                onChange={(event) => {
                  const next = event.target.value;
                  if (textField.value === undefined) setInternalText(next);
                  textField.onChange?.(next);
                }}
              />
            </label>
          )}

          {suppression && (
            <label className={styles.suppression}>
              <input
                type="checkbox"
                checked={suppression.checked ?? suppressed}
                onChange={(event) => {
                  const next = event.target.checked;
                  if (suppression.checked === undefined) setSuppressed(next);
                  suppression.onChange?.(next);
                }}
              />
              <span>{suppression.label}</span>
            </label>
          )}
        </div>

        <div className={styles.actions} data-layout={layout}>
          {ordered.map((action) => (
            <button
              key={action.id}
              type="button"
              className={styles.action}
              data-role={action.role ?? 'default'}
              data-destructive={shouldStyleDestructive(action) ? 'true' : undefined}
              data-default-focus={resolvedDefaultId === action.id ? 'true' : undefined}
              onClick={() => runAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>

        {helpUrl && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.help}
              onClick={() => window.open(helpUrl, '_blank', 'noopener,noreferrer')}
            >
              Help
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export type {
  AlertDialogProps,
  AlertDialogAction,
  AlertDialogPresentation,
  AlertDialogTextField,
  AlertDialogSuppression,
} from './types';

export {
  orderAlertActions,
  validateAlertActions,
  shouldStyleDestructive,
  resolveCancelAction,
  warnIfAlertTitleTooLong,
  MAX_ALERT_BUTTONS,
} from './utils';
