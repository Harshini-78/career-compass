import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const LeaderboardPreview = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('leaderboard/');
                setLeaderboard(res.data.leaderboard.slice(0, 3)); // Get top 3
                setUserRank(res.data.your_rank);
            } catch (err) {
                console.error("Failed to load leaderboard preview", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return null;

    return (
        <div className="bg-white rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[10px] bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0">
                    <Trophy size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-extrabold text-[#0f172a] text-[16px] leading-tight">Top Students</h3>
                    <p className="text-gray-500 text-[12px] font-medium">In your domain</p>
                </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
                {leaderboard.map((student, idx) => (
                    <div key={student.id} className="flex justify-between items-center p-3 rounded-[10px] bg-[#FAFAFA] border border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${idx === 0 ? 'bg-[#F59E0B] text-white shadow-sm' : idx === 1 ? 'bg-[#94A3B8] text-white' : idx === 2 ? 'bg-[#B45309] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {idx + 1}
                            </span>
                            <span className="font-bold text-gray-800 text-[14px]">{student.username}</span>
                        </div>
                        <span className="font-extrabold text-[#5B4BFF] text-[14px]">{student.progress_percentage}%</span>
                    </div>
                ))}
            </div>

            {userRank && (
                <div className="text-center mb-4">
                    <span className="inline-block bg-[#F8F9FA] border border-gray-200 text-gray-700 text-[13px] font-bold px-4 py-1.5 rounded-full">
                        Your Rank: #{userRank}
                    </span>
                </div>
            )}

            <button 
                className="w-full bg-[#F5F6FA] text-[#0f172a] font-bold text-[14px] py-2.5 rounded-[8px] hover:bg-gray-200 transition-colors mt-auto cursor-default"
            >
                View Full Leaderboard
            </button>
        </div>
    );
};

export default LeaderboardPreview;
