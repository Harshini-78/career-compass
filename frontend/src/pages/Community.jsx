import React, { useState, useEffect } from 'react';
import { Filter, Eye, Trophy, HelpCircle, Check, UserPlus, Users, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import StudyGroupChat from '../components/community/StudyGroupChat';

const Community = () => {
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const [domainFilter, setDomainFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [needsHelpFilter, setNeedsHelpFilter] = useState(false);
    const [alumniFilter, setAlumniFilter] = useState(false);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('network');

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await api.get('domains/');
                setDomains(res.data);
            } catch {
                // handle error or ignore
            }
        };
        fetchDomains();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = 'community/?';
            if (domainFilter) url += `domain=${domainFilter}&`;
            if (yearFilter) url += `year=${yearFilter}&`;
            if (needsHelpFilter) url += `needs_help=true&`;
            if (alumniFilter) url += `alumni=true&`;
            const res = await api.get(url);
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch community", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'network') {
            fetchUsers();
        }
    }, [domainFilter, yearFilter, needsHelpFilter, alumniFilter, activeTab]);

    const handleFollowToggle = async (userId, currentFollowStatus) => {
        try {
            await api.post(`users/${userId}/toggle-follow/`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_followed_by_me: !currentFollowStatus } : u));
        } catch (err) {
            console.error('Failed to toggle follow', err);
        }
    };

    const clearFilters = () => {
        setDomainFilter('');
        setYearFilter('');
        setNeedsHelpFilter(false);
        setAlumniFilter(false);
    };

    const colorPalette = ['bg-indigo-500', 'bg-sky-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
    const badgePalette = [
        'bg-indigo-100 text-indigo-700',
        'bg-sky-100 text-sky-700',
        'bg-rose-100 text-rose-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-purple-100 text-purple-700'
    ];

    const getDeterministicIndex = (str) => {
        if (!str) return 0;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % colorPalette.length;
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full font-inter pb-12 transition-colors">
            <div className="mb-8">
                <h1 className="text-[36px] font-extrabold text-[#0f172a] dark:text-white mb-1.5 tracking-tight">Community Feed</h1>
                <p className="text-gray-500 dark:text-gray-400 text-[16px] font-medium">See how others are progressing and collaborate together</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 mb-8 bg-gray-100 dark:bg-slate-900 shadow-sm p-1.5 rounded-2xl w-fit border border-gray-200 dark:border-slate-800 transition-colors">
                <button
                    onClick={() => setActiveTab('network')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all duration-300 ${activeTab === 'network' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Users size={18} /> Network
                </button>
                <button
                    onClick={() => setActiveTab('forum')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all duration-300 ${activeTab === 'forum' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <MessageSquare size={18} /> Study Forum
                </button>
            </div>

            {activeTab === 'forum' && (
                <div className="mb-8 flex justify-end">
                    <select
                        className="bg-white border border-[#e2e8f0] text-gray-900 text-[14px] font-medium rounded-xl focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 pr-8 appearance-none cursor-pointer shadow-sm w-full sm:w-[250px]"
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                    >
                        <option value="">Global General Chat</option>
                        {domains.map(d => (
                            <option key={d.id} value={d.id}>{d.name} Forum</option>
                        ))}
                    </select>
                </div>
            )}

            {activeTab === 'forum' ? (
                <StudyGroupChat domainId={domainFilter} />
            ) : (
                <>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 mb-10 transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-[#0f172a] dark:text-white font-extrabold text-[18px]">
                                <Filter size={20} className="text-gray-400 dark:text-gray-500" />
                                <span>Find Peers</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                            <div className="w-full md:w-auto flex-1 min-w-[200px]">
                                <label className="block text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Domain</label>
                                <select
                                    className="w-full bg-white border border-[#e2e8f0] text-gray-900 text-[14px] font-medium rounded-[12px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 appearance-none transition-all outline-none cursor-pointer"
                                    value={domainFilter}
                                    onChange={(e) => setDomainFilter(e.target.value)}
                                >
                                    <option value="">All Domains</option>
                                    {domains.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full md:w-auto flex-1 min-w-[150px]">
                                <label className="block text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Year</label>
                                <select
                                    className="w-full bg-white border border-[#e2e8f0] text-gray-900 text-[14px] font-medium rounded-[12px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 appearance-none transition-all outline-none cursor-pointer"
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                >
                                    <option value="">All Years</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>

                            <div className="w-full md:w-auto flex-1 flex flex-col gap-3 pb-2 px-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" checked={needsHelpFilter} onChange={(e) => setNeedsHelpFilter(e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-rose-500 checked:border-rose-500 transition-colors" />
                                        <Check size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                    </div>
                                    <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Needs Help</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" checked={alumniFilter} onChange={(e) => setAlumniFilter(e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-amber-500 checked:border-amber-500 transition-colors" />
                                        <Check size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                    </div>
                                    <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Alumni / Ready</span>
                                </label>
                            </div>

                            <div className="w-full md:w-auto">
                                <button
                                    onClick={clearFilters}
                                    className="w-full md:w-auto bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-6 rounded-xl border border-transparent transition-all text-[14px] active:scale-95 shadow-sm"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-12 text-gray-500 font-medium">Loading community...</div>
                        ) : users.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500 font-medium bg-white rounded-[16px] border border-gray-100">No users found matching your filters.</div>
                        ) : (
                            users.map(user => {
                                const cIdx = getDeterministicIndex(user.username);
                                const isAlumni = user.progress_percentage === 100;
                                const isTop10 = user.rank_percentile <= 10;

                                return (
                                    <div key={user.id} className={`bg-white dark:bg-slate-900 rounded-[20px] shadow-sm hover:shadow-md border p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${isAlumni ? 'border-amber-200 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400' : 'border-gray-100 dark:border-slate-800 hover:border-[#5B4BFF]/30 dark:hover:border-indigo-500/50 hover:-translate-y-1 group'}`}>

                                        {/* Background effect for Top 10% */}
                                        {isTop10 && !isAlumni && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-[100px] pointer-events-none z-0 transition-colors" />}

                                        <div className="flex items-center justify-between mb-5 relative z-10 w-full gap-4">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className={`w-12 h-12 rounded-2xl ${colorPalette[cIdx]} text-white flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0 border border-white/20`}>
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-extrabold text-[16px] text-[#0f172a] dark:text-white mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                                        {user.username}
                                                    </h3>
                                                    <div className="text-gray-500 dark:text-gray-400 text-[13px] font-medium flex items-center gap-2">
                                                        <span className="truncate max-w-[120px]" title={user.college}>{user.college}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0"></span>
                                                        <span className="shrink-0">{user.year}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center">
                                                <button onClick={() => navigate(`/community/profile/${user.id}`)} className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors active:scale-95" title="View Public Profile">
                                                    <Eye size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700`}>
                                                {user.domain || 'N/A'}
                                            </span>
                                            {isAlumni && (
                                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                                                    <Trophy size={12} className="shrink-0" /> Alumni
                                                </span>
                                            )}
                                            {isTop10 && !isAlumni && (
                                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                                                    Top 10%
                                                </span>
                                            )}
                                            {user.needs_help && !isAlumni && (
                                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                                                    <HelpCircle size={12} className="shrink-0" /> Needs Help
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto relative z-10">
                                            <div className="flex justify-between items-end mb-2.5">
                                                <span className="text-gray-600 dark:text-gray-400 font-semibold text-[13px]">Stage {user.stage || 0} / {user.total_stages || 7}</span>
                                                <span className={`font-extrabold text-[15px] ${isAlumni ? 'text-amber-600 dark:text-amber-400' : 'text-[#0f172a] dark:text-white'}`}>{user.progress_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mb-5 overflow-hidden shadow-inner">
                                                <div className={`${isAlumni ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : colorPalette[cIdx]} h-full rounded-full transition-all duration-700`} style={{ width: `${user.progress_percentage}%` }}></div>
                                            </div>

                                            <button
                                                onClick={() => handleFollowToggle(user.id, user.is_followed_by_me)}
                                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[14px] transition-all duration-200 active:scale-95 border ${user.is_followed_by_me ? 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30' : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 hover:bg-[#5B4BFF] hover:dark:bg-indigo-500 hover:text-white hover:border-transparent shadow-sm'}`}
                                            >
                                                {user.is_followed_by_me ? (
                                                    <>Following</>
                                                ) : (
                                                    <><UserPlus size={18} /> Follow</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Community;
