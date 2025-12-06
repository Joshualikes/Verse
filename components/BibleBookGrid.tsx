import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Book, Play, CheckCircle, Clock, Star } from 'lucide-react-native';
import { bibleBooks, bibleCategories } from '@/data/bibleBooks';
import { BibleBook } from '@/types/bible';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

interface BibleBookGridProps {
  selectedTestament: string;
  selectedCategory: string;
  onBookSelect: (book: BibleBook) => void;
  userProgress?: { [key: string]: number };
}

export function BibleBookGrid({ 
  selectedTestament, 
  selectedCategory, 
  onBookSelect,
  userProgress = {}
}: BibleBookGridProps) {
  const [sortBy, setSortBy] = useState<'order' | 'progress' | 'name'>('order');

  const getFilteredBooks = () => {
    let filteredBooks = bibleBooks;

    if (selectedTestament !== 'All') {
      filteredBooks = filteredBooks.filter(book => book.testament === selectedTestament);
    }

    if (selectedCategory !== 'All') {
      const category = bibleCategories.find(cat => cat.name === selectedCategory);
      if (category) {
        filteredBooks = filteredBooks.filter(book => category.books.includes(book.id));
      }
    }

    // Sort books
    switch (sortBy) {
      case 'name':
        return filteredBooks.sort((a, b) => a.name.localeCompare(b.name));
      case 'progress':
        return filteredBooks.sort((a, b) => {
          const progressA = userProgress[a.id] || 0;
          const progressB = userProgress[b.id] || 0;
          return progressB - progressA;
        });
      default:
        return filteredBooks.sort((a, b) => a.id - b.id);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return '#F0F0F0';
    if (progress < 25) return '#FF6B6B';
    if (progress < 50) return '#FFD700';
    if (progress < 75) return '#FF8C42';
    if (progress < 100) return '#4A90E2';
    return '#50C878';
  };

  const getCategoryColor = (bookId: number) => {
    const category = bibleCategories.find(cat => cat.books.includes(bookId));
    return category?.color || '#8B4513';
  };

  const filteredBooks = getFilteredBooks();

  return (
    <View style={styles.container}>
      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
          {[
            { key: 'order', label: 'Biblical Order' },
            { key: 'name', label: 'Name' },
            { key: 'progress', label: 'Progress' }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.activeSortButton
              ]}
              onPress={() => setSortBy(option.key as any)}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === option.key && styles.activeSortButtonText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Books Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredBooks.map((book) => {
            const progress = userProgress[book.id] || 0;
            const isCompleted = progress >= 100;
            const categoryColor = getCategoryColor(book.id);

            return (
              <TouchableOpacity
                key={book.id}
                style={[styles.bookCard, { borderLeftColor: categoryColor }]}
                onPress={() => onBookSelect(book)}
              >
                {/* Header */}
                <View style={styles.bookHeader}>
                  <View style={[styles.bookIcon, { backgroundColor: categoryColor }]}>
                    <Book color="#FFFFFF" size={16} strokeWidth={2.5} />
                  </View>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <CheckCircle color="#50C878" size={16} fill="#50C878" />
                    </View>
                  )}
                </View>

                {/* Book Info */}
                <View style={styles.bookInfo}>
                  <Text style={styles.bookName}>{book.name}</Text>
                  <Text style={styles.bookDetails}>
                    {book.chapters} chapter{book.chapters > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.bookCategory}>{book.category}</Text>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
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

                {/* Actions */}
                <View style={styles.bookActions}>
                  <View style={styles.actionButton}>
                    <Play color="#8B4513" size={12} />
                    <Text style={styles.actionText}>Read</Text>
                  </View>
                  {progress > 0 && (
                    <View style={styles.actionButton}>
                      <Clock color="#D2691E" size={12} />
                      <Text style={styles.actionText}>Continue</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Collection Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{filteredBooks.length}</Text>
              <Text style={styles.statLabel}>Books</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {filteredBooks.reduce((total, book) => total + book.chapters, 0)}
              </Text>
              <Text style={styles.statLabel}>Chapters</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {filteredBooks.filter(book => (userProgress[book.id] || 0) >= 100).length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(
                  filteredBooks.reduce((total, book) => total + (userProgress[book.id] || 0), 0) / 
                  filteredBooks.length
                )}%
              </Text>
              <Text style={styles.statLabel}>Overall</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortButton: {
    backgroundColor: '#F7D154',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: '#FF8C42',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bookCard: {
    width: itemWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 16,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookIcon: {
    borderRadius: 12,
    padding: 6,
  },
  completedBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 4,
  },
  bookInfo: {
    marginBottom: 12,
  },
  bookName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 12,
    color: '#D2691E',
    marginBottom: 2,
  },
  bookCategory: {
    fontSize: 10,
    color: '#999999',
    fontStyle: 'italic',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#8B4513',
    fontWeight: '600',
    textAlign: 'center',
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  actionText: {
    fontSize: 10,
    color: '#8B4513',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#D2691E',
    fontWeight: '600',
  },
});