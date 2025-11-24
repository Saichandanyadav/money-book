import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function PasswordInput({ value, onChange, placeholder, className, id }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const inputType = showPassword ? "text" : "password";
  const Icon = showPassword ? FiEyeOff : FiEye;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} pr-10 w-full`}
        id={id}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <Icon size={20} />
      </button>
    </div>
  );
}