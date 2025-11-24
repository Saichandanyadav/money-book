import React from "react";
import Modal from "./Modal";
import CustomSelect from "./CustomSelect";

const TransactionModal = ({ showModal, transactionType, setShowModal, handleTransaction, form, handleFormChange, paymentFormOptions, symbol, OTHER_OPTION }) => (
    showModal && (
        <Modal
            title={`${transactionType === "credit" ? "Add" : "Send"} Money`}
            onClose={() => setShowModal(false)}
            onSubmit={handleTransaction}
            submitText={transactionType === "credit" ? "Add" : "Send"}
            submitColor={transactionType === "credit" ? "green" : "red"}
        >
            <form className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name/Title</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="E.g., Salary, Rent, Groceries"
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ({symbol})</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={form.amount}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label htmlFor="modeOfPayment" className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment</label>
                    <CustomSelect
                        id="modeOfPayment"
                        name="modeOfPayment"
                        value={form.modeOfPayment}
                        onChange={handleFormChange}
                        options={paymentFormOptions}
                        placeholder="Select Mode"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                    ></textarea>
                </div>
            </form>
        </Modal>
    )
);

export default TransactionModal;