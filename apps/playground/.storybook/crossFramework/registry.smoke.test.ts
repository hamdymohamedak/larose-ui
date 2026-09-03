import { describe, expect, it } from 'vitest';
import {
  crossFrameworkRegistry,
  getCrossFrameworkDefinition,
  foundationRegistry,
  liquidGlassRegistry,
  menusRegistry,
  documentRegistry,
  demoRegistry,
} from './registry';

describe('crossFramework registry split', () => {
  it('keeps 104 definitions across domain modules', () => {
    expect(Object.keys(crossFrameworkRegistry).length).toBe(104);
    expect(Object.keys(foundationRegistry).length).toBeGreaterThan(40);
    expect(Object.keys(liquidGlassRegistry)).toEqual(
      expect.arrayContaining([
        'liquidGlass',
        'liquidGlassTabBar',
        'liquidGlassTopBar',
        'liquidGlassAllControls',
      ]),
    );
    expect(Object.keys(menusRegistry)).toEqual(
      expect.arrayContaining(['menu', 'contextMenu', 'commandPalette']),
    );
    expect(Object.keys(documentRegistry)).toEqual(
      expect.arrayContaining(['documentWorkspace', 'documentToolbar', 'fileBrowser']),
    );
    expect(Object.keys(demoRegistry).length).toBeLessThan(40);
  });

  it('resolves foundation and demo entries', () => {
    expect(getCrossFrameworkDefinition('button')?.displayName).toBe('Button');
    expect(getCrossFrameworkDefinition('modal')?.displayName).toBe('Modal');
    expect(getCrossFrameworkDefinition('liquidGlassButton')?.componentName).toBe(
      'LiquidGlassButtonDemo',
    );
    expect(getCrossFrameworkDefinition('menu')?.componentName).toBe('MenuDemo');
    expect(getCrossFrameworkDefinition('documentWorkspace')?.componentName).toBe(
      'DocumentWorkspaceDemo',
    );
  });

  it('renders foundation React nodes', () => {
    const def = getCrossFrameworkDefinition('emptyState');
    const mapped = def!.mapArgs({});
    const node = def!.renderReact(mapped.props, mapped.slotText, {
      theme: 'light',
      density: 'comfortable',
    });
    expect(node).toBeTruthy();
  });
});
