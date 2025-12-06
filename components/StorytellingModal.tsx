import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  ScrollView,
  Image,
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Play, 
  Pause, 
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react-native';
import { Audio } from 'expo-av';

interface StorytellingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: (storyId: number) => void;
  story: {
    id: number;
    title: string;
    image: string;
    hasAudio: boolean;
    difficulty: string;
  };
  category: string;
}

const { width, height } = Dimensions.get('window');

const storyContent = {
  1: {
    title: "Jesus with Children",
    text: "One day, people were bringing their little children to Jesus so that he might touch them and bless them. But the disciples saw this and thought Jesus was too busy for children. They tried to send the families away.\n\nWhen Jesus saw what his disciples were doing, he was not pleased. He called the children to come to him and said, 'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.'\n\nJesus took the children in his arms, placed his hands on them, and blessed them. He showed everyone that children are very important to God. Jesus loves all children and wants them to come to him.\n\nThe children felt safe and loved with Jesus. Their parents were filled with joy to see how much Jesus cared for their little ones. This story teaches us that Jesus has a special place in his heart for children.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  2: {
    title: "The Good Shepherd",
    text: "Jesus told a beautiful story about a shepherd who had one hundred sheep. Every day, the shepherd would lead his sheep to green pastures where they could eat fresh grass and drink clean water.\n\nOne evening, when the shepherd was counting his sheep, he discovered that one was missing! Ninety-nine sheep were safe in the fold, but one little sheep had wandered away and was lost.\n\nDid the shepherd say, 'Well, I still have ninety-nine sheep, that's enough'? No! The good shepherd left the ninety-nine sheep in a safe place and went out into the dark night to search for the one lost sheep.\n\nHe searched high and low, calling for his lost sheep. Finally, he heard a faint bleating sound. There was his sheep, scared and alone! The shepherd gently picked up the sheep, put it on his shoulders, and carried it home safely.\n\nJesus said, 'I am the good shepherd. I know my sheep and my sheep know me.' Just like the shepherd in the story, Jesus loves each one of us and will never give up on us when we are lost.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  3: {
    title: "Miracle of Loaves",
    text: "One day, Jesus was teaching by the Sea of Galilee when a huge crowd of people came to hear him speak. There were over five thousand people! As the day grew late, the disciples became worried.\n\n'Jesus,' they said, 'it's getting late and the people are hungry. Send them away so they can buy food in the nearby villages.'\n\nBut Jesus said, 'You give them something to eat.'\n\nThe disciples were amazed. 'How can we feed so many people? We only have a little money, and it would take months of wages to buy enough bread!'\n\nThen a young boy came forward. He had brought his lunch: five small loaves of bread and two small fish. It wasn't much, but he offered it to Jesus.\n\nJesus took the boy's lunch, looked up to heaven, and gave thanks to God. Then something amazing happened! Jesus broke the bread and fish into pieces, and the disciples distributed the food to everyone.\n\nMiraculously, everyone ate until they were full! When they gathered the leftover pieces, they filled twelve baskets. From one small lunch, Jesus had fed over five thousand people!\n\nThis miracle shows us that when we offer what we have to Jesus, no matter how small, he can do amazing things with it.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  4: {
    title: "Walking on Water",
    text: "After Jesus fed the five thousand people, he told his disciples to get in their boat and cross to the other side of the lake while he went up on a mountain to pray.\n\nAs evening came, the disciples were in the middle of the lake, rowing hard against strong winds and waves. The boat was being tossed back and forth, and they were having trouble making progress.\n\nEarly in the morning, while it was still dark, Jesus came to them. But he wasn't in a boat – he was walking on the water! When the disciples saw him walking on the lake, they were terrified.\n\n'It's a ghost!' they cried out in fear.\n\nBut Jesus immediately called out to them, 'Take courage! It is I. Don't be afraid!'\n\nPeter, always eager and bold, said, 'Lord, if it's really you, let me walk on the water too!'\n\n'Come on,' Jesus said.\n\nPeter stepped out of the boat and began walking on the water toward Jesus! But when he saw the strong wind and waves, he became afraid and started to sink.\n\n'Lord, save me!' Peter cried.\n\nImmediately, Jesus reached out and caught him. 'Why did you doubt?' Jesus asked gently.\n\nWhen Jesus got into the boat, the wind stopped blowing. The disciples were amazed and worshiped Jesus, saying, 'Truly you are the Son of God!'\n\nThis miracle shows us that Jesus has power over nature and that we can trust him even in the storms of life.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  5: {
    title: "Building the Ark",
    text: "Long, long ago, there lived a good man named Noah. While everyone around him was doing wrong things, Noah loved God and tried to obey him in everything he did.\n\nOne day, God spoke to Noah and said, 'I am going to send a great flood to wash away all the wickedness in the world. But I want to save you and your family because you are faithful to me.'\n\nGod gave Noah very specific instructions: 'Build a large boat called an ark. Make it 300 cubits long, 50 cubits wide, and 30 cubits high. Cover it with tar inside and out to make it waterproof.'\n\nNoah listened carefully as God continued: 'Make rooms inside the ark, and build a window and a door. I want you to bring two of every kind of animal – male and female – into the ark. Also bring seven pairs of every clean animal and bird.'\n\nNoah must have wondered how he could possibly build such a huge boat! But he trusted God completely. Noah and his sons – Shem, Ham, and Japheth – began the enormous task of building the ark.\n\nDay after day, month after month, they worked. People probably laughed at Noah, thinking he was crazy for building a boat when there wasn't even a lake nearby! But Noah kept working because he believed God's word.\n\nFinally, after many years of hard work, the ark was finished. It was a magnificent sight – the largest boat anyone had ever seen! Noah had obeyed God perfectly, and now they were ready for what would come next.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  6: {
    title: "Animals Boarding",
    text: "When the ark was finally complete, God said to Noah, 'The time has come. Gather your family and bring all the animals into the ark, just as I commanded you.'\n\nWhat an amazing sight it must have been! From all over the earth, animals began coming to Noah. There were big animals and small animals, animals that walked and animals that crawled, animals that flew and animals that swam.\n\nTwo by two, they came: elephants trumpeting, lions roaring, bears lumbering, horses galloping, and sheep bleating. Birds of every color flew overhead – eagles, sparrows, peacocks, and doves. Creeping creatures came too – snakes slithering, lizards scurrying, and insects buzzing.\n\nNoah and his family worked hard to help all the animals find their places in the ark. They made sure each animal had enough space and the right kind of food. The ark became like a floating zoo!\n\nSome animals were easy to handle, like the gentle lambs and friendly dogs. Others were more challenging, like the roaring lions and the enormous elephants. But God helped Noah manage them all.\n\nEven the tiniest creatures found their way to the ark – butterflies, beetles, and busy ants. God cared about every single animal, from the mightiest elephant to the smallest mouse.\n\nWhen all the animals were safely inside, Noah and his family – his wife, his three sons, and their wives – entered the ark too. Then God himself shut the door. They were all safe inside, just as God had promised.\n\nThe ark was full of life and ready for the great adventure that lay ahead!",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  7: {
    title: "The Great Flood",
    text: "Seven days after everyone was safely inside the ark, the rain began to fall. At first, it was just a gentle shower, but then it became heavier and heavier.\n\nThe rain didn't stop after an hour, or a day, or even a week. It rained for forty days and forty nights! Water poured down from the sky like never before. At the same time, underground springs burst open, sending water gushing up from the earth.\n\nSlowly, the water began to rise. First, it covered the grass and flowers. Then it reached the bushes and small trees. Higher and higher the water rose, covering houses and tall trees, then hills and mountains.\n\nInside the ark, Noah and his family could hear the rain pounding on the roof and feel the ark beginning to float. The animals sensed something big was happening. Some were restless, others were quiet, but Noah took care of them all.\n\nFor months, the ark floated on the vast ocean that now covered the entire earth. There was water everywhere – no land could be seen in any direction. But inside the ark, everyone was safe and dry.\n\nNoah trusted that God would take care of them. Every day, he fed the animals and made sure they had everything they needed. His family helped him care for all the creatures, from the tiniest insects to the largest elephants.\n\nThe ark became their home on the water, floating safely above the flood while God protected them all. Even in the middle of the great flood, God's love surrounded Noah and every living thing in the ark.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  8: {
    title: "Rainbow Promise",
    text: "After many months floating on the water, the rain finally stopped. Slowly, very slowly, the water began to go down. Noah was eager to know if there was dry land anywhere.\n\nFirst, Noah sent out a raven to see if it could find land, but it just flew back and forth. Then Noah sent out a dove. The dove flew around but couldn't find anywhere to rest, so it came back to the ark.\n\nSeven days later, Noah sent the dove out again. This time, when it returned, it had a fresh olive leaf in its beak! Noah was so excited – this meant that plants were growing again and the water was going down.\n\nAfter another week, Noah sent the dove out once more. This time, the dove didn't come back at all, which meant it had found a good place to live.\n\nFinally, God said to Noah, 'Come out of the ark, you and your family and all the animals. It's time to start fresh on the earth.'\n\nWhat a joyful day that was! After more than a year in the ark, Noah opened the door. The animals rushed out – lions roaring with happiness, elephants trumpeting, birds singing, and rabbits hopping with joy. Every creature was excited to be on solid ground again.\n\nNoah and his family stepped out and felt the warm sun on their faces. The first thing Noah did was build an altar and thank God for keeping them safe.\n\nThen something beautiful happened. God put a magnificent rainbow in the sky – the very first rainbow ever! God said, 'This rainbow is my promise to you. I will never again destroy the earth with a flood. Whenever you see a rainbow, remember my promise.'\n\nEven today, when we see a rainbow after the rain, we can remember God's faithful promise to Noah and to us.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  9: {
    title: "Following the Star",
    text: "Far away in the East, there lived wise men who studied the stars. These men, called Magi, spent their nights looking at the sky and learning about God's creation.\n\nOne night, they saw something amazing – a new star that was brighter and more beautiful than any star they had ever seen! This wasn't an ordinary star. It seemed to move across the sky, and somehow they knew it was very special.\n\nThe wise men had studied ancient writings that told of a promised King who would be born to save the world. When they saw this magnificent star, they knew it meant the promised King had been born!\n\n'We must go and find this newborn King,' they said to each other. 'We must worship him and bring him gifts.'\n\nSo the wise men prepared for a long journey. They loaded their camels with food, water, and precious gifts. Most importantly, they brought gold, frankincense, and myrrh – gifts fit for a king.\n\nDay after day, night after night, they followed the star. It led them across deserts, over hills, and through many lands. The journey was long and difficult, but they never gave up because they knew they were following God's star to find God's Son.\n\nPeople along the way must have wondered about these travelers with their camels and fine clothes, following a star. But the wise men kept their eyes on the star and their hearts focused on finding the promised King.\n\nThe star was like God's special light, guiding them safely on their important journey to find baby Jesus.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  10: {
    title: "Gifts for Jesus",
    text: "The wise men had been following the star for many days when they arrived in Jerusalem, the great city of the Jews. They went to King Herod's palace, thinking surely the newborn King would be born in a royal palace.\n\n'Where is the one who has been born King of the Jews?' they asked. 'We saw his star when it rose and have come to worship him.'\n\nKing Herod was troubled by this news. He didn't want another king in his land! He called together all the chief priests and teachers of the law and asked them where the Christ was to be born.\n\n'In Bethlehem,' they answered, 'for this is what the prophet has written: \"But you, Bethlehem, in the land of Judah, are by no means least among the rulers of Judah; for out of you will come a ruler who will shepherd my people Israel.\"'\n\nHerod secretly met with the wise men and found out exactly when the star had appeared. Then he sent them to Bethlehem, saying, 'Go and search carefully for the child. As soon as you find him, report to me, so that I too may go and worship him.'\n\nBut Herod was lying – he didn't want to worship Jesus; he wanted to harm him.\n\nThe wise men left Jerusalem and continued following the star. How excited they were when the star stopped right over a small house in Bethlehem! Their long journey was finally over.\n\nInside the house, they found Mary and the young child Jesus. When they saw Jesus, they bowed down and worshiped him. Then they opened their treasures and presented him with gifts: gold, frankincense, and myrrh.\n\nGold was a gift for a king, frankincense was used in worship of God, and myrrh was a precious spice. Each gift showed that they understood Jesus was very special – he was a King, he was God, and he would one day give his life to save people from their sins.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  11: {
    title: "The Journey",
    text: "The wise men's journey to find Jesus was long and filled with adventure. They traveled hundreds of miles across deserts, mountains, and foreign lands, all because they believed God had sent them a special sign in the sky.\n\nTheir journey began in their homeland in the East, possibly Persia or Babylon. These weren't just any travelers – they were learned men, scholars who studied astronomy, mathematics, and ancient prophecies. When they saw the unusual star, they knew immediately that it announced something extraordinary.\n\nPacking their camels with supplies for the long journey, they brought water for the desert, food for many weeks, and most importantly, precious gifts for the newborn King. The caravan probably included servants and guards to protect them on the dangerous roads.\n\nAs they traveled, they faced many challenges. Desert sandstorms could blind them and bury their path. Bandits might attack travelers carrying valuable goods. Rivers had to be crossed, and mountains had to be climbed. But through it all, the star guided them.\n\nAt night, when they made camp, they would look up at their guiding star and feel encouraged. During the day, even when they couldn't see the star, they remembered its position and continued in the right direction.\n\nThe wise men talked together about the ancient prophecies they had studied. They discussed what kind of King this child might be and what his birth would mean for the world. Their excitement grew with each passing day.\n\nWhen they finally reached Jerusalem, they had traveled for many weeks, possibly even months. But their faith never wavered. They knew that God had called them to make this journey, and they trusted that he would lead them safely to the promised King.\n\nTheir journey teaches us that sometimes God calls us to step out in faith, even when the path is long and difficult. Like the wise men, we can trust that God will guide us when we seek him with sincere hearts.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  12: {
    title: "Meeting Baby Jesus",
    text: "After their long journey following the star, the wise men finally arrived at the small house in Bethlehem where Mary and Joseph were staying with baby Jesus. The star had led them to exactly the right place!\n\nAs they approached the humble house, their hearts must have been beating with excitement. They had traveled so far and waited so long for this moment. The bright star stopped right above the house, as if pointing down and saying, 'Here he is! Here is the King you've been seeking!'\n\nWhen Mary opened the door, she saw these distinguished visitors with their fine robes and their camels loaded with treasures. The wise men explained that they had come from far away, following a star, to worship the newborn King.\n\nMary welcomed them into their simple home. There, in the arms of his mother, was baby Jesus. He may have been sleeping peacefully, or perhaps his bright eyes were looking up at these visitors from distant lands.\n\nThe moment the wise men saw Jesus, they knew they were in the presence of someone very special. Without hesitation, they fell to their knees and worshiped him. Here was no ordinary baby – this was the Son of God, the promised Savior of the world!\n\nWith great joy and reverence, they opened their treasure chests and presented their gifts. The gold gleamed in the lamplight, the frankincense filled the room with its sweet fragrance, and the myrrh showed their understanding that this child had come for a great purpose.\n\nMary and Joseph must have been amazed by these visitors and their expensive gifts. God had sent these wise men from far away to honor his Son and to provide for the young family.\n\nThat night, God warned the wise men in a dream not to return to King Herod, who wanted to harm Jesus. So they went home by a different route, their hearts full of joy because they had found and worshiped the newborn King.\n\nThe wise men's visit shows us that Jesus came not just for one group of people, but for everyone in the world. People from every nation can come to worship him and find salvation.",
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return '#50C878';
    case 'Medium': return '#FFD700';
    case 'Hard': return '#FF6B6B';
    default: return '#8B4513';
  }
};

export function StorytellingModal({ visible, onClose, onComplete, story, category }: StorytellingModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Animation for soundwave effect
  const [waveAnim] = useState(new Animated.Value(0));

  const currentStory = storyContent[story.id as keyof typeof storyContent];

  useEffect(() => {
    if (isPlaying) {
      // Start soundwave animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.stopAnimation();
      waveAnim.setValue(0);
    }
  }, [isPlaying, waveAnim]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    if (!audioEnabled || !currentStory?.audioUrl) return;

    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentStory.audioUrl },
        { shouldPlay: false }
      );
      
      setSound(newSound);
      
      // Get duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setIsPaused(false);
            setIsCompleted(true);
            setCurrentTime(0);
            // Mark story as completed
            if (onComplete) {
              onComplete(story.id);
            }
          }
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      Alert.alert('Audio Error', 'Failed to load story audio');
    }
  };

  const handlePlay = async () => {
    if (!audioEnabled) return;

    try {
      if (!sound) {
        await loadAudio();
        return;
      }

      if (isPaused) {
        await sound.playAsync();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        await sound.replayAsync();
        setIsPlaying(true);
        setIsPaused(false);
        setIsCompleted(false);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handlePause = async () => {
    if (sound && isPlaying) {
      try {
        await sound.pauseAsync();
        setIsPlaying(false);
        setIsPaused(true);
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    }
  };

  const handleStop = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
        setIsCompleted(false);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  };

  const handleSkipForward = async () => {
    if (sound) {
      try {
        const newPosition = Math.min(currentTime + 10000, duration);
        await sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping forward:', error);
      }
    }
  };

  const handleSkipBackward = async () => {
    if (sound) {
      try {
        const newPosition = Math.max(currentTime - 10000, 0);
        await sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping backward:', error);
      }
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentStory) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <X color="#8B4513" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <BookOpen color="#8B4513" size={24} strokeWidth={2.5} />
            <Text style={styles.headerTitle}>Storytelling</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Story Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: story.image }} style={styles.storyImage} />
            <View style={styles.imageOverlay}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(story.difficulty) }]}>
                <Text style={styles.difficultyText}>{story.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Story Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.storyTitle}>{currentStory.title}</Text>
          </View>

          {/* Audio Controls */}
          <View style={styles.audioControlsContainer}>
            <Text style={styles.audioTitle}>Listen to the Story</Text>
            
            {/* Soundwave Animation */}
            {isPlaying && (
              <View style={styles.soundwaveContainer}>
                {[...Array(5)].map((_, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.soundwaveBar,
                      {
                        transform: [{
                          scaleY: waveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1.5 + Math.random() * 0.5],
                          })
                        }]
                      }
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Control Buttons */}
            <View style={styles.controlButtons}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleSkipBackward}
                disabled={!audioEnabled || !sound}
              >
                <SkipBack color={audioEnabled && sound ? "#8B4513" : "#CCCCCC"} size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.playButton, isLoading && styles.loadingButton]}
                onPress={isPlaying ? handlePause : handlePlay}
                disabled={!audioEnabled || isLoading}
              >
                {isLoading ? (
                  <Text style={styles.loadingText}>...</Text>
                ) : isPlaying ? (
                  <Pause color="#FFFFFF" size={24} strokeWidth={2.5} />
                ) : (
                  <Play color="#FFFFFF" size={24} strokeWidth={2.5} />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleStop}
                disabled={!audioEnabled || !sound}
              >
                <Square color={audioEnabled && sound ? "#8B4513" : "#CCCCCC"} size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleSkipForward}
                disabled={!audioEnabled || !sound}
              >
                <SkipForward color={audioEnabled && sound ? "#8B4513" : "#CCCCCC"} size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlButton, !audioEnabled && styles.disabledButton]}
                onPress={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? (
                  <Volume2 color="#8B4513" size={20} />
                ) : (
                  <VolumeX color="#FF6B6B" size={20} />
                )}
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                <View style={[styles.progressThumb, { left: `${progressPercentage}%` }]} />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Status Messages */}
            {isCompleted && (
              <View style={styles.completionMessage}>
                <Text style={styles.completionText}>Story Complete! 🎉 Great job listening!</Text>
              </View>
            )}

            {!audioEnabled && (
              <View style={styles.statusMessage}>
                <Text style={styles.statusText}>Audio is disabled. Tap the volume icon to enable.</Text>
              </View>
            )}
          </View>

          {/* Story Text */}
          <View style={styles.storyTextContainer}>
            <Text style={styles.storyTextTitle}>Story Text</Text>
            <Text style={styles.storyText}>{currentStory.text}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4CC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7D154',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    fontStyle: 'italic',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    margin: 16,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  audioControlsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 16,
  },
  soundwaveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 20,
    gap: 4,
  },
  soundwaveBar: {
    width: 4,
    height: 20,
    backgroundColor: '#E8C23A',
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#F7D154',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playButton: {
    backgroundColor: '#E8C23A',
    padding: 16,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  loadingButton: {
    backgroundColor: '#CCCCCC',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 8,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E8C23A',
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    backgroundColor: '#E8C23A',
    borderRadius: 7,
    marginLeft: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },
  completionMessage: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  completionText: {
    color: '#50C878',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusMessage: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statusText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  storyTextContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  storyTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  storyText: {
    fontSize: 16,
    color: '#5D4037',
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'sans-serif',
  },
});