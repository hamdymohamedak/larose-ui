import { useId, useState, type ReactNode } from 'react';
import { Presence } from '../Motion/Presence';
import styles from '@larose-ui/styles/components/Tooltip/Tooltip.module.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocusCapture={() => setVisible(true)}
      onBlurCapture={() => setVisible(false)}
    >
      <span aria-describedby={visible ? tooltipId : undefined}>{children}</span>
      <Presence present={visible} variant="popover" placement={side}>
        <span id={tooltipId} role="tooltip" className={styles.tooltip} data-side={side}>
          {content}
        </span>
      </Presence>
    </span>
  );
}
