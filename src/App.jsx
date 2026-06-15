import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import { Menu, X, Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Approvals = lazy(() => import('./pages/Approvals'));
const Crawlers = lazy(() => import('./pages/Crawlers'));
const Chats = lazy(() => import('./pages/Chats'));

function AdminLoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 size={32} className="animate-spin text-blue-600" />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 w-full z-20 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GujGov Admin
          </h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 focus:outline-none">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Background Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 md:flex md:w-64 flex-shrink-0`}>
          <Sidebar onLogout={handleLogout} />
        </div>

        <main className="flex-1 overflow-y-auto mt-14 md:mt-0 relative z-10 w-full">
          <Suspense fallback={<AdminLoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/crawlers" element={<Crawlers />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
