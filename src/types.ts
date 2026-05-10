export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  classId?: string;
  sectionId?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  gradeLevel: number;
}

export interface Section {
  id: string;
  name: string;
  classId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  classId: string;
  sectionId: string;
  teacherId: string;
  createdAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  subject: string;
  score: number;
  maxScore: number;
  feedback?: string;
  teacherId: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'school' | 'class' | 'section';
  classId?: string;
  sectionId?: string;
  authorId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any;
}

export interface PTM {
  id: string;
  teacherId: string;
  studentId: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  link?: string;
}
