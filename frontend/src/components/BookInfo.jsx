import React from "react";

const BookInfo = ({ book, symbol, activeTab, setActiveTab, setTransactionType, setShowModal }) => (
    <div className="flex flex-col gap-2 mb-5">
        <div className="flex justify-between items-center flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-sky-700 pr-4 max-w-full sm:max-w-md break-words">
                {book.name}
            </h1>
            <div className="text-sm text-gray-700 flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0">
                <div className="font-semibold whitespace-nowrap">Current Balance:</div>
                <div className="bg-sky-100 px-3 py-1 rounded-lg font-extrabold text-xl text-sky-800 whitespace-nowrap">{symbol}{book.totalAmount.toFixed(2)}</div>
            </div>
        </div>
        <p className="text-sm text-gray-600">Status: <span className={book.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{book.isActive ? "Active" : "Deactivated"}</span></p>

        <div className="flex flex-wrap items-center justify-between mt-4 border-b pb-2 border-sky-200">
            <div className="flex items-center gap-2">
                <button className={`px-4 py-2 text-sm ${activeTab === "overview" ? "border-b-2 border-sky-600 font-bold text-sky-700" : "text-gray-600"}`} onClick={() => setActiveTab("overview")}>Overview</button>
                <button className={`px-4 py-2 text-sm ${activeTab === "transactions" ? "border-b-2 border-sky-600 font-bold text-sky-700" : "text-gray-600"}`} onClick={() => setActiveTab("transactions")}>Transactions</button>
                <button className={`px-4 py-2 text-sm ${activeTab === "stats" ? "border-b-2 border-sky-600 font-bold text-sky-700" : "text-gray-600"}`} onClick={() => setActiveTab("stats")}>Stats</button>
            </div>
            <div className="hidden sm:flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                <button onClick={() => { setTransactionType("credit"); setShowModal(true); }} disabled={!book.isActive} className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 disabled:opacity-50 transition duration-150">Add Money</button>
                <button onClick={() => { setTransactionType("debit"); setShowModal(true); }} disabled={!book.isActive} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition duration-150">Send Money</button>
            </div>
        </div>
    </div>
);

export default BookInfo;