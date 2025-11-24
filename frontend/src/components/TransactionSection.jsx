import React from "react";
import { HiOutlineDownload, HiOutlineXCircle } from "react-icons/hi";
import CustomSelect from "./CustomSelect";
import TransactionTable from "./TransactionTable";

const TransactionSection = ({
    pendingFilter,
    handlePendingFilterChange,
    handleApplyFilter,
    handleClearFilters,
    handleExportPdf,
    paymentFilterOptions,
    statusOptions,
    isFilterPending,
    isLoading,
    isFilterApplied,
    transactions,
    symbol,
    currentPage,
    totalPages,
    handlePageChange
}) => (
    <>
        <div className="flex flex-wrap gap-3 mb-4 items-end p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            
            <CustomSelect
                name="modeOfPayment"
                value={pendingFilter.modeOfPayment}
                onChange={handlePendingFilterChange}
                label="Filter by Mode"
                options={paymentFilterOptions}
                placeholder="All Modes"
                className="flex-1 min-w-[150px] sm:flex-initial"
            />
            
            <CustomSelect
                name="status"
                value={pendingFilter.status}
                onChange={handlePendingFilterChange}
                label="Filter by Status"
                options={statusOptions}
                placeholder="All Statuses"
                className="flex-1 min-w-[150px] sm:flex-initial"
            />
            
            <div className="flex gap-3 w-full sm:w-auto">
                <button
                    onClick={handleApplyFilter}
                    disabled={!isFilterPending || isLoading}
                    className="text-sm px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 h-10 flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition duration-150 flex-1 min-w-[120px] sm:min-w-0"
                >
                    Apply Filter
                </button>
                
               {isFilterApplied && (
                <button
                    onClick={handleClearFilters}
                    disabled={isLoading}
                    className="text-sm px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 h-11 flex items-center justify-center disabled:opacity-50 w-40 sm:w-48"
                >
                    <HiOutlineXCircle className="h-5 w-5" />
                    <span className="ml-2 hidden sm:inline text-base">Clear Filters</span>
                </button>
                )}
            </div>
            
            <button
                onClick={handleExportPdf}
                className="flex bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 transition duration-150 items-center justify-center h-10 flex-shrink-0 w-full sm:w-auto lg:w-auto lg:flex-initial"
            >
                <HiOutlineDownload className="h-5 w-5 mr-1" />
                Export PDF
            </button>
        </div>

        <TransactionTable 
            transactions={transactions}
            symbol={symbol}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
        />
    </>
);

export default TransactionSection;