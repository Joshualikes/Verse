import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, BookOpen, Filter, Search } from 'lucide-react-native';
import { BibleBookGrid } from '@/components/BibleBookGrid';
import { ChapterListModal } from '@/components/ChapterListModal';
import { BibleReaderModal } from '@/components/BibleReaderModal';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { bibleCategories } from '@/data/bibleBooks';
import { BibleBook } from '@/types/bible';

const { width } = Dimensions.get('window');

export default function StorytellingScreen() {
  const [selectedTestament, setSelectedTestament] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [userProgress, setUserProgress] = useState<{ [key: string]: number }>({});
  const insets = useSafeAreaInsets();

  const testaments = ['All', 'Old Testament', 'New Testament', 'Deuterocanonical'];
  const categories = ['All', ...bibleCategories.map(cat => cat.name)];

  const handleThemes = () => {
    console.log('Opening themes...');
  };

  const handleRewards = () => {
    console.log('Opening rewards...');
  };

  const handleCompleted = () => {
    console.log('Opening completed books...');
  };

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setShowChapterList(true);
  };

  const handleChapterSelect = (bookId: number, chapterNumber: number) => {
    setCurrentChapter(chapterNumber);
    setShowChapterList(false);
    setShowReader(true);
  };

  const handleProgressUpdate = (bookId: number, chapterNumber: number, progress: number) => {
    const key = `${bookId}-${chapterNumber}`;
    setUserProgress(prev => ({
      ...prev,
      [key]: progress
    }));
  };

  const handleChapterComplete = (bookId: number, chapterNumber: number) => {
    const key = `${bookId}-${chapterNumber}`;
    setUserProgress(prev => ({
      ...prev,
      [key]: 100
    }));
    Alert.alert(
      'Chapter Completed! 🎉',
      `You've finished ${selectedBook?.name} Chapter ${chapterNumber}!`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const handleChapterChange = (newChapterNumber: number) => {
    setCurrentChapter(newChapterNumber);
  };

  const handleExportBook = (bookId: number) => {
    Alert.alert(
      'Export Book',
      `Export entire book as PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            console.log('Exporting book:', bookId);
            Alert.alert('Success', 'Book exported successfully!');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 100 }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/UPDAILY.jpg')}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
              <Menu color="#FFFFFF" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bible Library</Text>
            <Text style={styles.headerSubtitle}>Read, Listen & Learn</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filtersContainer}>
          {/* Testament Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Testament:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {testaments.map((testament) => (
                <TouchableOpacity
                  key={testament}
                  style={[
                    styles.filterTab,
                    selectedTestament === testament && styles.activeFilterTab,
                  ]}
                  onPress={() => setSelectedTestament(testament)}
                >
                  <Text style={[
                    styles.filterTabText,
                    selectedTestament === testament && styles.activeFilterTabText,
                  ]}>
                    {testament}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterTab,
                    selectedCategory === category && styles.activeFilterTab,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.filterTabText,
                    selectedCategory === category && styles.activeFilterTabText,
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <BibleBookGrid 
            selectedTestament={selectedTestament}
            selectedCategory={selectedCategory}
            onBookSelect={handleBookSelect}
            userProgress={userProgress}
          />
        </View>
      </ScrollView>

      <HamburgerMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onThemes={handleThemes}
        onRewards={handleRewards}
        onCompleted={handleCompleted}
      />

      {/* Chapter List Modal */}
      <ChapterListModal
        visible={showChapterList}
        onClose={() => setShowChapterList(false)}
        book={selectedBook}
        onChapterSelect={handleChapterSelect}
        onExportBook={handleExportBook}
        userProgress={userProgress}
      />

      {/* Bible Reader Modal */}
      <BibleReaderModal
        visible={showReader}
        onClose={() => setShowReader(false)}
        book={selectedBook}
        chapterNumber={currentChapter}
        onProgressUpdate={handleProgressUpdate}
        onComplete={handleChapterComplete}
        onChapterChange={handleChapterChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 180,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    padding: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#F7D154',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 6,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterTab: {
    backgroundColor: '#F7D154',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: '#FF8C42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
});