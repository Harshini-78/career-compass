import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Using email as username for consistency with simplejwt without changing backend
            const response = await api.post('token/', { username: email, password, role: role.toLowerCase() });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex flex-col font-inter">
            {/* Header */}
            <header className="flex justify-between items-center px-4 sm:px-8 py-5 bg-white border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                    <Rocket className="text-[#5B4BFF]" size={24} />
                    <span className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">CareerCompass</span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back to Home</span>
                </button>
            </header>

            {/* Login Section */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-[440px] p-5 sm:p-10 rounded-[12px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col my-8">

                    <h2 className="text-[28px] font-bold text-[#0f172a] mb-1 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 font-medium text-[15px] mb-8">Continue your journey to placement readiness</p>

                    {error && <div className="w-full bg-red-50 text-red-600 p-4 rounded-[8px] mb-6 text-sm font-medium border border-red-100">{error}</div>}

                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-900">Email</label>
                            <input
                                type="email"
                                className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-sm rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none placeholder:text-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your.email@college.edu"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-900">Password</label>
                            <input
                                type="password"
                                className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-sm rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none placeholder:text-gray-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-900">Login as</label>
                            <select
                                className="w-full bg-[#FCFDFE] border border-gray-200 text-gray-900 text-sm rounded-[8px] focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block p-3 transition-all outline-none appearance-none cursor-pointer"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>Student</option>
                                <option>Senior</option>
                                <option>Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-2 py-3 rounded-[8px] text-white font-medium text-[15px] transition-all
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} 
                                bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] shadow-[0px_4px_14px_rgba(91,75,255,0.25)]`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-[#5B4BFF] font-bold hover:underline">Sign Up</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
