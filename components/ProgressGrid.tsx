import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Play, Clock, Calendar } from 'lucide-react-native';
import { ColoringCanvas } from './ColoringCanvas';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

interface ProgressGridProps {
  category: string;
}

const progressData = {
  'New': [
    { id: 1, title: "Jesus with Children", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 75, hasAudio: true, timeSpent: '12 min' },
    { id: 2, title: "The Good Shepherd", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 45, hasAudio: true, timeSpent: '8 min' },
    { id: 3, title: "Miracle of Loaves", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 30, hasAudio: true, timeSpent: '5 min' },
  ],
  "Noah's Ark": [
    { id: 4, title: "Building the Ark", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 60, hasAudio: true, timeSpent: '15 min' },
    { id: 5, title: "Animals Boarding", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 85, hasAudio: true, timeSpent: '20 min' },
  ],
  'Three Kings': [
    { id: 6, title: "Following the Star", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 40, hasAudio: true, timeSpent: '7 min' },
    { id: 7, title: "Gifts for Jesus", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', progress: 90, hasAudio: true, timeSpent: '18 min' },
  ],
};

const itemProgress: { [key: number]: number } = {};

export function ProgressGrid({ category }: ProgressGridProps) {
  const items = progressData[category as keyof typeof progressData] || [];
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No works in progress</Text>
        <Text style={styles.emptySubtitle}>Start coloring to see your progress here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Continue Your Journey</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemCard}
            onPress={() => handleItemPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            {/* Progress Overlay */}
            <View style={styles.progressOverlay}>
              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>
                  {Math.round(itemProgress[item.id] || item.progress)}%
                </Text>
              </View>
              {item.hasAudio && (
                <TouchableOpacity style={styles.audioIcon}>
                  <Play color="#FFFFFF" size={12} fill="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${itemProgress[item.id] || item.progress}%` }]} />
              </View>
            </View>

            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.itemFooter}>
                <Clock color="#D2691E" size={12} />
                <Text style={styles.timeText}>{item.timeSpent}</Text>
              </View>
              <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueButtonText}>
                  {item.progress >= 100 ? 'View' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coloring Canvas Modal */}
      {selectedItem && (
        <ColoringCanvas
          visible={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onProgressUpdate={() => {}}
          onComplete={() => {}}
          title={selectedItem.title}
          initialProgress={selectedItem.progress}
          category={category}
          storyId={selectedItem.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#D2691E',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: itemWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  itemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  progressOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressBadge: {
    backgroundColor: 'rgba(255, 140, 66, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  audioIcon: {
    backgroundColor: 'rgba(80, 200, 120, 0.9)',
    borderRadius: 12,
    padding: 6,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 10,
    color: '#D2691E',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#F7D154',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: 'bold',
  },
});