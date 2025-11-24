import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import usePageLoader from "../hooks/usePageLoader";

export default function Landing() {
  const navigate = useNavigate();
  const loading = usePageLoader();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <img src="/AppLogo1.png" alt="Logo" className="w-10 h-10 rounded-full md:w-16 md:h-16" />
          <div className="text-2xl md:text-4xl font-extrabold text-sky-700 tracking-wide">Money Book</div>
        </div>
        <nav className="flex gap-4 items-center">
          <button onClick={() => navigate("/login")} className="hidden md:block px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">Login</button>
          <button onClick={() => navigate("/signup")} className="hidden md:block px-4 py-2 bg-white text-sky-600 border border-sky-600 rounded-lg hover:bg-sky-50 transition">Signup</button>
          <button onClick={() => navigate("/login")} className="md:hidden w-9 h-9 flex items-center justify-center bg-sky-600 text-white rounded-lg text-lg"><FiLogIn /></button>
          <button onClick={() => navigate("/signup")} className="md:hidden w-9 h-9 flex items-center justify-center bg-white text-sky-600 border border-sky-600 rounded-lg text-lg"><FiUserPlus /></button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 leading-tight mb-4">Manage your money, ledgers, and transactions effortlessly</h1>
            <p className="text-gray-600 text-lg mb-6">Create books, track credits & debits, analyze insights with charts, and stay financially organized with a clean and secure interface.</p>
            <div className="flex gap-4">
              <button onClick={() => navigate("/signup")} className="px-6 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition">Get Started</button>
              <button onClick={() => navigate("/login")} className="px-6 py-3 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 transition">Login</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 border border-sky-100">
            <div className="h-64 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg flex flex-col justify-center items-center">
              <div className="text-sky-700 font-bold text-xl">Dashboard Preview</div>
              <div className="mt-3 text-gray-600 text-sm text-center px-4">Visualize your spending, track payments, monitor balance trends, and manage all books in one place.</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-sky-50 rounded-lg text-center shadow-sm"><div className="font-bold text-sky-700">Secure</div><div className="text-xs text-gray-500">User authentication enabled</div></div>
              <div className="p-3 bg-sky-50 rounded-lg text-center shadow-sm"><div className="font-bold text-sky-700">Insights</div><div className="text-xs text-gray-500">Charts for smarter tracking</div></div>
              <div className="p-3 bg-sky-50 rounded-lg text-center shadow-sm"><div className="font-bold text-sky-700">Fast</div><div className="text-xs text-gray-500">Quick transaction entries</div></div>
              <div className="p-3 bg-sky-50 rounded-lg text-center shadow-sm"><div className="font-bold text-sky-700">Responsive</div><div className="text-xs text-gray-500">Works on all devices</div></div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">Create Books</h3>
            <p className="text-sm text-gray-600">Build separate ledgers for business, personal, savings, and more.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">Smart Transactions</h3>
            <p className="text-sm text-gray-600">Add credits and debits with rich details and payment modes.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">Visualize your financial activity with pie, bar, and line charts.</p>
          </div>
        </section>

        <section className="mt-20 bg-sky-700 text-white rounded-xl p-10 shadow-lg">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Start managing smarter with Money Book</h2>
            <p className="mt-2 text-sky-100">Create your first ledger and take charge of your finances today.</p>
            <button onClick={() => navigate("/signup")} className="mt-6 px-8 py-3 bg-white text-sky-700 rounded-lg font-semibold hover:bg-sky-50 transition">Create Account</button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} Money Book</div>
          <div className="flex gap-4 text-sm text-gray-500">
            <button onClick={() => navigate("/support")} className="hover:underline">Support</button>
            <button onClick={() => navigate("/privacy")} className="hover:underline">Privacy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
