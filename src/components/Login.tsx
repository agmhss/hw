import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
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
    
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name,
            email,
            role,
            createdAt: new Date().toISOString()
          });
        } catch (fsErr) {
          handleFirestoreError(fsErr, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = err.message;
      if (err.code === 'auth/missing-password') message = "Please enter a password.";
      if (err.code === 'auth/invalid-email') message = "The email address is not valid.";
      if (err.code === 'auth/weak-password') message = "The password is too weak (min 6 characters).";
      if (err.code === 'auth/user-not-found') message = "No account found with this email. Please Create Account first.";
      if (err.code === 'auth/email-already-in-use') message = "This email is already registered. Please switch to the Access Portal to log in.";
      if (err.code === 'auth/operation-not-allowed') message = "Email/Password login is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Auto-register as student or admin based on email
        const userRole = user.email === 'agmhsspatteeswaram@gmail.com' ? 'admin' : 'student';
        
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: user.displayName || 'Unnamed User',
            email: user.email,
            role: userRole,
            createdAt: new Date().toISOString()
          });
        } catch (fsErr) {
          handleFirestoreError(fsErr, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      let message = err.message;
      if (err.code === 'auth/unauthorized-domain') {
        message = "This domain (agmhss.github.io) is not authorized for Google Sign-in. Please add it to 'Authorized domains' in Firebase Console > Authentication > Settings.";
      } else if (err.code === 'auth/popup-blocked') {
        message = "The sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.code === 'auth/operation-not-allowed') {
        message = "Google Sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    const mockProfile = {
      uid: 'demo-admin',
      name: 'System Administrator (Demo)',
      email: 'agmhsspatteeswaram@gmail.com',
      role: 'admin' as const,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
    window.location.reload();
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

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-slate-50"></span>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400">Or Continue With</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Account
            </Button>

            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleDemoAccess}
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600"
            >
              Launch Demo Experience (No Account Needed)
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
