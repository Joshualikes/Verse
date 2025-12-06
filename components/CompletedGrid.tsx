import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { CircleCheck as CheckCircle, Download, Share, Star, Calendar } from 'lucide-react-native';
import { ColoringCanvas } from './ColoringCanvas';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

interface CompletedGridProps {
  category: string;
}

const completedData = {
  'New': [
    { 
      id: 1, 
      title: "Jesus Blessing", 
      image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', 
      completedDate: '2 days ago',
      rating: 5,
      downloadCount: 3
    },
    { 
      id: 2, 
      title: "Sermon on Mount", 
      image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', 
      completedDate: '5 days ago',
      rating: 4,
      downloadCount: 1
    },
  ],
  "Noah's Ark": [
    { 
      id: 3, 
      title: "Rainbow Promise", 
      image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', 
      completedDate: '1 week ago',
      rating: 5,
      downloadCount: 5
    },
    { 
      id: 4, 
      title: "Noah's Family", 
      image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', 
      completedDate: '3 days ago',
      rating: 4,
      downloadCount: 2
    },
  ],
  'Three Kings': [
    { 
      id: 5, 
      title: "Star of Bethlehem", 
      image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', 
      completedDate: '4 days ago',
      rating: 5,
      downloadCount: 4
    },
  ],
};

export function CompletedGrid({ category }: CompletedGridProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const items = completedData[category as keyof typeof completedData] || [];

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDownload = (item: any) => {
    Alert.alert(
      'Download Artwork',
      `Download "${item.title}" as PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log('Downloading:', item.title) }
      ]
    );
  };

  const handleBatchDownload = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Selection', 'Please select artworks to download');
      return;
    }
    
    Alert.alert(
      'Batch Download',
      `Download ${selectedItems.length} selected artworks as PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download All', onPress: () => console.log('Batch downloading:', selectedItems) }
      ]
    );
  };

  const handleItemPress = (item: any) => {
    setViewingItem(item);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CheckCircle color="#50C878" size={48} strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>No completed works yet</Text>
        <Text style={styles.emptySubtitle}>Finish coloring pages to see them here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Completed Masterpieces</Text>
        {selectedItems.length > 0 && (
          <TouchableOpacity style={styles.batchButton} onPress={handleBatchDownload}>
            <Download color="#FFFFFF" size={16} strokeWidth={2.5} />
            <Text style={styles.batchButtonText}>({selectedItems.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.itemCard,
              selectedItems.includes(item.id) && styles.selectedCard
            ]}
            onPress={() => handleItemPress(item)}
            onLongPress={() => toggleSelection(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            {/* Completed Badge */}
            <View style={styles.completedOverlay}>
              <View style={styles.completedBadge}>
                <CheckCircle color="#FFFFFF" size={16} fill="#FFFFFF" />
              </View>
              {selectedItems.includes(item.id) && (
                <View style={styles.selectionBadge}>
                  <Text style={styles.selectionText}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              
              {/* Rating */}
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    color="#FFD700" 
                    fill={i < item.rating ? "#FFD700" : "none"} 
                  />
                ))}
              </View>

              {/* Date */}
              <View style={styles.dateContainer}>
                <Calendar color="#D2691E" size={12} />
                <Text style={styles.dateText}>{item.completedDate}</Text>
              </View>

              {/* Actions */}
              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDownload(item)}
                >
                  <Download color="#50C878" size={14} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share color="#4A90E2" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* View Completed Artwork */}
      {viewingItem && (
        <ColoringCanvas
          visible={!!viewingItem}
          onClose={() => setViewingItem(null)}
          onProgressUpdate={() => {}} // No progress updates for completed items
          onComplete={() => {}}
          title={viewingItem.title}
          initialProgress={100}
          category={category}
          storyId={viewingItem.id}
        />
      )}

      {/* Selection Instructions */}
      {items.length > 0 && selectedItems.length === 0 && (
        <Text style={styles.instructionText}>
          Long press to select multiple artworks for batch download
        </Text>
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#D2691E',
    textAlign: 'center',
  },
  headerRow: {
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
  batchButton: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
  },
  batchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  selectedCard: {
    borderWidth: 3,
    borderColor: '#F7D154',
    shadowColor: '#F7D154',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  itemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  completedOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  completedBadge: {
    backgroundColor: 'rgba(80, 200, 120, 0.95)',
    borderRadius: 15,
    padding: 6,
  },
  selectionBadge: {
    backgroundColor: 'rgba(247, 209, 84, 0.95)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: 'bold',
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 10,
    color: '#D2691E',
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#FFF8DC',
    padding: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  instructionText: {
    fontSize: 12,
    color: '#D2691E',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 20,
  },
});