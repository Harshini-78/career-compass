import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, GraduationCap, Github, Linkedin, Link as LinkIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicProfile = async () => {
            try {
                // We'll use the profile endpoint with an ID or create a public profile fetcher
                const res = await api.get(`users/${id}/profile/`);
                setProfile(res.data);
            } catch (err) {
                setError('Failed to load this profile or it does not exist.');
            } finally {
                setLoading(false);
            }
        };
        fetchPublicProfile();
    }, [id]);

    if (loading) return <div className="p-8 text-gray-500 font-medium tracking-tight h-full flex items-center justify-center">Loading profile...</div>;

    if (error || !profile) return (
        <div className="p-8 max-w-2xl mx-auto w-full mt-10">
            <Button variant="ghost" onClick={() => navigate('/community')} className="mb-4 text-gray-500"><ArrowLeft size={16} className="mr-2" /> Back to Community</Button>
            <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">{error || "User not found."}</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full font-inter space-y-6">
            <Button variant="ghost" onClick={() => navigate('/community')} className="mb-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white -ml-2">
                <ArrowLeft size={16} className="mr-2" /> Back to Community
            </Button>

            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-900"></div>

                <div className="px-8 pb-8">
                    <div className="flex justify-between items-start">
                        <div className="-mt-16 mb-4 flex gap-6 items-end relative">
                            {profile.profile_photo ? (
                                <img src={profile.profile_photo} alt={profile.username} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover bg-white" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl text-gray-400 font-bold shadow-sm">
                                    {profile.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-none mb-2">{profile.username}</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-[15px] font-medium mb-3">
                            {profile.college || 'No college listed'} • {profile.year || 'No year specified'}
                        </p>
                        <div className="flex items-center gap-3">
                            <Badge variant="neutral" className="capitalize px-3 py-1 font-semibold">{profile.role}</Badge>
                            {profile.domain && <Badge variant="primary" className="px-3 py-1 font-semibold">{profile.domain}</Badge>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                    {/* About Section */}
                    {(profile.about) && (
                        <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-5">About</h2>
                            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {profile.about}
                            </p>
                        </Card>
                    )}

                    {/* Experience Section */}
                    {profile.experience?.length > 0 && (
                        <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-6">Experience</h2>
                            <div className="space-y-6">
                                {profile.experience.map((exp, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-[#F8F9FA] dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-700">
                                            <span className="font-bold text-gray-400 text-xl">{exp.company?.charAt(0) || 'E'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">{exp.title}</h3>
                                            <p className="text-[14px] text-gray-700 dark:text-gray-300 font-medium">{exp.company}</p>
                                            <p className="text-[13px] text-gray-500 mb-2">{exp.duration}</p>
                                            <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Education Section */}
                    {profile.education?.length > 0 && (
                        <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-6">Education</h2>
                            <div className="space-y-5">
                                {profile.education.map((edu, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-[#F8F9FA] dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-700 text-gray-400">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">{edu.school}</h3>
                                            <p className="text-[14px] text-gray-700 dark:text-gray-300 font-medium">{edu.degree}</p>
                                            <p className="text-[13px] text-gray-500">{edu.duration}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Achievements Section */}
                    {profile.achievements?.length > 0 && (
                        <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-6">Achievements</h2>
                            <div className="space-y-5">
                                {profile.achievements.map((ach, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-[#F8F9FA] dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-700 text-gray-400">
                                            <CheckCircle2 size={24} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">{ach.title}</h3>
                                            <p className="text-[14px] text-gray-700 dark:text-gray-300 font-medium">{ach.issuer}</p>
                                            <p className="text-[13px] text-gray-500">{ach.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                </div>

                {/* Sidebar Columns */}
                <div className="space-y-6">

                    {/* Profile Statistics Card */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors bg-gradient-to-br from-[#5B4BFF]/5 to-purple-500/5">
                        <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-5">Profile Statistics</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-[14px]">Reputation Points</span>
                                <span className="text-[15px] font-bold text-[#5B4BFF]">{profile.reputation_points || 0}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-[14px]">Questions Asked</span>
                                <span className="text-[15px] font-bold text-gray-900 dark:text-white">{profile.questions_count || 0}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-[14px]">Answers Given</span>
                                <span className="text-[15px] font-bold text-gray-900 dark:text-white">{profile.replies_count || 0}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-[14px]">Best Answers</span>
                                <span className="text-[15px] font-bold text-amber-500">{profile.best_answers_count || 0}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Skills Section */}
                    {profile.skills?.length > 0 && (
                        <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-5">Skills</h2>
                            <div className="flex flex-wrap gap-2.5">
                                {profile.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-[#F8F9FA] dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3.5 py-2 rounded-xl text-[14px] font-bold border border-gray-200 dark:border-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Interests Section */}
                    {profile.interests?.length > 0 && (
                        <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-5">Interests</h2>
                            <div className="flex flex-wrap gap-2.5">
                                {profile.interests.map((interest, idx) => (
                                    <span key={idx} className="bg-[#F8F9FA] dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3.5 py-2 rounded-xl text-[14px] font-bold border border-gray-200 dark:border-slate-700">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Social Links Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-5">Contact & Links</h2>
                        <div className="space-y-4">
                            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><Mail size={16} className="text-gray-400" /> {profile.email}</a>
                            {profile.social_links?.github && <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><Github size={16} className="text-gray-400" /> GitHub Profile</a>}
                            {profile.social_links?.linkedin && <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><Linkedin size={16} className="text-gray-400" /> LinkedIn Profile</a>}
                            {profile.social_links?.portfolio && <a href={profile.social_links.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><LinkIcon size={16} className="text-gray-400" /> Portfolio / Website</a>}
                        </div>
                    </Card>

                </div>
            </div>
            <div className="h-6"></div>
        </div>
    );
};

export default PublicProfile;
