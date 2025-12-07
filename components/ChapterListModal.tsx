import React, { useState } from 'react';
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
  CheckCircle, 
  Clock, 
  Star,
  Download,
  Share,
  Bookmark,
  Volume2,
  Palette
} from 'lucide-react-native';
import { BibleBook } from '@/types/bible';

const { width } = Dimensions.get('window');

interface ChapterListModalProps {
  visible: boolean;
  onClose: () => void;
  book: BibleBook | null;
  onChapterSelect: (bookId: number, chapterNumber: number) => void;
  userProgress?: { [key: string]: number };
}

export function ChapterListModal({ 
  visible, 
  onClose, 
  book, 
  onChapterSelect,
  userProgress = {}
}: ChapterListModalProps) {
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  if (!book) return null;

  const toggleChapterSelection = (chapterNumber: number) => {
    setSelectedChapters(prev => 
      prev.includes(chapterNumber)
        ? prev.filter(ch => ch !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };

  const selectAllChapters = () => {
    if (selectedChapters.length === book.chapters) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(Array.from({ length: book.chapters }, (_, i) => i + 1));
    }
  };

  const handleBulkExport = () => {
    if (selectedChapters.length === 0) {
      Alert.alert('No Selection', 'Please select chapters to export');
      return;
    }

    Alert.alert(
      'Export Chapters',
      `Export ${selectedChapters.length} selected chapters as PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            console.log('Exporting chapters:', selectedChapters);
            setSelectedChapters([]);
            setShowBulkActions(false);
          }
        }
      ]
    );
  };

  const getChapterProgress = (chapterNumber: number) => {
    const key = `${book.id}-${chapterNumber}`;
    return userProgress[key] || 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return '#F0F0F0';
    if (progress < 25) return '#FF6B6B';
    if (progress < 50) return '#FFD700';
    if (progress < 75) return '#FF8C42';
    if (progress < 100) return '#4A90E2';
    return '#50C878';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#8B4513" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.bookTitle}>{book.name}</Text>
          </View>
        </View>

        {/* Bulk Actions */}
        {showBulkActions && (
          <View style={styles.bulkActionsContainer}>
            <TouchableOpacity style={styles.bulkActionButton} onPress={selectAllChapters}>
              <Text style={styles.bulkActionText}>
                {selectedChapters.length === book.chapters ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
            {selectedChapters.length > 0 && (
              <>
                <TouchableOpacity style={styles.bulkActionButton} onPress={handleBulkExport}>
                  <Download color="#50C878" size={16} />
                  <Text style={styles.bulkActionText}>Export ({selectedChapters.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bulkActionButton}>
                  <Bookmark color="#4A90E2" size={16} />
                  <Text style={styles.bulkActionText}>Bookmark</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Chapters List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.chaptersGrid}>
            {Array.from({ length: book.chapters }, (_, index) => {
              const chapterNumber = index + 1;
              const progress = getChapterProgress(chapterNumber);
              const isCompleted = progress >= 100;
              const isSelected = selectedChapters.includes(chapterNumber);

              return (
                <TouchableOpacity
                  key={chapterNumber}
                  style={[
                    styles.chapterCard,
                    isSelected && styles.selectedChapterCard,
                    isCompleted && styles.completedChapterCard
                  ]}
                  onPress={() => {
                    if (showBulkActions) {
                      toggleChapterSelection(chapterNumber);
                    } else {
                      onChapterSelect(book.id, chapterNumber);
                    }
                  }}
                  onLongPress={() => {
                    if (!showBulkActions) {
                      setShowBulkActions(true);
                      toggleChapterSelection(chapterNumber);
                    }
                  }}
                >
                  {/* Chapter Header */}
                  <View style={styles.chapterHeader}>
                    <View style={styles.chapterNumber}>
                      <Text style={styles.chapterNumberText}>{chapterNumber}</Text>
                    </View>
                    {isCompleted && (
                      <View style={styles.completedIcon}>
                        <CheckCircle color="#50C878" size={16} fill="#50C878" />
                      </View>
                    )}
                    {isSelected && (
                      <View style={styles.selectedIcon}>
                        <Text style={styles.selectedIconText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Chapter Title */}
                  <Text style={styles.chapterTitle}>
                    {chapterNumber}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${progress}%`,
                            backgroundColor: getProgressColor(progress)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                  </View>

                  {/* Chapter Actions */}
                  <View style={styles.chapterActions}>
                    <View style={styles.actionIcon}>
                      <Play color="#8B4513" size={12} />
                    </View>
                    <View style={styles.actionIcon}>
                      <Volume2 color="#D2691E" size={12} />
                    </View>
                    <View style={styles.actionIcon}>
                      <Palette color="#FF8C42" size={12} />
                    </View>
                  </View>

                  {/* Status Badge */}
                  {progress > 0 && progress < 100 && (
                    <View style={styles.statusBadge}>
                      <Clock color="#FFFFFF" size={10} />
                      <Text style={styles.statusText}>In Progress</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  bulkActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bulkActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7D154',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  bulkActionText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  chapterCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedChapterCard: {
    borderWidth: 2,
    borderColor: '#F7D154',
    shadowColor: '#F7D154',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  completedChapterCard: {
    backgroundColor: '#F0FFF0',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterNumber: {
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedIcon: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 4,
  },
  selectedIcon: {
    backgroundColor: '#F7D154',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 8,
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
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#8B4513',
    fontWeight: '600',
    textAlign: 'center',
  },
  chapterActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  actionIcon: {
    backgroundColor: '#FFF8DC',
    borderRadius: 10,
    padding: 6,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 140, 66, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
  },
});