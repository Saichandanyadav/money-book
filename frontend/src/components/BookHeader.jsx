import React, { useRef } from "react";
import { HiOutlineArrowLeft, HiOutlineDotsVertical, HiOutlineDownload } from "react-icons/hi";
import { RiProhibitedLine, RiDeleteBinLine, RiCheckLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const BookHeader = ({ book, symbol, isMenuOpen, setIsMenuOpen, setConfirmModal, handleExportPdf }) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);

    return (
        <div className="flex justify-between items-start mb-4">
            <button onClick={() => navigate("/dashboard")} className="px-3 py-2 bg-white border border-sky-200 rounded-lg shadow hover:bg-sky-50 text-sm flex items-center">
                <HiOutlineArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-gray-200 text-gray-700 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-300 font-bold leading-none">
                    <HiOutlineDotsVertical className="h-5 w-5" />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                        <button 
                            onClick={() => { setIsMenuOpen(false); setConfirmModal({ type: "toggleStatus", visible: true }); }} 
                            className={`w-full text-left px-4 py-2 text-sm flex items-center ${book.isActive ? "text-yellow-700 hover:bg-yellow-50" : "text-blue-700 hover:bg-blue-50"}`}
                        >
                            {book.isActive ? (
                                <>
                                    <RiProhibitedLine className="h-5 w-5 mr-2" /> Deactivate Book
                                </>
                            ) : (
                                <>
                                    <RiCheckLine className="h-5 w-5 mr-2" /> Activate Book
                                </>
                            )}
                        </button>
                        <button 
                            onClick={() => { setIsMenuOpen(false); setConfirmModal({ type: "delete", visible: true }); }} 
                            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                        >
                            <RiDeleteBinLine className="h-5 w-5 mr-2" /> Delete Book
                        </button>
                        <button
                            onClick={() => { handleExportPdf(); setIsMenuOpen(false); }}
                            className="lg:hidden w-full text-left px-4 py-2 text-sm text-sky-700 hover:bg-sky-50 flex items-center"
                        >
                            <HiOutlineDownload className="h-5 w-5 mr-2" /> Export PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookHeader;