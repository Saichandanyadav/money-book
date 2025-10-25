import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { countryList } from "../utils/currency";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", country: "India" });

  const handleSignup = async () => {
    try {
      await api.post("/auth/signup", form);
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="border p-3 rounded-lg" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-3 rounded-lg" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border p-3 rounded-lg" />
        <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="border p-3 rounded-lg">
          {countryList.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <button onClick={handleSignup} className="px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold">Signup</button>
        <div className="text-center mt-2">
          <button onClick={() => navigate("/login")} className="text-sm text-sky-600">ALREADY HAVE AN ACCOUNT? LOGIN</button>
        </div>
        <button onClick={() => navigate("/")} className="text-sm text-gray-700 underline mt-2">Back to Landing Page</button>
      </div>
    </div>
  );
}
