import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-sky-700">Book Manager</div>
        <nav className="flex gap-4 items-center">
          <button onClick={() => navigate("/login")} className="px-4 py-2 bg-sky-600 text-white rounded-lg">Login</button>
          <button onClick={() => navigate("/signup")} className="px-4 py-2 bg-white text-sky-600 border border-sky-600 rounded-lg">Signup</button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 mb-4">Manage your money, books, and transactions with ease</h1>
            <p className="text-gray-600 mb-6">Create personal ledgers, track transactions, see visual summaries and keep your finances organized per book. Secure accounts and per-user data access.</p>
            <div className="flex gap-3">
              <button onClick={() => navigate("/signup")} className="px-6 py-3 bg-sky-600 text-white rounded-lg shadow">Get Started</button>
              <button onClick={() => navigate("/login")} className="px-6 py-3 bg-white border border-sky-300 rounded-lg">Login</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-64 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg flex flex-col justify-center items-center">
              <div className="text-sky-700 font-bold text-lg">Overview</div>
              <div className="mt-3 text-gray-600 text-sm text-center">Create books, add credits and debits, view charts and transaction lists — everything in one place.</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-sky-50 rounded-lg text-center">
                <div className="font-bold text-sky-700">Secure</div>
                <div className="text-xs text-gray-500">Per-user authenticated access</div>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg text-center">
                <div className="font-bold text-sky-700">Visuals</div>
                <div className="text-xs text-gray-500">Charts and stats per book</div>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg text-center">
                <div className="font-bold text-sky-700">Simple</div>
                <div className="text-xs text-gray-500">Quick add transactions</div>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg text-center">
                <div className="font-bold text-sky-700">Mobile Friendly</div>
                <div className="text-xs text-gray-500">Responsive UI with Tailwind</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Create Books</h3>
            <p className="text-sm text-gray-600">Create separate books to track independent ledgers for different purposes.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Transactions</h3>
            <p className="text-sm text-gray-600">Add credits and debits quickly with payment mode and descriptions.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View debit vs credit, mode breakdown and balance over time.</p>
          </div>
        </section>

        <section className="mt-16 bg-sky-700 text-white rounded-xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold">Ready to organize your finances?</h2>
            <p className="mt-2 text-sky-100">Sign up in seconds and set up your first book.</p>
            <div className="mt-4">
              <button onClick={() => navigate("/signup")} className="px-6 py-3 bg-white text-sky-700 rounded-lg font-semibold">Create Account</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} Book Manager</div>
          <div className="flex gap-4 text-sm text-gray-500">
            <button onClick={() => navigate("/login")} className="hover:underline">Support</button>
            <button onClick={() => navigate("/login")} className="hover:underline">Privacy</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;