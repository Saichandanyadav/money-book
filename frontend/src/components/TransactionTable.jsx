import React from "react";
import { useNavigate } from "react-router-dom";
import { getCurrencySymbol } from "../utils/currency";
import Pagination from "./Pagination";

const TransactionTable = ({ transactions, currentPage, totalPages, onPageChange, isLoading }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const symbol = getCurrencySymbol(user?.country);

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
        <p className="text-gray-500 mt-3">Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <div className="text-center text-gray-500 p-6">No transactions found.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto border border-sky-200 rounded-xl bg-white shadow-md">
        <table className="min-w-full">
          <thead className="bg-sky-100 text-sky-800 font-semibold">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Mode</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr
                key={tx._id}
                className="cursor-pointer hover:bg-sky-50 transition"
                onClick={() => navigate(`/transaction/${tx._id}`)}
              >
                <td className="p-3 border-t border-sky-100">{tx.name}</td>
                <td className={`p-3 border-t border-sky-100 font-bold ${tx.status === "debit" ? "text-red-600" : "text-green-600"}`}>
                  {tx.status}
                </td>
                <td className="p-3 border-t border-sky-100">{tx.modeOfPayment}</td>
                <td className={`p-3 border-t border-sky-100 text-right font-bold ${tx.status === "debit" ? "text-red-600" : "text-green-600"}`}>
                  {symbol}{tx.amount}
                </td>
                <td className="p-3 border-t border-sky-100">{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export default TransactionTable;