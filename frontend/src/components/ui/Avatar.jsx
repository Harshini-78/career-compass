import React from 'react';

const Avatar = ({ name, size = 'md', className = '' }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-16 h-16 text-xl'
    };

    <div className={`flex items-center justify-center rounded-2xl bg-[#5B4BFF]/10 text-[#5B4BFF] dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold shadow-sm border border-[#5B4BFF]/20 dark:border-indigo-500/20 ${sizes[size]} shrink-0 ${className}`}>
        {initial}
    </div>
};

export default Avatar;
