'use client';

import React from 'react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: ProductPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-3 text-xs shadow-xs sm:flex-row sm:px-4 sm:py-3 dark:border-white/5 dark:bg-[#111111]">
      {/* Left side: Showing X-Y of Z & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3 text-black/60 dark:text-white/60">
        <span className="font-medium">
          Showing <strong className="font-bold text-black dark:text-white">{startItem.toLocaleString()}</strong>–
          <strong className="font-bold text-black dark:text-white">{endItem.toLocaleString()}</strong> of{' '}
          <strong className="font-bold text-black dark:text-white">{totalItems.toLocaleString()}</strong> products
        </span>

        <div className="hidden h-3.5 w-[1px] bg-black/10 sm:block dark:bg-white/10" />

        <div className="flex items-center gap-1.5">
          <label htmlFor="pageSizeSelect" className="font-medium text-black/40 dark:text-white/40">
            Per page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            disabled={isLoading}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
            className="cursor-pointer rounded-lg border border-black/10 bg-[#f8f9fa] px-2 py-1 font-semibold text-black transition-all outline-none hover:border-black/30 focus:border-black dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:border-white/30 dark:focus:border-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Right side: Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* First Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1 || isLoading}
          title="First Page"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-white font-bold text-black transition-all hover:bg-black/5 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-[#141417] dark:text-white dark:hover:bg-white/5"
        >
          <span className="sr-only">First Page</span>
          &laquo;
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1 || isLoading}
          className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 font-bold text-black transition-all hover:bg-black/5 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-[#141417] dark:text-white dark:hover:bg-white/5"
        >
          &larr; <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 px-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-6 items-center justify-center font-bold text-black/30 select-none dark:text-white/30"
                >
                  &hellip;
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`flex h-8 min-w-[32px] cursor-pointer items-center justify-center rounded-lg px-2 text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? 'border border-black bg-black text-white shadow-sm dark:border-white dark:bg-white dark:text-black'
                    : 'border border-black/10 bg-white text-black hover:border-black/30 hover:bg-black/5 dark:border-white/10 dark:bg-[#141417] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/5'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || totalPages === 0 || isLoading}
          className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 font-bold text-black transition-all hover:bg-black/5 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-[#141417] dark:text-white dark:hover:bg-white/5"
        >
          <span className="hidden sm:inline">Next</span> &rarr;
        </button>

        {/* Last Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || totalPages === 0 || isLoading}
          title="Last Page"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-white font-bold text-black transition-all hover:bg-black/5 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-[#141417] dark:text-white dark:hover:bg-white/5"
        >
          <span className="sr-only">Last Page</span>
          &raquo;
        </button>
      </div>
    </div>
  );
}
