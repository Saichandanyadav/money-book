import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import usePaymentMethods from "../hooks/usePaymentMethods";
import AddPaymentModal from "../components/AddPaymentModal";
import Modal from "../components/Modal";
import CustomSelect from "../components/CustomSelect";
import { getCurrencySymbol } from "../utils/currency";

const OTHER_OPTION = "other-custom-option";

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, modeOfPayment: "", description: "" });
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();

  const fetchTransaction = useCallback(async () => {
    try {
      const res = await api.get(`/transactions/transaction/${id}`);
      const data = res.data.transaction || res.data;
      setTransaction(data);
      setForm({
        name: data.name,
        amount: data.amount,
        modeOfPayment: data.modeOfPayment,
        description: data.description || ""
      });
    } catch {}
  }, [id]);

  useEffect(() => { fetchTransaction(); }, [fetchTransaction]);

  const handleFormChange = (e) => {
    if (e.target.name === "modeOfPayment" && e.target.value === OTHER_OPTION) {
      setShowAddPaymentModal(true);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleAddCustomPayment = async (name) => {
    const newMethod = await addPaymentMethod(name);
    if (newMethod) setForm(p => ({ ...p, modeOfPayment: newMethod }));
    setShowAddPaymentModal(false);
  };

  const handleUpdate = async () => {
    if (!form.name || !form.amount || !form.modeOfPayment) {
      window.dispatchEvent(new CustomEvent("api-toast", { detail: { title: "Missing fields", description: "Please fill all required fields." } }));
      return;
    }
    try {
      await api.put(`/transactions/transaction/${id}`, { ...form, amount: Number(form.amount) });
      setShowEditModal(false);
      fetchTransaction();
    } catch {}
  };

  if (!transaction) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const symbol = getCurrencySymbol(user?.country);

  const paymentFormOptions = [
    { label: "Select Mode", value: "" },
    ...paymentMethods.map(mode => ({ label: mode, value: mode })),
    { label: "Add New Payment Method", value: OTHER_OPTION }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white via-sky-50 to-sky-100 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-sky-700 tracking-tight drop-shadow-sm">Transaction Details</h1>
          <p className="text-gray-600 text-sm mt-1">View, update, and manage your transaction information</p>
        </div>

        <div className="bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.07)] border border-sky-100 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-4 text-gray-700 text-lg leading-relaxed">
            <p><span className="font-semibold text-sky-700">Name:</span> {transaction.name}</p>
            <p><span className="font-semibold text-sky-700">Status:</span> {transaction.status}</p>
            <p>
              <span className="font-semibold text-sky-700">Amount:</span>{" "}
              <span className={transaction.status === "debit" ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                {symbol}{transaction.amount}
              </span>
            </p>
            <p><span className="font-semibold text-sky-700">Mode of Payment:</span> {transaction.modeOfPayment}</p>
            <p><span className="font-semibold text-sky-700">Description:</span> {transaction.description || "N/A"}</p>
            <p><span className="font-semibold text-sky-700">Date:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
          </div>

          <div className="hidden sm:flex gap-4 mt-10">
            <button onClick={() => setShowEditModal(true)} className="flex-1 bg-sky-600 hover:bg-sky-700 transition text-white py-3 rounded-2xl text-lg font-semibold shadow">Edit</button>
            <button onClick={() => navigate(-1)} className="flex-1 bg-gray-600 hover:bg-gray-700 transition text-white py-3 rounded-2xl text-lg font-semibold shadow">Go Back</button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 h-20 z-20 sm:hidden">
          <div className="flex justify-around items-center h-full px-4">
            <button onClick={() => setShowEditModal(true)} className="flex flex-col items-center text-sky-600 p-2">
              <span className="text-xl font-bold">✎</span>
              <span className="text-xs font-semibold">Edit</span>
            </button>
            <button onClick={() => navigate(-1)} className="flex flex-col items-center text-gray-700 p-2">
              <span className="text-xl font-bold">←</span>
              <span className="text-xs font-semibold">Back</span>
            </button>
          </div>
        </div>

        {showEditModal && (
          <Modal title="Edit Transaction" onClose={() => setShowEditModal(false)} onSubmit={handleUpdate} submitText="Save">
            <div className="flex flex-col gap-4">
              <input type="text" name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="border border-sky-300 p-3 rounded-xl" />
              <input type="number" name="amount" value={form.amount} onChange={handleFormChange} placeholder="Amount" className="border border-sky-300 p-3 rounded-xl" />
              <CustomSelect
                name="modeOfPayment" // <-- ADDED NAME PROP HERE
                options={paymentFormOptions}
                value={form.modeOfPayment}
                onChange={handleFormChange}
                placeholder="Select Mode"
              />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" className="border border-sky-300 p-3 rounded-xl h-28" />
            </div>
          </Modal>
        )}

        {showAddPaymentModal && <AddPaymentModal onClose={() => setShowAddPaymentModal(false)} onAdd={handleAddCustomPayment} />}
      </div>
    </div>
  );
}