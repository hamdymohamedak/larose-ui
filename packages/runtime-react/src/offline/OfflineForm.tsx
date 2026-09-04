import {
  useCallback,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useNetwork } from '../network/NetworkProvider';
import { useOffline } from '../offline/OfflineProvider';

export interface OfflineFormProps {
  action: string;
  method?: string;
  onSubmit?: (data: FormData) => Promise<void>;
  children: ReactNode;
}

export function OfflineForm({
  action,
  method = 'POST',
  onSubmit,
  children,
}: OfflineFormProps) {
  const { t } = useI18n();
  const network = useNetwork();
  const offline = useOffline();
  const [status, setStatus] = useState<'idle' | 'saved' | 'queued'>('idle');

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const body = Object.fromEntries(formData.entries());

      if (!network.online) {
        await offline.enqueue({ url: action, method, body });
        setStatus('queued');
        return;
      }

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch(action, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`${response.status}`);
      }
      setStatus('saved');
    },
    [action, method, network.online, offline, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} data-lr-offline-form>
      {children}
      {status === 'queued' && (
        <p role="status" style={{ color: 'var(--lr-color-warning)', fontSize: 'var(--lr-font-size-sm)' }}>
          {t('network.offline.message')} ({offline.queue.length} queued)
        </p>
      )}
      {status === 'saved' && (
        <p role="status" style={{ color: 'var(--lr-color-success)', fontSize: 'var(--lr-font-size-sm)' }}>
          {t('common.synced')}
        </p>
      )}
    </form>
  );
}
