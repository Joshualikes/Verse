export interface BibleBook {
  id: number;
  name: string;
  testament: 'Old Testament' | 'New Testament' | 'Deuterocanonical';
  chapters: number;
  category: string;
  description?: string;
}

export interface BibleChapter {
  id: number;
  bookId: number;
  chapterNumber: number;
  title: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedReadTime: number; // in minutes
  keyVerses?: string[];
  themes?: string[];
  coloringPageUrl?: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  bookId: number;
  chapterNumber: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercentage: number;
  timeSpent: number; // in minutes
  lastAccessed: string;
  completedDate?: string;
  rating?: number;
  notes?: string;
  coloringCompleted?: boolean;
}

export interface BibleCategory {
  id: string;
  name: string;
  description: string;
  books: number[];
  color: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  chapters: Array<{
    day: number;
    bookId: number;
    chapterNumber: number;
  }>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: 'book_completed' | 'testament_completed' | 'reading_streak' | 'coloring_master' | 'audio_listener';
  bookId?: number;
  unlockedDate: string;
  points: number;
}