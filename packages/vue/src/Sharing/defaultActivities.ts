import type { ActivityItem } from './types';

/** Default share and action activities — icons omitted (no JSX). */
export function createDefaultActivities(handlers?: Partial<Record<string, () => void>>): ActivityItem[] {
  return [
    { id: 'messages', title: 'Messages', subtitle: 'Messages', kind: 'share', onSelect: handlers?.messages },
    { id: 'mail', title: 'Mail', subtitle: 'Mail', kind: 'share', onSelect: handlers?.mail },
    { id: 'copy', title: 'Copy', kind: 'action', system: true, onSelect: handlers?.copy },
    { id: 'add-to-files', title: 'Add to Files', kind: 'action', system: true, onSelect: handlers?.['add-to-files'] },
    { id: 'markup', title: 'Markup', kind: 'action', system: true, onSelect: handlers?.markup },
    { id: 'print', title: 'Print', kind: 'action', system: true, onSelect: handlers?.print },
    { id: 'airplay', title: 'AirPlay', kind: 'action', system: true, onSelect: handlers?.airplay },
    { id: 'save-to-photos', title: 'Save to Photos', kind: 'action', system: true, onSelect: handlers?.['save-to-photos'] },
  ];
}

export function createPhotoActivities(handlers?: Partial<Record<string, () => void>>): ActivityItem[] {
  return [
    { id: 'copy-photo', title: 'Copy Photo', kind: 'app', onSelect: handlers?.['copy-photo'] },
    { id: 'add-to-album', title: 'Add to Album', kind: 'app', onSelect: handlers?.['add-to-album'] },
    { id: 'adjust-location', title: 'Adjust Location', kind: 'app', onSelect: handlers?.['adjust-location'] },
    ...createDefaultActivities(handlers),
  ];
}
