import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm border border-sky-300 rounded-lg hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 text-sm border border-sky-300 rounded-lg hover:bg-sky-100 bg-white">1</button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 text-sm border rounded-lg ${
            number === currentPage
              ? "bg-sky-600 text-white border-sky-600"
              : "bg-white text-sky-700 border-sky-300 hover:bg-sky-100"
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 text-sm border border-sky-300 rounded-lg hover:bg-sky-100 bg-white">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm border border-sky-300 rounded-lg hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;