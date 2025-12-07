import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Download, CircleCheck as CheckCircle, Play } from 'lucide-react-native';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ProgressGrid } from '@/components/ProgressGrid';
import { CompletedGrid } from '@/components/CompletedGrid';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const [activeCategory, setActiveCategory] = useState('New');
  const [activeSection, setActiveSection] = useState<'progress' | 'completed'>('progress');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 100 }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg' }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>Gallery</Text>
            <Text style={styles.headerSubtitle}>Your Coloring Journey</Text>
          </View>
        </View>

        {/* Category Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Progress/Completed Toggle */}
        <View style={styles.sectionToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, activeSection === 'progress' && styles.activeToggleButton]}
            onPress={() => setActiveSection('progress')}
          >
            <Text style={[styles.toggleText, activeSection === 'progress' && styles.activeToggleText]}>
              In Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeSection === 'completed' && styles.activeToggleButton]}
            onPress={() => setActiveSection('completed')}
          >
            <Text style={[styles.toggleText, activeSection === 'completed' && styles.activeToggleText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Grid */}
        <View style={styles.contentContainer}>
          {activeSection === 'progress' ? (
            <ProgressGrid category={activeCategory} />
          ) : (
            <CompletedGrid category={activeCategory} />
          )}
        </View>

        {/* Export Section for Completed */}
        {activeSection === 'completed' && (
          <View style={styles.exportSection}>
            <Text style={styles.exportTitle}>Export Your Artwork</Text>
            <View style={styles.exportButtons}>
              <TouchableOpacity style={styles.exportButton}>
                <Download color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.exportButtonText}>Download All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.exportButton, styles.pdfButton]}>
                <Text style={styles.exportButtonText}>Create PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: 'rgba(139, 69, 19, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  sectionToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#F7D154',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D2691E',
  },
  activeToggleText: {
    color: '#8B4513',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exportSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#50C878',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfButton: {
    backgroundColor: '#FF8C42',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
});