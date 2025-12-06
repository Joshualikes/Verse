export const loadingVerses = [
  {
    text: "I have told you all this, so that you may have peace in me. Here on earth you will have many trials and sorrows. But take heart, because I have overcome the world.",
    reference: "John 16:33"
  },
  {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16"
  },
  {
    text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",
    reference: "John 14:6"
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28"
  },
  {
    text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    reference: "2 Corinthians 5:17"
  },
  {
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5"
  },
  {
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.",
    reference: "Psalm 23:1-2"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    text: "Blessed are those who have not seen and yet have believed.",
    reference: "John 20:29"
  },
  {
    text: "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.",
    reference: "Matthew 19:14"
  },
  {
    text: "Love one another. As I have loved you, so you must love one another.",
    reference: "John 13:34"
  },
  {
    text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    reference: "Matthew 28:19"
  },
  {
    text: "This is the message we have heard from him and declare to you: God is light; in him there is no darkness at all.",
    reference: "1 John 1:5"
  },
  {
    text: "Jesus wept. The Jews said, 'See how he loved him!'",
    reference: "John 11:35-36"
  },
  {
    text: "So God created mankind in his own image, in the image of God he created them; male and female he created them.",
    reference: "Genesis 1:27"
  },
  {
    text: "Now we see only a reflection as in a mirror; then we shall see face to face. Now I know in part; then I shall know fully.",
    reference: "1 Corinthians 13:12"
  },
  {
    text: "I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.",
    reference: "John 8:12"
  },
  {
    text: "Do to others as you would have them do to you.",
    reference: "Luke 6:31"
  }
];

export const getRandomVerse = () => {
  return loadingVerses[Math.floor(Math.random() * loadingVerses.length)];
};
