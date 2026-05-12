import React, { useEffect, useState } from 'react';
import { PartyPopper, X } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, message, title = "Congratulations!" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300); // Wait for transition
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                onClick={onClose}
            ></div>
            
            <div className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-16 h-16 bg-[#EEF2FF] text-[#5B4BFF] rounded-full flex items-center justify-center mb-5 relative">
                        <PartyPopper size={32} strokeWidth={2.5} />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-[#0f172a] mb-2">{title}</h3>
                    <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
                        {message}
                    </p>

                    <button 
                        onClick={onClose}
                        className="w-full bg-[#5B4BFF] hover:bg-[#4F46E5] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
                    >
                        Continue Journey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
