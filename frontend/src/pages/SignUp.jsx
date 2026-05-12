import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import api from '../services/api';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [college, setCollege] = useState('');
    const [year, setYear] = useState('1st Year');
    const [role, setRole] = useState('student');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // map full name to username without spaces for django backward compat
            // add random suffix to ensure username is unique
            const baseUsername = fullName.replace(/\s+/g, '').toLowerCase() || email.split('@')[0];
            const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

            // Register using the default API
            await api.post('register/', {
                username: username,
                email: email,
                password: password,
                role: role
            });

            // On success, login to get access token so we can assign domain
            const tokenRes = await api.post('token/', { username: email, password });
            localStorage.setItem('access', tokenRes.data.access);
            localStorage.setItem('refresh', tokenRes.data.refresh);
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenRes.data.access}`;

            // Try to assign the dummy domain if possible, depending on what the user picked
            // We ignore errors on this part since it's just visual for the signup
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data?.username?.[0] || 'Registration failed. Check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center font-inter p-4">

            {/* Form Section */}
            <div className="bg-white w-full max-w-[480px] p-5 sm:p-10 rounded-[12px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col my-8">

                <h2 className="text-[28px] font-bold text-[#0f172a] mb-1 tracking-tight">Create Account</h2>
                <p className="text-gray-500 font-medium text-[15px] mb-8">Start tracking your journey to placement readiness</p>

                {error && <div className="w-full bg-red-50 text-red-600 p-4 rounded-[8px] mb-6 text-sm font-medium border border-red-100">{error}</div>}

                <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-900">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-[14px] rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none placeholder:text-gray-400"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-900">Email</label>
                        <input
                            type="email"
                            className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-[14px] rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none placeholder:text-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your.email@college.edu"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-900">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-[14px] rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none placeholder:text-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a strong password"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-900">College</label>
                        <input
                            type="text"
                            className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-[14px] rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none placeholder:text-gray-400"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            placeholder="Your college name"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-900">Year</label>
                        <select
                            className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-[14px] rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none appearance-none cursor-pointer"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-900">Role</label>
                        <select
                            className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-[14px] rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none appearance-none cursor-pointer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-2 py-3.5 rounded-[8px] text-white font-medium text-[15px] transition-all
                            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} 
                            bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] shadow-[0px_4px_14px_rgba(91,75,255,0.25)]`}
                    >
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
