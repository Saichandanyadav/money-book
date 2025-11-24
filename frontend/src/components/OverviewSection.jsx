import React from "react";
import OverviewCard from "./OverviewCard";

const OverviewSection = ({ overviewData, symbol }) => {
    const overviewEmpty = !overviewData;

    return (
        overviewEmpty ? (
            <div className="text-center text-gray-500 p-10 col-span-full border border-sky-100 bg-white rounded-xl shadow-lg">Loading overview or no transactions found.</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <OverviewCard
                    title="Current Balance"
                    value={overviewData.currentBalance}
                    count={overviewData.totalTransactionCount}
                    symbol={symbol}
                    colorClass="border-sky-300 shadow-sky-100/50"
                />
                <OverviewCard
                    title="Net Change"
                    value={overviewData.netTransactionAmount}
                    count={overviewData.totalTransactionCount}
                    symbol={symbol}
                    colorClass={overviewData.netTransactionAmount >= 0 ? "border-green-300 shadow-green-100/50" : "border-red-300 shadow-red-100/50"}
                />
                <OverviewCard
                    title="Total Credited"
                    value={overviewData.totalCreditAmount}
                    count={overviewData.creditCount}
                    symbol={symbol}
                    colorClass="border-green-300 shadow-green-100/50"
                />
                <OverviewCard
                    title="Total Debited"
                    value={overviewData.totalDebitAmount}
                    count={overviewData.debitCount}
                    symbol={symbol}
                    colorClass="border-red-300 shadow-red-100/50"
                />
                <OverviewCard
                    title="Total Transactions"
                    value={overviewData.totalCreditAmount + overviewData.totalDebitAmount}
                    count={overviewData.totalTransactionCount}
                    symbol={symbol}
                    colorClass="border-indigo-300 shadow-indigo-100/50"
                />
            </div>
        )
    );
};

export default OverviewSection;