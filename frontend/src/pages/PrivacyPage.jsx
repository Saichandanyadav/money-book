import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 px-6 py-12 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 px-4 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition text-sm"
      >
        ← Back
      </button>
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center mt-5">
        <h1 className="text-4xl font-extrabold text-sky-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-700 text-lg mb-8">
          Your privacy is important to us. We are committed to protecting your personal data and providing transparency on how it is collected and used.
        </p>
        <h2 className="text-2xl font-semibold text-sky-700 mb-3">Information We Collect</h2>
        <ul className="list-disc text-gray-700 text-left ml-6 mb-6 space-y-1">
          <li>Name, Email, and login credentials</li>
          <li>Books, transactions, and financial records</li>
          <li>Usage data for improving the app experience</li>
          <li>Device and system information</li>
        </ul>
        <h2 className="text-2xl font-semibold text-sky-700 mb-3">How We Use Your Data</h2>
        <ul className="list-disc text-gray-700 text-left ml-6 mb-6 space-y-1">
          <li>To authenticate and manage your account</li>
          <li>To securely store and retrieve your financial data</li>
          <li>To provide personalized features and insights</li>
          <li>To communicate updates, offers, or important notifications</li>
        </ul>
        <h2 className="text-2xl font-semibold text-sky-700 mb-3">Data Sharing & Security</h2>
        <ul className="list-disc text-gray-700 text-left ml-6 mb-6 space-y-1">
          <li>We do not share your data with third parties without your consent</li>
          <li>Data is encrypted and securely stored</li>
          <li>Access is limited to authorized personnel only</li>
        </ul>
        <h2 className="text-2xl font-semibold text-sky-700 mb-3">Your Rights</h2>
        <ul className="list-disc text-gray-700 text-left ml-6 mb-8 space-y-1">
          <li>You can request to view, update, or delete your data</li>
          <li>You may opt-out of communications at any time</li>
        </ul>
        <p className="text-gray-700 text-lg">
          For more information or questions about our privacy practices,{" "}
          <span
            onClick={() => navigate("/support")}
            className="text-sky-600 font-semibold cursor-pointer hover:underline"
          >
            contact us
          </span>
          .
        </p>
      </div>
    </div>
  );
}
