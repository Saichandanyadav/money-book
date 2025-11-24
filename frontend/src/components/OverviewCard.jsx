import React from "react";

const OverviewCard = ({ title, value, count, symbol, colorClass }) => (
    <div className={`p-4 bg-white border ${colorClass} rounded-xl shadow-md transform hover:scale-[1.02] transition duration-200`}>
        <div className="text-sm font-semibold text-gray-500 mb-1">{title}</div>
        <div className="text-2xl font-extrabold text-sky-800">{symbol}{value.toFixed(2)}</div>
        <div className="text-xs text-gray-600 font-medium">{count} Transactions</div>
    </div>
);

export default OverviewCard;