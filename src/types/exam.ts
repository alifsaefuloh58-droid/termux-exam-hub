export interface Question {
  id: string;
  type: 'reading' | 'listening';
  text: string;
  image?: string;
  audio?: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamSet {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  readingQuestions: Question[];
  listeningQuestions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examSetId: string;
  answers: { [questionId: string]: number };
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  completedAt: Date;
}

export interface ExamSession {
  examSetId: string;
  studentId: string;
  startTime: Date;
  answers: { [questionId: string]: number };
  audioPlayCounts: { [questionId: string]: number };
}