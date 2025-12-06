import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['New', "Noah's Ark", 'Three Kings'];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tab,
              activeCategory === category && styles.activeTab,
            ]}
            onPress={() => onCategoryChange(category)}
          >
            <Text style={[
              styles.tabText,
              activeCategory === category && styles.activeTabText,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#F7D154',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  activeTabText: {
    color: '#5D4037',
  },
});