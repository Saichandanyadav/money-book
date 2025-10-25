import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard", { replace: true });
      window.history.pushState(null, "", "/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-3 rounded-lg" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border p-3 rounded-lg" />
        <button onClick={handleLogin} className="px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold">Login</button>
        <div className="text-center mt-2">
          <button onClick={() => navigate("/signup")} className="text-sm text-sky-600">DON'T HAVE ANY ACCOUNT? SIGNUP</button>
        </div>
        <button onClick={() => navigate("/")} className="text-sm text-gray-700 underline mt-2">Back to Landing Page</button>
      </div>
    </div>
  );
}
