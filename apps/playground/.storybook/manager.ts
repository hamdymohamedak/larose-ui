import { addons } from '@storybook/manager-api';
import { GLOBALS_UPDATED } from '@storybook/core-events';
import {
  readToolbarFramework,
  storyIndexSupportsFramework,
} from './crossFramework/frameworkSupport';

addons.register('larose/framework-filter', (api) => {
  const applyFrameworkFilter = () => {
    const globals =
      typeof api.getUserGlobals === 'function'
        ? api.getUserGlobals()
        : api.getGlobals();
    const framework = readToolbarFramework(globals as Record<string, unknown>);

    void api.experimental_setFilter('larose-framework', (item) => {
      const entryType = 'type' in item ? item.type : undefined;
      if (entryType && entryType !== 'story' && entryType !== 'docs') {
        return true;
      }

      return storyIndexSupportsFramework(item.tags, framework);
    });
  };

  api.on(GLOBALS_UPDATED, applyFrameworkFilter);
  applyFrameworkFilter();
});
