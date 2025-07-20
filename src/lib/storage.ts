import { ExamSet, Student, Admin, ExamResult, ExamSession } from '@/types/exam';

const STORAGE_KEYS = {
  ADMINS: 'exam_app_admins',
  STUDENTS: 'exam_app_students',
  EXAM_SETS: 'exam_app_exam_sets',
  EXAM_RESULTS: 'exam_app_exam_results',
  EXAM_SESSION: 'exam_app_current_session',
  CURRENT_USER: 'exam_app_current_user',
} as const;

// Initialize default admin if none exists
const initializeDefaultAdmin = () => {
  const admins = getAdmins();
  if (admins.length === 0) {
    const defaultAdmin: Admin = {
      id: 'admin-1',
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
    };
    saveAdmins([defaultAdmin]);
  }
};

// Admin functions
export const getAdmins = (): Admin[] => {
  const admins = localStorage.getItem(STORAGE_KEYS.ADMINS);
  return admins ? JSON.parse(admins) : [];
};

export const saveAdmins = (admins: Admin[]) => {
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
};

export const authenticateAdmin = (username: string, password: string): Admin | null => {
  const admins = getAdmins();
  return admins.find(admin => admin.username === username && admin.password === password) || null;
};

// Student functions
export const getStudents = (): Student[] => {
  const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return students ? JSON.parse(students) : [];
};

export const saveStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: `student-${Date.now()}`,
    createdAt: new Date(),
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

export const authenticateStudent = (username: string, password: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.username === username && student.password === password) || null;
};

// Exam Set functions
export const getExamSets = (): ExamSet[] => {
  const examSets = localStorage.getItem(STORAGE_KEYS.EXAM_SETS);
  return examSets ? JSON.parse(examSets) : [];
};

export const saveExamSets = (examSets: ExamSet[]) => {
  localStorage.setItem(STORAGE_KEYS.EXAM_SETS, JSON.stringify(examSets));
};

export const addExamSet = (examSet: Omit<ExamSet, 'id' | 'createdAt' | 'updatedAt'>) => {
  const examSets = getExamSets();
  const newExamSet: ExamSet = {
    ...examSet,
    id: `exam-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  examSets.push(newExamSet);
  saveExamSets(examSets);
  return newExamSet;
};

export const updateExamSet = (id: string, updates: Partial<ExamSet>) => {
  const examSets = getExamSets();
  const index = examSets.findIndex(exam => exam.id === id);
  if (index !== -1) {
    examSets[index] = { ...examSets[index], ...updates, updatedAt: new Date() };
    saveExamSets(examSets);
    return examSets[index];
  }
  return null;
};

export const deleteExamSet = (id: string) => {
  const examSets = getExamSets();
  const filtered = examSets.filter(exam => exam.id !== id);
  saveExamSets(filtered);
};

// Exam Results functions
export const getExamResults = (): ExamResult[] => {
  const results = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
  return results ? JSON.parse(results) : [];
};

export const saveExamResult = (result: Omit<ExamResult, 'id'>) => {
  const results = getExamResults();
  const newResult: ExamResult = {
    ...result,
    id: `result-${Date.now()}`,
  };
  results.push(newResult);
  localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(results));
  return newResult;
};

// Exam Session functions
export const saveExamSession = (session: ExamSession) => {
  localStorage.setItem(STORAGE_KEYS.EXAM_SESSION, JSON.stringify(session));
};

export const getExamSession = (): ExamSession | null => {
  const session = localStorage.getItem(STORAGE_KEYS.EXAM_SESSION);
  return session ? JSON.parse(session) : null;
};

export const clearExamSession = () => {
  localStorage.removeItem(STORAGE_KEYS.EXAM_SESSION);
};

// Current User functions
export const saveCurrentUser = (user: { type: 'admin' | 'student'; data: Admin | Student }) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUser = (): { type: 'admin' | 'student'; data: Admin | Student } | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Initialize app
export const initializeApp = () => {
  initializeDefaultAdmin();
};