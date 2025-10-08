export type User = {
  id: number;
  name: string;
  email: string;
  school: string;
  class: string;
  points: number;
  role: 'student' | 'teacher';
};

export type Task = {
  id: number;
  title: string;
  description: string;
  category: string;
  points: number;
  imageId: string;
  tutorialUrl?: string;
};

export type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  school: string;
};

export type Submission = {
  id: string;
  studentName: string;
  taskTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string;
  description: string;
  notes?: string;
  aiAnalysis?: string;
};

export type Lesson = {
  id: number;
  title: string;
  category: string;
  duration: number; // in minutes
  summary: string;
  imageId: string;
  videoUrl?: string;
  content: string;
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};
