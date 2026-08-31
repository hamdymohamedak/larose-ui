import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Presence } from '../Motion/Presence';
import styles from '@larose-ui/styles/components/Popover/Popover.module.css';

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverSide;
  /** Extra class names for the floating panel element. */
  panelClassName?: string;
  'aria-label'?: string;
}

export function Popover({
  trigger,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  panelClassName,
  'aria-label': ariaLabel = 'Popover',
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const popoverId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, setOpen]);

  return (
    <span ref={rootRef} className={styles.wrapper}>
      <span
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
      >
        {trigger}
      </span>
      <Presence present={isOpen} variant="popover" placement={side}>
        <div
          id={popoverId}
          role="dialog"
          aria-label={ariaLabel}
          className={[styles.popover, panelClassName].filter(Boolean).join(' ')}
          data-side={side}
        >
          {content}
        </div>
      </Presence>
    </span>
  );
}
