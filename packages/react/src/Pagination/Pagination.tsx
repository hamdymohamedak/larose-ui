import { useMemo } from 'react';
import styles from '@larose-ui/styles/components/Pagination/Pagination.module.css';

type PageItem = number | 'ellipsis';

function range(start: number, end: number): number[] {
  const items: number[] = [];
  for (let i = start; i <= end; i += 1) {
    items.push(i);
  }
  return items;
}

function getPageItems(page: number, totalPages: number, siblingCount: number): PageItem[] {
  if (totalPages <= 1) return [1];

  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

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

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  previousLabel?: string;
  nextLabel?: string;
  'aria-label'?: string;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  'aria-label': ariaLabel = 'Pagination',
  className,
}: PaginationProps) {
  const items = useMemo(
    () => getPageItems(page, totalPages, siblingCount),
    [page, siblingCount, totalPages],
  );

  if (totalPages < 1) return null;

  return (
    <nav className={[styles.pagination, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <button
        type="button"
        className={styles.pageButton}
        aria-label={previousLabel}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={styles.pageButton}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            data-state={item === page ? 'active' : 'inactive'}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.pageButton}
        aria-label={nextLabel}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
