import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Card, Badge, Button } from './UI';
import { BookOpen, Calendar, User, ArrowLeft, Loader2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface AssignmentData {
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  teacherId: string;
  createdAt: string;
}

interface TeacherData {
  name: string;
  email: string;
}

export default function AssignmentDetail() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignment() {
      if (!assignmentId) return;

      try {
        const assignmentRef = doc(db, 'assignments', assignmentId);
        const assignmentSnap = await getDoc(assignmentRef);

        if (assignmentSnap.exists()) {
          const data = assignmentSnap.data() as AssignmentData;
          setAssignment(data);

          // Fetch teacher name
          if (data.teacherId) {
            const teacherRef = doc(db, 'users', data.teacherId);
            const teacherSnap = await getDoc(teacherRef);
            if (teacherSnap.exists()) {
              setTeacher(teacherSnap.data() as TeacherData);
            }
          }
        } else {
          setError("Assignment not found. It might have been removed or the link is incorrect.");
        }
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError("Failed to load assignment details. Please try again later.");
        // We don't use handleFirestoreError here to avoid crashing the public view with complex error objects
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Fetching assignment details...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full p-8 text-center border-t-4 border-t-rose-500">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Access Issue</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {error || "We couldn't find the assignment you're looking for."}
          </p>
          <Link to="/">
            <Button variant="primary" className="w-full">
              Go to Homepage
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const dueDate = new Date(assignment.dueDate);
  const isPastDue = dueDate < new Date();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Portal Home
          </Link>
          <Badge variant={isPastDue ? 'danger' : 'success'}>
            {isPastDue ? 'Past Due' : 'Active Assignment'}
          </Badge>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">{assignment.subject}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                {assignment.title}
              </h1>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <Clock className="w-4 h-4" />
                Deadline
              </div>
              <div className={`text-xl font-black ${isPastDue ? 'text-rose-500' : 'text-slate-800'}`}>
                {dueDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Task Description</h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap whitespace-break-spaces">
                    {assignment.description}
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-white border-2 border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Assigned By</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-black text-lg">
                    {teacher?.name?.charAt(0) || <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{teacher?.name || 'Academic Staff'}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{assignment.subject} Department</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                <h3 className="text-xs font-black text-white/60 uppercase tracking-widest mb-2">Subject Area</h3>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xl font-black">{assignment.subject}</span>
                </div>
                <div className="p-4 bg-white/10 rounded-xl rounded-bl-sm border border-white/10">
                  <p className="text-xs leading-relaxed opacity-90 italic">
                    "Success is the sum of small efforts, repeated day in and day out."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
