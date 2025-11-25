import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Modal from "../components/Modal";
import AddPaymentModal from "../components/AddPaymentModal";
import usePaymentMethods from "../hooks/usePaymentMethods";
import { getCurrencySymbol, fetchCurrencyData } from "../utils/currency";
import BookHeader from "../components/BookHeader";
import BookInfo from "../components/BookInfo";
import OverviewSection from "../components/OverviewSection";
import TransactionSection from "../components/TransactionSection";
import StatCharts from "../components/StatCharts";
import TransactionModal from "../components/TransactionModal";
const OTHER_OPTION = "other-custom-option";
const TRANSACTIONS_PER_PAGE = 10;

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [transactionType, setTransactionType] = useState("debit");
  const [form, setForm] = useState({ name: "", amount: "", modeOfPayment: "", description: "" });
  const [filter, setFilter] = useState({ modeOfPayment: "", status: "", date: "" });
  const [pendingFilter, setPendingFilter] = useState({ modeOfPayment: "", status: "", date: "" });
  const [confirmModal, setConfirmModal] = useState({ type: "", visible: false });
  const [activeTab, setActiveTab] = useState("transactions");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  const menuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [symbol, setSymbol] = useState(getCurrencySymbol(user?.country));

  const fetchBook = useCallback(async (page = 1, currentFilter = { modeOfPayment: "", status: "", date: "" }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", TRANSACTIONS_PER_PAGE);
      if (currentFilter.modeOfPayment) params.append("modeOfPayment", currentFilter.modeOfPayment);
      if (currentFilter.status) params.append("status", currentFilter.status);

      const bookRes = await api.get(`/books/${id}`);
      const txRes = await api.get(`/transactions/${id}?${params.toString()}`);

      setBook(bookRes.data.book || bookRes.data);
      setTransactions(txRes.data.transactions || []);
      setCurrentPage(txRes.data.currentPage);
      setTotalPages(txRes.data.totalPages);
    } catch {
      setBook(null);
      setTransactions([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await api.get(`/transactions/overview/${id}`);
      setOverviewData(res.data);
    } catch {
      setOverviewData(null);
    }
  }, [id]);

  useEffect(() => {
    fetchCurrencyData().then(() => setSymbol(getCurrencySymbol(user?.country)));
  }, [user?.country]);

  useEffect(() => {
    fetchBook(1, filter);
    fetchOverview();
  }, [fetchBook, fetchOverview, filter]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchBook(page, filter);
    }
  };

  const handleFormChange = (e) => {
    if (e.target.name === "modeOfPayment" && e.target.value === OTHER_OPTION) {
      setShowModal(false);
      setShowAddPaymentModal(true);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handlePendingFilterChange = (e) => {
    setPendingFilter({ ...pendingFilter, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    setFilter(pendingFilter);
    setCurrentPage(1);
    fetchBook(1, pendingFilter);
  };

  const handleClearFilters = () => {
    const reset = { modeOfPayment: "", status: "", date: "" };
    setFilter(reset);
    setPendingFilter(reset);
    setCurrentPage(1);
    fetchBook(1, reset);
  };

  const handleAddCustomPayment = async (name) => {
    const newMethodName = await addPaymentMethod(name);
    if (newMethodName) {
      setForm({ ...form, modeOfPayment: newMethodName });
      setShowAddPaymentModal(false);
      setShowModal(true);
    }
  };

  const handleTransaction = async () => {
    if (!form.name || !form.amount || !form.modeOfPayment) return;
    try {
      const url = transactionType === "debit" ? "/transactions/send" : "/transactions/add";
      await api.post(url, { ...form, amount: Number(form.amount), bookId: id });
      setShowModal(false);
      setForm({ name: "", amount: "", modeOfPayment: "", description: "" });
      fetchBook(1, filter);
      fetchOverview();
    } catch {}
  };

  const handleToggleStatus = async () => {
    try {
      await api.put(`/books/toggle-status/${id}`);
      setConfirmModal({ type: "", visible: false });
      fetchBook();
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/books/${id}`);
      setConfirmModal({ type: "", visible: false });
      navigate("/dashboard");
    } catch {}
  };

  const handleExportPdf = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.modeOfPayment) params.append("modeOfPayment", filter.modeOfPayment);
      if (filter.status) params.append("status", filter.status);

      const response = await api.get(`/transactions/export/${id}?${params.toString()}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.name}_Statement_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {}
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!book) return <div className="flex justify-center items-center h-screen bg-gradient-to-b from-sky-50 to-white"><div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const paymentFilterOptions = [{ label: "All Modes", value: "" }, ...paymentMethods.map(mode => ({ label: mode, value: mode }))];
  const paymentFormOptions = [...paymentMethods.map(mode => ({ label: mode, value: mode })), { label: "-- Add New Mode --", value: OTHER_OPTION }];
  const statusOptions = [{ label: "All Statuses", value: "" }, { label: "Credit", value: "credit" }, { label: "Debit", value: "debit" }];
  const isFilterApplied = filter.modeOfPayment !== "" || filter.status !== "";
  const isFilterPending = pendingFilter.modeOfPayment !== filter.modeOfPayment || pendingFilter.status !== filter.status;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gradient-to-b from-white to-sky-50 min-h-screen relative pb-20 sm:pb-4">
      <BookHeader book={book} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setConfirmModal={setConfirmModal} handleExportPdf={handleExportPdf} />
      <BookInfo book={book} symbol={symbol} activeTab={activeTab} setActiveTab={setActiveTab} setTransactionType={setTransactionType} setShowModal={setShowModal} />
      {activeTab === "overview" && <OverviewSection overviewData={overviewData} symbol={symbol} />}
      {activeTab === "transactions" && <TransactionSection pendingFilter={pendingFilter} handlePendingFilterChange={handlePendingFilterChange} handleApplyFilter={handleApplyFilter} handleClearFilters={handleClearFilters} handleExportPdf={handleExportPdf} paymentFilterOptions={paymentFilterOptions} statusOptions={statusOptions} isFilterPending={isFilterPending} isLoading={isLoading} isFilterApplied={isFilterApplied} transactions={transactions} symbol={symbol} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />}
      {activeTab === "stats" && <StatCharts transactions={transactions} book={book} symbol={symbol} />}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-sky-200 shadow-xl sm:hidden">
        <div className="flex justify-around gap-3">
          <button onClick={() => { setTransactionType("credit"); setShowModal(true); }} disabled={!book.isActive} className="flex-1 px-3 py-2 bg-white border border-green-500 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-50 disabled:opacity-50 transition duration-150 shadow-md">Add Money</button>
          <button onClick={() => { setTransactionType("debit"); setShowModal(true); }} disabled={!book.isActive} className="flex-1 px-3 py-2 bg-white border border-red-500 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition duration-150 shadow-md">Send Money</button>
        </div>
      </div>
      {confirmModal.visible && <Modal title={`Confirm ${confirmModal.type === "toggleStatus" ? "Status Change" : "Deletion"}`} onClose={() => setConfirmModal({ type: "", visible: false })} onSubmit={confirmModal.type === "toggleStatus" ? handleToggleStatus : handleDelete} submitText={confirmModal.type === "toggleStatus" ? (book.isActive ? "Deactivate" : "Activate") : "Delete"} submitColor={confirmModal.type === "toggleStatus" ? (book.isActive ? "yellow" : "blue") : "red"}><p className="text-gray-700">{confirmModal.type === "toggleStatus" ? (book.isActive ? "Are you sure you want to deactivate this book?" : "Are you sure you want to activate this book?") : "Are you sure you want to delete this book permanently?"}</p></Modal>}
      <TransactionModal showModal={showModal} transactionType={transactionType} setShowModal={setShowModal} handleTransaction={handleTransaction} form={form} handleFormChange={handleFormChange} paymentFormOptions={paymentFormOptions} symbol={symbol} OTHER_OPTION={OTHER_OPTION} />
      {showAddPaymentModal && <AddPaymentModal onClose={() => { setShowAddPaymentModal(false); setShowModal(true); }} onAdd={handleAddCustomPayment} />}
    </div>
  );
};

export default BookPage;
