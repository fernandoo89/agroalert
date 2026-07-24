import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1 py-4" aria-label="Paginación">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-slate-400 px-1">...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
            p === page
              ? 'bg-agro-primary text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-400 px-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
