export interface BibleStory {
  id: number;
  title: string;
  image: string;
  hasAudio: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description?: string;
  audioUrl?: string;
  coloringPages?: string[];
}

export interface DailyVerse {
  reference: string;
  text: string;
  image: string;
  audioUrl: string;
  date: string;
}