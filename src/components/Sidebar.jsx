import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Globe, MessageSquare, LogOut, ClipboardCheck } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Schemes', path: '/schemes', icon: <FileText size={20} /> },
        { name: 'Data Queue', path: '/approvals', icon: <ClipboardCheck size={20} /> },
        { name: 'Crawlers', path: '/crawlers', icon: <Globe size={20} /> },
        { name: 'Chat Logs', path: '/chats', icon: <MessageSquare size={20} /> },
    ];

    return (
        <div className="h-[100dvh] w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed md:relative">
            <div className="p-6 border-b border-gray-200 hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    GujGov Admin
                </h1>
                <p className="text-sm text-gray-500 mt-1">Mitra Dashboard</p>
            </div>

            {/* Empty space to offset fixed mobile header */}
            <div className="h-16 md:hidden bg-gray-50 border-b border-gray-200"></div>

            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors duration-200"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
