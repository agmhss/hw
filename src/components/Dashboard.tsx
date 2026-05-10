import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, Badge, IconLabel, Button } from './UI';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Announcement, Assignment } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

import { setupInitialSchoolStructure } from '../services/schoolService';
import AITutor from './AITutor';

export function AdminDashboard() {
  const [settingUp, setSettingUp] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  const handleSetup = async () => {
    if (!confirm('This will initialize the class hierarchy (LKG-12). Continue?')) return;
    setSettingUp(true);
    try {
      await setupInitialSchoolStructure();
      setSetupDone(true);
      alert('School structure initialized successfully!');
    } catch (e) {
      alert('Setup failed. See console.');
    } finally {
      setSettingUp(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Console</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Infrastructure Management</p>
        </div>
        {!setupDone && (
          <Button onClick={handleSetup} disabled={settingUp} variant="primary">
            {settingUp ? 'Initializing...' : 'Setup School Structure'}
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '1,240', icon: GraduationCap, color: 'indigo' },
          { label: 'Teachers', value: '84', icon: Users, color: 'emerald' },
          { label: 'Attendance', value: '98%', icon: Clock, color: 'amber' },
          { label: 'Active Tasks', value: '12', icon: BookOpen, color: 'rose' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="p-6 border-white bg-white hover:border-indigo-100 transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 text-slate-800`} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <motion.section variants={item} className="col-span-12 lg:col-span-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-8 shadow-xl relative overflow-hidden text-white">
          <div className="relative z-10">
            <h2 className="text-indigo-200 text-xs uppercase font-black tracking-widest mb-4">Infrastructure Status</h2>
            <h3 className="text-4xl font-black leading-tight mb-6">Database Isolation <br/>Verified & Secure</h3>
            <div className="flex gap-4">
              <Badge variant="success">Encrypted</Badge>
              <Badge variant="success">Hashed UID</Badge>
            </div>
          </div>
          <div className="absolute bottom-[-40px] right-[-40px] text-[200px] opacity-10">🛡️</div>
        </motion.section>

        <motion.div variants={item} className="col-span-12 lg:col-span-4">
          <Card className="p-8 h-full bg-amber-400 border-amber-300 text-amber-950">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">System Logs</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="p-4 bg-white/20 rounded-2xl border border-white/30">
                  <p className="text-xs font-black">Security Audit #{1024 + n}</p>
                  <p className="text-[10px] font-bold opacity-80 mt-1">Cross-class access request: REJECTED</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.section variants={item} className="col-span-12">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Faculty & Staff</h3>
              <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6">Invite Member</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Dr. Sarah Wilson', role: 'Head of Dept', status: 'Active' },
                { name: 'Prof. Michael Chen', role: 'Senior Faculty', status: 'On Leave' },
                { name: 'Mrs. Emily Davis', role: 'Administrator', status: 'Active' },
              ].map((staff, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:border-indigo-100 transition-all cursor-pointer bg-slate-50/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {staff.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{staff.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}

export function TeacherDashboard() {
  const { profile } = useAuth();
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {profile?.name.split(' ')[0]}</h1>
          <p className="text-gray-500 font-medium">You have Class 8A and 9C today</p>
        </div>
        <Button>New Assignment</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div variants={item} className="md:col-span-2">
          <Card className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Class Performance</h3>
            <div className="space-y-6">
              {['Class 8 - Section A', 'Class 9 - Section C'].map((c, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-sm font-bold text-gray-700">{c}</h4>
                    <span className="text-xs font-bold text-blue-600">84% Avg</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i === 0 ? '84%' : '72%' }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Schedule</h3>
            <div className="space-y-4">
              {[
                { time: '09:00 AM', subject: 'Mathematics', class: '8A' },
                { time: '11:30 AM', subject: 'Physics', class: '9C' },
                { time: '02:00 PM', subject: 'Lab Session', class: '8A' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 border-l-2 border-blue-600 pl-4 py-1">
                  <div>
                    <p className="text-xs font-bold text-gray-400">{s.time}</p>
                    <p className="text-sm font-bold text-gray-900">{s.subject}</p>
                    <Badge>{s.class}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function StudentDashboard() {
  const { profile } = useAuth();
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Latest School News Section */}
        <motion.section variants={item} className="col-span-12 lg:col-span-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[32px] p-8 shadow-xl relative overflow-hidden text-white">
          <div className="relative z-10">
            <h2 className="text-white text-[10px] uppercase font-black tracking-widest mb-4 opacity-80">Latest School News</h2>
            <h3 className="text-4xl font-black leading-tight mb-4">Annual Inter-House Sports Meet <br/>Coming This Friday!</h3>
            <p className="text-white/90 text-sm max-w-md font-medium">Students of Section 6-12 are required to wear their house jerseys. Participation lists for the 100m sprint are now final.</p>
          </div>
          <div className="absolute bottom-[-30px] right-[-30px] text-[180px] opacity-20">🏆</div>
        </motion.section>

        {/* Smart AI Tutor Section */}
        <motion.section variants={item} className="col-span-12 lg:col-span-4">
          <AITutor />
        </motion.section>

        {/* GPA Summary Section - Now lower or hidden if desired, I'll move it to col-span-4 next to tasks */}
        <motion.section variants={item} className="col-span-12 lg:col-span-4">
          <Card className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-slate-800 font-black text-xs uppercase tracking-widest">Academic GPA</h2>
                <button className="text-indigo-600 text-[10px] font-black uppercase hover:underline">Full Report</button>
              </div>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">3.84</span>
                <span className="text-slate-400 font-bold mb-2">/ 4.0</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Mathematics', grade: 'A+', color: 'emerald' },
                { label: 'Physics', grade: 'A', color: 'emerald' },
                { label: 'Literature', grade: 'B+', color: 'amber' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                  <span className="text-sm font-bold text-slate-500">{s.label}</span>
                  <span className={`text-sm font-black text-${s.color}-500`}>{s.grade}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Pending Assignments Section */}
        <motion.section variants={item} className="col-span-12 lg:col-span-4 flex flex-col">
          <Card className="p-8 h-full flex flex-col overflow-hidden">
            <h2 className="text-slate-800 font-black uppercase tracking-widest text-xs mb-6">Pending Tasks</h2>
            <div className="space-y-4 flex-1">
              {[
                { title: 'Trigonometry Worksheet', teacher: 'Mr. Kapoor', sub: 'Math', due: 'Due Today', color: 'rose' },
                { title: 'Ancient Rome Project', teacher: 'Ms. Diana', sub: 'History', due: 'Tomorrow', color: 'emerald' },
                { title: 'Lab Report: Bases', teacher: 'Dr. Rao', sub: 'Chem', due: 'Dec 15', color: 'indigo' },
              ].map((a, i) => (
                <div key={i} className={`p-4 bg-${a.color}-50 rounded-2xl border-2 border-${a.color}-100/50 hover:scale-[1.02] transition-transform cursor-pointer`}>
                  <div className={`text-[10px] font-black text-${a.color}-500 mb-1 uppercase tracking-widest`}>{a.due}</div>
                  <p className="font-black text-slate-800 tracking-tight">{a.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{a.teacher} • {a.sub}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Academic Calendar Grid Preview */}
        <motion.section variants={item} className="col-span-12 lg:col-span-8">
          <Card className="p-8 h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-slate-800 font-black text-xl tracking-tight">Academic Calendar</h2>
              <div className="flex gap-2">
                <button className="px-5 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200">Week</button>
                <button className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase shadow-lg shadow-indigo-500/20">Month</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3 h-64 overflow-hidden">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className={`rounded-2xl border-2 border-slate-50 p-2 flex flex-col justify-between transition-all hover:border-indigo-200 cursor-pointer ${i === 8 ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}>
                  <span className={`text-[10px] font-black ${i === 8 ? 'text-indigo-600' : 'text-slate-400'}`}>{i + 1}</span>
                  {i === 8 && <div className="h-1.5 w-full bg-indigo-400 rounded-full"></div>}
                  {i === 14 && <div className="h-1.5 w-full bg-amber-400 rounded-full"></div>}
                  {i === 22 && <div className="h-1.5 w-full bg-rose-400 rounded-full"></div>}
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  switch (profile.role) {
    case 'admin': return <AdminDashboard />;
    case 'teacher': return <TeacherDashboard />;
    case 'student': return <StudentDashboard />;
    default: return <div id="dashboard-error">Unknown Role</div>;
  }
}
