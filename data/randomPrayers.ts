export const randomPrayers = [
  {
    english: "Dear God, thank you for this new day. Guide my steps and fill my heart with kindness and compassion. Help me to be a light to others. Amen.",
    tagalog: "Mahal na Diyos, salamat sa bagong araw na ito. Gabayan ang aking mga hakbang at punuin ang aking puso ng kabutihan at pagkilala. Tulungan akong maging liwanag sa iba. Amen."
  },
  {
    english: "Lord, I trust in Your love and protection. Whatever challenges come my way, I know You are with me. Give me strength and courage. Amen.",
    tagalog: "Panginoon, nagtitiwala ako sa Inyong pagmamahal at proteksyon. Anuman ang mga hamon na darating, alam ko na nandito Kayo. Bigyan mo ako ng lakas at tapang. Amen."
  },
  {
    english: "Father, bless my loved ones and keep them safe. Help us to grow closer to You and to one another. Let peace reign in our homes. Amen.",
    tagalog: "Ama, pagpalain ang aking mga mahal sa buhay at panatilihin silang ligtas. Tulungan kaming lumalapit sa Iyo at sa isa't isa. Hayaang maghari ang kapayapaan sa aming mga tahanan. Amen."
  },
  {
    english: "Thank You, Lord, for the blessings in my life. Help me to always remember Your goodness and to share that joy with others. Amen.",
    tagalog: "Salamat sa Iyo, Panginoon, para sa mga pagpapala sa aking buhay. Tulungan akong laging alalahanin ang Inyong kabutihan at ibahagi ang kaligayahang iyon sa iba. Amen."
  },
  {
    english: "God, grant me wisdom to make good decisions and compassion to help those in need. Let me serve others with a humble heart. Amen.",
    tagalog: "Diyos, bigyan mo ako ng karunungan para gumawa ng magandang desisyon at malasakit para sa mga nangangailangan. Hayaan akong maglingkod sa iba nang may mapagpiling puso. Amen."
  },
  {
    english: "Lord, when I am troubled, remind me of Your promises. Calm my fears and give me peace that passes all understanding. Amen.",
    tagalog: "Panginoon, kapag ako ay naglilipatan, paalahanin mo ako ng Inyong mga pangako. Panatilihin ang aking takot at bigyan mo ako ng kapayapaan na lumalampas sa lahat ng pag-unawa. Amen."
  },
  {
    english: "Thank You for Your grace and mercy, Lord. Help me to forgive others as You have forgiven me. Teach me to love unconditionally. Amen.",
    tagalog: "Salamat sa Inyong biyaya at kamatayan, Panginoon. Tulungan akong magpatawad sa iba tulad ng inyong pagpatawad sa akin. Turuan mo akong magmahal nang walang kondisyon. Amen."
  },
  {
    english: "Father, guide my words and actions. Help me to be honest and true. Let everything I do reflect Your love. Amen.",
    tagalog: "Ama, gabayan ang aming mga salita at aksyon. Tulungan akong maging tapat at totoo. Hayaang ang lahat ng aking ginagawa ay sumasalamin sa Inyong pagmamahal. Amen."
  },
  {
    english: "Lord, strengthen my faith when it wavers. Help me to trust in Your perfect plan for my life. Give me hope and encouragement. Amen.",
    tagalog: "Panginoon, palakasin ang aking pananampalataya kapag ito ay natitinag. Tulungan akong magtiwala sa Inyong perpektong plano para sa aking buhay. Bigyan mo ako ng pag-asa at inspirasyon. Amen."
  },
  {
    english: "Thank You, Lord, for the gift of this day. Help me to use it wisely and live in a way that honors You. Amen.",
    tagalog: "Salamat, Panginoon, sa handog ng araw na ito. Tulungan akong gamitin ito nang matalino at mamuhay sa paraan na nag-honor sa Iyo. Amen."
  },
  {
    english: "God, I surrender my worries to You. Help me to let go of control and trust in Your wisdom. Fill me with Your peace. Amen.",
    tagalog: "Diyos, isinasasakripisyo ko sa Iyo ang aming mga alalahanin. Tulungan akong magpakawala at magtiwala sa Inyong karunungan. Punuin mo ako ng Inyong kapayapaan. Amen."
  },
  {
    english: "Lord, help me to see others through Your eyes - with love and compassion. Give me a servant's heart. Amen.",
    tagalog: "Panginoon, tulungan akong makita ang iba sa pamamagitan ng Inyong mga mata - nang may pagmamahal at malasakit. Bigyan mo ako ng puso ng umaasa. Amen."
  },
  {
    english: "Thank You for my family and friends. Bless them abundantly and help us to support one another in faith. Amen.",
    tagalog: "Salamat sa aming pamilya at mga kaibigan. Pagpalain silang nang sagana at tulungan kaming suportahan ang isa't isa sa pananampalataya. Amen."
  },
  {
    english: "Father, help me to overcome my fears and doubts. Remind me that You are always by my side. Give me confidence in Your love. Amen.",
    tagalog: "Ama, tulungan akong higitan ang aming mga takot at pag-aalinlangan. Paalahanin mo ako na lagi kayong nasa aking panig. Bigyan mo ako ng kumpiyansa sa Inyong pagmamahal. Amen."
  },
  {
    english: "Lord, guide me toward becoming the person You want me to be. Help me grow in faith, hope, and love each day. Amen.",
    tagalog: "Panginoon, gabayan ako upang maging ang taong nais Mo na maging. Tulungan akong lumago sa pananampalataya, pag-asa, at pagmamahal araw-araw. Amen."
  }
];

export const getRandomPrayer = () => {
  return randomPrayers[Math.floor(Math.random() * randomPrayers.length)];
};
