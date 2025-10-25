import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      // backend will return appropriate toast; still do a quick guard
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      // show a local toast via the same event so UX is immediate
      window.dispatchEvent(new CustomEvent("api-toast", { detail: { title: "Mismatch", description: "New passwords do not match." } }));
      return;
    }
    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      // backend will emit a toast via interceptor; navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      // error toasts are emitted via interceptor; no extra UI needed here
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-4">Change Password</h1>
        <div className="flex flex-col gap-3">
          <input type="password" placeholder="Current Password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} className="border p-3 rounded-lg" />
          <input type="password" placeholder="New Password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} className="border p-3 rounded-lg" />
          <input type="password" placeholder="Confirm New Password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="border p-3 rounded-lg" />
          <div className="flex gap-2 mt-2">
            <button onClick={handleChange} disabled={loading} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold">
              {loading ? "Saving..." : "Change Password"}
            </button>
            <button onClick={() => navigate(-1)} className="px-4 py-3 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;