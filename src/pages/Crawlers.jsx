import React, { useState, useEffect } from 'react';
import { crawlersAPI } from '../services/api';
import { Plus, Trash2, Power, PowerOff, ExternalLink, Play, Loader2 } from 'lucide-react';

const Crawlers = () => {
    const [crawlers, setCrawlers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runningId, setRunningId] = useState(null);
    const [newUrl, setNewUrl] = useState('');

    const fetchCrawlers = async () => {
        try {
            const res = await crawlersAPI.getAll();
            setCrawlers(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCrawlers(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newUrl) return;
        try {
            await crawlersAPI.create({ url: newUrl, description: 'Added via Admin UI' });
            setNewUrl('');
            fetchCrawlers();
        } catch (e) { alert("Error adding URL"); }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            await crawlersAPI.update(id, { is_active: !currentStatus });
            fetchCrawlers();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete crawler source?")) return;
        try {
            await crawlersAPI.delete(id);
            fetchCrawlers();
        } catch (e) { console.error(e); }
    };

    const handleRun = async (id) => {
        setRunningId(id);
        try {
            const res = await crawlersAPI.run(id);
            alert(res.data.message);
        } catch (e) {
            console.error(e);
            alert("Crawler run failed or timed out.");
        } finally {
            setRunningId(null);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Web Crawlers</h1>
                    <p className="text-gray-500 mt-1">Manage data sources automatically scraped into the system.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input
                            type="url"
                            required
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="Enter government URL (e.g. https://www.digitalgujarat.gov.in/)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl font-medium flex items-center transition-colors">
                            <Plus size={18} className="mr-2" /> Add Source
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading sources...</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {crawlers.map((c) => (
                            <li key={c.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full ${c.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <GlobeIcon active={c.is_active} />
                                    </div>
                                    <div>
                                        <a href={c.url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-gray-900 hover:text-blue-600 flex items-center">
                                            {c.url} <ExternalLink size={14} className="ml-2 text-gray-400" />
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">{c.description || 'No description provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {c.is_active ? 'Active' : 'Paused'}
                                    </span>

                                    <div className="flex space-x-1 border-l border-gray-200 pl-4 ml-2">
                                        <button
                                            onClick={() => handleRun(c.id)}
                                            disabled={runningId === c.id || !c.is_active}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Run Crawler Now"
                                        >
                                            {runningId === c.id ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                                        </button>
                                        <button onClick={() => handleToggle(c.id, c.is_active)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors" title={c.is_active ? "Pause Crawler" : "Activate Crawler"}>
                                            {c.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                                        </button>
                                        <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {crawlers.length === 0 && (
                            <div className="p-12 text-center text-gray-500">No crawler sources defined yet.</div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

const GlobeIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export default Crawlers;
