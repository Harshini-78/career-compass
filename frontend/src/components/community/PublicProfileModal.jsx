import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Lock, GraduationCap, MapPin, Trophy } from 'lucide-react';
import api from '../../services/api';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const PublicProfileModal = ({ userId, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`users/${userId}/profile/`);
                setProfile(res.data);
            } catch (err) {
                setError('Failed to load this user\'s public profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col font-inter animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Student Portfolio</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 flex-1">
                    {loading ? (
                        <div className="py-12 flex justify-center text-gray-400 text-sm font-medium">Loading portfolio...</div>
                    ) : error ? (
                        <div className="py-12 flex justify-center text-red-500 text-sm font-medium">{error}</div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#F8F9FA] to-white p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                        {profile.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="text-2xl font-extrabold text-gray-900">{profile.username}</h1>
                                            {profile.progress_percentage === 100 && (
                                                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-widest">
                                                    <Trophy size={10} /> Alumni
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                                            <span className="flex items-center gap-1.5"><GraduationCap size={16} /> {profile.college}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.year}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="primary" className="mb-2 inline-flex">{profile.domain}</Badge>
                                    <p className="text-sm font-bold text-gray-400">Read-Only View</p>
                                </div>
                            </div>

                            {/* Overall Progress */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="font-bold text-gray-900">Placement Readiness</h3>
                                    <span className="text-gray-900 font-extrabold text-lg">{profile.progress_percentage}%</span>
                                </div>
                                <ProgressBar progress={profile.progress_percentage} color={profile.progress_percentage === 100 ? "bg-amber-400" : "bg-indigo-600"} className="h-3" />
                            </div>

                            {/* Curriculum Flow */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Curriculum Progress</h3>
                                <div className="flex flex-col relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {profile.stages.map((stage, i) => (
                                        <div key={stage.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                                            
                                            {/* Icon */}
                                            <div className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-200 rounded-full shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                {stage.completed ? (
                                                    <CheckCircle size={16} className="text-indigo-600" />
                                                ) : stage.unlocked ? (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                                ) : (
                                                    <Lock size={14} className="text-gray-400" />
                                                )}
                                            </div>
                                            
                                            {/* Card */}
                                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl shadow-sm border border-gray-100 bg-white">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-[11px] font-bold uppercase tracking-widest ${stage.completed ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        Stage {stage.order}
                                                    </span>
                                                    {stage.completed && <Badge variant="success">Completed</Badge>}
                                                </div>
                                                <h4 className={`font-bold text-base mb-3 ${stage.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{stage.title}</h4>
                                                
                                                {/* Skills list */}
                                                {(stage.unlocked || stage.completed) && stage.skills && stage.skills.length > 0 && (
                                                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                                                        {stage.skills.map(skill => (
                                                            <div key={skill.id} className="flex items-start gap-2 text-[13px] font-medium">
                                                                <CheckCircle size={14} className={`mt-0.5 shrink-0 ${skill.completed ? 'text-green-500' : 'text-gray-200'}`} />
                                                                <span className={skill.completed ? 'text-gray-700' : 'text-gray-400'}>{skill.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfileModal;
