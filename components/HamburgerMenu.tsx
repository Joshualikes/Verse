import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { RewardsScreen } from './RewardsScreen';

const { width, height } = Dimensions.get('window');

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onThemes: () => void;
  onRewards: () => void;
  onCompleted: () => void;
  completedStories?: number[];
}

export function HamburgerMenu({
  visible,
  onClose,
  onThemes,
  onRewards,
  onCompleted,
  completedStories = [],
}: HamburgerMenuProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleOptionPress = (action: () => void) => {
    onClose();
    setTimeout(action, 100); // Small delay for smooth transition
  };

  const handleRewardsPress = () => {
    onClose();
    setTimeout(() => setShowRewards(true), 100);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalCard,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: fadeAnim,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => handleOptionPress(onThemes)}
                  accessibilityLabel="Open themes selection"
                  accessibilityRole="button"
                >
                  <Text style={styles.menuButtonText}>Themes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={handleRewardsPress}
                  accessibilityLabel="Open rewards and points"
                  accessibilityRole="button"
                >
                  <Text style={styles.menuButtonText}>Rewards</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => handleOptionPress(onCompleted)}
                  accessibilityLabel="Open completed coloring books"
                  accessibilityRole="button"
                >
                  <Text style={styles.menuButtonText}>
                    Completed ({completedStories.length})
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>

      <RewardsScreen 
        visible={showRewards}
        onClose={() => setShowRewards(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#F7F3A0', // Light yellow background
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    minWidth: width * 0.7,
    maxWidth: width * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  menuButton: {
    backgroundColor: '#F7D154', // Golden background
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginVertical: 8,
    minHeight: 60, // Ensures 44+ logical pixels touch size
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic', // Script-style font
    textAlign: 'center',
  },
});