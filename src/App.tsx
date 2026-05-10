import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Placeholder from './components/Placeholder';
import Settings from './components/Settings';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Placeholder title="Class & Section Management" />} />
            <Route path="/assignments" element={<Placeholder title="Homework & Assignments" />} />
            <Route path="/grades" element={<Placeholder title="Performance & Gradebook" />} />
            <Route path="/calendar" element={<Placeholder title="School Calendar & Events" />} />
            <Route path="/messages" element={<Placeholder title="Secure Messaging" />} />
            <Route path="/announcements" element={<Placeholder title="School News" />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
