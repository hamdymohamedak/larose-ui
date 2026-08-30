import type { ActivityItem } from './types';
import {
  AirPlayIcon,
  CopyIcon,
  FilesIcon,
  MailIcon,
  MarkupIcon,
  MessageIcon,
  PhotosIcon,
  PrintIcon,
} from './icons';

/** Default share and action activities for demos and baselines. */
export function createDefaultActivities(handlers?: Partial<Record<string, () => void>>): ActivityItem[] {
  return [
    {
      id: 'messages',
      title: 'Messages',
      subtitle: 'Messages',
      kind: 'share',
      icon: <MessageIcon />,
      onSelect: handlers?.messages,
    },
    {
      id: 'mail',
      title: 'Mail',
      subtitle: 'Mail',
      kind: 'share',
      icon: <MailIcon />,
      onSelect: handlers?.mail,
    },
    {
      id: 'copy',
      title: 'Copy',
      kind: 'action',
      system: true,
      icon: <CopyIcon />,
      onSelect: handlers?.copy,
    },
    {
      id: 'add-to-files',
      title: 'Add to Files',
      kind: 'action',
      system: true,
      icon: <FilesIcon />,
      onSelect: handlers?.['add-to-files'],
    },
    {
      id: 'markup',
      title: 'Markup',
      kind: 'action',
      system: true,
      icon: <MarkupIcon />,
      onSelect: handlers?.markup,
    },
    {
      id: 'print',
      title: 'Print',
      kind: 'action',
      system: true,
      icon: <PrintIcon />,
      onSelect: handlers?.print,
    },
    {
      id: 'airplay',
      title: 'AirPlay',
      kind: 'action',
      system: true,
      icon: <AirPlayIcon />,
      onSelect: handlers?.airplay,
    },
    {
      id: 'save-to-photos',
      title: 'Save to Photos',
      kind: 'action',
      system: true,
      icon: <PhotosIcon />,
      onSelect: handlers?.['save-to-photos'],
    },
  ];
}

/** Photos-style app-specific activities shown before system actions. */
export function createPhotoActivities(handlers?: Partial<Record<string, () => void>>): ActivityItem[] {
  return [
    {
      id: 'copy-photo',
      title: 'Copy Photo',
      kind: 'app',
      icon: <CopyIcon />,
      onSelect: handlers?.['copy-photo'],
    },
    {
      id: 'add-to-album',
      title: 'Add to Album',
      kind: 'app',
      icon: <PhotosIcon />,
      onSelect: handlers?.['add-to-album'],
    },
    {
      id: 'adjust-location',
      title: 'Adjust Location',
      kind: 'app',
      icon: <MarkupIcon />,
      onSelect: handlers?.['adjust-location'],
    },
    ...createDefaultActivities(handlers),
  ];
}
