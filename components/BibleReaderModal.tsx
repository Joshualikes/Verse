import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Bookmark
} from 'lucide-react-native';
import { BibleBook } from '@/types/bible';
import { Audio } from 'expo-av';
// Supabase is optional - only use if environment variables are set
let supabase: any = null;
try {
  if (process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    );
  }
} catch (error) {
  console.warn('Supabase not available:', error);
}

const { width, height } = Dimensions.get('window');

interface BibleReaderModalProps {
  visible: boolean;
  onClose: () => void;
  book: BibleBook | null;
  chapterNumber: number;
  onProgressUpdate: (bookId: number, chapterNumber: number, progress: number) => void;
  onComplete: (bookId: number, chapterNumber: number) => void;
  onChapterChange: (newChapterNumber: number) => void;
}

export function BibleReaderModal({
  visible,
  onClose,
  book,
  chapterNumber,
  onProgressUpdate,
  onComplete,
  onChapterChange
}: BibleReaderModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [chapterContent, setChapterContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);
  

  // Fetch chapter content from database
  useEffect(() => {
    if (!book || !visible) return;

    const fetchChapterContent = async () => {
      setIsLoadingContent(true);
      setContentError(null);

      try {
        // In a real implementation, you would call your Supabase API here
        // For now, this is a placeholder that shows the structure
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/bible_chapters?book_id=eq.${book.id}&chapter_number=eq.${chapterNumber}`,
          {
            headers: {
              'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
              'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch chapter content');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setChapterContent(data[0].content);
        } else {
          setChapterContent(`Chapter ${chapterNumber} content not yet available. Please add content to the database.`);
        }
      } catch (error) {
        console.error('Error fetching chapter:', error);
        setContentError('Unable to load chapter content');
        setChapterContent(`Error loading chapter. Please try again later.`);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchChapterContent();
  }, [book, chapterNumber, visible]);

  useEffect(() => {
    if (visible) {
      setStartTime(Date.now());
    } else {
      if (startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
        setReadingTime(prev => prev + timeSpent);
      }
      setStartTime(null);
    }
  }, [visible]);

  useEffect(() => {
    // Update progress based on reading time and scroll position
    const progress = Math.min(readingProgress + (readingTime * 2), 100);
    if (book && progress > 0) {
      onProgressUpdate(book.id, chapterNumber, progress);
      
      if (progress >= 100) {
        onComplete(book.id, chapterNumber);
      }
    }
  }, [readingProgress, readingTime, book, chapterNumber]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  // 🔹 Stop and unload audio when modal closes
useEffect(() => {
  const handleModalClose = async () => {
    if (!visible && sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setReadingProgress(0); // optional: reset reading progress
      } catch (error) {
        console.error('Error stopping audio on close:', error);
      }
    }
  };

  handleModalClose();
}, [visible]);


const toggleAudio = async () => {
  
  if (!audioEnabled || !book) return;

  try {
    if (isPlaying) {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } else {
      if (!sound) {
        // 🔹 Fetch audio URL dynamically from Supabase
        const { data, error } = await supabase
          .from('bible_chapters')
          .select('audio_url')
          .eq('book_id', book.id)
          .eq('chapter_number', chapterNumber)
          .single();

        if (error) {
          console.error('Error fetching audio URL:', error.message);
          Alert.alert('Audio Error', 'Unable to fetch audio from database.');
          return;
        }

        const audioUrl = data?.audio_url;
        if (!audioUrl) {
          Alert.alert('Audio Missing', 'No audio found for this chapter.');
          return;
        }

        // 🎧 Create and play the sound from Supabase URL
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  } catch (error) {
    console.error('Error with audio:', error);
    Alert.alert('Playback Error', 'Something went wrong while playing audio.');
  }
};
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollProgress = (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;
    setReadingProgress(Math.max(0, Math.min(100, scrollProgress)));
  };

  const handlePreviousChapter = () => {
    if (chapterNumber > 1) {
      onChapterChange(chapterNumber - 1);
    }
  };

  const handleNextChapter = () => {
    if (book && chapterNumber < book.chapters) {
      onChapterChange(chapterNumber + 1);
    }
  };

  if (!book) return null;

  const themeStyles = lightTheme;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.container, themeStyles.container]}>
        {/* Header */}
        <View style={[styles.header, themeStyles.header]}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <X color={themeStyles.text.color} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.bookTitle, themeStyles.text]}>{book.name}</Text>
            <Text style={[styles.chapterTitle, themeStyles.secondaryText]}>
              Chapter {chapterNumber}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${readingProgress}%` }]} />
          </View>
          <Text style={[styles.progressText, themeStyles.secondaryText]}>
            {Math.round(readingProgress)}% • {readingTime} min
          </Text>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.contentContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={[styles.chapterContent, themeStyles.text]}>
              {chapterContent}
            </Text>
          </View>
        </ScrollView>

        {/* Audio Controls */}
        <View style={[styles.audioControls, themeStyles.panel]}>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? (
              <Volume2 color="#8B4513" size={20} />
            ) : (
              <VolumeX color="#FF6B6B" size={20} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.audioButton}>
            <SkipBack color="#8B4513" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, isPlaying && styles.playingButton]}
            onPress={toggleAudio}
            disabled={!audioEnabled}
          >
            {isPlaying ? (
              <Pause color="#FFFFFF" size={24} strokeWidth={2.5} />
            ) : (
              <Play color="#FFFFFF" size={24} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.audioButton}>
            <SkipForward color="#8B4513" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.audioButton, isBookmarked && styles.bookmarkedButton]}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark 
              color={isBookmarked ? "#FFFFFF" : "#8B4513"} 
              size={20} 
              fill={isBookmarked ? "#FFFFFF" : "none"}
            />
          </TouchableOpacity>
        </View>

        {/* Navigation */}
        <View style={[styles.navigation, themeStyles.panel]}>
          <TouchableOpacity
            style={[styles.navButton, chapterNumber <= 1 && styles.disabledNavButton]}
            disabled={chapterNumber <= 1}
            onPress={handlePreviousChapter}
          >
            <Text style={[styles.navButtonText, chapterNumber <= 1 && styles.disabledNavText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={[styles.chapterIndicator, themeStyles.text]}>
            {chapterNumber} / {book.chapters}
          </Text>

          <TouchableOpacity
            style={[styles.navButton, chapterNumber >= book.chapters && styles.disabledNavButton]}
            disabled={chapterNumber >= book.chapters}
            onPress={handleNextChapter}
          >
            <Text style={[styles.navButtonText, chapterNumber >= book.chapters && styles.disabledNavText]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const lightTheme = {
  container: { backgroundColor: '#FFF8DC' },
  header: { backgroundColor: '#FFFFFF' },
  panel: { backgroundColor: '#FFFFFF' },
  text: { color: '#8B4513' },
  secondaryText: { color: '#D2691E' }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7D154',
  },
  headerSpacer: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chapterTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingVertical: 16,
  },
  chapterContent: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'justify',
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 15,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  audioButton: {
    backgroundColor: '#F7D154',
    borderRadius: 20,
    padding: 10,
  },
  playButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    padding: 12,
  },
  playingButton: {
    backgroundColor: '#E67E22',
  },
  bookmarkedButton: {
    backgroundColor: '#4A90E2',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  navButton: {
    backgroundColor: '#F7D154',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  disabledNavButton: {
    backgroundColor: '#F0F0F0',
  },
  navButtonText: {
    color: '#8B4513',
    fontWeight: '600',
  },
  disabledNavText: {
    color: '#CCCCCC',
  },
  chapterIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});