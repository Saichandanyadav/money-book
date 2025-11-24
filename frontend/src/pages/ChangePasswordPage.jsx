import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { PasswordInput } from "../components/PasswordInput";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) return;
    if (form.newPassword !== form.confirmPassword) {
      window.dispatchEvent(
        new CustomEvent("api-toast", {
          detail: { title: "Mismatch", description: "New passwords do not match." }
        })
      );
      return;
    }
    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white lg:bg-gradient-to-b lg:from-sky-50 lg:to-white p-6">
      <div className="w-full max-w-md lg:bg-white lg:rounded-xl lg:shadow-lg lg:p-8 p-0">
        <h1 className="text-2xl font-bold text-center mb-4">Change Password</h1>

        <div className="flex flex-col gap-3 p-0 lg:p-0">
          <PasswordInput
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={e => setForm({ ...form, currentPassword: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <PasswordInput
            placeholder="New Password"
            value={form.newPassword}
            onChange={e => setForm({ ...form, newPassword: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <PasswordInput
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleChange}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-3 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
