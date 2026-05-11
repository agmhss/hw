import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, Badge, Button, Input, Textarea } from './UI';
import { 
  BookOpen, 
  Plus,
  Send,
  Trash2,
  Clock,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Dashboard() {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [profile]);

  async function fetchAssignments() {
    if (!profile) return;
    try {
      const q = query(
        collection(db, 'assignments'),
        where('teacherId', '==', profile.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      setAssignments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  }

  const handlePostAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);

    try {
      const newAssignment = {
        title,
        description,
        subject,
        dueDate,
        teacherId: profile.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'assignments'), newAssignment);
      
      setTitle('');
      setDescription('');
      setSubject('');
      setDueDate('');
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'assignments');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteDoc(doc(db, 'assignments', id));
      fetchAssignments();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `assignments/${id}`);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <Badge variant="neutral" className="mb-2">Teacher Portal</Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assignment Management</h1>
          <p className="text-slate-500 font-medium">Post and manage homework for your classes.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="shadow-xl shadow-indigo-600/20 px-8 py-3"
        >
          {showForm ? 'Cancel Creation' : 'Create New Assignment'}
          {!showForm && <Plus className="w-4 h-4 ml-2" />}
        </Button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 border-2 border-indigo-50 bg-white">
              <form onSubmit={handlePostAssignment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Assignment Title"
                    required 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Trigonometry Basics" 
                  />
                  <Input 
                    label="Subject"
                    required 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics" 
                  />
                  <Input 
                    label="Due Date"
                    required 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
                <Textarea 
                  label="Instructions / Description"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the task..."
                  rows={6}
                />
                <div className="flex justify-end pt-4">
                  <Button disabled={submitting} type="submit" className="w-full md:w-auto px-12 py-4">
                    {submitting ? 'Publishing...' : 'Publish to Portal'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-800">Your Active Assignments</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
            {[1, 2].map(i => <Card key={i} className="h-48 bg-slate-100 animate-pulse"><div></div></Card>)}
          </div>
        ) : assignments.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">No assignments posted yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((a) => (
              <Card key={a.id} className="p-6 group hover:border-indigo-100 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="neutral">{a.subject}</Badge>
                    <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => window.open(`/assignments/${a.id}`, '_blank')}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleDelete(a.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{a.title}</h3>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed">{a.description}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    Due {new Date(a.dueDate).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    REF: {a.id.slice(0, 8)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer className="pt-12 text-center border-t border-slate-50">
        <p className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
          <AlertCircle className="w-3 h-3" />
          Assignments are visible to students immediately via unique links.
        </p>
      </footer>
    </div>
  );
}
