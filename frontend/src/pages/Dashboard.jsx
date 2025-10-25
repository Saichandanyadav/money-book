import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import BookCard from "../components/BookCard";
import Modal from "../components/Modal";
import { FiMenu } from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [newBook, setNewBook] = useState({ name: "", totalAmount: "", description: "" });
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const normalizeBooks = (resData) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData.books)) return resData.books;
    if (Array.isArray(resData.data)) return resData.data;
    return [];
  };

  const fetchBooks = useCallback(async () => {
    try {
      const res = await api.get("/books");
      setBooks(normalizeBooks(res.data));
    } catch {
      setBooks([]);
    }
  }, []);

  const handleCreateBook = async () => {
    try {
      await api.post("/books", { ...newBook, totalAmount: Number(newBook.totalAmount) });
      setShowModal(false);
      setNewBook({ name: "", totalAmount: "", description: "" });
      fetchBooks();
    } catch {}
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    window.history.pushState(null, "", "/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchBooks();
  }, [user, navigate, fetchBooks]);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-sky-700">Welcome, {user?.username} 👋</h1>
          <div className="sm:hidden relative">
            <button onClick={() => setShowMenu(prev => !prev)} className="text-2xl p-2 rounded-lg hover:bg-sky-100 text-sky-700">
              <FiMenu />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border border-sky-100 rounded-xl shadow-lg flex flex-col gap-2 p-2 w-40 z-50">
                <button onClick={() => { navigate("/change-password"); setShowMenu(false); }} className="bg-yellow-400 text-white px-3 py-2 rounded-lg shadow hover:bg-yellow-500">Change Password</button>
                <button onClick={() => { setShowLogoutModal(true); setShowMenu(false); }} className="bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-600">Logout</button>
              </div>
            )}
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => navigate("/change-password")} className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500">Change Password</button>
            <button onClick={() => setShowLogoutModal(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">Logout</button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-sky-700">Manage Books</h2>
          <button onClick={() => setShowModal(true)} className="bg-sky-500 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-600">Create New Book</button>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} fetchBooks={fetchBooks} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10 text-lg">No books found. Please create a new book.</div>
        )}
      </div>

      {showModal && (
        <Modal title="Create New Book" onClose={() => setShowModal(false)} onSubmit={handleCreateBook}>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Book Name" value={newBook.name} onChange={e => setNewBook({ ...newBook, name: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white" />
            <input type="number" placeholder="Total Amount" value={newBook.totalAmount} onChange={e => setNewBook({ ...newBook, totalAmount: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white" />
            <textarea placeholder="Description (optional)" value={newBook.description} onChange={e => setNewBook({ ...newBook, description: e.target.value })} className="border border-sky-300 p-2 rounded-lg w-full bg-white" />
          </div>
        </Modal>
      )}

      {showLogoutModal && (
        <Modal title="Confirm Logout" onClose={() => setShowLogoutModal(false)} onSubmit={confirmLogout}>
          <p>Are you sure you want to logout?</p>
        </Modal>
      )}
    </div>
  );
}
