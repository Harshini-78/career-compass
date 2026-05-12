import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Rocket, Home, Users, MessageSquare, Settings, LogOut, Bookmark } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('profile/');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load user profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-white dark:bg-slate-950 border-r border-gray-100 dark:border-slate-800 flex flex-col h-screen shrink-0 font-inter py-8 transition-colors">
            <div className="px-8 flex items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5B4BFF]/10 dark:bg-[#5B4BFF]/20 flex items-center justify-center">
                        <Rocket className="text-[#5B4BFF] dark:text-indigo-400" size={24} strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[24px] text-gray-900 dark:text-white tracking-tight">CareerCompass</span>
                </div>
            </div>

            <div className="px-8 mb-10">
                <div className="flex flex-col gap-1 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/60">
                    <span className="font-bold text-gray-900 dark:text-white text-[15px] truncate">{user ? user.username : 'Loading...'}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[13px] font-medium truncate">
                        {user ? user.email : 'mentor@college.edu'}
                    </span>
                    {(!user || user?.role === 'senior') && (
                        <div className="mt-2 text-left">
                            <span className="bg-[#5B4BFF]/10 text-[#5B4BFF] dark:bg-indigo-900/30 dark:text-indigo-300 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                                Senior Mentor
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-5 flex flex-col gap-2.5 overflow-y-auto">
                <div className="px-3 mb-2">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menu</span>
                </div>
                {[
                    { to: '/dashboard', icon: Home, label: 'Dashboard' },
                    { to: '/community', icon: Users, label: 'Community' },
                    { to: '/ask-seniors', icon: MessageSquare, label: 'Ask Seniors' },
                    { to: '/saved', icon: Bookmark, label: 'Saved Questions' },
                    { to: '/profile', icon: Settings, label: 'Settings' }
                ].map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all relative group ${isActive
                                ? 'text-[#5B4BFF] dark:text-indigo-400 bg-[#5B4BFF]/5 dark:bg-indigo-500/10'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#5B4BFF] rounded-r-full" />
                                )}
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors ${isActive ? 'text-[#5B4BFF] dark:text-indigo-400' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-5 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
                >
                    <LogOut size={20} className="group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
