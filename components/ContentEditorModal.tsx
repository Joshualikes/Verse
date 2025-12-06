/**
 * Content Editor Modal
 *
 * A simple interface for adding Bible chapter content directly in the app.
 * This is useful for quickly adding or editing chapter text without using scripts.
 *
 * USAGE:
 * Import and use this component to add a content management interface to your app.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Save, BookOpen } from 'lucide-react-native';
import { addChapter, updateChapter, getChapter } from '@/utils/bibleContentManager';
import { bibleBooks } from '@/data/bibleBooks';

interface ContentEditorModalProps {
  visible: boolean;
  onClose: () => void;
  bookId?: number;
  chapterNumber?: number;
}

export function ContentEditorModal({
  visible,
  onClose,
  bookId: initialBookId,
  chapterNumber: initialChapterNumber
}: ContentEditorModalProps) {
  const [bookId, setBookId] = useState(initialBookId?.toString() || '1');
  const [chapterNumber, setChapterNumber] = useState(initialChapterNumber?.toString() || '1');
  const [content, setContent] = useState('');
  const [estimatedReadTime, setEstimatedReadTime] = useState('5');
  const [keyVerses, setKeyVerses] = useState('');
  const [themes, setThemes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedBook = bibleBooks.find(b => b.id === parseInt(bookId));

  const loadExistingChapter = async () => {
    if (!bookId || !chapterNumber) return;

    setIsLoading(true);
    try {
      const chapter = await getChapter(parseInt(bookId), parseInt(chapterNumber));
      if (chapter) {
        setContent(chapter.content);
        setEstimatedReadTime(chapter.estimated_read_time?.toString() || '5');
        setKeyVerses(chapter.key_verses?.join(', ') || '');
        setThemes(chapter.themes?.join(', ') || '');
        Alert.alert('Loaded', 'Existing chapter content loaded for editing');
      } else {
        Alert.alert('New Chapter', 'No existing content found. You can add new content.');
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      Alert.alert('Error', 'Failed to load chapter content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!bookId || !chapterNumber || !content.trim()) {
      Alert.alert('Missing Information', 'Please fill in book ID, chapter number, and content');
      return;
    }

    setIsSaving(true);
    try {
      const chapterData = {
        book_id: parseInt(bookId),
        chapter_number: parseInt(chapterNumber),
        content: content.trim(),
        estimated_read_time: parseInt(estimatedReadTime) || 5,
        key_verses: keyVerses.split(',').map(v => v.trim()).filter(v => v),
        themes: themes.split(',').map(t => t.trim()).filter(t => t)
      };

      // Check if chapter exists
      const existingChapter = await getChapter(chapterData.book_id, chapterData.chapter_number);

      if (existingChapter) {
        // Update existing
        await updateChapter(chapterData.book_id, chapterData.chapter_number, {
          content: chapterData.content,
          estimated_read_time: chapterData.estimated_read_time,
          key_verses: chapterData.key_verses,
          themes: chapterData.themes
        });
        Alert.alert('Success', 'Chapter updated successfully!');
      } else {
        // Add new
        await addChapter(chapterData);
        Alert.alert('Success', 'Chapter added successfully!');
      }

      // Clear form
      setContent('');
      setKeyVerses('');
      setThemes('');
      onClose();
    } catch (error) {
      console.error('Error saving chapter:', error);
      Alert.alert('Error', 'Failed to save chapter. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
            <BookOpen color="#8B4513" size={24} strokeWidth={2.5} />
            <Text style={styles.headerTitle}>Content Editor</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.savingButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Save color="#FFFFFF" size={20} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Book Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Book ID</Text>
            <TextInput
              style={styles.input}
              value={bookId}
              onChangeText={setBookId}
              keyboardType="numeric"
              placeholder="Enter book ID (1-75)"
              placeholderTextColor="#999999"
            />
            {selectedBook && (
              <Text style={styles.helperText}>
                Selected: {selectedBook.name} ({selectedBook.chapters} chapters)
              </Text>
            )}
          </View>

          {/* Chapter Number */}
          <View style={styles.section}>
            <Text style={styles.label}>Chapter Number</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={chapterNumber}
                onChangeText={setChapterNumber}
                keyboardType="numeric"
                placeholder="Chapter"
                placeholderTextColor="#999999"
              />
              <TouchableOpacity
                style={styles.loadButton}
                onPress={loadExistingChapter}
                disabled={isLoading}
              >
                <Text style={styles.loadButtonText}>
                  {isLoading ? 'Loading...' : 'Load Existing'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View style={styles.section}>
            <Text style={styles.label}>Chapter Content</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={20}
              placeholder="Paste or type the full chapter text here..."
              placeholderTextColor="#999999"
              textAlignVertical="top"
            />
            <Text style={styles.helperText}>
              Word count: {content.trim().split(/\s+/).filter(w => w).length}
            </Text>
          </View>

          {/* Estimated Read Time */}
          <View style={styles.section}>
            <Text style={styles.label}>Estimated Read Time (minutes)</Text>
            <TextInput
              style={styles.input}
              value={estimatedReadTime}
              onChangeText={setEstimatedReadTime}
              keyboardType="numeric"
              placeholder="5"
              placeholderTextColor="#999999"
            />
          </View>

          {/* Key Verses */}
          <View style={styles.section}>
            <Text style={styles.label}>Key Verses (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={keyVerses}
              onChangeText={setKeyVerses}
              placeholder="Genesis 1:1, Genesis 1:27, Genesis 1:31"
              placeholderTextColor="#999999"
            />
          </View>

          {/* Themes */}
          <View style={styles.section}>
            <Text style={styles.label}>Themes (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={themes}
              onChangeText={setThemes}
              placeholder="Creation, God's Power, Beginning"
              placeholderTextColor="#999999"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.bigSaveButton, isSaving && styles.savingButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.bigSaveButtonText}>
              {isSaving ? 'Saving...' : 'Save Chapter'}
            </Text>
          </TouchableOpacity>

          {/* Help Text */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Quick Tips:</Text>
            <Text style={styles.helpText}>
              1. Enter the book ID and chapter number
            </Text>
            <Text style={styles.helpText}>
              2. Click "Load Existing" to edit an existing chapter
            </Text>
            <Text style={styles.helpText}>
              3. Paste or type the full chapter content
            </Text>
            <Text style={styles.helpText}>
              4. Add optional metadata (key verses, themes)
            </Text>
            <Text style={styles.helpText}>
              5. Click "Save Chapter" to save to database
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  saveButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#50C878',
  },
  savingButton: {
    backgroundColor: '#CCCCCC',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#8B4513',
    borderWidth: 1,
    borderColor: '#F7D154',
  },
  contentInput: {
    minHeight: 300,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#D2691E',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  loadButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  loadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  bigSaveButton: {
    backgroundColor: '#50C878',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  bigSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#D2691E',
    marginBottom: 8,
    paddingLeft: 8,
  },
});
