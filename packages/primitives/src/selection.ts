export type SelectionMode = 'single' | 'multiple';

export function isSelected(selected: readonly string[], id: string): boolean {
  return selected.includes(id);
}

export function toggleSelection(
  selected: readonly string[],
  id: string,
  mode: SelectionMode = 'multiple',
): string[] {
  if (mode === 'single') {
    return selected.includes(id) ? [] : [id];
  }
  return selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id];
}

export function selectOnly(id: string): string[] {
  return [id];
}

export function clearSelection(): string[] {
  return [];
}
