import React, { useState, useRef, useEffect } from "react";
import { FaHeadset, FaTimes, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

export default function CustomerSupport() {
    const [showModal, setShowModal] = useState(false);
    const buttonRef = useRef(null);
    const [modalPosition, setModalPosition] = useState({ bottom: 0, right: 0 });

    useEffect(() => {
        if (showModal && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setModalPosition({ bottom: window.innerHeight - rect.top + 10, right: window.innerWidth - rect.right });
        }
    }, [showModal]);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setShowModal(!showModal)}
                className="fixed bottom-6 right-6 bg-sky-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-sky-700 transition duration-200 z-50"
            >
                <FaHeadset className="w-8 h-8" />
            </button>

            {showModal && (
                <div
                    style={{ bottom: modalPosition.bottom, right: modalPosition.right }}
                    className="fixed z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 transition duration-200"
                >
                    <div className="absolute bottom-[-10px] right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                    <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 mb-3">
                        <img src="/AppLogo1.png" alt="Company Logo" className="w-8 h-8" />
                        <h3 className="text-lg font-semibold text-gray-800">Customer Support</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">Reach out with any questions via the following accounts:</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <a href="mailto:saichandhanyadav2002@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-500 transition">
                            <FaEnvelope className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com/in/Saichandanyadav" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                            <FaLinkedin className="w-6 h-6" />
                        </a>
                        <a href="https://github.com/Saichandanyadav" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition">
                            <FaGithub className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
