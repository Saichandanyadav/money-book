import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { getCurrencySymbol } from "../utils/currency";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, modeOfPayment: "", description: "" });

  const fetchTransaction = useCallback(async () => {
    try {
      const res = await api.get(`/transactions/transaction/${id}`);
      const data = res.data.transaction || res.data;
      setTransaction(data);
      setForm({ name: data.name, amount: data.amount, modeOfPayment: data.modeOfPayment, description: data.description || "" });
    } catch {}
  }, [id]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const handleUpdate = async () => {
    if (!form.name || !form.amount || !form.modeOfPayment) {
      window.dispatchEvent(new CustomEvent("api-toast", { detail: { title: "Missing fields", description: "Please fill all required fields." } }));
      return;
    }
    try {
      await api.put(`/transactions/transaction/${id}`, { ...form, amount: Number(form.amount) });
      setEditMode(false);
      fetchTransaction();
    } catch {}
  };

  if (!transaction) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const symbol = getCurrencySymbol(user?.country);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md border border-sky-100 mt-10">
      <h2 className="text-2xl font-extrabold text-sky-700 mb-4 text-center">Transaction Details</h2>

      {editMode ? (
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-sky-300 p-2 rounded-lg" />
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border border-sky-300 p-2 rounded-lg" />
          <select value={form.modeOfPayment} onChange={e => setForm({ ...form, modeOfPayment: e.target.value })} className="border border-sky-300 p-2 rounded-lg">
            <option value="">Select Mode</option>
            <option value="PhonePe">PhonePe</option>
            <option value="GPay">GPay</option>
            <option value="Paytm">Paytm</option>
            <option value="Cash">Cash</option>
            <option value="Account Transfer">Account Transfer</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border border-sky-300 p-2 rounded-lg" />
          <div className="flex gap-2 mt-3">
            <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">Save</button>
            <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-gray-700">
          <p><strong>Name:</strong> {transaction.name}</p>
          <p><strong>Status:</strong> {transaction.status}</p>
          <p><strong>Amount:</strong> {symbol}{transaction.amount}</p>
          <p><strong>Mode of Payment:</strong> {transaction.modeOfPayment}</p>
          <p><strong>Description:</strong> {transaction.description || "N/A"}</p>
          <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-sky-500 text-white rounded-lg shadow hover:bg-sky-600">Edit</button>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600">Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
