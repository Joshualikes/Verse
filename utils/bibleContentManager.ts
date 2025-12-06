/**
 * Bible Content Manager
 *
 * This utility helps you add and manage Bible chapter content in the Supabase database.
 * Use these functions to insert, update, and retrieve Bible chapter text.
 */

interface BibleChapterData {
  book_id: number;
  chapter_number: number;
  content: string;
  audio_url?: string;
  estimated_read_time?: number;
  key_verses?: string[];
  themes?: string[];
}

/**
 * Add a single chapter to the database
 *
 * Example usage:
 * ```typescript
 * await addChapter({
 *   book_id: 1,
 *   chapter_number: 1,
 *   content: "In the beginning God created the heavens and the earth...",
 *   estimated_read_time: 5,
 *   key_verses: ["Genesis 1:1", "Genesis 1:27"],
 *   themes: ["Creation", "God's Power"]
 * });
 * ```
 */
export async function addChapter(chapterData: BibleChapterData): Promise<void> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/bible_chapters`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(chapterData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add chapter: ${error}`);
  }
}

/**
 * Update an existing chapter in the database
 */
export async function updateChapter(
  bookId: number,
  chapterNumber: number,
  updates: Partial<Omit<BibleChapterData, 'book_id' | 'chapter_number'>>
): Promise<void> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/bible_chapters?book_id=eq.${bookId}&chapter_number=eq.${chapterNumber}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update chapter: ${error}`);
  }
}

/**
 * Get a specific chapter from the database
 */
export async function getChapter(
  bookId: number,
  chapterNumber: number
): Promise<BibleChapterData | null> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/bible_chapters?book_id=eq.${bookId}&chapter_number=eq.${chapterNumber}`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch chapter');
  }

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

/**
 * Add multiple chapters at once
 *
 * Example usage:
 * ```typescript
 * await addMultipleChapters([
 *   {
 *     book_id: 1,
 *     chapter_number: 1,
 *     content: "In the beginning..."
 *   },
 *   {
 *     book_id: 1,
 *     chapter_number: 2,
 *     content: "Thus the heavens and the earth..."
 *   }
 * ]);
 * ```
 */
export async function addMultipleChapters(chapters: BibleChapterData[]): Promise<void> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/bible_chapters`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(chapters)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add chapters: ${error}`);
  }
}

/**
 * Get all chapters for a specific book
 */
export async function getBookChapters(bookId: number): Promise<BibleChapterData[]> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/bible_chapters?book_id=eq.${bookId}&order=chapter_number.asc`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch book chapters');
  }

  return await response.json();
}

/**
 * Check if a chapter exists in the database
 */
export async function chapterExists(bookId: number, chapterNumber: number): Promise<boolean> {
  const chapter = await getChapter(bookId, chapterNumber);
  return chapter !== null;
}

/**
 * Delete a chapter from the database
 */
export async function deleteChapter(bookId: number, chapterNumber: number): Promise<void> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/bible_chapters?book_id=eq.${bookId}&chapter_number=eq.${chapterNumber}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete chapter');
  }
}
