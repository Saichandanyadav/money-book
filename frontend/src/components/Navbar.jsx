import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMenu, FiLogOut, FiUser, FiGrid, FiKey } from "react-icons/fi";
import Modal from "./Modal";

export default function Navbar() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const initials = user?.username.charAt(0).toUpperCase() || '?';

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-20 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center text-2xl font-bold text-sky-700 space-x-2">
                    <img src="/AppLogo1.png" alt="App Logo" className="w-10 h-10 rounded-full" />
                    <span>Money Book</span>
                </Link>

                <div className="hidden sm:flex items-center space-x-4">
                    <Link to="/dashboard" className="text-gray-700 hover:text-sky-600 font-medium">
                        Dashboard
                    </Link>
                    <Link to="/account" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sky-50 transition">
                        <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold">
                            {initials}
                        </div>
                        <span className="text-gray-800 font-semibold">{user?.username}</span>
                    </Link>
                    <button onClick={() => setShowLogoutModal(true)} className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                <div className="sm:hidden relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-sky-700 hover:bg-sky-100 rounded-full">
                        <FiMenu size={24} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-sky-200 rounded-lg shadow-lg z-10">
                            <div className="p-3 text-sm font-semibold text-gray-700 border-b flex items-center space-x-2">
                                <div className="w-7 h-7 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm">
                                    {initials}
                                </div>
                                <span>{user?.username}</span>
                            </div>
                            <Link to="/dashboard" onClick={() => setShowMenu(false)} className="flex items-center px-4 py-2 hover:bg-sky-50 text-gray-700">
                                <FiGrid className="inline mr-2" size={18} /> Dashboard
                            </Link>
                            <Link to="/account" onClick={() => setShowMenu(false)} className="flex items-center px-4 py-2 hover:bg-sky-50 text-gray-700">
                                <FiUser className="inline mr-2" size={18} /> Account Settings
                            </Link>
                            <Link to="/change-password" onClick={() => setShowMenu(false)} className="flex items-center px-4 py-2 hover:bg-sky-50 text-gray-700">
                                <FiKey className="inline mr-2" size={18} /> Change Password
                            </Link>
                            <button onClick={() => { setShowLogoutModal(true); setShowMenu(false); }} className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                                <FiLogOut className="inline mr-2" size={18} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showLogoutModal && (
                <Modal title="Confirm Logout" onClose={() => setShowLogoutModal(false)} onSubmit={handleLogout} submitText="Logout">
                    <p>Are you sure you want to log out?</p>
                </Modal>
            )}
        </header>
    );
}
