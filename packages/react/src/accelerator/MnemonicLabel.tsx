import { parseMnemonicLabel, resolveMnemonicKey } from '@larose-ui/core';
import type { CSSProperties } from 'react';
import styles from '@larose-ui/styles/components/Menu/Menu.module.css';

export interface MnemonicLabelProps {
  label: string;
  mnemonic?: string;
  /** When true, underline the access key character. */
  showAccessKey?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a menu label with an optional underlined mnemonic access key.
 */
export function MnemonicLabel({
  label,
  mnemonic,
  showAccessKey = false,
  className,
  style,
}: MnemonicLabelProps) {
  const parsed = parseMnemonicLabel(label);
  const accessKey = resolveMnemonicKey(label, mnemonic) ?? parsed.mnemonicKey;
  const display = parsed.displayLabel;

  if (!showAccessKey || !accessKey) {
    return <span className={className} style={style}>{display}</span>;
  }

  const index = display.toLowerCase().indexOf(accessKey.toLowerCase());
  if (index === -1) {
    return <span className={className} style={style}>{display}</span>;
  }

  return (
    <span className={className} style={style}>
      {display.slice(0, index)}
      <span className={styles.mnemonicChar}>{display.charAt(index)}</span>
      {display.slice(index + 1)}
    </span>
  );
}
