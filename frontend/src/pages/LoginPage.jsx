import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { PasswordInput } from "../components/PasswordInput";
import usePageLoader from "../hooks/usePageLoader";

export default function Login() {
  const navigate = useNavigate();
  const loading = usePageLoader();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard", { replace: true });
      window.history.pushState(null, "", "/dashboard");
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-[60%] h-screen bg-cover bg-center" style={{ backgroundImage: "url('/login.png')" }}></div>
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-6 py-0 h-screen lg:h-auto">
        <div className="w-full max-w-md flex flex-col gap-4">
          <img src="/AppLogo1.png" alt="App Logo" className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
          <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-3 rounded-lg" />
          <PasswordInput placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-3 rounded-lg" />
          <button onClick={handleLogin} className="px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold">Login</button>
          <button onClick={() => navigate("/signup")} className="text-sm text-sky-600 mt-2">DON'T HAVE ANY ACCOUNT? SIGNUP</button>
          <button onClick={() => navigate("/")} className="text-sm text-gray-700 underline mt-2">Back to Landing Page</button>
        </div>
      </div>
    </div>
  );
}
