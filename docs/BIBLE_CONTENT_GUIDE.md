# Bible Content Management Guide

This guide explains how to add and manage Bible chapter content in your app.

## Overview

The app now uses a Supabase database to store Bible chapter content. Each chapter is stored individually, allowing you to add, edit, and manage the text for all 1,189 chapters of the Bible.

## Database Structure

The `bible_chapters` table has the following structure:

- `book_id`: The ID of the Bible book (1-75, matching bibleBooks.ts)
- `chapter_number`: The chapter number within the book
- `content`: The full text content of the chapter
- `audio_url`: Optional URL to an audio recording
- `estimated_read_time`: Estimated reading time in minutes
- `key_verses`: Array of important verse references
- `themes`: Array of themes covered in the chapter

## How to Add Content

### Method 1: Add a Single Chapter

```typescript
import { addSingleChapter } from '@/data/sampleChapterContent';

await addSingleChapter(
  1,  // book_id (Genesis)
  1,  // chapter_number
  `In the beginning God created the heavens and the earth...`, // content
  {
    estimatedReadTime: 5,
    keyVerses: ['Genesis 1:1', 'Genesis 1:27'],
    themes: ['Creation', 'God\'s Power']
  }
);
```

### Method 2: Add Multiple Chapters at Once

```typescript
import { addMultipleChapters } from '@/utils/bibleContentManager';

await addMultipleChapters([
  {
    book_id: 1,
    chapter_number: 1,
    content: "In the beginning God created..."
  },
  {
    book_id: 1,
    chapter_number: 2,
    content: "Thus the heavens and the earth..."
  },
  // Add more chapters...
]);
```

### Method 3: Using the Script Template

1. Open `scripts/addBibleContent.ts`
2. Fill in your Bible text in the appropriate section
3. Uncomment the function you want to run
4. Execute the script

## Step-by-Step Guide

### Step 1: Prepare Your Content

Organize your Bible text by book and chapter. You can:
- Copy text from Bible Gateway, YouVersion, or another source
- Use plain text files organized by book
- Use a Bible API to fetch content

### Step 2: Format Your Content

Format the text as needed:

**With verse numbers:**
```
1 In the beginning God created the heavens and the earth.
2 Now the earth was formless and empty, darkness was over the surface of the deep.
3 And God said, "Let there be light," and there was light.
```

**Without verse numbers:**
```
In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep. And God said, "Let there be light," and there was light.
```

### Step 3: Add to Database

Choose your preferred method:

**Quick Single Chapter:**
```typescript
import { addChapter } from '@/utils/bibleContentManager';

await addChapter({
  book_id: 19,
  chapter_number: 23,
  content: `The Lord is my shepherd, I lack nothing.
He makes me lie down in green pastures...`,
  estimated_read_time: 2,
  key_verses: ['Psalm 23:1'],
  themes: ['God as Shepherd', 'Trust']
});
```

**Bulk Import:**
```typescript
// Create an array of all chapters for a book
const psalmsChapters = [];
for (let i = 1; i <= 150; i++) {
  psalmsChapters.push({
    book_id: 19,
    chapter_number: i,
    content: getPsalmContent(i), // Your function to get content
    estimated_read_time: 5
  });
}

await addMultipleChapters(psalmsChapters);
```

## Book IDs Reference

Here are some commonly used book IDs:

**Old Testament:**
- 1: Genesis (50 chapters)
- 2: Exodus (40 chapters)
- 19: Psalms (150 chapters)

**New Testament:**
- 50: Matthew (28 chapters)
- 51: Mark (16 chapters)
- 52: Luke (24 chapters)
- 53: John (21 chapters)

See `data/bibleBooks.ts` for the complete list.

## Tips for Content Entry

1. **Start Small**: Begin with a few popular chapters (Psalm 23, John 3, Genesis 1)
2. **Test as You Go**: Add a chapter and test it in the app before continuing
3. **Batch by Book**: Work on one book at a time to stay organized
4. **Include Metadata**: Add key verses and themes to enhance the reading experience
5. **Estimate Read Time**: Roughly 200-250 words = 1 minute of reading

## Updating Existing Content

To update a chapter that's already in the database:

```typescript
import { updateChapter } from '@/utils/bibleContentManager';

await updateChapter(1, 1, {
  content: "Updated content...",
  estimated_read_time: 6,
  key_verses: ['Genesis 1:1', 'Genesis 1:27', 'Genesis 1:31']
});
```

## Checking Content Status

To see if a chapter exists:

```typescript
import { chapterExists } from '@/utils/bibleContentManager';

const exists = await chapterExists(1, 1);
console.log(`Genesis 1 exists: ${exists}`);
```

To get all chapters for a book:

```typescript
import { getBookChapters } from '@/utils/bibleContentManager';

const genesisChapters = await getBookChapters(1);
console.log(`Genesis has ${genesisChapters.length} chapters in database`);
```

## Recommended Workflow

1. **Priority Chapters**: Start with the most commonly read chapters
   - Psalm 23
   - John 3
   - Genesis 1
   - Matthew 5-7 (Sermon on the Mount)
   - 1 Corinthians 13 (Love Chapter)

2. **Complete Books**: Then move to completing entire books
   - Start with shorter books (Ruth, Jonah, Philippians)
   - Then tackle medium books (Mark, 1 Peter)
   - Finally complete larger books (Genesis, Psalms, Isaiah)

3. **Bulk Operations**: Use scripts to add multiple chapters efficiently

4. **Verification**: Regularly test chapters in the app to ensure proper display

## Troubleshooting

**Chapter not showing in app:**
- Check that book_id and chapter_number are correct
- Verify content was actually saved (use getChapter to check)
- Check browser console for errors

**Content formatting issues:**
- Ensure newlines are preserved in your content string
- Use backticks (`) for multi-line strings in JavaScript
- Test with a short chapter first

**Database connection errors:**
- Verify Supabase environment variables are set
- Check that RLS policies allow read access
- Ensure you're authenticated if required

## Advanced: Using Bible APIs

You can automate content entry using Bible APIs:

```typescript
// Example using a Bible API (pseudo-code)
async function importFromAPI(bookId: number, bookName: string) {
  for (let chapter = 1; chapter <= getChapterCount(bookId); chapter++) {
    const content = await fetchFromBibleAPI(bookName, chapter);
    await addChapter({
      book_id: bookId,
      chapter_number: chapter,
      content: content
    });
  }
}
```

Popular Bible APIs:
- Bible Gateway API
- API.Bible
- ESV API
- YouVersion API

## Support

For questions or issues:
1. Check the code comments in `utils/bibleContentManager.ts`
2. Review example usage in `scripts/addBibleContent.ts`
3. Test with the sample content in `data/sampleChapterContent.ts`
