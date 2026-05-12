import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: 'bg-[#5B4BFF]/10 text-[#5B4BFF] border border-[#5B4BFF]/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        neutral: 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700',
        locked: 'bg-gray-50 text-gray-400 border border-dashed border-gray-300 dark:bg-slate-900/50 dark:text-gray-500 dark:border-slate-800'
    };

    return (
        <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-md ${variants[variant] || variants.primary} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
