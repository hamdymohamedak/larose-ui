import { forwardRef, type ButtonHTMLAttributes } from 'react';
import type { Collaborator } from './types';
import { collaboratorInitials } from './utils';
import { PeopleIcon } from './icons';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';

export interface CollaborationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  collaborators: Collaborator[];
  label?: string;
  maxVisible?: number;
}

/** Displays active collaborators — Apple HIG Collaboration button pattern. */
export const CollaborationButton = forwardRef<HTMLButtonElement, CollaborationButtonProps>(
  (
    {
      collaborators,
      label = 'Collaboration',
      maxVisible = 3,
      className,
      ...props
    },
    ref,
  ) => {
    const visible = collaborators.slice(0, maxVisible);
    const overflow = collaborators.length - visible.length;

    return (
      <button
        ref={ref}
        type="button"
        className={[styles.collaborationButton, className].filter(Boolean).join(' ')}
        aria-label={`${label}, ${collaborators.length} collaborators`}
        {...props}
      >
        {collaborators.length > 0 ? (
          <span className={styles.avatarStack} aria-hidden="true">
            {visible.map((person) => (
              <span key={person.id} className={styles.avatar} title={person.name}>
                {person.avatarUrl ? (
                  <img src={person.avatarUrl} alt="" />
                ) : (
                  person.initials ?? collaboratorInitials(person.name)
                )}
              </span>
            ))}
            {overflow > 0 && (
              <span className={`${styles.avatar} ${styles.avatarOverflow}`}>+{overflow}</span>
            )}
          </span>
        ) : (
          <PeopleIcon />
        )}
        <span>{collaborators.length > 0 ? `${collaborators.length}` : 'Share'}</span>
      </button>
    );
  },
);

CollaborationButton.displayName = 'CollaborationButton';
