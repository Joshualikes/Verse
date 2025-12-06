/**
 * Sample Bible Chapter Content
 *
 * This file provides a template for adding Bible chapter content to your database.
 * Replace the sample text with actual Bible verses for each book and chapter.
 *
 * To use this file:
 * 1. Fill in the actual Bible text for each chapter
 * 2. Run the import script to populate the database
 * 3. The app will automatically fetch this content when users read chapters
 */

import { addChapter, addMultipleChapters } from '@/utils/bibleContentManager';

// Example: Genesis Chapters
export const genesisChapters = [
  {
    book_id: 1, // Genesis
    chapter_number: 1,
    content: `In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.

And God said, "Let there be light," and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.

[Continue with the full text of Genesis 1...]

Replace this with the actual Bible text for Genesis Chapter 1.`,
    estimated_read_time: 5,
    key_verses: ['Genesis 1:1', 'Genesis 1:27', 'Genesis 1:31'],
    themes: ['Creation', 'God\'s Power', 'Beginning of Time']
  },
  {
    book_id: 1,
    chapter_number: 2,
    content: `Thus the heavens and the earth were completed in all their vast array. By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.

[Continue with the full text of Genesis 2...]

Replace this with the actual Bible text for Genesis Chapter 2.`,
    estimated_read_time: 4,
    key_verses: ['Genesis 2:7', 'Genesis 2:18', 'Genesis 2:24'],
    themes: ['Rest', 'Creation of Man', 'Marriage']
  },
  // Add all 50 chapters of Genesis...
];

// Example: Matthew Chapters
export const matthewChapters = [
  {
    book_id: 50, // Matthew
    chapter_number: 1,
    content: `This is the genealogy of Jesus the Messiah the son of David, the son of Abraham:

Abraham was the father of Isaac, Isaac the father of Jacob, Jacob the father of Judah and his brothers...

[Continue with the full text of Matthew 1...]

Replace this with the actual Bible text for Matthew Chapter 1.`,
    estimated_read_time: 6,
    key_verses: ['Matthew 1:1', 'Matthew 1:21', 'Matthew 1:23'],
    themes: ['Genealogy', 'Birth of Jesus', 'Prophecy Fulfilled']
  },
  {
    book_id: 50,
    chapter_number: 2,
    content: `After Jesus was born in Bethlehem in Judea, during the time of King Herod, Magi from the east came to Jerusalem and asked, "Where is the one who has been born king of the Jews? We saw his star when it rose and have come to worship him."

[Continue with the full text of Matthew 2...]

Replace this with the actual Bible text for Matthew Chapter 2.`,
    estimated_read_time: 5,
    key_verses: ['Matthew 2:1-2', 'Matthew 2:11', 'Matthew 2:15'],
    themes: ['Visit of the Magi', 'Flight to Egypt', 'Herod\'s Persecution']
  },
  // Add all 28 chapters of Matthew...
];

// Template for adding a single book's chapters
export const createBookChapters = (bookId: number, bookName: string, totalChapters: number) => {
  const chapters = [];

  for (let i = 1; i <= totalChapters; i++) {
    chapters.push({
      book_id: bookId,
      chapter_number: i,
      content: `[${bookName} Chapter ${i}]

Replace this text with the actual Bible content for ${bookName} Chapter ${i}.

You can include:
- The full chapter text
- Verse numbers
- Paragraph breaks
- Any other formatting you need

Example format:
1 Verse one text here.
2 Verse two text here.
3 Verse three text here.

And so on for the entire chapter.`,
      estimated_read_time: 5, // Update based on actual chapter length
      key_verses: [], // Add key verses for this chapter
      themes: [] // Add themes for this chapter
    });
  }

  return chapters;
};

// Function to add all chapters for a specific book
export async function addBookToDatabase(bookId: number, bookName: string, totalChapters: number) {
  console.log(`Adding ${bookName} with ${totalChapters} chapters...`);

  const chapters = createBookChapters(bookId, bookName, totalChapters);

  try {
    await addMultipleChapters(chapters);
    console.log(`Successfully added ${bookName}!`);
  } catch (error) {
    console.error(`Error adding ${bookName}:`, error);
    throw error;
  }
}

// Function to add a single chapter with custom content
export async function addSingleChapter(
  bookId: number,
  chapterNumber: number,
  content: string,
  options?: {
    audioUrl?: string;
    estimatedReadTime?: number;
    keyVerses?: string[];
    themes?: string[];
  }
) {
  try {
    await addChapter({
      book_id: bookId,
      chapter_number: chapterNumber,
      content: content,
      audio_url: options?.audioUrl,
      estimated_read_time: options?.estimatedReadTime || 5,
      key_verses: options?.keyVerses || [],
      themes: options?.themes || []
    });
    console.log(`Successfully added Chapter ${chapterNumber} for Book ID ${bookId}!`);
  } catch (error) {
    console.error('Error adding chapter:', error);
    throw error;
  }
}

// Quick reference for all Bible books and chapter counts
export const allBibleBooks = [
  // Old Testament
  { id: 1, name: 'Genesis', chapters: 50 },
  { id: 2, name: 'Exodus', chapters: 40 },
  { id: 3, name: 'Leviticus', chapters: 27 },
  { id: 4, name: 'Numbers', chapters: 36 },
  { id: 5, name: 'Deuteronomy', chapters: 34 },
  // ... Add all 75 books
  // New Testament
  { id: 50, name: 'Matthew', chapters: 28 },
  { id: 51, name: 'Mark', chapters: 16 },
  { id: 52, name: 'Luke', chapters: 24 },
  { id: 53, name: 'John', chapters: 21 },
  // ... Continue with remaining books
];

/**
 * HOW TO USE THIS FILE:
 *
 * 1. ADDING A SINGLE CHAPTER:
 * ```typescript
 * import { addSingleChapter } from '@/data/sampleChapterContent';
 *
 * await addSingleChapter(1, 1, "In the beginning God created...", {
 *   estimatedReadTime: 5,
 *   keyVerses: ["Genesis 1:1"],
 *   themes: ["Creation"]
 * });
 * ```
 *
 * 2. ADDING ALL CHAPTERS FOR A BOOK (with placeholders):
 * ```typescript
 * import { addBookToDatabase } from '@/data/sampleChapterContent';
 *
 * await addBookToDatabase(1, "Genesis", 50);
 * ```
 *
 * 3. ADDING MULTIPLE CHAPTERS WITH CONTENT:
 * ```typescript
 * import { addMultipleChapters } from '@/utils/bibleContentManager';
 *
 * await addMultipleChapters([
 *   { book_id: 1, chapter_number: 1, content: "..." },
 *   { book_id: 1, chapter_number: 2, content: "..." },
 *   // ... more chapters
 * ]);
 * ```
 */
