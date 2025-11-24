import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

const StatCharts = ({ transactions, book, symbol }) => {
    const statsEmpty = transactions.length === 0;

    const generatePieData = () => {
        const statsMap = {};
        transactions.forEach(tx => statsMap[tx.status] = (statsMap[tx.status] || 0) + tx.amount);
        return Object.keys(statsMap).map(key => ({ name: key, value: statsMap[key] }));
    };

    const generateBarData = () => {
        const creditTransactions = transactions.filter(tx => tx.status === 'credit');
        const statsMap = {};
        creditTransactions.forEach(tx => statsMap[tx.modeOfPayment] = (statsMap[tx.modeOfPayment] || 0) + tx.amount);
        return Object.keys(statsMap).map(key => ({ mode: key, amount: statsMap[key] }));
    };

    const generateLineData = () => {
        const sorted = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        let balance = book?.totalAmount || 0;
        const initial = [{ date: "Initial", balance: book.totalAmount }];
        
        const data = sorted.reduce((acc, tx) => {
            const isCredit = tx.status === "credit";
            const change = isCredit ? tx.amount : -tx.amount;
            balance += change;
            const dateStr = new Date(tx.createdAt).toLocaleDateString();
            acc.push({ date: dateStr, balance });
            return acc;
        }, initial);
        
        const result = [];
        const dateMap = {};
        data.forEach(item => dateMap[item.date] = item.balance);
        Object.keys(dateMap).forEach(date => result.push({ date, balance: dateMap[date] }));
        
        return result;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 lg:col-span-2">
                <h2 className="text-xl font-semibold text-sky-700 mb-4 border-b pb-2">Balance Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    {statsEmpty ? (
                        <div className="flex items-center justify-center h-full text-gray-500">No transactions to display chart.</div>
                    ) : (
                        <LineChart data={generateLineData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis tickFormatter={(value) => `${symbol}${value}`} stroke="#6b7280" />
                            <Tooltip formatter={(value) => [`${symbol}${value.toFixed(2)}`, 'Balance']} labelFormatter={(label) => `Date: ${label}`} />
                            <Legend />
                            <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} name="Balance" />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-sky-700 mb-4 border-b pb-2">Credit/Debit Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                    {statsEmpty ? (
                        <div className="flex items-center justify-center h-full text-gray-500">No transactions to display chart.</div>
                    ) : (
                        <PieChart>
                            <Pie
                                data={generatePieData()}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name.toUpperCase()} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {generatePieData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'credit' ? "#10b981" : "#ef4444"} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${symbol}${value.toFixed(2)}`, 'Amount']} labelFormatter={(label) => `Status: ${label.toUpperCase()}`} />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 lg:col-span-3">
                <h2 className="text-xl font-semibold text-sky-700 mb-4 border-b pb-2">Credit by Payment Mode</h2>
                <ResponsiveContainer width="100%" height={300}>
                    {statsEmpty ? (
                        <div className="flex items-center justify-center h-full text-gray-500">No transactions to display chart.</div>
                    ) : (
                        <BarChart data={generateBarData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="mode" stroke="#6b7280" />
                            <YAxis tickFormatter={(value) => `${symbol}${value}`} stroke="#6b7280" />
                            <Tooltip formatter={(value) => [`${symbol}${value.toFixed(2)}`, 'Credited Amount']} labelFormatter={(label) => `Mode: ${label}`} />
                            <Legend />
                            <Bar dataKey="amount" fill="#0284c7" name="Amount Credited" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatCharts;