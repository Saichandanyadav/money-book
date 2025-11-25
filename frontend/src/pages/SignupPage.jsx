import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { PasswordInput } from "../components/PasswordInput";
import useCurrencyData from "../hooks/useCurrencyData";

export default function Signup() {
  const navigate = useNavigate();
  const { countries, isLoading } = useCurrencyData();
  const [form, setForm] = useState({ username: "", email: "", password: "", country: "India" });

  const showToast = (title, description) => {
    window.dispatchEvent(new CustomEvent("api-toast", { detail: { title, description } }));
  };

  const handleSignup = async () => {
    if (!form.username || !form.email || !form.password || !form.country) {
      showToast("Missing Fields", "Please fill all the required fields.");
      return;
    }
    try {
      await api.post("/auth/signup", form);
      navigate("/login", { replace: true });
    } catch (error) {
      
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-[60%] h-screen bg-cover bg-center" style={{ backgroundImage: "url('/signup.png')" }} />
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-6 py-12 h-screen lg:h-auto">
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="flex justify-center mb-2">
            <img src="/AppLogo1.png" alt="Logo" className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">Signup</h1>
          <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="border p-3 rounded-lg" />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-3 rounded-lg" />
          <PasswordInput placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-3 rounded-lg" />
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="border p-3 rounded-lg">
            {countries.map((country) => (<option key={country} value={country}>{country}</option>))}
          </select>
          <button onClick={handleSignup} className="px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold">Signup</button>
          <button onClick={() => navigate("/login")} className="text-sm text-sky-600 mt-2">ALREADY HAVE AN ACCOUNT? LOGIN</button>
          <button onClick={() => navigate("/")} className="text-sm text-gray-700 underline mt-2">Back to Landing Page</button>
        </div>
      </div>
    </div>
  );
}
