import { describe, expect, it } from 'vitest';
import {
  findNearestComponentFiber,
  getComponentName,
  resolveReactComponentInfo,
  sanitizeFiberProps,
} from './reactFiber';

function ObservedComponent() {
  return null;
}
ObservedComponent.displayName = 'ObservedComponent';

describe('reactFiber', () => {
  it('resolves component name from function types', () => {
    function EmployeeTable() {
      return null;
    }
    expect(getComponentName(EmployeeTable)).toBe('EmployeeTable');
    expect(getComponentName(ObservedComponent)).toBe('ObservedComponent');
    expect(getComponentName('div')).toBeNull();
  });

  it('sanitizes props for display', () => {
    const props = sanitizeFiberProps({
      title: 'Employees',
      onClick: () => undefined,
      children: 'ignored',
      count: 42,
      meta: { nested: true },
    });

    expect(props.title).toBe('Employees');
    expect(props.onClick).toBe('[Function]');
    expect(props.children).toBeUndefined();
    expect(props.count).toBe('42');
    expect(props.meta).toBe('{"nested":true}');
  });

  it('redacts sensitive prop names', () => {
    const props = sanitizeFiberProps({
      apiKey: 'sk-live-secret',
      accessToken: 'Bearer abc',
      title: 'Employees',
    });

    expect(props.apiKey).toBe('[REDACTED]');
    expect(props.accessToken).toBe('[REDACTED]');
    expect(props.title).toBe('Employees');
  });

  it('walks fiber tree to nearest component', () => {
    const componentFiber = {
      type: ObservedComponent,
      memoizedProps: { name: 'EmployeeTable' },
      return: null,
    };
    const hostFiber = {
      type: 'div',
      memoizedProps: {},
      return: componentFiber,
    };

    const found = findNearestComponentFiber(hostFiber);
    expect(found?.type).toBe(ObservedComponent);
    expect(found?.memoizedProps?.name).toBe('EmployeeTable');
  });

  it('resolves component info from DOM node with mock fiber', () => {
    const componentFiber = {
      type: ObservedComponent,
      memoizedProps: { name: 'EmployeeTable', visible: true },
      return: null,
    };
    const hostFiber = {
      type: 'div',
      memoizedProps: { 'data-lr-observed': 'EmployeeTable' },
      return: componentFiber,
    };

    const node = document.createElement('div');
    (node as unknown as Record<string, unknown>).__reactFiber$test = hostFiber;

    const info = resolveReactComponentInfo(node);
    expect(info?.displayName).toBe('ObservedComponent');
    expect(info?.props.name).toBe('EmployeeTable');
    expect(info?.props.visible).toBe('true');
  });
});
