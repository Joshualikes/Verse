import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Play, Star } from 'lucide-react-native';
import { StorytellingModal } from './StorytellingModal';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 items per row with margins

interface ColoringGridProps {
  category: string;
  onStoryComplete?: (storyId: number) => void;
}

const bibleStories = {
  'New': [
    { id: 1, title: "Jesus with Children", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Easy' },
    { id: 2, title: "The Good Shepherd", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Medium' },
    { id: 3, title: "Miracle of Loaves", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Easy' },
    { id: 4, title: "Walking on Water", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Hard' },
  ],
  "Noah's Ark": [
    { id: 5, title: "Building the Ark", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Medium' },
    { id: 6, title: "Animals Boarding", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Easy' },
    { id: 7, title: "The Great Flood", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Hard' },
    { id: 8, title: "Rainbow Promise", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Medium' },
  ],
  'Three Kings': [
    { id: 9, title: "Following the Star", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Medium' },
    { id: 10, title: "Gifts for Jesus", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Easy' },
    { id: 11, title: "The Journey", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Hard' },
    { id: 12, title: "Meeting Baby Jesus", image: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg', hasAudio: true, difficulty: 'Easy' },
  ],
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return '#50C878';
    case 'Medium': return '#FFD700';
    case 'Hard': return '#FF6B6B';
    default: return '#8B4513';
  }
};

export function ColoringGrid({ category, onStoryComplete }: ColoringGridProps) {
  const stories = bibleStories[category as keyof typeof bibleStories] || [];
  const [selectedStory, setSelectedStory] = React.useState<any>(null);

  const handleStoryPress = (story: any) => {
    setSelectedStory(story);
  };

  const handleStoryComplete = (storyId: number) => {
    if (onStoryComplete) {
      onStoryComplete(storyId);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category} Stories</Text>
      <View style={styles.grid}>
        {stories.map((story) => (
          <TouchableOpacity 
            key={story.id} 
            style={styles.storyCard}
            onPress={() => handleStoryPress(story)}
          >
            <Image source={{ uri: story.image }} style={styles.storyImage} />
            <View style={styles.storyOverlay}>
              {story.hasAudio && (
                <TouchableOpacity style={styles.playIcon}>
                  <Play color="#FFFFFF" size={16} fill="#FFFFFF" />
                </TouchableOpacity>
              )}
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(story.difficulty) }]}>
                <Text style={styles.difficultyText}>{story.difficulty}</Text>
              </View>
            </View>
            <View style={styles.storyContent}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <View style={styles.storyFooter}>
                <Star color="#FFD700" size={14} fill="#FFD700" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Storytelling Modal */}
      {selectedStory && (
        <StorytellingModal
          visible={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          onComplete={handleStoryComplete}
          story={selectedStory}
          category={category}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
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
  storyCard: {
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
  storyImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  storyOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playIcon: {
    backgroundColor: 'rgba(255, 140, 66, 0.9)',
    borderRadius: 15,
    padding: 6,
  },
  difficultyBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storyContent: {
    padding: 12,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#D2691E',
    fontWeight: '500',
  },
  progressIndicator: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
    alignSelf: 'center',
  },
  progressIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});