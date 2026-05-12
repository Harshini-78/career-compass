import React from 'react';

const ProgressBar = ({ progress, className = '' }) => {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2.5 overflow-hidden ${className}`}>
            <div
                className="bg-[#5B4BFF] h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
