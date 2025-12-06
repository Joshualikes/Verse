import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Download, 
  Star, 
  Trophy, 
  Award, 
  Crown, 
  Gift,
  CheckCircle,
  Calendar,
  Palette,
  Target
} from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

interface RewardsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const rewardsData = {
  points: 1250,
  level: 8,
  nextLevelPoints: 1500,
  badges: [
    { id: 1, name: 'First Steps', description: 'Complete your first coloring page', icon: 'star', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Noah\'s Friend', description: 'Complete all Noah\'s Ark stories', icon: 'trophy', earned: true, date: '2024-01-20' },
    { id: 3, name: 'Wise King', description: 'Complete all Three Kings stories', icon: 'crown', earned: true, date: '2024-01-25' },
    { id: 4, name: 'Daily Devotion', description: 'Complete 7 daily challenges', icon: 'calendar', earned: true, date: '2024-01-30' },
    { id: 5, name: 'Artist Master', description: 'Complete 25 coloring pages', icon: 'palette', earned: false, progress: 18 },
    { id: 6, name: 'Perfect Week', description: 'Complete daily challenges for a full week', icon: 'target', earned: false, progress: 5 },
  ],
  completedBooks: [
    { id: 1, title: 'Genesis', category: 'Pentateuch', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-15', rating: 5, chapters: 50 },
    { id: 2, title: 'Matthew', category: 'Gospels', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-16', rating: 4, chapters: 28 },
    { id: 3, title: 'Psalms', category: 'Wisdom', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-18', rating: 5, chapters: 150 },
    { id: 4, title: 'John', category: 'Gospels', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-19', rating: 5, chapters: 21 },
    { id: 5, title: 'Romans', category: 'Pauline Epistles', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-20', rating: 4, chapters: 16 },
    { id: 6, title: 'Proverbs', category: 'Wisdom', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-22', rating: 5, chapters: 31 },
    { id: 7, title: 'Acts', category: 'History', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-24', rating: 5, chapters: 28 },
    { id: 8, title: 'Isaiah', category: 'Major Prophets', image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', completedDate: '2024-01-25', rating: 4, chapters: 66 },
  ]
};

const getBadgeIcon = (iconName: string, earned: boolean) => {
  const color = earned ? '#FFD700' : '#D3D3D3';
  const size = 32;
  
  switch (iconName) {
    case 'star': return <Star color={color} size={size} fill={earned ? color : 'none'} />;
    case 'trophy': return <Trophy color={color} size={size} fill={earned ? color : 'none'} />;
    case 'crown': return <Crown color={color} size={size} fill={earned ? color : 'none'} />;
    case 'calendar': return <Calendar color={color} size={size} />;
    case 'palette': return <Palette color={color} size={size} />;
    case 'target': return <Target color={color} size={size} />;
    default: return <Award color={color} size={size} />;
  }
};

export function RewardsScreen({ visible, onClose }: RewardsScreenProps) {
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleBookSelection = (bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const selectAllBooks = () => {
    if (selectedBooks.length === rewardsData.completedBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(rewardsData.completedBooks.map(book => book.id));
    }
  };

  const downloadSelectedBooks = async () => {
    if (selectedBooks.length === 0) {
      Alert.alert('No Selection', 'Please select coloring books to download');
      return;
    }

    setIsDownloading(true);
    
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        Alert.alert(
          'Download Started',
          `Preparing ${selectedBooks.length} coloring books for download as PDF...`,
          [{ text: 'OK', onPress: () => setSelectedBooks([]) }]
        );
      } else {
        // Mobile implementation
        const selectedBooksData = rewardsData.completedBooks.filter(book => 
          selectedBooks.includes(book.id)
        );
        
        // Create a comprehensive text file with the list (in production, this would be a PDF)
        const content = `My Completed Bible Books\n\n${selectedBooksData.map(book => 
          `${book.title} (${book.category}) - ${book.chapters} chapters - Completed: ${book.completedDate} - Rating: ${book.rating}/5`
        ).join('\n')}`;
        
        const fileUri = FileSystem.documentDirectory + 'completed_bible_books.txt';
        await FileSystem.writeAsStringAsync(fileUri, content);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/plain',
            dialogTitle: 'My Completed Bible Books'
          });
        }
        
        setSelectedBooks([]);
        Alert.alert('Success', 'Bible books downloaded successfully!');
      }
    } catch (error) {
      Alert.alert('Download Error', 'Failed to download Bible books. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const progressPercentage = (rewardsData.points / rewardsData.nextLevelPoints) * 100;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#8B4513" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rewards & Achievements</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Points & Level Section */}
          <View style={styles.pointsCard}>
            <View style={styles.pointsHeader}>
              <View style={styles.levelBadge}>
                <Crown color="#FFFFFF" size={24} fill="#FFFFFF" />
                <Text style={styles.levelText}>Level {rewardsData.level}</Text>
              </View>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsValue}>{rewardsData.points}</Text>
                <Text style={styles.pointsLabel}>Points</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                Progress to Level {rewardsData.level + 1}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {rewardsData.points} / {rewardsData.nextLevelPoints} points
              </Text>
            </View>
          </View>

          {/* Badges Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements & Badges</Text>
            <View style={styles.badgesGrid}>
              {rewardsData.badges.map((badge) => (
                <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.unearned]}>
                  <View style={styles.badgeIcon}>
                    {getBadgeIcon(badge.icon, badge.earned)}
                  </View>
                  <Text style={[styles.badgeName, !badge.earned && styles.unearnedText]}>
                    {badge.name}
                  </Text>
                  <Text style={[styles.badgeDescription, !badge.earned && styles.unearnedText]}>
                    {badge.description}
                  </Text>
                  {badge.earned ? (
                    <View style={styles.earnedBadge}>
                      <CheckCircle color="#50C878" size={16} fill="#50C878" />
                      <Text style={styles.earnedDate}>{badge.date}</Text>
                    </View>
                  ) : (
                    badge.progress && (
                      <View style={styles.progressBadge}>
                        <Text style={styles.progressBadgeText}>
                          {badge.progress}/25
                        </Text>
                      </View>
                    )
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Completed Books Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Completed Bible Books</Text>
              <TouchableOpacity style={styles.selectAllButton} onPress={selectAllBooks}>
                <Text style={styles.selectAllText}>
                  {selectedBooks.length === rewardsData.completedBooks.length ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.booksGrid}>
              {rewardsData.completedBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={[
                    styles.bookCard,
                    selectedBooks.includes(book.id) && styles.selectedBookCard
                  ]}
                  onPress={() => toggleBookSelection(book.id)}
                >
                  <Image source={{ uri: book.image }} style={styles.bookImage} />
                  
                  {selectedBooks.includes(book.id) && (
                    <View style={styles.selectionOverlay}>
                      <CheckCircle color="#FFFFFF" size={24} fill="#50C878" />
                    </View>
                  )}

                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookCategory}>{book.category}</Text>
                    <Text style={styles.bookChapters}>{book.chapters} chapters</Text>
                    
                    <View style={styles.bookFooter}>
                      <View style={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            color="#FFD700" 
                            fill={i < book.rating ? "#FFD700" : "none"} 
                          />
                        ))}
                      </View>
                      <Text style={styles.completedDate}>{book.completedDate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Download Section */}
            {selectedBooks.length > 0 && (
              <View style={styles.downloadSection}>
                <Text style={styles.downloadTitle}>
                  {selectedBooks.length} Bible book{selectedBooks.length > 1 ? 's' : ''} selected
                </Text>
                <TouchableOpacity 
                  style={[styles.downloadButton, isDownloading && styles.downloadingButton]}
                  onPress={downloadSelectedBooks}
                  disabled={isDownloading}
                >
                  <Download color="#FFFFFF" size={20} strokeWidth={2.5} />
                  <Text style={styles.downloadButtonText}>
                    {isDownloading ? 'Preparing Download...' : 'Download as PDF'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Stats Summary */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Journey</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{rewardsData.completedBooks.length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{rewardsData.badges.filter(b => b.earned).length}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{rewardsData.level}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{rewardsData.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
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
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7D154',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  pointsCard: {
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
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  pointsInfo: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#D2691E',
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#50C878',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#D2691E',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  selectAllButton: {
    backgroundColor: '#F7D154',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  selectAllText: {
    color: '#8B4513',
    fontWeight: '600',
    fontSize: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 48) / 2,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  unearned: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  badgeIcon: {
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 12,
  },
  unearnedText: {
    color: '#999999',
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  earnedDate: {
    fontSize: 10,
    color: '#50C878',
    fontWeight: '600',
    marginLeft: 4,
  },
  progressBadge: {
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progressBadgeText: {
    fontSize: 10,
    color: '#D2691E',
    fontWeight: '600',
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 48) / 2,
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  selectedBookCard: {
    borderWidth: 3,
    borderColor: '#50C878',
    shadowColor: '#50C878',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(80, 200, 120, 0.9)',
    borderRadius: 15,
    padding: 4,
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  bookCategory: {
    fontSize: 12,
    color: '#D2691E',
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 10,
    color: '#999999',
    marginBottom: 8,
  },
  bookFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  completedDate: {
    fontSize: 10,
    color: '#999999',
  },
  downloadSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  downloadButton: {
    backgroundColor: '#50C878',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  downloadingButton: {
    backgroundColor: '#999999',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#D2691E',
    fontWeight: '600',
  },
});