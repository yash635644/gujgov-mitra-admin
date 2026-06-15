import React, { useState, useEffect } from 'react';
import { pendingSchemesAPI } from '../services/api';
import { FileText, Check, X, Edit3, Loader2 } from 'lucide-react';

const Approvals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const response = await pendingSchemesAPI.getAll();
            setPending(response.data);
        } catch (error) {
            console.error("Failed to fetch pending schemes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleSelect = (scheme) => {
        setSelectedScheme(scheme);
        setEditTitle(scheme.title);
        setEditContent(scheme.content);
    };

    const handleClose = () => {
        setSelectedScheme(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleApprove = async () => {
        if (!selectedScheme) return;
        try {
            setActionLoading(true);
            await pendingSchemesAPI.approve(selectedScheme.id, {
                title: editTitle,
                content: editContent
            });
            alert("Scheme approved, embedded, and published!");
            handleClose();
            fetchPending();
        } catch (error) {
            console.error(error);
            alert("Failed to approve scheme");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject and delete this scraped data?")) return;
        try {
            const schemeId = id || selectedScheme?.id;
            await pendingSchemesAPI.reject(schemeId);
            if (selectedScheme && selectedScheme.id === schemeId) {
                handleClose();
            }
            fetchPending();
        } catch (error) {
            console.error(error);
            alert("Failed to reject scheme");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Approval Queue</h1>
                <p className="text-gray-500 mt-1">Review raw scraped data before spending AI tokens to vectorize it.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="p-12 flex justify-center items-center">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                    </div>
                ) : pending.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-500 h-full">
                        <FileText size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900">Queue is Empty</p>
                        <p className="text-sm mt-1">No pending data to review.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 min-h-[500px]">

                        {/* List Sidebar */}
                        <div className="col-span-1 overflow-y-auto max-h-[600px] bg-gray-50/50">
                            {pending.map(scheme => (
                                <div
                                    key={scheme.id}
                                    onClick={() => handleSelect(scheme)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedScheme?.id === scheme.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-white border-l-4 border-l-transparent'}`}
                                >
                                    <h3 className="font-semibold text-gray-900 line-clamp-2">{scheme.title}</h3>
                                    <p className="text-xs text-indigo-600 mt-1 truncate">{scheme.source_url || 'Manual Entry'}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(scheme.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Detail / Edit View */}
                        <div className="col-span-2 p-6 md:p-8 bg-white flex flex-col h-full">
                            {selectedScheme ? (
                                <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1 mr-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full text-xl font-bold text-gray-900 border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-600 focus:ring-0 p-0 bg-transparent transition-colors"
                                            />
                                            <p className="text-sm text-indigo-600 mt-2 hover:underline">
                                                <a href={selectedScheme.source_url} target="_blank" rel="noopener noreferrer">
                                                    {selectedScheme.source_url}
                                                </a>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleReject()}
                                                disabled={actionLoading}
                                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center transition-colors disabled:opacity-50"
                                            >
                                                <X size={16} className="mr-1.5" /> Reject
                                            </button>
                                            <button
                                                onClick={handleApprove}
                                                disabled={actionLoading}
                                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Check size={16} className="mr-1.5" />}
                                                Approve & Embed
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Edit3 size={14} className="mr-1" /> Edit Content
                                        </label>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 resize-none font-mono text-sm leading-relaxed text-gray-700 h-96"
                                        />
                                        <p className="text-xs text-gray-500 mt-3 text-right">
                                            Approving will cost AI indexing tokens to vectorize this text.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <FileText size={48} className="mb-4 opacity-20" />
                                    <p>Select a pending scheme from the queue to review it.</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Approvals;
