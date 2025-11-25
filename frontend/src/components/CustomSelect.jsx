import React, { useState, useRef, useEffect } from "react";

export default function CustomSelect({ name, options, value, onChange, placeholder, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  
  const handleSelect = (val) => {
    onChange({ target: { name: name, value: val } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="flex flex-col relative" ref={ref}>
      {label && <label htmlFor={name} className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
      <button
        id={name}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm text-left flex justify-between items-center bg-white transition duration-150 ease-in-out hover:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
      >
        <span className={`${!selectedOption ? 'text-gray-400' : 'text-gray-700'}`}>
          {selectedOption ? selectedOption.label : (placeholder || "Select an option")}
        </span>
        <span className="ml-2 text-gray-500 transform transition-transform duration-200">
          <svg className={`w-4 h-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg animate-fade-in">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`p-3 hover:bg-sky-100 cursor-pointer text-sm transition duration-100 ${opt.value === value ? "bg-sky-50 font-semibold text-sky-700" : "text-gray-700"}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}