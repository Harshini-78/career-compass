import React, { useState, useEffect } from 'react';
import { Check, Lock, TrendingUp, MessageCircle, ChevronUp, Users, CheckCircle, Rocket } from 'lucide-react';
import api from '../services/api';
import StageCard from '../components/dashboard/StageCard';
import StatCard from '../components/dashboard/StatCard';
import ProgressBar from '../components/dashboard/ProgressBar';
import LeaderboardPreview from '../components/dashboard/LeaderboardPreview';
import ConnectionsPreview from '../components/dashboard/ConnectionsPreview';
import RoadmapSuggestion from '../components/dashboard/RoadmapSuggestion';
import AlertModal from '../components/ui/AlertModal';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [mentorData, setMentorData] = useState(null);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '' });

    const fetchDashboard = async () => {
        try {
            const res = await api.get('dashboard/');
            setData(res.data);
            if (res.data.user_role === 'senior') {
                try {
                    const mentorRes = await api.get('mentor/dashboard/');
                    setMentorData(mentorRes.data);
                } catch (mentorErr) {
                    console.error("Failed to load mentor info", mentorErr);
                }
            }
            setError(null);
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.error === 'No domain selected') {
                fetchDomains();
            } else {
                setError('Failed to load dashboard.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchDomains = async () => {
        try {
            const res = await api.get('domains/');
            setDomains(res.data);
        } catch {
            setError('Failed to load domains.');
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleSelectDomain = async (domainId) => {
        try {
            await api.post('domains/select/', { domain_id: domainId });
            setLoading(true);
            fetchDashboard();
        } catch {
            setError('Failed to select domain.');
        }
    };

    const handleToggleSkill = async (skillId, completed) => {
        try {
            const res = await api.post(`skills/${skillId}/toggle/`, { completed });
            if (res.data.stage_completed) {
                // If it completed the stage, show the popup
                setAlertModal({
                    isOpen: true,
                    title: "Congratulations!!",
                    message: "You have successfully completed this stage! Keep up the great work."
                });
            }
            fetchDashboard(); // Refresh data to show new progress
        } catch {
            setError('Failed to update skill progress.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) return <div className="p-8 text-gray-500 font-medium h-full flex items-center justify-center">Loading dashboard...</div>;

    if (!data && domains.length > 0) {
        return (
            <div className="max-w-[1000px] w-full">
                <div className="bg-white dark:bg-slate-900 rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-8 text-center transition-colors">
                    <h2 className="text-[28px] font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Select Your Domain</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Choose a specialization to begin your journey. You can only choose once.</p>
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-[12px] mb-6 text-sm font-medium border border-red-100 dark:border-red-900/50">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {domains.map(d => (
                            <div key={d.id} className="border border-gray-100 dark:border-slate-800 hover:border-[#5B4BFF] dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-[#5B4BFF]/5 rounded-2xl transition-all duration-300 p-6 cursor-pointer bg-white dark:bg-slate-900 group" onClick={() => handleSelectDomain(d.id)}>
                                <h3 className="text-lg font-extrabold text-[#0f172a] dark:text-white mb-4 group-hover:text-[#5B4BFF] dark:group-hover:text-indigo-400 transition-colors">{d.name}</h3>
                                <button className="w-full justify-center bg-gray-50 dark:bg-slate-800 group-hover:bg-[#5B4BFF] dark:group-hover:bg-indigo-500 text-gray-700 dark:text-gray-300 group-hover:text-white font-bold py-3 rounded-xl transition-all duration-300 text-[14px]">Select {d.name}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        if (domains.length === 0 && !error) {
            return (
                <div className="p-8 text-center flex flex-col items-center justify-center h-[50vh]">
                    <h2 className="text-[24px] font-extrabold text-gray-900 dark:text-white mb-2">Roadmaps Not Found</h2>
                    <p className="text-gray-500 font-medium">The career domains have not been populated in the database yet. If you just deployed, please wait for the setup script to finish or ask an admin to run the population script.</p>
                </div>
            );
        }
        return <div className="p-8 text-red-600 font-medium flex items-center justify-center h-full">{error || 'Something went wrong.'}</div>;
    }

    // Derived values for dashboard display
    const firstIncompleteStage = data.stages.find(s => !s.completed);
    const currentStageOrder = firstIncompleteStage ? firstIncompleteStage.order : data.total_stages;
    const isStageUnlocked = (stage) => stage.unlocked && !stage.completed;

    const handleReplySubmit = async (e, questionId) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        try {
            await api.post(`questions/${questionId}/reply/`, { content: replyContent });
            setReplyingTo(null);
            setReplyContent('');
            fetchDashboard();
        } catch (err) {
            console.error("Failed to post reply", err);
        }
    };

    if (data?.user_role === 'senior' && mentorData) {
        return (
            <div className="max-w-[1200px] w-full mx-auto font-inter pb-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[36px] font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">Mentorship Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-[16px] font-medium flex items-center gap-2">
                            <span>Guiding students in</span>
                            <span className="bg-[#EEF2FF] dark:bg-indigo-900/40 text-[#5B4BFF] dark:text-indigo-300 px-3 py-1 rounded-full text-[13px] font-bold">
                                {mentorData.domain}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Impact Overview */}
                <h2 className="text-[15px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Impact Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <div className="bg-white dark:bg-slate-900 rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden group hover:border-[#5B4BFF]/30 dark:hover:border-[#5B4BFF]/50 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#5B4BFF]/5 dark:bg-[#5B4BFF]/10 rounded-bl-[100px] -z-10 group-hover:bg-[#5B4BFF]/10 dark:group-hover:bg-[#5B4BFF]/20 transition-colors"></div>
                        <div className="w-10 h-10 rounded-[10px] bg-[#EEF2FF] dark:bg-indigo-900/40 text-[#5B4BFF] dark:text-indigo-400 flex items-center justify-center mb-4">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[32px] font-extrabold text-[#0f172a] dark:text-white leading-none mb-1 block">{mentorData.students_helped}</span>
                        <p className="text-gray-500 dark:text-gray-400 text-[14px] font-medium">Students Helped</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden group hover:border-[#10B981]/30 dark:hover:border-[#10B981]/50 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/5 dark:bg-[#10B981]/10 rounded-bl-[100px] -z-10 group-hover:bg-[#10B981]/10 dark:group-hover:bg-[#10B981]/20 transition-colors"></div>
                        <div className="w-10 h-10 rounded-[10px] bg-[#ECFDF5] dark:bg-emerald-900/40 text-[#10B981] dark:text-emerald-400 flex items-center justify-center mb-4">
                            <CheckCircle size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[32px] font-extrabold text-[#0f172a] dark:text-white leading-none mb-1 block">{mentorData.total_answers || 0}</span>
                        <p className="text-gray-500 dark:text-gray-400 text-[14px] font-medium">Answers Provided</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden group hover:border-[#F59E0B]/30 dark:hover:border-[#F59E0B]/50 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 rounded-bl-[100px] -z-10 group-hover:bg-[#F59E0B]/10 dark:group-hover:bg-[#F59E0B]/20 transition-colors"></div>
                        <div className="w-10 h-10 rounded-[10px] bg-[#FEF3C7] dark:bg-amber-900/40 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mb-4">
                            <ChevronUp size={24} strokeWidth={3} />
                        </div>
                        <span className="text-[32px] font-extrabold text-[#0f172a] dark:text-white leading-none mb-1 block">{mentorData.upvotes_received || 0}</span>
                        <p className="text-gray-500 dark:text-gray-400 text-[14px] font-medium">Total Upvotes</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-6 relative overflow-hidden group hover:border-[#F43F5E]/30 dark:hover:border-[#F43F5E]/50 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F43F5E]/5 dark:bg-[#F43F5E]/10 rounded-bl-[100px] -z-10 group-hover:bg-[#F43F5E]/10 dark:group-hover:bg-[#F43F5E]/20 transition-colors"></div>
                        <div className="w-10 h-10 rounded-[10px] bg-[#FFF1F2] dark:bg-rose-900/40 text-[#F43F5E] dark:text-rose-400 flex items-center justify-center mb-4">
                            <MessageCircle size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[32px] font-extrabold text-[#0f172a] dark:text-white leading-none mb-1 block">{mentorData.questions_to_answer}</span>
                        <p className="text-gray-500 dark:text-gray-400 text-[14px] font-medium">Pending Questions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Action Feed */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-bold text-[#0f172a] dark:text-white tracking-tight">Recent Opportunities to Help</h2>
                            <span className="text-sm font-medium text-[#5B4BFF] dark:text-indigo-400 bg-[#EEF2FF] dark:bg-indigo-900/40 px-3 py-1 rounded-full">{mentorData.recent_questions.length} New</span>
                        </div>

                        <div className="flex flex-col gap-5">
                            {mentorData.recent_questions.length > 0 ? mentorData.recent_questions.map((q) => (
                                <div key={q.id} className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-[16px] p-6 hover:shadow-[0px_4px_20px_rgba(0,0,0,0.04)] dark:hover:border-slate-700 transition-all flex gap-5">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center bg-[#F8F9FA] dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700">
                                            <ChevronUp size={24} strokeWidth={3} />
                                        </div>
                                        <span className="text-[14px] font-bold mt-1.5 text-gray-500 dark:text-gray-400">{q.upvote_count || 0}</span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight pr-4">{q.title}</h3>
                                            <span className="text-[12px] font-medium text-gray-400 whitespace-nowrap">{formatDate(q.created_at)}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed mb-5 line-clamp-2">
                                            {q.content}
                                        </p>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-auto border-t border-gray-100 dark:border-slate-800 pt-4 gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-600 dark:to-purple-600 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-white">
                                                    {q.is_anonymous ? 'A' : q.author_name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-gray-600 dark:text-gray-400 text-[13px] font-medium">
                                                    {q.is_anonymous ? 'Anonymous Student' : `${q.author_name} • ${q.author_college || 'Unknown College'}`}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                                                className="bg-[#0f172a] dark:bg-slate-800 hover:bg-[#1e293b] dark:hover:bg-slate-700 text-white text-[13px] font-semibold py-2 px-4 rounded-[8px] transition-colors w-full sm:w-auto text-center"
                                            >
                                                {replyingTo === q.id ? 'Cancel' : 'Write Answer'}
                                            </button>
                                        </div>
                                        {replyingTo === q.id && (
                                            <div className="mt-5 pt-5 border-t border-[#e2e8f0] dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <form onSubmit={(e) => handleReplySubmit(e, q.id)}>
                                                    <textarea
                                                        className="w-full bg-[#FCFDFE] dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-[12px] p-4 text-[14px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] outline-none mb-3 resize-none shadow-inner"
                                                        rows="4"
                                                        placeholder="Share your experience and advice..."
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        required
                                                    ></textarea>
                                                    <div className="flex justify-end">
                                                        <button type="submit" className="bg-[#5B4BFF] hover:bg-[#4939ff] shadow-[0px_4px_14px_rgba(91,75,255,0.25)] text-white text-[14px] font-semibold py-2.5 px-6 rounded-[8px] transition-all">
                                                            Post Answer
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-[16px] p-10 text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle size={32} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Inbox Zero!</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">There are no pending questions in {mentorData.domain} right now.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Tips / Meta Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[16px] p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mt-10 -mr-10"></div>
                            <h3 className="text-[18px] font-bold mb-4 flex items-center gap-2">
                                <Rocket size={20} className="text-[#A78BFA]" />
                                Mentorship Best Practices
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[12px] font-bold text-[#A78BFA]">1</span>
                                    </div>
                                    <p className="text-[13px] text-gray-300 leading-relaxed"><strong>Be specific.</strong> Students value actionable steps over abstract theory.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[12px] font-bold text-[#A78BFA]">2</span>
                                    </div>
                                    <p className="text-[13px] text-gray-300 leading-relaxed"><strong>Share failures.</strong> Hearing about your early struggles makes you more relatable.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[12px] font-bold text-[#A78BFA]">3</span>
                                    </div>
                                    <p className="text-[13px] text-gray-300 leading-relaxed"><strong>Link resources.</strong> If there's an article that helped you, paste the URL!</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] w-full mx-auto font-inter pb-12 transition-colors">

            <div className="mb-10">
                <h1 className="text-[36px] font-extrabold text-[#0f172a] dark:text-white mb-1.5 tracking-tight">Welcome back!</h1>
                <p className="text-gray-500 dark:text-gray-400 text-[16px] font-medium flex items-center gap-2">
                    <span>Continue your journey in</span>
                    <span className="bg-[#EEF2FF] dark:bg-indigo-900/40 text-[#5B4BFF] dark:text-indigo-300 px-3 py-1 rounded-full text-[13px] font-bold">
                        {data.domain}
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

                {/* Overall Progress Card */}
                <div className="md:col-span-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800/80 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-extrabold text-[#0f172a] dark:text-white text-[20px] tracking-tight">Overall Progress</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Track your domain mastery</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[#5B4BFF]/10 dark:bg-indigo-900/40 flex items-center justify-center">
                            <Rocket className="text-[#5B4BFF] dark:text-indigo-400" size={24} />
                        </div>
                    </div>

                    <div className="mb-6 mt-auto">
                        <ProgressBar
                            currentStage={currentStageOrder}
                            totalStages={data.total_stages}
                            percentage={data.progress_percentage}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2">
                        <StatCard title="Completed" value={data.completed_stages} label="Completed" isPrimary={false} />
                        <StatCard title="In Progress" value={data.unlocked_stages - data.completed_stages} label="In Progress" isPrimary={true} />
                        <StatCard title="Remaining" value={data.remaining_stages} label="Remaining" isPrimary={false} />
                    </div>
                </div>

                {/* Leaderboard Snapshot Card */}
                <div className="md:col-span-3">
                    <LeaderboardPreview />
                </div>

                {/* Connections Snapshot Card */}
                <div className="md:col-span-3">
                    <ConnectionsPreview />
                </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-r from-gray-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 rounded-3xl shadow-lg shadow-gray-900/10 dark:shadow-none border border-slate-700/50 p-8 flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#5B4BFF]/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shrink-0">
                        <TrendingUp size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-white text-[20px] mb-1.5 tracking-tight">Keep the momentum going!</h3>
                        <p className="text-gray-300 text-[15px] font-medium leading-relaxed">
                            Complete the next stage to reach {Math.min(100, data.progress_percentage + Math.round((1 / data.total_stages) * 100))}% overall progress.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white hover:bg-gray-50 text-gray-900 active:scale-95 font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm whitespace-nowrap relative z-10"
                >
                    View Next Stage
                </button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 id="roadmap-section" className="text-[24px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Your {data.total_stages}-Stage Roadmap</h2>
            </div>

            <div className="flex flex-col gap-3">
                {data.stages.map((stage) => (
                    <StageCard
                        key={stage.id}
                        stage={stage}
                        isUnlocked={isStageUnlocked(stage)}
                        isCompleted={stage.completed}
                        onToggleSkill={handleToggleSkill}
                    />
                ))}
            </div>

            <div className="mt-8">
                <RoadmapSuggestion domain={data.domain} />
            </div>

            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
                title={alertModal.title}
                message={alertModal.message}
            />
        </div>
    );
};

export default Dashboard;
