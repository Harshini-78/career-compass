import React, { useState, useEffect } from 'react';
import { Search, X, ChevronUp, Bookmark, Eye, BookmarkCheck, CheckCircle2, Trophy } from 'lucide-react';
import api from '../services/api';

const SavedQuestions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            let url = `questions/?bookmarked=true&search=${searchQuery}`;
            if (selectedTag) url += `&tag=${selectedTag}`;
            const res = await api.get(url);
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        api.get('profile/').then(res => setCurrentUser(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuestions();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedTag]);

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const [expandedQuestionId, setExpandedQuestionId] = useState(null);

    const toggleQuestion = async (id) => {
        setExpandedQuestionId(expandedQuestionId === id ? null : id);
        if (expandedQuestionId !== id) {
            try {
                await api.get(`questions/${id}/`);
                setTimeout(() => {
                    fetchQuestions();
                }, 500);
            } catch (err) { console.error(err); }
        }
    };

    const handleUpvote = async (e, id) => {
        e.stopPropagation();
        try {
            await api.post(`questions/${id}/upvote/`);
            fetchQuestions();
        } catch (err) { console.error(err); }
    };

    const handleBookmark = async (e, id) => {
        e.stopPropagation();
        try {
            await api.post(`questions/${id}/bookmark/`);
            fetchQuestions();
        } catch (err) { console.error(err); }
    }

    const handleUpvoteReply = async (e, id) => {
        e.stopPropagation();
        try {
            await api.post(`replies/${id}/upvote/`);
            fetchQuestions();
        } catch (err) { console.error(err); }
    }

    const handleMarkBest = async (e, replyId) => {
        e.stopPropagation();
        try {
            await api.post(`replies/${replyId}/best/`);
            fetchQuestions();
        } catch (err) { console.error(err); }
    }

    return (
        <div className="p-6 md:p-8 max-w-[1000px] mx-auto w-full font-inter pb-12 transition-colors">
            <div className="flex flex-col gap-6 mb-10">
                <div>
                    <h1 className="text-[36px] font-extrabold text-[#0f172a] dark:text-white mb-1.5 tracking-tight">Saved Questions</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-[16px] font-medium">Revisit the discussions you've bookmarked</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 mb-8 transition-colors">
                <div className="relative w-full flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="text-gray-400 absolute top-1/2 left-5 -translate-y-1/2" />
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-4 pl-14 transition-all outline-none placeholder:text-gray-400"
                            placeholder="Search your saved questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {selectedTag && (
                        <div className="flex shrink-0 items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-3 rounded-xl font-bold border border-indigo-100 dark:border-indigo-800/50">
                            <span>#{selectedTag}</span>
                            <button onClick={() => setSelectedTag('')} className="hover:text-red-500"><X size={16}/></button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="text-center py-12 text-gray-500 font-medium animate-pulse">Loading saved questions...</div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-medium bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">You haven't saved any questions yet. Bookmark questions in Ask Seniors to see them here!</div>
                ) : (
                    questions.map((q) => (
                        <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 transition-all hover:shadow-md hover:border-[#5B4BFF]/30 dark:hover:border-indigo-500/50 group/card">
                            <div className="cursor-pointer flex gap-5 md:gap-6" onClick={() => toggleQuestion(q.id)}>
                                {/* Upvote Column */}
                                <div className="flex flex-col items-center shrink-0 pt-1">
                                    <button
                                        onClick={(e) => handleUpvote(e, q.id)}
                                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${q.has_upvoted ? 'bg-[#5B4BFF]/10 dark:bg-indigo-500/20 text-[#5B4BFF] dark:text-indigo-400' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                                    >
                                        <ChevronUp size={24} strokeWidth={q.has_upvoted ? 3 : 2.5} className={q.has_upvoted ? 'text-[#5B4BFF] dark:text-indigo-400' : ''} />
                                    </button>
                                    <span className={`text-[16px] font-extrabold mt-2 tracking-tight ${q.has_upvoted ? 'text-[#5B4BFF] dark:text-indigo-400' : 'text-gray-500 dark:text-gray-500'}`}>{q.upvote_count}</span>
                                    
                                    <button onClick={(e) => handleBookmark(e, q.id)} className={`mt-4 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${q.has_bookmarked ? 'bg-[#5B4BFF]/10 dark:bg-indigo-500/20 text-[#5B4BFF] dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                                        {q.has_bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                    </button>
                                </div>

                                {/* Question Content */}
                                <div className="flex-1 w-full min-w-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-tight group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors pr-4">{q.title}</h3>
                                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shrink-0 mt-1">
                                            {q.domain_name}
                                        </span>
                                    </div>
                                    
                                    {q.tags && q.tags.length > 0 && (
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {q.tags.map(tag => (
                                                <span key={tag} onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors">#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-gray-600 dark:text-gray-400 text-[15px] font-medium leading-relaxed mb-6 line-clamp-3">
                                        {q.content}
                                    </p>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-auto gap-4">
                                        <div className="text-gray-500 dark:text-gray-500 text-[13px] font-semibold flex items-center gap-2.5 flex-wrap">
                                            <span className="text-gray-700 dark:text-gray-300">{q.author_name}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0"></span>
                                            <span>{q.author_college || 'Unknown College'}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600 shrink-0"></span>
                                            <span>{formatDate(q.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-[13px]">
                                                <Eye size={16} /> {q.views}
                                            </div>
                                            <div className="flex items-center gap-2 text-[#5B4BFF] dark:text-indigo-400 font-bold text-[14px] bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 group-hover/card:bg-indigo-100 dark:group-hover/card:bg-indigo-500/20 transition-colors">
                                                <span>{q.reply_count} Replies</span>
                                                <span className={`transition-transform duration-300 ${expandedQuestionId === q.id ? 'rotate-90' : ''}`}>&rarr;</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {expandedQuestionId === q.id && q.replies && q.replies.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Mentor Replies ({q.replies.length})</h4>
                                    {q.replies.map(reply => (
                                        <div key={reply.id} className={`${reply.is_best_answer ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700/50' : 'bg-[#F8F9FA] dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700'} rounded-[16px] p-5 border`}>
                                            {reply.is_best_answer && <div className="text-amber-600 dark:text-amber-500 font-bold text-[12px] flex items-center gap-1.5 mb-3 uppercase tracking-wider"><CheckCircle2 size={16}/> Best Answer Selected</div>}
                                            <div className="flex items-center gap-3 mb-3">
                                                {reply.author_photo ? (
                                                    <img src={reply.author_photo} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[12px]">
                                                        {reply.author_name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-bold text-gray-900 dark:text-white text-[15px]">{reply.author_name}</span>
                                                <span className="text-[#10B981] bg-[#10B981]/10 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Senior</span>
                                                {reply.mentor_badge === 'Gold' && <span className="text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider"><Trophy size={10} /> Gold</span>}
                                                {reply.mentor_badge === 'Silver' && <span className="text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider"><Trophy size={10} /> Silver</span>}
                                                {reply.mentor_badge === 'Bronze' && <span className="text-amber-900 bg-amber-50 dark:bg-orange-900/30 dark:text-orange-400 border border-amber-100 dark:border-orange-800/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider"><Trophy size={10} /> Bronze</span>}
                                                <span className="text-gray-400 text-xs ml-auto font-medium">{formatDate(reply.created_at)}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 text-[15px] font-medium leading-relaxed ml-11 mb-4 whitespace-pre-wrap">
                                                {reply.content}
                                            </p>
                                            <div className="ml-11 flex items-center gap-6">
                                                <button onClick={(e) => handleUpvoteReply(e, reply.id)} className={`flex items-center gap-1.5 text-[13px] font-extrabold uppercase tracking-wide transition-colors ${reply.has_upvoted ? 'text-[#5B4BFF] dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                                                    <ChevronUp size={18} strokeWidth={3} /> {reply.upvote_count} Upvotes
                                                </button>
                                                {currentUser && currentUser.username === q.author_name && !reply.is_best_answer && (
                                                    <button onClick={(e) => handleMarkBest(e, reply.id)} className="text-[13px] font-extrabold uppercase tracking-wide text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors flex items-center gap-1.5">
                                                        <CheckCircle2 size={16} /> Mark as Best Answer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {expandedQuestionId === q.id && (!q.replies || q.replies.length === 0) && (
                                <div className="mt-6 pt-6 border-t border-[#e2e8f0] dark:border-slate-700">
                                    <p className="text-gray-500 text-sm font-medium">No replies yet. Check back soon!</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedQuestions;
