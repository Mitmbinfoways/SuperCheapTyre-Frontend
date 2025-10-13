import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <button onClick={() => goToPage(1)} className="text-sm sm:text-lg font-lexend hover:text-brand-red transition-colors p-1 sm:p-2" aria-label="First">
        ««
      </button>
      <button onClick={() => goToPage(currentPage - 1)} className="text-sm sm:text-lg font-lexend hover:text-brand-red transition-colors p-1 sm:p-2" aria-label="Previous">
        «
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`text-sm sm:text-lg font-lexend transition-colors p-1 sm:p-2 ${
            p === currentPage ? 'text-brand-red font-semibold underline text-black' : 'text-[#808080] hover:text-brand-red'
          }`}
        >
          {p}
        </button>
      ))}
      <button onClick={() => goToPage(currentPage + 1)} className="text-sm sm:text-lg font-lexend hover:text-brand-red transition-colors p-1 sm:p-2" aria-label="Next">
        »
      </button>
      <button onClick={() => goToPage(totalPages)} className="text-sm sm:text-lg font-lexend hover:text-brand-red transition-colors p-1 sm:p-2" aria-label="Last">
        »»
      </button>
    </div>
  );
};

export default Pagination;
