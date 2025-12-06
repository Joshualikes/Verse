import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Menu } from 'lucide-react-native';

export function WelcomeHeader() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/8553869/pexels-photo-8553869.jpeg' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.menuButton}>
          <Menu color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>Bible Stories</Text>
          <Text style={styles.subtitle}>Color, Listen & Learn</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 69, 19, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    padding: 12,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#F7D154',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});