import type { ActivityItem, SystemActivityId } from './types';

export const MAX_ACTIVITY_TITLE_LENGTH = 32;

/** Built-in system activities available across apps. */
export const SYSTEM_ACTIVITY_IDS: SystemActivityId[] = [
  'copy',
  'add-to-files',
  'markup',
  'print',
  'airplay',
  'save-to-photos',
  'assign-to-contact',
];

export function formatActivityTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ').slice(0, MAX_ACTIVITY_TITLE_LENGTH);
}

export function filterActivities(
  activities: ActivityItem[],
  excludedIds: string[] = [],
): ActivityItem[] {
  const excluded = new Set(excludedIds);
  return activities.filter(
    (activity) => !activity.hidden && !activity.disabled && !excluded.has(activity.id),
  );
}

/** App-specific activities appear before share destinations and system actions. */
export function sortActivities(activities: ActivityItem[]): ActivityItem[] {
  const order: Record<ActivityItem['kind'], number> = {
    app: 0,
    share: 1,
    action: 2,
  };

  return [...activities].sort((a, b) => {
    const kindDelta = order[a.kind] - order[b.kind];
    if (kindDelta !== 0) return kindDelta;
    if (a.kind === 'action' && a.system !== b.system) {
      return a.system ? 1 : -1;
    }
    return a.title.localeCompare(b.title);
  });
}

export function partitionActivities(activities: ActivityItem[]) {
  const share = activities.filter((activity) => activity.kind === 'share');
  const app = activities.filter((activity) => activity.kind === 'app');
  const actions = activities.filter((activity) => activity.kind === 'action');
  return { share, app, actions };
}

export function isDuplicateSystemActivity(
  customTitle: string,
  systemTitles: string[],
): boolean {
  const normalized = customTitle.trim().toLowerCase();
  return systemTitles.some((title) => title.trim().toLowerCase() === normalized);
}

export function prepareActivities(
  activities: ActivityItem[],
  excludedIds: string[] = [],
): ActivityItem[] {
  return sortActivities(filterActivities(activities, excludedIds)).map((activity) => ({
    ...activity,
    title: formatActivityTitle(activity.title),
  }));
}
