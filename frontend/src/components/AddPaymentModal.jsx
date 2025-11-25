import React, { useState } from "react";
import Modal from "./Modal";

export default function AddPaymentModal({ onClose, onAdd }) {
    const [newMethodName, setNewMethodName] = useState("");

    const handleSubmit = () => {
        if (newMethodName.trim()) {
            onAdd(newMethodName.trim());
        }
    };

    return (
        <Modal title="Add New Payment Method" onClose={onClose} onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="New Payment Method Name" 
                value={newMethodName} 
                onChange={e => setNewMethodName(e.target.value)} 
                className="border border-gray-300 p-2 rounded-lg w-full"
            />
        </Modal>
    );
}