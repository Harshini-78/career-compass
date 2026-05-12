import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="flex bg-[#F8F9FC] dark:bg-slate-950 h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-inter transition-colors">
            <Sidebar />
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <main className="min-h-full py-12 px-8 lg:px-16">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
