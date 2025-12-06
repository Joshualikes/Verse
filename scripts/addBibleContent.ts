/**
 * Bible Content Addition Script
 *
 * This script helps you easily add Bible chapter content to the database.
 * You can run this script to populate chapters individually or in bulk.
 *
 * USAGE:
 * 1. Fill in your Bible text below
 * 2. Uncomment the appropriate function call
 * 3. Run the script
 */

import { addSingleChapter } from '../data/sampleChapterContent';
import { addMultipleChapters } from '../utils/bibleContentManager';

/**
 * EXAMPLE 1: Add a single chapter
 * Replace the content with actual Bible text
 */
async function addGenesisChapter1() {
  const content = `In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.

And God said, "Let there be light," and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.

And God said, "Let there be a vault between the waters to separate water from water." So God made the vault and separated the water under the vault from the water above it. And it was so. God called the vault "sky." And there was evening, and there was morning—the second day.

[Continue with the rest of Genesis 1...]`;

  await addSingleChapter(1, 1, content, {
    estimatedReadTime: 5,
    keyVerses: ['Genesis 1:1', 'Genesis 1:27', 'Genesis 1:31'],
    themes: ['Creation', 'God\'s Power', 'Beginning']
  });
}

/**
 * EXAMPLE 2: Add multiple chapters for Genesis
 */
async function addGenesisChapters() {
  const chapters = [
    {
      book_id: 1,
      chapter_number: 1,
      content: `[Your Genesis Chapter 1 text here...]`,
      estimated_read_time: 5,
      key_verses: ['Genesis 1:1', 'Genesis 1:27'],
      themes: ['Creation']
    },
    {
      book_id: 1,
      chapter_number: 2,
      content: `[Your Genesis Chapter 2 text here...]`,
      estimated_read_time: 4,
      key_verses: ['Genesis 2:7', 'Genesis 2:24'],
      themes: ['Creation of Man', 'Marriage']
    },
    {
      book_id: 1,
      chapter_number: 3,
      content: `[Your Genesis Chapter 3 text here...]`,
      estimated_read_time: 5,
      key_verses: ['Genesis 3:15'],
      themes: ['Fall of Man', 'Sin', 'Promise of Redemption']
    },
    // Add more chapters as needed...
  ];

  await addMultipleChapters(chapters);
}

/**
 * EXAMPLE 3: Template for any book
 * This creates a template for all chapters of a book
 */
function generateBookTemplate(bookId: number, bookName: string, totalChapters: number) {
  const chapters = [];

  for (let i = 1; i <= totalChapters; i++) {
    chapters.push({
      book_id: bookId,
      chapter_number: i,
      content: `
===========================================
${bookName} - Chapter ${i}
===========================================

[Replace this with the actual chapter content]

Instructions:
1. Copy the full chapter text from your Bible source
2. Include all verses
3. Format with proper paragraph breaks
4. You can include verse numbers like:

1 In the beginning God created the heavens and the earth.
2 Now the earth was formless and empty...
3 And God said, "Let there be light," and there was light.

Or without verse numbers:
In the beginning God created the heavens and the earth. Now the earth was formless and empty...

Choose whatever format works best for your app!
`,
      estimated_read_time: 5,
      key_verses: [],
      themes: []
    });
  }

  return chapters;
}

/**
 * QUICK START GUIDE
 *
 * To add your Bible content:
 *
 * 1. For a single chapter:
 *    - Edit the content in addGenesisChapter1() above
 *    - Run: addGenesisChapter1()
 *
 * 2. For multiple chapters:
 *    - Edit the chapters array in addGenesisChapters()
 *    - Add your content for each chapter
 *    - Run: addGenesisChapters()
 *
 * 3. For a whole book:
 *    - Generate a template: const template = generateBookTemplate(1, "Genesis", 50)
 *    - Fill in the content for each chapter
 *    - Run: addMultipleChapters(template)
 */

// Uncomment the function you want to run:
// addGenesisChapter1();
// addGenesisChapters();

// Or create your own custom additions:
async function myCustomContent() {
  // Example: Adding Psalm 23
  await addSingleChapter(19, 23, `The Lord is my shepherd, I lack nothing.
He makes me lie down in green pastures,
he leads me beside quiet waters,
he refreshes my soul.
He guides me along the right paths
for his name's sake.

Even though I walk
through the darkest valley,
I will fear no evil,
for you are with me;
your rod and your staff,
they comfort me.

You prepare a table before me
in the presence of my enemies.
You anoint my head with oil;
my cup overflows.
Surely your goodness and love will follow me
all the days of my life,
and I will dwell in the house of the Lord
forever.`, {
    estimatedReadTime: 2,
    keyVerses: ['Psalm 23:1', 'Psalm 23:4'],
    themes: ['God as Shepherd', 'Trust', 'Protection', 'Comfort']
  });

  // Example: Adding John 3
  await addSingleChapter(53, 3, `Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council. He came to Jesus at night and said, "Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him."

Jesus replied, "Very truly I tell you, no one can see the kingdom of God unless they are born again."

[Continue with the rest of John 3...]

For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.`, {
    estimatedReadTime: 7,
    keyVerses: ['John 3:16', 'John 3:3'],
    themes: ['Born Again', 'Salvation', 'God\'s Love', 'Eternal Life']
  });
}

// Uncomment to run your custom content:
// myCustomContent();

export { addGenesisChapter1, addGenesisChapters, generateBookTemplate, myCustomContent };
