import { addons } from '@storybook/manager-api';
import { GLOBALS_UPDATED } from '@storybook/core-events';
import {
  readToolbarFramework,
  storyIndexSupportsFramework,
  type StorybookFramework,
} from './crossFramework/frameworkSupport';

type IndexEntry = {
  id: string;
  type?: string;
  title?: string;
  tags?: string[];
};

type FrameworkFilterApi = {
  getUserGlobals?: () => Record<string, unknown>;
  getGlobals: () => Record<string, unknown>;
  experimental_setFilter: (
    id: string,
    filter: (item: IndexEntry & { type?: string }) => boolean,
  ) => void | Promise<void>;
  getCurrentStoryData: () => IndexEntry | undefined;
  selectStory: (storyId: string) => void;
  selectFirstStory?: () => void;
  getData?: (storyId?: string) => IndexEntry | Record<string, IndexEntry> | undefined;
  raw?: () => IndexEntry[];
  on: (event: string, cb: () => void) => void;
};

function collectStories(api: FrameworkFilterApi): IndexEntry[] {
  try {
    const all = api.getData?.();
    if (all && typeof all === 'object' && !('id' in all)) {
      return Object.values(all as Record<string, IndexEntry>);
    }
  } catch {
    // ignore
  }
  try {
    const raw = api.raw?.();
    if (Array.isArray(raw)) return raw;
  } catch {
    // ignore
  }
  return [];
}

function leaveUnsupportedStory(api: FrameworkFilterApi, framework: StorybookFramework) {
  const current = api.getCurrentStoryData();
  if (!current) return;
  if (storyIndexSupportsFramework(current.tags, framework)) return;

  if (typeof api.selectFirstStory === 'function') {
    api.selectFirstStory();
    return;
  }

  const stories = collectStories(api).filter(
    (entry) =>
      entry.type === 'story' && storyIndexSupportsFramework(entry.tags, framework),
  );
  const sameTitle = stories.find((entry) => entry.title === current.title);
  const next = sameTitle ?? stories[0];
  if (next) api.selectStory(next.id);
}

addons.register('larose/framework-filter', (api) => {
  const managerApi = api as unknown as FrameworkFilterApi;

  const applyFrameworkFilter = () => {
    const globals =
      typeof managerApi.getUserGlobals === 'function'
        ? managerApi.getUserGlobals()
        : managerApi.getGlobals();
    const framework = readToolbarFramework(globals);

    void Promise.resolve(
      managerApi.experimental_setFilter('larose-framework', (item) => {
        const entryType = item.type;
        if (entryType && entryType !== 'story' && entryType !== 'docs') {
          return true;
        }
        return storyIndexSupportsFramework(item.tags, framework);
      }),
    ).then(() => {
      // Let the filtered index settle, then leave React-only canvases.
      leaveUnsupportedStory(managerApi, framework);
      window.setTimeout(() => leaveUnsupportedStory(managerApi, framework), 0);
    });
  };

  managerApi.on(GLOBALS_UPDATED, applyFrameworkFilter);
  applyFrameworkFilter();
});
