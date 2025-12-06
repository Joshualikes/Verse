import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { getRandomVerse } from '@/data/loadingVerses';

const { width } = Dimensions.get('window');

interface Verse {
  text: string;
  reference: string;
}

export default function LoadingScreen() {
  const [verse, setVerse] = useState<Verse | null>(null);

  useEffect(() => {
    setVerse(getRandomVerse());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400',
            }}
            style={styles.jesusImage}
          />
        </View>

        <View style={styles.verseContainer}>
          {verse && (
            <>
              <Text style={styles.verseText}>{verse.text}</Text>
              <Text style={styles.verseReference}>{verse.reference}</Text>
            </>
          )}
        </View>

        <View style={styles.loadingDots}>
          <Text style={styles.dot}>●</Text>
          <Text style={styles.dot}>●</Text>
          <Text style={styles.dot}>●</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  imageWrapper: {
    marginBottom: 40,
  },
  jesusImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  verseContainer: {
    marginBottom: 40,
    maxWidth: width - 40,
  },
  verseText: {
    fontSize: 16,
    color: '#3D2817',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  verseReference: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    fontSize: 16,
    color: '#D2691E',
  },
});
