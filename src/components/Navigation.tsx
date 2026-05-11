import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ClipboardList as BookOpen, 
  Settings as SettingsIcon,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function Navigation() {
  const { profile, signOut } = useAuth();

  const navItems = [
    { label: 'Assignments', icon: BookOpen, path: '/' },
    { label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  return (
    <nav id="sidebar" className="w-64 h-screen bg-indigo-600 flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-600 text-xl shadow-lg ring-4 ring-white/10">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-lg tracking-tight leading-none">PORTAL</span>
            <span className="text-[10px] font-black text-indigo-200 mt-1 uppercase tracking-widest opacity-60">Academic Staff</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-950/20 scale-[1.02]' 
                : 'text-indigo-100 hover:bg-white/10'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-indigo-700/50 p-4 rounded-2xl border border-indigo-400/30 mb-4">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Authenticated As</p>
          <p className="text-sm font-bold text-white truncate">{profile?.name || 'Academic Staff'}</p>
          <p className="text-[10px] font-black text-amber-400 uppercase mt-0.5">{profile?.role}</p>
        </div>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold text-indigo-100 hover:bg-rose-500 hover:text-white transition-all group"
        >
          <LogOut className="w-5 h-5 text-indigo-300 group-hover:text-white" />
          Logout Session
        </button>
      </div>
    </nav>
  );
}
