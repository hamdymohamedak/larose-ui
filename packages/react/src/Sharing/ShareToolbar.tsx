import { useState, type ReactNode } from 'react';
import { ShareButton } from './ShareButton';
import { ShareSheet } from './ShareSheet';
import { CollaborationButton } from './CollaborationButton';
import { CollaborationPopover } from './CollaborationPopover';
import type {
  CollaborationAction,
  Collaborator,
  ShareDestination,
  SharePermissionOption,
  ShareSettings,
} from './types';
import { CopyIcon, LinkIcon, MessageIcon } from './icons';
import styles from './Sharing.module.css';

export interface ShareToolbarProps {
  /** Document or item title shown in the share sheet. */
  shareTitle?: string;
  /** When true, shows the Collaboration button beside Share. */
  collaborating?: boolean;
  collaborators?: Collaborator[];
  shareSettings?: ShareSettings;
  onShareSettingsChange?: (settings: ShareSettings) => void;
  destinations?: ShareDestination[];
  permissionOptions?: SharePermissionOption[];
  collaborationActions?: CollaborationAction[];
  onManageSharedFile?: () => void;
  manageLabel?: string;
  onMessage?: () => void;
  onVideo?: () => void;
  trailing?: ReactNode;
}

const defaultShareSettings: ShareSettings = {
  audience: 'invited',
  permission: 'edit',
};

const defaultDestinations: ShareDestination[] = [
  { id: 'copy-link', label: 'Copy Link', icon: <LinkIcon /> },
  { id: 'copy', label: 'Send Copy', icon: <CopyIcon /> },
  { id: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

export function ShareToolbar({
  shareTitle = 'Share Document',
  collaborating = false,
  collaborators = [],
  shareSettings = defaultShareSettings,
  onShareSettingsChange,
  destinations = defaultDestinations,
  permissionOptions,
  collaborationActions,
  onManageSharedFile,
  manageLabel,
  onMessage,
  onVideo,
  trailing,
}: ShareToolbarProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [settings, setSettings] = useState(shareSettings);

  const updateSettings = (next: ShareSettings) => {
    setSettings(next);
    onShareSettingsChange?.(next);
  };

  return (
    <div className={styles.toolbar}>
      <ShareButton onClick={() => setShareOpen(true)} />

      {collaborating && (
        <CollaborationPopover
          trigger={<CollaborationButton collaborators={collaborators} />}
          collaborators={collaborators}
          actions={collaborationActions}
          manageLabel={manageLabel}
          onManage={onManageSharedFile}
          onMessage={onMessage}
          onVideo={onVideo}
        />
      )}

      {trailing}

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={shareTitle}
        settings={settings}
        onSettingsChange={updateSettings}
        destinations={destinations}
        permissionOptions={permissionOptions}
      />
    </div>
  );
}
