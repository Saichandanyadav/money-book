import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import BookCard from "../components/BookCard";
import Modal from "../components/Modal";
import usePaymentMethods from "../hooks/usePaymentMethods";
import AddPaymentModal from "../components/AddPaymentModal";

const OTHER_OPTION = "other-custom-option";

export default function Dashboard() {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBook, setNewBook] = useState({ name: "", totalAmount: "", description: "", initialStatus: "credit", initialMode: "" });
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const { paymentMethods, addPaymentMethod } = usePaymentMethods();

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchBooks = useCallback(async () => {
        try {
            const res = await api.get("/books");
            setBooks(res.data.books);
        } catch {}
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "initialMode" && value === OTHER_OPTION) {
            setShowModal(false);
            setShowAddPaymentModal(true);
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    const handleAddCustomPayment = async (name) => {
        const newMethodName = await addPaymentMethod(name);
        if (newMethodName) {
            setNewBook({ ...newBook, initialMode: newMethodName });
            setShowAddPaymentModal(false);
            setShowModal(true);
        }
    };

    const handleCreateBook = async () => {
        if (!newBook.name || !newBook.totalAmount || newBook.totalAmount <= 0 || !newBook.initialMode) return;

        try {
            await api.post("/books", { ...newBook, totalAmount: Number(newBook.totalAmount) });
            setShowModal(false);
            setNewBook({ name: "", totalAmount: "", description: "", initialStatus: "credit", initialMode: "" });
            fetchBooks();
        } catch {}
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-white">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.username || 'User'} 👋</h1>

            <div className="mb-6 flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">Manage Your Books</h2>
                <button onClick={() => setShowModal(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 shadow-md">
                    + New Book
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                    <BookCard key={book._id} book={book} />
                ))}
            </div>

            {showModal && (
                <Modal 
                    title="Start a New Book" 
                    onClose={() => setShowModal(false)} 
                    onSubmit={handleCreateBook} 
                    submitText="Create Book"
                >
                    <div className="flex flex-col gap-4">
                        <input type="text" name="name" placeholder="Book Name (e.g., Raju's Account)" value={newBook.name} onChange={handleFormChange} className="border border-sky-300 p-3 rounded-lg focus:ring-sky-500 focus:border-sky-500" required />
                        <input type="number" name="totalAmount" placeholder="Starting Amount (₹)" value={newBook.totalAmount} onChange={handleFormChange} className="border border-sky-300 p-3 rounded-lg focus:ring-sky-500 focus:border-sky-500" required />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 border border-sky-200 rounded-lg">
                                <label className="text-gray-700 font-medium block mb-2">Who pays?</label>
                                <div className="flex flex-col gap-2">
                                    <label className={`inline-flex items-center p-2 rounded-md transition-colors ${newBook.initialStatus === 'credit' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-white hover:bg-gray-50'}`}>
                                        <input type="radio" name="initialStatus" value="credit" checked={newBook.initialStatus === "credit"} onChange={handleFormChange} className="form-radio text-green-500 h-5 w-5" />
                                        <span className="ml-2 text-green-700 font-semibold">Credit (They will Pay)</span>
                                    </label>
                                    <label className={`inline-flex items-center p-2 rounded-md transition-colors ${newBook.initialStatus === 'debit' ? 'bg-red-100 ring-2 ring-red-500' : 'bg-white hover:bg-gray-50'}`}>
                                        <input type="radio" name="initialStatus" value="debit" checked={newBook.initialStatus === "debit"} onChange={handleFormChange} className="form-radio text-red-500 h-5 w-5" />
                                        <span className="ml-2 text-red-700 font-semibold">Debit (I will Pay)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-3 border border-sky-200 rounded-lg">
                                <label className="text-gray-700 font-medium block mb-2">Payment Method</label>
                                <select name="initialMode" value={newBook.initialMode} onChange={handleFormChange} className="border border-sky-300 p-3 rounded-lg focus:ring-sky-500 focus:border-sky-500 w-full bg-white mb-2" required>
                                    <option value="">Select Mode</option>
                                    {paymentMethods.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                                    <option value={OTHER_OPTION}>-- Add New Mode --</option>
                                </select>
                                <p className="text-xs text-sky-700 font-semibold text-center">
                                    For **old debts** (no payment now), select **"Opening Balance"**.
                                </p>
                            </div>
                        </div>

                        <textarea name="description" placeholder="Notes (optional)" value={newBook.description} onChange={handleFormChange} className="border border-sky-300 p-3 rounded-lg focus:ring-sky-500 focus:border-sky-500" rows="2" />
                    </div>
                </Modal>
            )}

            {showAddPaymentModal && <AddPaymentModal onClose={() => { setShowAddPaymentModal(false); setShowModal(true); }} onAdd={handleAddCustomPayment} />}
        </div>
    );
}