import React from "react";

export default function Modal({ title, children, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
            Cancel
          </button>
          <button onClick={onSubmit} className="px-4 py-2 bg-sky-600 text-white rounded-lg">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
