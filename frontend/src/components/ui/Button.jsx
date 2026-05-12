import React from 'react';

const Button = ({ children, onClick, className = '', disabled = false, variant = 'primary', size = 'default', type = 'button' }) => {
    const primaryClass = 'bg-[#5B4BFF] text-white hover:bg-[#4939ff] shadow-sm hover:shadow-md hover:shadow-[#5B4BFF]/20 active:bg-[#3b2ddb] border border-transparent';
    const secondaryClass = 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-950 shadow-sm';
    const ghostClass = 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-700';

    const variantClass = variant === 'primary' ? primaryClass : variant === 'ghost' ? ghostClass : secondaryClass;

    const sizeMap = {
        sm: 'px-4 py-2 text-sm rounded-xl',
        default: 'px-6 py-3 text-[15px] rounded-2xl',
        lg: 'px-8 py-4 text-base rounded-2xl'
    };
    const sizeClass = sizeMap[size] || sizeMap.default;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100 shadow-none' : ''} ${variantClass} ${sizeClass} ${className}`}
        >
            {children}
        </button>
    );
};
export default Button;
