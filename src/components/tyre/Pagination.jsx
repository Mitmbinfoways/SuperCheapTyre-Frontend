import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const range = [];
    const rangeWithDots = [];
    const delta = 1; // Number of pages to show around the current page

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <button
        onClick={() => goToPage(1)}
        disabled={currentPage <= 1}
        className={`text-sm sm:text-lg font-lexend transition-colors p-1 sm:p-2 ${currentPage <= 1 ? 'text-gray-300 cursor-default' : 'hover:text-brand-red cursor-pointer'
          }`}
        aria-label="First"
      >
        ««
      </button>
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`text-sm sm:text-lg font-lexend transition-colors p-1 sm:p-2 ${currentPage <= 1 ? 'text-gray-300 cursor-default' : 'hover:text-brand-red cursor-pointer'
          }`}
        aria-label="Previous"
      >
        &lt;
      </button>

      {pages.map((p, index) => (
        <React.Fragment key={index}>
          {p === '...' ? (
            <span className="text-sm sm:text-lg font-lexend text-[#808080] p-1 sm:p-2">
              ...
            </span>
          ) : (
            <button
              onClick={() => goToPage(p)}
              className={`text-sm sm:text-lg font-lexend transition-colors p-1 sm:p-2 ${p === currentPage
                ? 'text-brand-red font-semibold underline text-black'
                : 'text-[#808080] hover:text-brand-red'
                }`}
            >
              {p}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`text-sm sm:text-lg font-lexend transition-colors p-1 sm:p-2 ${currentPage >= totalPages ? 'text-gray-300 cursor-default' : 'hover:text-brand-red cursor-pointer'
          }`}
        aria-label="Next"
      >
        &gt;
      </button>
      <button
        onClick={() => goToPage(totalPages)}
        disabled={currentPage >= totalPages}
        className={`text-sm sm:text-lg font-lexend transition-colors p-1 sm:p-2 ${currentPage >= totalPages ? 'text-gray-300 cursor-default' : 'hover:text-brand-red cursor-pointer'
          }`}
        aria-label="Last"
      >
        »»
      </button>
    </div>
  );
};

export default Pagination;
