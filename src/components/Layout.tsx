import React from 'react';
import Navigation from './Navigation';
import { useAuth } from './AuthProvider';
import Login from './Login';
import { Badge } from './UI';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Define public routes that don't require authentication
  const isPublicRoute = location.pathname.startsWith('/assignments/');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // If it's a public route, render just the content without the sidebar or auth check
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!user || !profile) {
    return <Login />;
  }

  return (
    <div id="main-layout" className="min-h-screen bg-[#F3F4F6] text-slate-800 font-sans overflow-hidden flex">
      <Navigation />
      <main className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {profile?.role === 'student' ? `Morning, ${profile?.name}` : `AGMHSS EduPulse Management`}
            </h1>
            <Badge variant="success">{profile?.role} Access</Badge>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm">
                {profile?.name.charAt(0)}
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <span className="text-lg">🔔</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
