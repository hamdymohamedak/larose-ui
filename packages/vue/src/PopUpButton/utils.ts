import type { MenuEntry } from '../Menu/types';
import type { PopUpCustomOption, PopUpOption } from './types';

export function resolvePopUpLabel(
  options: PopUpOption[],
  value: string | undefined,
  placeholder: string,
): string {
  if (!value) return placeholder;
  return options.find((option) => option.value === value)?.label ?? placeholder;
}

export function resolveDefaultValue(
  options: PopUpOption[],
  defaultValue?: string,
): string | undefined {
  if (defaultValue && options.some((option) => option.value === defaultValue)) {
    return defaultValue;
  }
  return options[0]?.value;
}

export function buildPopUpMenuEntries(
  options: PopUpOption[],
  value: string | undefined,
  customOption?: PopUpCustomOption,
): MenuEntry[] {
  const entries: MenuEntry[] = options.map((option) => ({
    id: option.value,
    label: option.label,
    disabled: option.disabled,
    selected: option.value === value,
  }));

  if (customOption) {
    entries.push({ type: 'separator' });
    entries.push({
      id: customOption.value,
      label: customOption.label,
      selected: customOption.value === value,
    });
  }

  return entries;
}

export function isMutuallyExclusiveSelection(
  options: PopUpOption[],
  nextValue: string,
): boolean {
  return options.some((option) => option.value === nextValue) || nextValue === 'custom';
}
