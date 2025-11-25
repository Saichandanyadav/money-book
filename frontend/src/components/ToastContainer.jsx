import React, { useEffect, useState } from "react";

const Toast = ({ id, toast, onClose }) => {
  return (
    <div className="max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-gray-800">{toast.title}</div>
          <div className="text-sm text-gray-600 mt-1">{toast.description}</div>
        </div>
        <button onClick={() => onClose(id)} className="ml-4 text-gray-500 hover:text-gray-700">✕</button>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts((t) => [{ id, toast: detail }, ...t]);
      // auto remove after 6s
      setTimeout(() => {
        setToasts((t) => t.filter(x => x.id !== id));
      }, 6000);
    };
    window.addEventListener("api-toast", handler);
    return () => window.removeEventListener("api-toast", handler);
  }, []);

  const onClose = (id) => setToasts((t) => t.filter(x => x.id !== id));

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map(t => (
        <Toast key={t.id} id={t.id} toast={t.toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default ToastContainer;