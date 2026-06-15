import React, { useState, useEffect } from 'react';
import { dashboardAPI, reportsAPI } from '../services/api';
import { Users, FileText, Globe, Activity, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Icon size={24} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
                <ArrowUpRight size={16} className="mr-1" />
                {trend}
            </span>
            <span className="text-gray-400 ml-2">vs last week</span>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_schemes: 0,
        total_chats: 0,
        total_crawlers: 0,
        chart_data: []
    });
    const [activityLines, setActivityLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    dashboardAPI.getStats(),
                    dashboardAPI.getActivity()
                ]);
                setStats(statsRes.data);
                setActivityLines(activityRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            const res = await reportsAPI.generate();
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from Content-Disposition header if possible, else fallback
            let filename = `GujGov_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            const contentDisposition = res.headers['content-disposition'];
            if (contentDisposition && contentDisposition.includes('filename=')) {
                filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to generate report", error);
            alert("Failed to generate report. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';
        const diff = new Date() - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    if (loading) return <div className="p-8 text-gray-500 flex items-center justify-center h-full">Loading dashboard data...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className={`bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                    <Activity size={18} className="mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Schemes Indexed" value={stats.total_schemes} icon={FileText} trend="+12%" />
                <StatCard title="Citizen Queries Resolved" value={stats.total_chats} icon={Users} trend="+24%" />
                <StatCard title="Active Scraper Crawlers" value={stats.total_crawlers} icon={Globe} trend="+2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Query Volume (7 Days)</h2>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chart_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="queries" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {activityLines.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent activity found.</p>
                        ) : (
                            activityLines.map((item, idx) => (
                                <div key={item.id || idx} className="flex space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'scheme_live' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                        {item.type === 'scheme_live' ? <FileText size={18} /> : <AlertTriangle size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.message} • {getTimeAgo(item.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
