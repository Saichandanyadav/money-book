import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Modal from "./Modal";

export default function BookCard({ book, fetchBooks }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ type: "", visible: false });
  const navigate = useNavigate();

  const handleToggleStatus = async () => {
    try {
      await api.put(`/books/toggle-status/${book._id}`);
      setShowConfirm({ type: "", visible: false });
      fetchBooks();
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/books/${book._id}`);
      setShowConfirm({ type: "", visible: false });
      fetchBooks();
    } catch {}
  };

  return (
    <div
      onClick={() => navigate(`/book/${book._id}`)}
      className={`bg-white border rounded-xl shadow-lg p-4 relative cursor-pointer ${!book.isActive ? "opacity-60" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-sky-700">{book.name}</h2>
          <p className="text-sm text-gray-600">Status: {book.isActive ? "Active" : "Deactivated"}</p>
        </div>
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setShowMenu(!showMenu)} className="text-xl font-bold px-2 py-1">⋮</button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-white border rounded shadow-md z-10 w-44">
              <button onClick={() => navigate(`/book/${book._id}`)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">
                View Book
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm.visible && (
        <Modal
          title={
            showConfirm.type === "toggleStatus"
              ? book.isActive
                ? "Confirm Deactivation"
                : "Confirm Activation"
              : "Confirm Deletion"
          }
          onClose={() => setShowConfirm({ type: "", visible: false })}
          onSubmit={showConfirm.type === "toggleStatus" ? handleToggleStatus : handleDelete}
        >
          <p>
            Are you sure you want to{" "}
            {showConfirm.type === "toggleStatus"
              ? book.isActive
                ? "deactivate"
                : "activate"
              : "delete"}{" "}
            this book?
          </p>
        </Modal>
      )}
    </div>
  );
}
