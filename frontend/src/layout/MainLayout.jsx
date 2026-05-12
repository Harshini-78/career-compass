import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Rocket } from 'lucide-react';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#F8F9FC] dark:bg-slate-950 h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-inter transition-colors">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <Rocket className="text-[#5B4BFF] dark:text-indigo-400" size={20} />
                        <span className="font-extrabold text-[20px] tracking-tight">CareerCompass</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
                        <Menu size={24} />
                    </button>
                </div>
                
                <main className="flex-1 py-8 px-4 sm:px-8 lg:px-16 lg:py-12 min-h-max">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
