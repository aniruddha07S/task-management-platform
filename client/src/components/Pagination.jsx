import { memo } from 'react';

// Builds a compact page list: 1 … 4 5 6 … 12
const pageList = (page, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
};

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
  </svg>
);

const Pagination = memo(function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const btn = 'flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[12px] font-medium tabular-nums transition';

  return (
    <nav className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Pagination">
      <p className="text-[12px] text-ink-2">
        Showing <span className="font-medium text-ink">{from}–{to}</span> of{' '}
        <span className="font-medium text-ink">{total}</span>
      </p>

      {totalPages > 1 && (
        <div className="inline-flex items-center gap-0.5 rounded-lg bg-fill p-0.5">
          <button type="button" className={`${btn} text-ink-2 hover:text-ink disabled:opacity-35`} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
            <Chevron dir="left" />
          </button>
          {pageList(page, totalPages).map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="px-1 text-[12px] text-ink-3">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`${btn} ${
                  p === page
                    ? 'bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.14),0_0_0_0.5px_rgb(0_0_0/0.06)] dark:bg-[#5a5a5f]'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button type="button" className={`${btn} text-ink-2 hover:text-ink disabled:opacity-35`} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </nav>
  );
});

export default Pagination;
