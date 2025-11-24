import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import usePageLoader from "../hooks/usePageLoader";

export default function SupportPage() {
  const navigate = useNavigate();
  const loading = usePageLoader();

  const contacts = [
    { name: "Email", link: "mailto:saichandhanyadav2002@gmail.com", icon: <FaEnvelope className="text-white" />, bgColor: "bg-red-500" },
    { name: "GitHub", link: "https://github.com/saichandanyadav", icon: <FaGithub className="text-white" />, bgColor: "bg-gray-800" },
    { name: "LinkedIn", link: "https://linkedin.com/in/saichandanyadav", icon: <FaLinkedin className="text-white" />, bgColor: "bg-blue-700" },
    { name: "Twitter", link: "https://twitter.com/saichandanyadav", icon: <FaTwitter className="text-white" />, bgColor: "bg-sky-400" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-start px-4 py-12 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition text-sm"
      >
        ← Back
      </button>
      <div className="flex flex-col items-center mt-12 mb-12">
        <img src="/AppLogo1.png" alt="Support Avatar" className="w-24 h-24 rounded-full mb-3 shadow-lg sm:w-20 sm:h-20" />
        <h1 className="text-3xl font-extrabold text-sky-800 mb-2 sm:text-2xl">Contact Support</h1>
        <p className="text-gray-600 max-w-md text-center text-base sm:text-sm">Have questions or need help? Reach out via email or connect on GitHub, LinkedIn, or Twitter.</p>
      </div>
      <div className="flex justify-center gap-6 flex-wrap w-full max-w-md">
        {contacts.map((contact) => (
          <a key={contact.name} href={contact.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-1 transition transform hover:scale-105">
            <div className={`w-16 h-16 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${contact.bgColor} shadow-md`}>
              {React.cloneElement(contact.icon, { size: 20 })}
            </div>
            <span className="text-gray-700 font-semibold text-base sm:text-xs">{contact.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
