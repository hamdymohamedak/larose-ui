export type PageItem = number | 'ellipsis';

function range(start: number, end: number): number[] {
  const items: number[] = [];
  for (let i = start; i <= end; i += 1) items.push(i);
  return items;
}

export function getPageItems(page: number, totalPages: number, siblingCount: number): PageItem[] {
  if (totalPages <= 1) return [1];
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) return range(1, totalPages);
  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;
  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblingCount * 2), 'ellipsis', totalPages];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis', ...range(totalPages - (3 + siblingCount * 2), totalPages)];
  }
  if (showLeftEllipsis && showRightEllipsis) {
    return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', totalPages];
  }
  return range(1, totalPages);
}
