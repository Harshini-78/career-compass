import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const getTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('leaderboard')) return 'Leaderboard';
        if (path.includes('community')) return 'Community';
        if (path.includes('profile')) return 'Profile';
        if (path.includes('ask-seniors')) return 'Ask Seniors';
        return 'CareerCompass';
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('notifications/');
            setNotifications(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleMarkRead = async (id) => {
        try {
            await api.post(`notifications/${id}/read/`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) { console.error(err); }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.post('notifications/read-all/');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) { console.error(err); }
    };

    const handleNotificationClick = (n) => {
        if (!n.is_read) handleMarkRead(n.id);
        setShowDropdown(false);
        if (n.link) navigate(n.link);
    };

    return (
        <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between px-8 z-20 sticky top-0 shrink-0 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{getTitle()}</h2>

            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    )}
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-gray-900 dark:text-white text-[15px]">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={handleMarkAllRead} className="text-xs font-bold text-[#5B4BFF] hover:text-[#4939ff] flex items-center gap-1 transition-colors">
                                    <CheckCheck size={14} /> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[360px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm font-medium text-gray-500">No notifications yet.</div>
                            ) : (
                                <div className="flex flex-col">
                                    {notifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            onClick={() => handleNotificationClick(n)}
                                            className={`p-4 border-b border-gray-50 dark:border-slate-800/50 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/80 ${n.is_read ? 'opacity-70' : 'bg-[#5B4BFF]/5 dark:bg-indigo-900/10'}`}
                                        >
                                            <div className="flex gap-3">
                                                {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#5B4BFF] mt-1.5 shrink-0 shadow-sm" />}
                                                <div>
                                                    <p className="text-[14px] text-gray-800 dark:text-gray-200 leading-snug">{n.message}</p>
                                                    <p className="text-[12px] text-gray-400 mt-2 font-medium">{new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
