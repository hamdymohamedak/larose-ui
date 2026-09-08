import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react';
import styles from '@larose-ui/styles/components/Activity/Activity.module.css';

type IslandState = 'idle' | 'media' | 'call';

const STATES: IslandState[] = ['idle', 'media', 'call'];

const ARIA_LABELS: Record<IslandState, string> = {
  idle: 'Dynamic Island, idle. Tap to preview notifications.',
  media: 'Dynamic Island, playing Nightcall by Kavinsky.',
  call: 'Dynamic Island, incoming call from Jordan Miles.',
};

export interface ActivityProps {
  className?: string;
}

export function Activity({ className }: ActivityProps) {
  const [state, setState] = useState<IslandState>('idle');

  const cycle = (): void => {
    const index = STATES.indexOf(state);
    const nextState = STATES[(index + 1) % STATES.length]!;
    setState(nextState);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      cycle();
    }
  };

  const handleReject = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setState('idle');
  };

  const handleAccept = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setState('media');
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState((currentState) => (currentState === 'idle' ? 'call' : currentState));
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (state !== 'call') {
      return;
    }

    const timer = window.setTimeout(() => {
      setState((currentState) => (currentState === 'call' ? 'idle' : currentState));
    }, 2600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [state]);

  return (
    <div
      className={[styles.island, className].filter(Boolean).join(' ')}
      data-state={state}
      data-larose="Activity"
      role="button"
      tabIndex={0}
      aria-label={ARIA_LABELS[state]}
      onClick={cycle}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.cam} aria-hidden="true" />

      <div
        className={[styles.panel, styles.panelIdle, state === 'idle' ? styles.isActive : '']
          .filter(Boolean)
          .join(' ')}
        data-panel-for="idle"
        aria-hidden={state !== 'idle'}
      />

      <div
        className={[styles.panel, styles.panelMedia, state === 'media' ? styles.isActive : '']
          .filter(Boolean)
          .join(' ')}
        data-panel-for="media"
        aria-hidden={state !== 'media'}
      >
        <div className={styles.albumArt} aria-hidden="true" />

        <div className={styles.trackInfo}>
          <span className={styles.trackTitle}>Nightcall</span>
          <span className={styles.trackArtist}>Kavinsky</span>
        </div>

        <div className={styles.waveform} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div
        className={[styles.panel, styles.panelCall, state === 'call' ? styles.isActive : '']
          .filter(Boolean)
          .join(' ')}
        data-panel-for="call"
        aria-hidden={state !== 'call'}
      >
        <div className={styles.callTop}>
          <div className={styles.callMeta}>
            <span className={styles.callName}>Jordan Miles</span>
            <span className={styles.callSub}>Incoming call…</span>
          </div>

          <div className={styles.callActions}>
            <button
              type="button"
              className={[styles.callBtn, styles.callBtnReject].join(' ')}
              aria-label="Decline call"
              onClick={handleReject}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <button
              type="button"
              className={[styles.callBtn, styles.callBtnAccept].join(' ')}
              aria-label="Accept call"
              onClick={handleAccept}
            >
              <svg viewBox="0 0 24 24" fill="#000" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.3 11.3 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.3 11.3 0 00.57 3.55 1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
