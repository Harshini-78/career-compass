import React, { useState, useEffect } from 'react';
import { Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ConnectionsPreview = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const res = await api.get('community/');
                // Filter the community list to only those we follow
                const followed = res.data.filter(u => u.is_followed_by_me).slice(0, 3);
                setConnections(followed);
            } catch (err) {
                console.error("Failed to load connections", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    const colorPalette = ['bg-indigo-500', 'bg-sky-500', 'bg-rose-500', 'bg-emerald-500', 'bg-purple-500'];
    const getDeterministicIndex = (str) => {
        if (!str) return 0;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % colorPalette.length;
    };

    return (
        <div className="bg-white rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-6 flex flex-col items-start justify-center h-full">
            <div className="w-12 h-12 rounded-[12px] bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                <Users size={24} strokeWidth={2.5} />
            </div>
            
            <div className="flex w-full items-center justify-between mb-3">
                <h3 className="font-extrabold text-[#0f172a] text-[16px]">Connections</h3>
                <Link to="/community" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <ExternalLink size={16} />
                </Link>
            </div>
            
            <div className="w-full flex flex-col gap-3 mt-1">
                {loading ? (
                    <div className="text-[13px] text-gray-400 font-medium">Loading network...</div>
                ) : connections.length === 0 ? (
                    <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                        Find peers on the <Link to="/community" className="text-indigo-600 hover:underline">Community</Link> page.
                    </p>
                ) : (
                    connections.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-[#F8F9FA] p-2.5 rounded-xl border border-gray-100 transition-all">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-8 h-8 rounded-full ${colorPalette[getDeterministicIndex(c.username)]} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                                    {c.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="truncate">
                                    <h4 className="font-bold text-[13px] text-gray-900 leading-tight truncate">{c.username}</h4>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">
                                        Stage {c.stage || 0}
                                    </div>
                                </div>
                            </div>
                            <div className="font-extrabold text-[13px] text-[#0f172a] shrink-0 ml-2">
                                {c.progress_percentage}%
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConnectionsPreview;
