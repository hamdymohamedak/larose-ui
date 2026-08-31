import { useCallback, useEffect, useState } from 'react';
import { Button } from '@larose-ui/react';

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [value]);

  return (
    <Button variant="ghost" size="sm" onClick={onCopy} aria-live="polite">
      {copied ? '✓ Copied' : label}
    </Button>
  );
}
