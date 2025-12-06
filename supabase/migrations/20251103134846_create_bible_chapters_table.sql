/*
  # Create Bible Chapters Table

  ## Overview
  This migration creates a table to store the actual content of Bible chapters,
  allowing individual text input for each book and chapter combination.

  ## Tables Created

  ### `bible_chapters`
  Stores the actual text content for each chapter of every Bible book.
  
  **Columns:**
  - `id` (uuid, primary key): Unique identifier for each chapter record
  - `book_id` (integer, not null): References the Bible book (1-75 from bibleBooks.ts)
  - `chapter_number` (integer, not null): The chapter number within the book
  - `content` (text, not null): The full text content of the chapter
  - `audio_url` (text, optional): URL to audio recording of the chapter
  - `estimated_read_time` (integer, default 5): Estimated reading time in minutes
  - `key_verses` (text array, optional): Array of key verse references
  - `themes` (text array, optional): Array of themes covered in the chapter
  - `created_at` (timestamptz): When the record was created
  - `updated_at` (timestamptz): When the record was last updated

  ## Constraints
  - Unique constraint on (book_id, chapter_number) to prevent duplicates
  - Check constraint to ensure chapter_number is positive

  ## Indexes
  - Index on book_id for fast lookups by book
  - Index on (book_id, chapter_number) for fast chapter retrieval

  ## Security
  - Row Level Security (RLS) enabled
  - Public read access for all users (anyone can read Bible content)
  - Only authenticated admins can insert/update content (you'll manage this separately)

  ## Notes
  - This table stores the actual Bible text that will replace the lorem ipsum placeholder
  - Each book-chapter combination should have exactly one record
  - Content can be as long as needed (text type supports very large content)
*/

-- Create bible_chapters table
CREATE TABLE IF NOT EXISTS bible_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id integer NOT NULL,
  chapter_number integer NOT NULL,
  content text NOT NULL,
  audio_url text,
  estimated_read_time integer DEFAULT 5,
  key_verses text[],
  themes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure each book-chapter combination is unique
  CONSTRAINT unique_book_chapter UNIQUE (book_id, chapter_number),
  
  -- Ensure chapter numbers are positive
  CONSTRAINT positive_chapter_number CHECK (chapter_number > 0),
  
  -- Ensure book_id is valid (1-75 based on bibleBooks.ts)
  CONSTRAINT valid_book_id CHECK (book_id >= 1 AND book_id <= 75)
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_bible_chapters_book_id ON bible_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_bible_chapters_book_chapter ON bible_chapters(book_id, chapter_number);

-- Enable Row Level Security
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read Bible content (public access)
CREATE POLICY "Anyone can read Bible chapters"
  ON bible_chapters
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users can insert chapters (for content management)
CREATE POLICY "Authenticated users can insert chapters"
  ON bible_chapters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update chapters (for content management)
CREATE POLICY "Authenticated users can update chapters"
  ON bible_chapters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete chapters (for content management)
CREATE POLICY "Authenticated users can delete chapters"
  ON bible_chapters
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bible_chapters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER trigger_update_bible_chapters_updated_at
  BEFORE UPDATE ON bible_chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_bible_chapters_updated_at();