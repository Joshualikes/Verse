export interface ColoringProgress {
  id: number;
  coloringPageId: number;
  userId: string;
  status: 'in-progress' | 'completed';
  progressPercentage: number;
  colorData: string; // JSON string of saved colors
  timeSpent: number; // in minutes
  lastModified: string;
  completedDate?: string;
  rating?: number;
}

export interface ColoringPage {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  hasAudio: boolean;
  audioUrl?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
}

export interface GalleryStats {
  totalCompleted: number;
  totalInProgress: number;
  totalFavorites: number;
  totalTimeSpent: number;
}