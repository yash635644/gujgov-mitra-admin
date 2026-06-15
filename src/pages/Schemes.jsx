import React, { useState, useEffect } from 'react';
import { schemesAPI } from '../services/api';
import { Trash2, Plus, Search, FileText, X } from 'lucide-react';

const Schemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchSchemes = async () => {
        try {
            const res = await schemesAPI.getAll();
            setSchemes(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchemes(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scheme?")) return;
        try {
            await schemesAPI.delete(id);
            fetchSchemes();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await schemesAPI.create({ title: newTitle, content: newContent });
            fetchSchemes();
            setShowForm(false);
            setNewTitle('');
            setNewContent('');
        } catch (error) {
            console.error(error);
            alert("Failed to create scheme. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Government Schemes</h1>
                    <p className="text-gray-500 mt-1">Manage knowledge base for RAG AI generation.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center transition-colors shadow-sm"
                >
                    <Plus size={18} className="mr-2" /> Add Scheme
                </button>
            </div>

            {/* Scheme Creation Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Add New Government Scheme</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Mukhyamantri Amrutam Yojana"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Details & Steps</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter full raw details about eligibility, documents required, and process..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Our backend AI pipeline will automatically index this text using vector embedding algorithms so the Chatbot can answer questions about it dynamically.
                                </p>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-70 flex items-center"
                                >
                                    {isSaving ? 'Processing AI Embeddings...' : 'Save & Index Scheme'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search schemes..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading schemes...</div>
                ) : schemes.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                        <FileText size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900">No schemes found</p>
                        <p className="text-sm mt-1">Get started by adding a government scheme.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Scheme Title</th>
                                <th className="px-6 py-4 font-medium">Content Preview</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schemes.map((scheme) => (
                                <tr key={scheme.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{scheme.title}</td>
                                    <td className="px-6 py-4 max-w-md truncate">{scheme.content}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(scheme.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Schemes;
