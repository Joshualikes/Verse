import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play, Pause, Palette, Share, Download } from 'lucide-react-native';

interface ColoringPageProps {
  story: {
    id: number;
    title: string;
    image: string;
    hasAudio: boolean;
    difficulty: string;
  };
  visible: boolean;
  onClose: () => void;
}

export function ColoringPage({ story, visible, onClose }: ColoringPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F4A460', '#98D8C8'];

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#8B4513" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.title}>{story.title}</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Share color="#8B4513" size={20} />
          </TouchableOpacity>
        </View>

        {/* Audio Controls */}
        <View style={styles.audioControls}>
          <TouchableOpacity style={styles.audioButton} onPress={toggleAudio}>
            {isPlaying ? (
              <Pause color="#FFFFFF" size={20} strokeWidth={2.5} />
            ) : (
              <Play color="#FFFFFF" size={20} strokeWidth={2.5} />
            )}
            <Text style={styles.audioButtonText}>
              {isPlaying ? 'Pause Story' : 'Play Story'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coloring Canvas */}
        <View style={styles.canvasContainer}>
          <Image source={{ uri: story.image }} style={styles.coloringImage} />
        </View>

        {/* Tools */}
        <View style={styles.toolsContainer}>
          <TouchableOpacity 
            style={[styles.toolButton, showColorPalette && styles.activeToolButton]}
            onPress={() => setShowColorPalette(!showColorPalette)}
          >
            <Palette color={showColorPalette ? "#FFFFFF" : "#8B4513"} size={20} />
            <Text style={[styles.toolButtonText, showColorPalette && styles.activeToolButtonText]}>
              Colors
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton}>
            <Download color="#8B4513" size={20} />
            <Text style={styles.toolButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Color Palette */}
        {showColorPalette && (
          <View style={styles.colorPalette}>
            <Text style={styles.paletteTitle}>Choose Your Colors</Text>
            <View style={styles.colorsGrid}>
              {colors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.colorCircle, { backgroundColor: color }]}
                />
              ))}
            </View>
          </View>
        )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7D154',
  },
  audioControls: {
    padding: 16,
    alignItems: 'center',
  },
  audioButton: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  canvasContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  coloringImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toolButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeToolButton: {
    backgroundColor: '#F7D154',
  },
  toolButtonText: {
    color: '#8B4513',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  activeToolButtonText: {
    color: '#5D4037',
  },
  colorPalette: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paletteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 12,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});