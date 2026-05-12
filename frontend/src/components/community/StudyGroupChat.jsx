import React, { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import api from '../../services/api';
import Avatar from '../ui/Avatar';

const StudyGroupChat = ({ domainId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const url = domainId ? `community/chat/?domain=${domainId}` : `community/chat/`;
            const res = await api.get(url);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to load chat', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Set up polling every 10 seconds for a real-ish time feel
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, [domainId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const url = domainId ? `community/chat/?domain=${domainId}` : `community/chat/`;
            const res = await api.post(url, { content: newMessage });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const isToday = date.getDate() === now.getDate() && 
                        date.getMonth() === now.getMonth() && 
                        date.getFullYear() === now.getFullYear();
                        
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && 
                            date.getMonth() === yesterday.getMonth() && 
                            date.getFullYear() === yesterday.getFullYear();
                            
        const isWithinWeek = now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
        
        if (isToday) {
            return timeStr;
        } else if (isYesterday) {
            return `Yesterday, ${timeStr}`;
        } else if (isWithinWeek) {
            const dayName = date.toLocaleDateString([], { weekday: 'long' });
            return `${dayName}, ${timeStr}`;
        } else {
            const dateStr = date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
            return `${dateStr}, ${timeStr}`;
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-500 font-medium">Loading forum...</div>;

    return (
        <div className="bg-white rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-[600px] overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Users size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight">Domain Study Group</h3>
                    <p className="text-xs font-medium text-gray-500">Ask questions and collaborate with your peers</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#FCFDFE]">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 font-medium my-auto">No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={msg.id} className="flex gap-4">
                            <Avatar name={msg.author_name} size="md" className="shrink-0" />
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-bold text-[14px] text-gray-900">{msg.author_name}</span>
                                    <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                                        {formatMessageTime(msg.created_at)}
                                    </span>
                                </div>
                                <div className="bg-white border border-gray-100 shadow-sm p-3.5 rounded-2xl rounded-tl-sm text-[14px] text-gray-700 leading-relaxed max-w-[85%]">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-full focus:ring-2 focus:ring-[#5B4BFF]/20 focus:border-[#5B4BFF] block px-5 py-3 transition-all outline-none"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 rounded-full bg-[#5B4BFF] hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
                >
                    <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                </button>
            </form>
        </div>
    );
};

export default StudyGroupChat;
