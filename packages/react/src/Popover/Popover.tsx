import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { activateOverlayFocus } from '@larose-ui/primitives';
import { presenceMotionClassKey } from '@larose-ui/component-logic/overlay';
import { useSharedPresence } from '../Motion/useSharedPresence';
import styles from '@larose-ui/styles/components/Popover/Popover.module.css';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';

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
  className?: string;
  style?: CSSProperties;
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
  className,
  style,
  'aria-label': ariaLabel = 'Popover',
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const popoverId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { phase, shouldRender, onAnimationEnd } = useSharedPresence(Boolean(isOpen));

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

    document.addEventListener('mousedown', onPointerDown);
    const deactivate = activateOverlayFocus({
      container: panelRef.current,
      onEscape: () => setOpen(false),
      lockScroll: false,
    });

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      deactivate();
    };
  }, [isOpen, setOpen]);

  const popoverKey = presenceMotionClassKey('popover', phase);

  return (
    <span ref={rootRef} className={[styles.wrapper, className].filter(Boolean).join(' ')} style={style}>
      <span
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
      >
        {trigger}
      </span>
      {shouldRender ? (
        <div
          ref={panelRef}
          id={popoverId}
          role="dialog"
          aria-label={ariaLabel}
          className={[
            styles.popover,
            panelClassName,
            popoverKey ? motionStyles[popoverKey as keyof typeof motionStyles] : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
          data-side={side}
          data-placement={side}
          data-presence={phase}
          onAnimationEnd={onAnimationEnd}
        >
          {content}
        </div>
      ) : null}
    </span>
  );
}
