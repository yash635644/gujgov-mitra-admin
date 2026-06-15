import React, { useState, useEffect, useMemo } from 'react';
import { chatsAPI } from '../services/api';
import { MessageSquare, Clock, User, Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'resolved', 'unanswered'

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await chatsAPI.getAll();
                setChats(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const filteredChats = useMemo(() => {
        if (filter === 'unanswered') return chats.filter(c => c.is_unanswered);
        if (filter === 'resolved') return chats.filter(c => !c.is_unanswered);
        return chats;
    }, [chats, filter]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chat Analytics</h1>
                    <p className="text-gray-500 mt-1">Review recent citizen queries and AI responses.</p>
                </div>

                {/* Status Filter */}
                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Chats
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${filter === 'resolved' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <CheckCircle2 size={16} className="mr-1.5" /> Resolved
                    </button>
                    <button
                        onClick={() => setFilter('unanswered')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${filter === 'unanswered' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <AlertTriangle size={16} className="mr-1.5" /> Unanswered
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading chat logs...</div>
                ) : filteredChats.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900">No chat history found</p>
                        <p className="text-sm mt-1">Try changing your filters.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                        {filteredChats.map((chat) => (
                            <div key={chat.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col space-y-4">
                                <div className="flex items-center justify-between text-xs text-gray-400 font-medium pb-2 border-b border-gray-50">
                                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {formatDate(chat.timestamp)}</span>
                                    <div className="flex items-center gap-3">
                                        <span>ID: #{chat.id}</span>
                                        {chat.is_unanswered ? (
                                            <span className="flex items-center bg-red-50 text-red-600 px-2.5 py-1 rounded-md font-semibold">
                                                <AlertTriangle size={12} className="mr-1" /> Needs Knowledge
                                            </span>
                                        ) : (
                                            <span className="flex items-center bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md font-semibold">
                                                <CheckCircle2 size={12} className="mr-1" /> Answered
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                                        <User size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 mb-1">Citizen</p>
                                        <p className="text-gray-700 bg-gray-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm whitespace-pre-wrap">{chat.user_query}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${chat.is_unanswered ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        <Bot size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 mb-1">Mitra AI</p>
                                        <div className={`text-gray-700 p-4 rounded-tl-xl rounded-br-xl rounded-bl-xl text-sm whitespace-pre-wrap shadow-sm leading-relaxed border ${chat.is_unanswered ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-100'}`}>
                                            {chat.bot_response}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chats;
