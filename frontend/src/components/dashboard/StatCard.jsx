import React from 'react';

const StatCard = ({ title, value, label, isPrimary }) => {
    return (
        <div className="flex flex-col justify-center">
            <span className={`block text-[28px] font-extrabold leading-tight mb-1 tracking-tight ${isPrimary ? 'text-[#5B4BFF] dark:text-indigo-400' : 'text-[#0f172a] dark:text-white'}`}>
                {value}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-[13px] font-semibold tracking-wide uppercase">{label}</span>
        </div>
    );
};

export default StatCard;
