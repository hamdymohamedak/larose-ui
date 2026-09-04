import { describe, expect, it } from 'vitest';
import {
  classifyStorybookComponent,
  isCompoundPart,
  pickSimplePropKeys,
  canAutoScaffoldContract,
  toRegistryId,
} from '../../../../scripts/lib/storybook-catalog.mjs';

describe('storybook-catalog', () => {
  const all = [
    'Accordion',
    'AccordionItem',
    'Button',
    'ButtonGroup',
    'Lockup',
    'LockupCard',
    'Sidebar',
    'SidebarToggle',
    'MnemonicLabel',
  ];

  it('maps PascalCase names to camelCase registry ids', () => {
    expect(toRegistryId('MnemonicLabel')).toBe('mnemonicLabel');
    expect(toRegistryId('Button')).toBe('button');
  });

  it('classifies compound anatomy under a parent', () => {
    expect(isCompoundPart('AccordionItem', all)).toBe(true);
    expect(isCompoundPart('SidebarToggle', all)).toBe(true);
    expect(classifyStorybookComponent('AccordionItem', all)).toBe('compound');
  });

  it('keeps known standalone prefix exceptions as roots', () => {
    expect(isCompoundPart('ButtonGroup', all)).toBe(false);
    expect(isCompoundPart('LockupCard', all)).toBe(false);
    expect(classifyStorybookComponent('ButtonGroup', all)).toBe('root');
  });

  it('skips providers and icons', () => {
    expect(classifyStorybookComponent('ToastProvider', all)).toBe('skip');
    expect(classifyStorybookComponent('SearchIcon', all)).toBe('icon');
  });

  it('filters non-identifier and event props from auto controls', () => {
    expect(
      pickSimplePropKeys([
        { name: 'label', type: 'string' },
        { name: "'aria-label'", type: 'string' },
        { name: 'onClick', type: '() => void' },
        { name: 'disabled', type: 'boolean' },
      ]),
    ).toEqual(['label', 'disabled']);
  });

  it('rejects auto-scaffold when required props are complex objects', () => {
    expect(
      canAutoScaffoldContract({
        props: [
          { name: 'token', type: 'SearchToken', required: true },
          { name: 'label', type: 'string', required: false },
        ],
      }),
    ).toBe(false);
    expect(
      canAutoScaffoldContract({
        props: [{ name: 'label', type: 'string', required: true }],
      }),
    ).toBe(true);
  });
});
