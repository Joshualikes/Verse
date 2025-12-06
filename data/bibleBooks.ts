import { BibleBook, BibleCategory } from '@/types/bible';

export const bibleBooks: BibleBook[] = [
  // Old Testament
  { id: 1, name: 'Genesis', testament: 'Old Testament', chapters: 50, category: 'Pentateuch' },
  { id: 2, name: 'Exodus', testament: 'Old Testament', chapters: 40, category: 'Pentateuch' },
  { id: 3, name: 'Leviticus', testament: 'Old Testament', chapters: 27, category: 'Pentateuch' },
  { id: 4, name: 'Numbers', testament: 'Old Testament', chapters: 36, category: 'Pentateuch' },
  { id: 5, name: 'Deuteronomy', testament: 'Old Testament', chapters: 34, category: 'Pentateuch' },
  { id: 6, name: 'Joshua', testament: 'Old Testament', chapters: 24, category: 'Historical' },
  { id: 7, name: 'Judges', testament: 'Old Testament', chapters: 21, category: 'Historical' },
  { id: 8, name: 'Ruth', testament: 'Old Testament', chapters: 4, category: 'Historical' },
  { id: 9, name: '1 Samuel', testament: 'Old Testament', chapters: 31, category: 'Historical' },
  { id: 10, name: '2 Samuel', testament: 'Old Testament', chapters: 24, category: 'Historical' },
  { id: 11, name: '1 Kings', testament: 'Old Testament', chapters: 22, category: 'Historical' },
  { id: 12, name: '2 Kings', testament: 'Old Testament', chapters: 25, category: 'Historical' },
  { id: 13, name: '1 Chronicles', testament: 'Old Testament', chapters: 29, category: 'Historical' },
  { id: 14, name: '2 Chronicles', testament: 'Old Testament', chapters: 36, category: 'Historical' },
  { id: 15, name: 'Ezra', testament: 'Old Testament', chapters: 10, category: 'Historical' },
  { id: 16, name: 'Nehemiah', testament: 'Old Testament', chapters: 13, category: 'Historical' },
  { id: 17, name: 'Esther', testament: 'Old Testament', chapters: 10, category: 'Historical' },
  { id: 18, name: 'Job', testament: 'Old Testament', chapters: 42, category: 'Wisdom' },
  { id: 19, name: 'Psalms', testament: 'Old Testament', chapters: 150, category: 'Wisdom' },
  { id: 20, name: 'Proverbs', testament: 'Old Testament', chapters: 31, category: 'Wisdom' },
  { id: 21, name: 'Ecclesiastes', testament: 'Old Testament', chapters: 12, category: 'Wisdom' },
  { id: 22, name: 'Song of Solomon', testament: 'Old Testament', chapters: 8, category: 'Wisdom' },
  { id: 23, name: 'Isaiah', testament: 'Old Testament', chapters: 66, category: 'Major Prophets' },
  { id: 24, name: 'Jeremiah', testament: 'Old Testament', chapters: 52, category: 'Major Prophets' },
  { id: 25, name: 'Lamentations', testament: 'Old Testament', chapters: 5, category: 'Major Prophets' },
  { id: 26, name: 'Ezekiel', testament: 'Old Testament', chapters: 48, category: 'Major Prophets' },
  { id: 27, name: 'Daniel', testament: 'Old Testament', chapters: 12, category: 'Major Prophets' },
  { id: 28, name: 'Hosea', testament: 'Old Testament', chapters: 14, category: 'Minor Prophets' },
  { id: 29, name: 'Joel', testament: 'Old Testament', chapters: 3, category: 'Minor Prophets' },
  { id: 30, name: 'Amos', testament: 'Old Testament', chapters: 9, category: 'Minor Prophets' },
  { id: 31, name: 'Obadiah', testament: 'Old Testament', chapters: 1, category: 'Minor Prophets' },
  { id: 32, name: 'Jonah', testament: 'Old Testament', chapters: 4, category: 'Minor Prophets' },
  { id: 33, name: 'Micah', testament: 'Old Testament', chapters: 7, category: 'Minor Prophets' },
  { id: 34, name: 'Nahum', testament: 'Old Testament', chapters: 3, category: 'Minor Prophets' },
  { id: 35, name: 'Habakkuk', testament: 'Old Testament', chapters: 3, category: 'Minor Prophets' },
  { id: 36, name: 'Zephaniah', testament: 'Old Testament', chapters: 3, category: 'Minor Prophets' },
  { id: 37, name: 'Haggai', testament: 'Old Testament', chapters: 2, category: 'Minor Prophets' },
  { id: 38, name: 'Zechariah', testament: 'Old Testament', chapters: 14, category: 'Minor Prophets' },
  { id: 39, name: 'Malachi', testament: 'Old Testament', chapters: 4, category: 'Minor Prophets' },

  // Deuterocanonical Books
  { id: 40, name: 'Tobit', testament: 'Deuterocanonical', chapters: 14, category: 'Deuterocanonical' },
  { id: 41, name: 'Judith', testament: 'Deuterocanonical', chapters: 16, category: 'Deuterocanonical' },
  { id: 42, name: 'Wisdom of Solomon', testament: 'Deuterocanonical', chapters: 19, category: 'Deuterocanonical' },
  { id: 43, name: 'Sirach', testament: 'Deuterocanonical', chapters: 51, category: 'Deuterocanonical' },
  { id: 44, name: 'Baruch', testament: 'Deuterocanonical', chapters: 5, category: 'Deuterocanonical' },
  { id: 45, name: '1 Maccabees', testament: 'Deuterocanonical', chapters: 16, category: 'Deuterocanonical' },
  { id: 46, name: '2 Maccabees', testament: 'Deuterocanonical', chapters: 15, category: 'Deuterocanonical' },
  { id: 47, name: '1 Esdras', testament: 'Deuterocanonical', chapters: 9, category: 'Deuterocanonical' },
  { id: 48, name: 'Prayer of Manasseh', testament: 'Deuterocanonical', chapters: 1, category: 'Deuterocanonical' },
  { id: 49, name: '2 Esdras', testament: 'Deuterocanonical', chapters: 16, category: 'Deuterocanonical' },

  // New Testament
  { id: 50, name: 'Matthew', testament: 'New Testament', chapters: 28, category: 'Gospels' },
  { id: 51, name: 'Mark', testament: 'New Testament', chapters: 16, category: 'Gospels' },
  { id: 52, name: 'Luke', testament: 'New Testament', chapters: 24, category: 'Gospels' },
  { id: 53, name: 'John', testament: 'New Testament', chapters: 21, category: 'Gospels' },
  { id: 54, name: 'Acts', testament: 'New Testament', chapters: 28, category: 'History' },
  { id: 55, name: 'Romans', testament: 'New Testament', chapters: 16, category: 'Pauline Epistles' },
  { id: 56, name: '1 Corinthians', testament: 'New Testament', chapters: 16, category: 'Pauline Epistles' },
  { id: 57, name: '2 Corinthians', testament: 'New Testament', chapters: 13, category: 'Pauline Epistles' },
  { id: 58, name: 'Galatians', testament: 'New Testament', chapters: 6, category: 'Pauline Epistles' },
  { id: 59, name: 'Ephesians', testament: 'New Testament', chapters: 6, category: 'Pauline Epistles' },
  { id: 60, name: 'Philippians', testament: 'New Testament', chapters: 4, category: 'Pauline Epistles' },
  { id: 61, name: 'Colossians', testament: 'New Testament', chapters: 4, category: 'Pauline Epistles' },
  { id: 62, name: '1 Thessalonians', testament: 'New Testament', chapters: 5, category: 'Pauline Epistles' },
  { id: 63, name: '2 Thessalonians', testament: 'New Testament', chapters: 3, category: 'Pauline Epistles' },
  { id: 64, name: '1 Timothy', testament: 'New Testament', chapters: 6, category: 'Pastoral Epistles' },
  { id: 65, name: '2 Timothy', testament: 'New Testament', chapters: 4, category: 'Pastoral Epistles' },
  { id: 66, name: 'Titus', testament: 'New Testament', chapters: 3, category: 'Pastoral Epistles' },
  { id: 67, name: 'Hebrews', testament: 'New Testament', chapters: 13, category: 'General Epistles' },
  { id: 68, name: 'James', testament: 'New Testament', chapters: 5, category: 'General Epistles' },
  { id: 69, name: '1 Peter', testament: 'New Testament', chapters: 5, category: 'General Epistles' },
  { id: 70, name: '2 Peter', testament: 'New Testament', chapters: 3, category: 'General Epistles' },
  { id: 71, name: '1 John', testament: 'New Testament', chapters: 5, category: 'General Epistles' },
  { id: 72, name: '2 John', testament: 'New Testament', chapters: 1, category: 'General Epistles' },
  { id: 73, name: '3 John', testament: 'New Testament', chapters: 1, category: 'General Epistles' },
  { id: 74, name: 'Jude', testament: 'New Testament', chapters: 1, category: 'General Epistles' },
  { id: 75, name: 'Revelation', testament: 'New Testament', chapters: 22, category: 'Prophecy' },
];

export const bibleCategories: BibleCategory[] = [
  { id: 'pentateuch', name: 'Pentateuch', description: 'The first five books of the Bible', books: [1, 2, 3, 4, 5], color: '#8B4513' },
  { id: 'historical', name: 'Historical Books', description: 'Books that record the history of Israel', books: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], color: '#D2691E' },
  { id: 'wisdom', name: 'Wisdom Literature', description: 'Books of poetry and wisdom', books: [18, 19, 20, 21, 22], color: '#FFD700' },
  { id: 'major-prophets', name: 'Major Prophets', description: 'The longer prophetic books', books: [23, 24, 25, 26, 27], color: '#4A90E2' },
  { id: 'minor-prophets', name: 'Minor Prophets', description: 'The shorter prophetic books', books: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], color: '#50C878' },
  { id: 'deuterocanonical', name: 'Deuterocanonical', description: 'Additional books in some traditions', books: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], color: '#DDA0DD' },
  { id: 'gospels', name: 'Gospels', description: 'The life and teachings of Jesus', books: [50, 51, 52, 53], color: '#FF6B6B' },
  { id: 'history-nt', name: 'Acts', description: 'The early church history', books: [54], color: '#FF8C42' },
  { id: 'pauline', name: 'Pauline Epistles', description: 'Letters written by Paul', books: [55, 56, 57, 58, 59, 60, 61, 62, 63], color: '#20B2AA' },
  { id: 'pastoral', name: 'Pastoral Epistles', description: 'Paul\'s letters to church leaders', books: [64, 65, 66], color: '#9370DB' },
  { id: 'general', name: 'General Epistles', description: 'Letters to the general church', books: [67, 68, 69, 70, 71, 72, 73, 74], color: '#32CD32' },
  { id: 'prophecy-nt', name: 'Prophecy', description: 'The book of Revelation', books: [75], color: '#DC143C' },
];

export const getTotalChapters = (): number => {
  return bibleBooks.reduce((total, book) => total + book.chapters, 0);
};

export const getBooksByTestament = (testament: string) => {
  return bibleBooks.filter(book => book.testament === testament);
};

export const getBooksByCategory = (category: string) => {
  return bibleBooks.filter(book => book.category === category);
};