import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Card, Button, Input, IconLabel } from './UI';
import { GraduationCap, School } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page" className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-[28px] mb-6 shadow-2xl shadow-indigo-500/30">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">AGMHSS EduPulse</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Unified Learning Management</p>
        </div>

        <Card className="p-10 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['student', 'teacher', 'admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-3 text-[10px] font-black uppercase rounded-2xl border-2 transition-all ${
                          role === r 
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Input
              label="Sync ID (Email)"
              type="email"
              placeholder="name@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Access Secret (Password)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-[10px] font-black text-rose-500 bg-rose-50 p-4 rounded-2xl border-2 border-rose-100 uppercase tracking-tight">
                {error}
              </p>
            )}

            <Button disabled={loading} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">
              {loading ? 'Authenticating...' : isLogin ? 'Access Portal' : 'Establish Profile'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t-2 border-slate-50 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
            >
              <School className="w-4 h-4" />
              {isLogin ? "New to AGMHSS EduPulse? Create Account" : 'Back to Login'}
            </button>
          </div>
        </Card>

        <div className="mt-10 flex justify-center items-center gap-8 opacity-30 grayscale saturate-0 transition-opacity hover:opacity-50">
          <IconLabel icon={School} label="Campus Global" className="font-black text-[10px] uppercase tracking-widest" />
        </div>
      </motion.div>
    </div>
  );
}
