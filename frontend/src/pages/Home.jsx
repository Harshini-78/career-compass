import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, Target, TrendingUp, Users, CheckCircle, Bot, Globe, Lock, Shield } from 'lucide-react';
import libraryImage from '../assets/library.jpg';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col font-inter">
            {/* Header */}
            <header className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center px-4 sm:px-8 py-5 border-b border-[#e2e8f0] gap-4">
                <div className="flex items-center gap-2">
                    <Rocket className="text-[#5B4BFF]" size={24} />
                    <span className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">CareerCompass</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-[8px] font-medium text-sm sm:text-base text-gray-700 bg-white border border-[#e2e8f0] hover:bg-gray-50 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-[8px] font-medium text-sm sm:text-base text-white bg-[#5B4BFF] hover:bg-[#4939ff] transition-colors shadow-sm"
                    >
                        Sign Up
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-12 md:py-20 gap-10 lg:gap-16">
                    {/* Text Content */}
                    <div className="flex-1 max-w-xl text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#5B4BFF]/10 text-[#5B4BFF] text-xs sm:text-sm font-semibold mb-6 md:mb-8">
                            Your Journey to Placement Success
                        </div>

                        <h1 className="text-4xl md:text-[3.5rem] leading-[1.1] font-extrabold text-[#0f172a] mb-6 tracking-tight">
                            Track your journey<br />
                            from beginner to<br />
                            <span className="text-[#5B4BFF]">placement-ready</span>
                        </h1>

                        <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8">
                            A structured, milestone-based platform that guides you through 7 carefully crafted stages in your chosen domain. No pressure, just progress.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="inline-flex items-center justify-center px-6 py-3.5 rounded-[8px] font-medium text-white bg-[#5B4BFF] hover:bg-[#4939ff] transition-colors shadow-sm gap-2"
                            >
                                Get Started Free <ArrowRight size={18} />
                            </button>
                            <button
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-[8px] font-medium text-gray-700 bg-white border border-[#e2e8f0] hover:bg-gray-50 transition-colors"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 w-full max-w-lg h-auto sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-[24px] overflow-hidden shadow-2xl shrink-0">
                        <img
                            src={libraryImage}
                            alt="Library"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white py-16 md:py-24 px-4 sm:px-8 border-t border-[#f1f5f9]">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-[#0f172a] mb-4">Everything you need to succeed</h2>
                        <p className="text-gray-500 text-lg mb-16 max-w-2xl mx-auto">
                            A complete career guidance system designed specifically for college students
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6 text-purple-600">
                                    <Target size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-xl mb-3">7-Stage Roadmap</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Clear, structured path from basics to placement readiness in your chosen domain
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-xl mb-3">Track Progress</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Visualize your journey with progress bars and milestone completion
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-6 text-rose-600">
                                    <Users size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-xl mb-3">Ask Seniors</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Get guidance from seniors who've walked the same path
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 text-green-600">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-xl mb-3">Self-Verification</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Mark stages complete based on your own achievement and readiness
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Domain Section */}
                <section className="bg-gray-50 py-16 md:py-24 px-4 sm:px-8 border-t border-[#f1f5f9]">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-[#0f172a] mb-4">Choose Your Domain</h2>
                        <p className="text-gray-500 text-lg mb-16 max-w-2xl mx-auto">
                            Specialized guidance for your career path
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Domain 1 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow flex flex-col items-center justify-center cursor-pointer group">
                                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                    <Bot size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900">AI/ML</h3>
                            </div>

                            {/* Domain 2 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow flex flex-col items-center justify-center cursor-pointer group">
                                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                    <Globe size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900">Web Development</h3>
                            </div>

                            {/* Domain 3 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow flex flex-col items-center justify-center cursor-pointer group">
                                <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                    <Lock size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900">Cyber Security</h3>
                            </div>

                            {/* Domain 4 */}
                            <div className="p-8 rounded-[16px] bg-white border border-[#e2e8f0] hover:shadow-lg transition-shadow flex flex-col items-center justify-center cursor-pointer group">
                                <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                    <Shield size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900">Network Security</h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-white py-16 md:py-24 px-4 sm:px-8 text-center border-t border-[#f1f5f9]">
                    <h2 className="text-3xl font-extrabold text-[#0f172a] mb-4">Ready to start your journey?</h2>
                    <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                        Join hundreds of students already tracking their path to placement success
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-[8px] font-medium text-white bg-[#5B4BFF] hover:bg-[#4939ff] transition-colors shadow-sm"
                    >
                        Get Started Today
                    </button>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="bg-[#0f172a] text-white py-12 px-4 sm:px-8 border-t border-[#1e293b]">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Rocket className="text-white" size={24} />
                        <span className="font-extrabold text-xl tracking-tight">CareerCompass</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} CareerCompass. Empowering students to reach placement readiness.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
