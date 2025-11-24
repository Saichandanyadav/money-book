import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiGlobe, FiUser, FiCalendar, FiLock } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function AccountPage() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  
  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : "N/A";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
          <div className="flex flex-col items-center border-b pb-4 mb-4">
            <div className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center text-white text-4xl font-extrabold mb-3">
              <FaUserCircle size={96} className="text-sky-100" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-700">
              <FiUser size={20} className="text-sky-500" />
              <span className="font-semibold">Username:</span>
              <span>{user?.username}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiMail size={20} className="text-sky-500" />
              <span className="font-semibold">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiGlobe size={20} className="text-sky-500" />
              <span className="font-semibold">Country:</span>
              <span>{user?.country || "India"}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiCalendar size={20} className="text-sky-500" />
              <span className="font-semibold">Joined:</span>
              <span>{joinedDate}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Security Settings</h2>
          
          <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
            <div className="flex items-center space-x-3">
              <FiLock size={24} className="text-sky-600" />
              <span className="font-medium text-gray-700">Change Your Password</span>
            </div>
            <button
              onClick={() => navigate("/change-password")}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg font-semibold text-sm hover:bg-sky-700 transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}