import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  Users, 
  Settings, 
  LogOut,
  LayoutDashboard,
  ClipboardList
} from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function Navigation() {
  const { profile, signOut } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'teacher', 'student'] },
    { label: 'Classes', icon: Users, path: '/classes', roles: ['admin'] },
    { label: 'Assignments', icon: ClipboardList, path: '/assignments', roles: ['teacher', 'student'] },
    { label: 'Grades', icon: BarChart3, path: '/grades', roles: ['teacher', 'student', 'admin'] },
    { label: 'Calendar', icon: Calendar, path: '/calendar', roles: ['admin', 'teacher', 'student'] },
    { label: 'Messaging', icon: MessageSquare, path: '/messages', roles: ['admin', 'teacher', 'student'] },
    { label: 'Announcements', icon: Bell, path: '/announcements', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <nav id="sidebar" className="w-64 h-screen bg-indigo-600 flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-600 text-xl">
            E
          </div>
          <span className="text-white font-bold text-lg tracking-tight">EduPulse</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-white text-indigo-600 shadow-sm shadow-indigo-900/10' 
                : 'text-indigo-100 hover:bg-white/10'
              }
            `}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-indigo-300'}`} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-indigo-700/50 p-4 rounded-2xl border border-indigo-400/30 mb-4">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Current Session</p>
          <p className="text-sm font-bold text-white truncate">{profile?.name}</p>
          <p className="text-[10px] font-black text-amber-400 uppercase mt-0.5">{profile?.role}</p>
        </div>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-indigo-100 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5 text-indigo-300" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
