import React from "react";
import { IoMdClose } from "react-icons/io";

export default function Modal({ title, children, onClose, onSubmit, submitText = "Submit" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg">
          <IoMdClose />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          {onSubmit && (
            <button onClick={onSubmit} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
              {submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
