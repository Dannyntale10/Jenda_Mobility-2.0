import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Hexagon, Bell, Settings, UserCircle } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

interface LayoutProps {
  children: React.ReactNode;
  contextData: any;
}

export const Layout: React.FC<LayoutProps> = ({ children, contextData }) => {
  const location = useLocation();

  // Determine page title
  const currentNav = NAV_ITEMS.find(item => item.path === location.pathname) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="text-brand-500">
            <Hexagon size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">OmniNexus</h1>
            <p className="text-xs text-slate-500 font-medium">ENTERPRISE SAAS</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
              `}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
            <UserCircle className="text-slate-400" size={32} />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@omninexus.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-white">{currentNav.label}</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
             {children}
          </div>
        </div>
      </main>

      {/* Integrated AI Assistant */}
      <AIAssistant contextData={JSON.stringify(contextData)} />
    </div>
  );
};