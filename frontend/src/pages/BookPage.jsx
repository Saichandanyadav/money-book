import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Modal from "../components/Modal";
import TransactionTable from "../components/TransactionTable";
import { getCurrencySymbol } from "../utils/currency";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

const COLORS = ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc"];

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState("debit");
  const [form, setForm] = useState({ name: "", amount: "", modeOfPayment: "", description: "" });
  const [filter, setFilter] = useState({ modeOfPayment: "", date: "" });
  const [confirmModal, setConfirmModal] = useState({ type: "", visible: false });
  const [activeTab, setActiveTab] = useState("transactions");

  const fetchBook = useCallback(async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data.book || res.data);
      const sorted = (res.data.transactions || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(sorted);
    } catch {
      setBook(null);
      setTransactions([]);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
    const interval = setInterval(fetchBook, 5000);
    return () => clearInterval(interval);
  }, [fetchBook]);

  const handleTransaction = async () => {
    if (!form.name || !form.amount || !form.modeOfPayment) return;
    try {
      const url = transactionType === "debit" ? "/transactions/send" : "/transactions/add";
      await api.post(url, { ...form, amount: Number(form.amount), bookId: id });
      setShowModal(false);
      setForm({ name: "", amount: "", modeOfPayment: "", description: "" });
      fetchBook();
    } catch {}
  };

  const handleToggleStatus = async () => {
    try {
      await api.put(`/books/toggle-status/${id}`);
      setConfirmModal({ type: "", visible: false });
      fetchBook();
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/books/${id}`);
      setConfirmModal({ type: "", visible: false });
      navigate("/dashboard");
    } catch {}
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchMode = filter.modeOfPayment ? tx.modeOfPayment === filter.modeOfPayment : true;
    const matchDate = filter.date ? new Date(tx.createdAt).toISOString().slice(0,10) === filter.date : true;
    return matchMode && matchDate;
  });

  const generatePieData = () => {
    const statsMap = {};
    transactions.forEach(tx => statsMap[tx.status] = (statsMap[tx.status] || 0) + tx.amount);
    return Object.keys(statsMap).map(key => ({ name: key, value: statsMap[key] }));
  };

  const generateBarData = () => {
    const statsMap = {};
    transactions.forEach(tx => statsMap[tx.modeOfPayment] = (statsMap[tx.modeOfPayment] || 0) + tx.amount);
    return Object.keys(statsMap).map(key => ({ mode: key, amount: statsMap[key] }));
  };

  const generateLineData = () => {
    const sorted = [...transactions].sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
    let balance = 0;
    return sorted.map(tx => {
      balance += tx.status === "credit" ? tx.amount : -tx.amount;
      return { date: new Date(tx.createdAt).toLocaleDateString(), balance };
    });
  };

  if (!book) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const symbol = getCurrencySymbol(user?.country || book.country);

  const statsEmpty = transactions.length === 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gradient-to-b from-white to-sky-50 min-h-screen">
      <button onClick={() => navigate("/dashboard")} className="mb-5 px-3 py-2 bg-white border border-sky-200 rounded-lg shadow hover:bg-sky-50">← Back</button>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center flex-wrap">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-sky-700">{book.name}</h1>
          <div className="text-sm text-gray-700 mt-1 sm:mt-0 flex items-center gap-2">
            <div>Total Left:</div>
            <div className="bg-sky-100 px-4 py-2 rounded-lg font-extrabold text-xl text-sky-800">{symbol}{book.totalAmount}</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Status: <span className={book.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{book.isActive ? "Active" : "Deactivated"}</span></p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => { setTransactionType("debit"); setShowModal(true); }} disabled={!book.isActive} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50">Send</button>
        <button onClick={() => { setTransactionType("credit"); setShowModal(true); }} disabled={!book.isActive} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50">Add</button>
        <button onClick={() => setConfirmModal({ type: "toggleStatus", visible: true })} className={`px-4 py-2 rounded-lg text-white ${book.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}>{book.isActive ? "Deactivate" : "Activate"}</button>
        <button onClick={() => setConfirmModal({ type: "delete", visible: true })} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Delete</button>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b pb-3 border-sky-200">
        <button className={`px-4 py-2 ${activeTab === "transactions" ? "border-b-2 border-sky-600 font-bold text-sky-700" : "text-gray-600"}`} onClick={() => setActiveTab("transactions")}>Transactions</button>
        <button className={`px-4 py-2 ${activeTab === "stats" ? "border-b-2 border-sky-600 font-bold text-sky-700" : "text-gray-600"}`} onClick={() => setActiveTab("stats")}>Stats</button>
      </div>
      {activeTab === "transactions" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row flex-wrap gap-2 mb-4 items-center">
            <select value={filter.modeOfPayment} onChange={e => setFilter({ ...filter, modeOfPayment: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-32 bg-white">
              <option value="">All Modes</option>
              <option value="PhonePe">PhonePe</option>
              <option value="GPay">GPay</option>
              <option value="Paytm">Paytm</option>
              <option value="Cash">Cash</option>
              <option value="Account Transfer">Account Transfer</option>
            </select>
            <input type="date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-36 bg-white" />
            <button onClick={() => setFilter({ modeOfPayment: "", date: "" })} className="bg-sky-200 hover:bg-sky-300 px-3 py-2 rounded-lg w-20 text-sky-800 font-semibold">Clear</button>
          </div>
          <TransactionTable transactions={filteredTransactions} />
        </div>
      )}
      {activeTab === "stats" && (
        statsEmpty ? (
          <div className="text-center text-gray-500 p-10 col-span-full">No stats available. Add transactions to view stats.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 w-full border border-sky-200 bg-white p-4 rounded-xl shadow-sm flex flex-col justify-center items-center">
            <h3 className="text-lg font-bold text-sky-700 mb-2">Debit vs Credit</h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={generatePieData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {generatePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="h-64 w-full border border-sky-200 bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-sky-700 mb-2">Amount by Payment Mode</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={generateBarData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mode" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64 w-full border border-sky-200 bg-white p-4 rounded-xl shadow-sm md:col-span-3">
            <h3 className="text-lg font-bold text-sky-700 mb-2">Cumulative Balance Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={generateLineData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        )
      )}
      {showModal && (
        <Modal title={transactionType === "debit" ? "Send Money" : "Add Money"} onClose={() => setShowModal(false)} onSubmit={handleTransaction}>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white" />
            <input type="number" placeholder={`Amount (${symbol})`} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white" />
            <select value={form.modeOfPayment} onChange={e => setForm({ ...form, modeOfPayment: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white">
              <option value="">Select Mode</option>
              <option value="PhonePe">PhonePe</option>
              <option value="GPay">GPay</option>
              <option value="Paytm">Paytm</option>
              <option value="Cash">Cash</option>
              <option value="Account Transfer">Account Transfer</option>
            </select>
            <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white" />
          </div>
        </Modal>
      )}
      {confirmModal.visible && (
        <Modal title={confirmModal.type === "toggleStatus" ? (book.isActive ? "Confirm Deactivation" : "Confirm Activation") : "Confirm Deletion"} onClose={() => setConfirmModal({ type: "", visible: false })} onSubmit={confirmModal.type === "toggleStatus" ? handleToggleStatus : handleDelete}>
          <p>Are you sure you want to {confirmModal.type === "toggleStatus" ? (book.isActive ? "deactivate" : "activate") : "delete"} this book?</p>
        </Modal>
      )}
    </div>
  );
};

export default BookPage;
