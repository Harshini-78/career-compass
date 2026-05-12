import React from 'react';

const Card = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200 ${onClick ? 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
