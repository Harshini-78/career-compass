import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProgressBar from '../components/ui/ProgressBar';
import { Eye, EyeOff, Save, User as UserIcon, Mail, GraduationCap, Calendar, CheckCircle2, Edit2, X, Plus, Trash2, Github, Linkedin, Link as LinkIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        college: '',
        year: '',
        is_progress_public: true,
        needs_help: false,
        profile_photo: '',
        about: '',
        skills: [],
        education: [],
        experience: [],
        achievements: [],
        interests: [],
        social_links: { github: '', linkedin: '', portfolio: '' }
    });

    // Edit Modes for Sections
    const [editMode, setEditMode] = useState({
        header: false,
        about: false,
        skills: false,
        education: false,
        experience: false,
        achievements: false,
        interests: false,
        socials: false,
    });

    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('profile/');
                setProfile(res.data);
                setFormData({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    college: res.data.college || '',
                    year: res.data.year || '1st Year',
                    is_progress_public: res.data.is_progress_public,
                    needs_help: res.data.needs_help || false,
                    profile_photo: res.data.profile_photo || '',
                    about: res.data.about || '',
                    skills: res.data.skills || [],
                    education: res.data.education || [],
                    experience: res.data.experience || [],
                    achievements: res.data.achievements || [],
                    interests: res.data.interests || [],
                    social_links: res.data.social_links || { github: '', linkedin: '', portfolio: '' }
                });
            } catch {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, social_links: { ...prev.social_links, [name]: value } }));
    };

    // Generic Handlers for arrays like skills, interests, achievements
    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleAddArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultValue] }));
    };

    const handleRemoveArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    // Specific handlers for object arrays (education, experience)
    const handleObjArrayChange = (field, index, subfield, value) => {
        const newArray = [...formData[field]];
        newArray[index][subfield] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleToggleEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCancelEdit = (section) => {
        // Reset specific section data from profile
        if (section === 'socials') {
            setFormData(prev => ({ ...prev, social_links: profile.social_links || { github: '', linkedin: '', portfolio: '' } }));
        } else if (['skills', 'education', 'experience', 'achievements', 'interests'].includes(section)) {
            setFormData(prev => ({ ...prev, [section]: profile[section] || [] }));
        } else {
            setFormData(prev => ({ ...prev, [section]: profile[section] || '' }));
            if (section === 'header') {
                setFormData(prev => ({
                    ...prev,
                    username: profile.username || '',
                    college: profile.college || '',
                    year: profile.year || '',
                    profile_photo: profile.profile_photo || ''
                }));
            }
        }
        handleToggleEdit(section);
    };

    const handleSave = async (section) => {
        setSaving(true);
        setError(null);
        setSaveSuccess('');
        try {
            const res = await api.patch('profile/', formData);
            setProfile(prev => ({ ...prev, ...formData }));
            setSaveSuccess(`Updated ${section} successfully!`);
            setTimeout(() => setSaveSuccess(''), 3000);
            if (section !== 'privacy') {
                handleToggleEdit(section);
            }
        } catch (err) {
            setError(err.response?.data?.email ? 'Email already exists or invalid data.' : 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div className="p-8 text-gray-500 font-medium tracking-tight h-full flex items-center justify-center">Loading settings...</div>;
    if (error && !profile) return <div className="p-8 text-red-600 font-medium bg-red-50 m-8 rounded-[16px] text-center border border-red-100">{error}</div>;
    if (!profile) return null;

    const renderActionButtons = (section) => (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleCancelEdit(section)} className="px-3 border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300">
                Cancel
            </Button>
            <Button size="sm" onClick={() => handleSave(section)} disabled={saving} className="px-5 bg-[#5B4BFF] hover:bg-[#4939ff]">
                {saving ? 'Saving...' : 'Save'}
            </Button>
        </div>
    );

    const renderEditButton = (section) => (
        <button onClick={() => handleToggleEdit(section)} className="p-2 text-gray-400 hover:text-[#5B4BFF] hover:bg-[#5B4BFF]/5 rounded-full transition-colors dark:text-gray-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/40">
            <Edit2 size={18} />
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto w-full font-inter space-y-6">

            {error && <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 font-medium">{error}</div>}
            {saveSuccess && <div className="p-4 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300"><CheckCircle2 size={18} />{saveSuccess}</div>}

            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden relative transition-colors">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-900 relative">
                    {!editMode.header && <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full">{renderEditButton('header')}</div>}
                </div>

                <div className="px-8 pb-8">
                    <div className="flex justify-between items-start">
                        <div className="-mt-16 mb-4 flex gap-6 items-end relative">
                            <div className="relative">
                                {formData.profile_photo ? (
                                    <img src={formData.profile_photo} alt={profile.username} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover bg-white" />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl text-gray-400 font-bold shadow-sm">
                                        {profile.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {editMode.header ? (
                        <div className="mt-4 space-y-5 max-w-2xl bg-gray-50/50 dark:bg-slate-800/30 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-200">
                            <div>
                                <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300 block mb-2">Profile Photo URL</label>
                                <input type="text" name="profile_photo" value={formData.profile_photo} onChange={handleChange} placeholder="https://..." className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300 block mb-2">Full Name</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300 block mb-2">College</label>
                                    <input type="text" name="college" value={formData.college} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300 block mb-2">Year</label>
                                    <input type="text" name="year" value={formData.year} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                {renderActionButtons('header')}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-none mb-2">{profile.username}</h1>
                            <p className="text-gray-600 dark:text-gray-300 text-[15px] font-medium mb-3">
                                {profile.college || 'No college provided'} • {profile.year || 'No year specified'}
                            </p>
                            <div className="flex items-center gap-3">
                                <Badge variant="neutral" className="capitalize px-3 py-1 font-semibold">{profile.role}</Badge>
                                {profile.domain && <Badge variant="primary" className="px-3 py-1 font-semibold">{profile.domain}</Badge>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                    {/* About Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">About</h2>
                            {!editMode.about && renderEditButton('about')}
                        </div>
                        {editMode.about ? (
                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                <textarea name="about" value={formData.about} onChange={handleChange} rows="5" placeholder="Write a summary about yourself..." className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white resize-none mb-4" />
                                <div className="flex justify-end">{renderActionButtons('about')}</div>
                            </div>
                        ) : (
                            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {profile.about || <span className="text-gray-400 italic">No summary provided. Add one to let others know more about you.</span>}
                            </p>
                        )}
                    </Card>

                    {/* Experience Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Experience</h2>
                            {!editMode.experience && renderEditButton('experience')}
                        </div>
                        {editMode.experience ? (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                {formData.experience.map((exp, idx) => (
                                    <div key={idx} className="p-5 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-700/50 relative">
                                        <button onClick={() => handleRemoveArrayItem('experience', idx)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                                            <input type="text" placeholder="Title/Role" value={exp.title || ''} onChange={(e) => handleObjArrayChange('experience', idx, 'title', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                            <input type="text" placeholder="Company/Organization" value={exp.company || ''} onChange={(e) => handleObjArrayChange('experience', idx, 'company', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                            <input type="text" placeholder="Duration (e.g. Jan 2023 - Present)" value={exp.duration || ''} onChange={(e) => handleObjArrayChange('experience', idx, 'duration', e.target.value)} className="md:col-span-2 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                        </div>
                                        <textarea placeholder="Description" rows="3" value={exp.description || ''} onChange={(e) => handleObjArrayChange('experience', idx, 'description', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] resize-none dark:text-white" />
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full py-3 border-dashed border-2 rounded-2xl hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white" onClick={() => handleAddArrayItem('experience', { title: '', company: '', duration: '', description: '' })}>
                                    <Plus size={18} className="mr-2" /> Add Experience
                                </Button>
                                <div className="flex justify-end pt-2">{renderActionButtons('experience')}</div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {profile.experience?.length > 0 ? profile.experience.map((exp, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-[#F8F9FA] dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-700">
                                            <span className="font-bold text-gray-400 text-xl">{exp.company?.charAt(0) || 'E'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">{exp.title}</h3>
                                            <p className="text-[14px] text-gray-700 dark:text-gray-300 font-medium">{exp.company}</p>
                                            <p className="text-[13px] text-gray-500 mb-2">{exp.duration}</p>
                                            <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-400 text-sm italic">No experience added yet.</p>}
                            </div>
                        )}
                    </Card>

                    {/* Education Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Education</h2>
                            {!editMode.education && renderEditButton('education')}
                        </div>
                        {editMode.education ? (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                {formData.education.map((edu, idx) => (
                                    <div key={idx} className="p-5 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-700/50 relative">
                                        <button onClick={() => handleRemoveArrayItem('education', idx)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                                            <input type="text" placeholder="School/University" value={edu.school || ''} onChange={(e) => handleObjArrayChange('education', idx, 'school', e.target.value)} className="md:col-span-2 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                            <input type="text" placeholder="Degree/Field of Study" value={edu.degree || ''} onChange={(e) => handleObjArrayChange('education', idx, 'degree', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                            <input type="text" placeholder="Years (e.g. 2021 - 2025)" value={edu.duration || ''} onChange={(e) => handleObjArrayChange('education', idx, 'duration', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full py-3 border-dashed border-2 rounded-2xl hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white" onClick={() => handleAddArrayItem('education', { school: '', degree: '', duration: '' })}>
                                    <Plus size={18} className="mr-2" /> Add Education
                                </Button>
                                <div className="flex justify-end pt-2">{renderActionButtons('education')}</div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {profile.education?.length > 0 ? profile.education.map((edu, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-[#F8F9FA] dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-700 text-gray-400">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">{edu.school}</h3>
                                            <p className="text-[14px] text-gray-700 dark:text-gray-300 font-medium">{edu.degree}</p>
                                            <p className="text-[13px] text-gray-500">{edu.duration}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-400 text-sm italic">No education history added yet.</p>}
                            </div>
                        )}
                    </Card>

                    {/* Achievements Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Achievements</h2>
                            {!editMode.achievements && renderEditButton('achievements')}
                        </div>
                        {editMode.achievements ? (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                {formData.achievements.map((ach, idx) => (
                                    <div key={idx} className="p-5 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-700/50 relative">
                                        <button onClick={() => handleRemoveArrayItem('achievements', idx)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-1 gap-4 pr-10">
                                            <input type="text" placeholder="Title/Name of Achievement" value={ach.title || ''} onChange={(e) => handleObjArrayChange('achievements', idx, 'title', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                            <input type="text" placeholder="Issuer / Organization / Event" value={ach.issuer || ''} onChange={(e) => handleObjArrayChange('achievements', idx, 'issuer', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                            <input type="text" placeholder="Date (e.g. Aug 2024)" value={ach.date || ''} onChange={(e) => handleObjArrayChange('achievements', idx, 'date', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all text-[14px] dark:text-white" />
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full py-3 border-dashed border-2 rounded-2xl hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white" onClick={() => handleAddArrayItem('achievements', { title: '', issuer: '', date: '' })}>
                                    <Plus size={18} className="mr-2" /> Add Achievement
                                </Button>
                                <div className="flex justify-end pt-2">{renderActionButtons('achievements')}</div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {profile.achievements?.length > 0 ? profile.achievements.map((ach, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-[#F8F9FA] dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-700 text-gray-400">
                                            <CheckCircle2 size={24} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">{ach.title}</h3>
                                            <p className="text-[14px] text-gray-700 dark:text-gray-300 font-medium">{ach.issuer}</p>
                                            <p className="text-[13px] text-gray-500">{ach.date}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-400 text-sm italic">No achievements added yet.</p>}
                            </div>
                        )}
                    </Card>

                </div>

                {/* Sidebar Columns */}
                <div className="space-y-6">
                    {/* Skills Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Skills</h2>
                            {!editMode.skills && renderEditButton('skills')}
                        </div>
                        {editMode.skills ? (
                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex flex-wrap gap-2.5 mb-5">
                                    {formData.skills.map((skill, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3.5 py-2 rounded-xl text-[14px] font-bold border border-indigo-100 dark:border-indigo-800/50">
                                            <input type="text" value={skill} onChange={(e) => handleArrayChange('skills', idx, e.target.value)} className="bg-transparent outline-none w-24" />
                                            <button onClick={() => handleRemoveArrayItem('skills', idx)} className="hover:text-red-500 transition-colors"><X size={16} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddArrayItem('skills', 'New Skill')} className="flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-[14px] font-bold transition-colors border border-dashed border-gray-300 dark:border-slate-600">
                                        <Plus size={16} className="mr-1.5" /> Add Skill
                                    </button>
                                </div>
                                <div className="flex justify-end">{renderActionButtons('skills')}</div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.length > 0 ? profile.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-[#F8F9FA] dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-[13px] font-bold border border-gray-200 dark:border-slate-700">
                                        {skill}
                                    </span>
                                )) : <p className="text-gray-400 text-sm italic">No skills listed.</p>}
                            </div>
                        )}
                    </Card>

                    {/* Social Links Section */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Contact & Links</h2>
                            {!editMode.socials && renderEditButton('socials')}
                        </div>
                        {editMode.socials ? (
                            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                                <div>
                                    <label className="text-[12px] font-bold text-gray-500 uppercase flex items-center gap-2 mb-2 tracking-wider"><Github size={14} /> GitHub URL</label>
                                    <input type="text" name="github" value={formData.social_links.github || ''} onChange={handleSocialChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none text-[14px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-[12px] font-bold text-gray-500 uppercase flex items-center gap-2 mb-2 tracking-wider"><Linkedin size={14} /> LinkedIn URL</label>
                                    <input type="text" name="linkedin" value={formData.social_links.linkedin || ''} onChange={handleSocialChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none text-[14px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-[12px] font-bold text-gray-500 uppercase flex items-center gap-2 mb-2 tracking-wider"><LinkIcon size={14} /> Portfolio/Other</label>
                                    <input type="text" name="portfolio" value={formData.social_links.portfolio || ''} onChange={handleSocialChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none text-[14px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] transition-all dark:text-white" />
                                </div>
                                <div className="flex justify-end pt-2">{renderActionButtons('socials')}</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><Mail size={16} className="text-gray-400" /> {profile.email}</a>
                                {profile.social_links?.github && <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><Github size={16} className="text-gray-400" /> GitHub Profile</a>}
                                {profile.social_links?.linkedin && <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><Linkedin size={16} className="text-gray-400" /> LinkedIn Profile</a>}
                                {profile.social_links?.portfolio && <a href={profile.social_links.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#5B4BFF] transition-colors"><LinkIcon size={16} className="text-gray-400" /> Portfolio / Website</a>}

                                {!profile.social_links?.github && !profile.social_links?.linkedin && !profile.social_links?.portfolio && (
                                    <p className="text-gray-400 text-sm italic">No social links added.</p>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Privacy & Settings */}
                    <Card className="p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-tight">Privacy & Support</h2>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-[14px] font-bold text-gray-700 dark:text-gray-300">Public Profile</span>
                                <input type="checkbox" checked={formData.is_progress_public} onChange={(e) => { setFormData(prev => ({ ...prev, is_progress_public: e.target.checked })); handleSave('privacy'); }} className="w-4 h-4 rounded border-gray-300 text-[#5B4BFF] focus:ring-[#5B4BFF]" />
                            </label>

                            {profile.role === 'student' && (
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-[14px] font-bold text-gray-700 dark:text-gray-300 pr-2">Flag 'Needs Help' in Community</span>
                                    <input type="checkbox" checked={formData.needs_help} onChange={(e) => { setFormData(prev => ({ ...prev, needs_help: e.target.checked })); handleSave('privacy'); }} className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
                                </label>
                            )}
                        </div>
                    </Card>

                </div>
            </div>
            <div className="h-6"></div>
        </div>
    );
};

export default Profile;
