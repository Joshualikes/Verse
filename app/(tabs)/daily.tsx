import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Pause, Heart, Share, Volume2, VolumeX, RotateCcw, Menu, Clock, Globe, Settings } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { loadingVerses, getRandomVerse } from '@/data/loadingVerses';
import { getRandomPrayer } from '@/data/randomPrayers';

const dailyVerses = [
  {
    id: 1,
    date: 'Monday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Psalm 23:1",
        text: "The Lord is my shepherd, I lack nothing."
      },
      tagalog: {
        reference: "Awit 23:1",
        text: "Ang Panginoon ang aking pastor; hindi ako magkakakulang."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  },
  {
    id: 2,
    date: 'Tuesday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Philippians 4:13",
        text: "I can do all this through him who gives me strength."
      },
      tagalog: {
        reference: "Mga Taga-Filipos 4:13",
        text: "Lahat ng bagay ay magagawa ko sa pamamagitan ni Cristo na nagbibigay sa akin ng lakas."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  },
  {
    id: 3,
    date: 'Wednesday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
      },
      tagalog: {
        reference: "Jeremias 29:11",
        text: "Sapagkat alam ko ang mga plano na mayroon ako para sa inyo, sabi ng Panginoon, mga planong magpapalago sa inyo."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  },
  {
    id: 4,
    date: 'Thursday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Isaiah 40:31",
        text: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles."
      },
      tagalog: {
        reference: "Isaias 40:31",
        text: "Ang mga umaasa sa Panginoon ay mababago ang kanilang lakas. Sila ay lilipad na may mga pakpak na tulad ng mga agila."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  },
  {
    id: 5,
    date: 'Friday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Romans 8:28",
        text: "In all things God works for the good of those who love him."
      },
      tagalog: {
        reference: "Mga Taga-Roma 8:28",
        text: "Sa lahat ng mga bagay ay gumagawa ang Diyos para sa kabutihan ng mga umiibig sa kaniya."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  },
  {
    id: 6,
    date: 'Saturday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Psalm 145:18-19",
        text: "The Lord is near to all who call on him. He hears their cry and saves them."
      },
      tagalog: {
        reference: "Awit 145:18-19",
        text: "Ang Panginoon ay malapit sa lahat ng tumatawag sa kaniya. Naririnig niya ang kanilang daing at iniligtas sila."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  },
  {
    id: 7,
    date: 'Sunday',
    headerImage: require('@/assets/images/UPDAILY.jpg'),
    verse: {
      english: {
        reference: "Matthew 11:28",
        text: "Come to me, all you who are weary and burdened, and I will give you rest."
      },
      tagalog: {
        reference: "Mateo 11:28",
        text: "Halina sa akin, kayong lahat na pagod at may pasan, at bibigyan ko kayo ng kapahingahan."
      },
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  }
];

export default function DailyScreen() {
  const [isPlayingVerse, setIsPlayingVerse] = useState(false);
  const [isPlayingReflection, setIsPlayingReflection] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [verseSound, setVerseSound] = useState<Audio.Sound | null>(null);
  const [reflectionSound, setReflectionSound] = useState<Audio.Sound | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [language, setLanguage] = useState<'english' | 'tagalog'>('english');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [randomVerse, setRandomVerse] = useState(getRandomVerse());
  const [randomPrayer, setRandomPrayer] = useState(getRandomPrayer());
  const insets = useSafeAreaInsets();

  const getCurrentDayVerse = () => {
    const dayOfWeek = currentDate.getDay();
    const verseIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return dailyVerses[verseIndex];
  };

  const currentVerse = getCurrentDayVerse();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (verseSound) {
        verseSound.unloadAsync();
      }
      if (reflectionSound) {
        reflectionSound.unloadAsync();
      }
    };
  }, [verseSound, reflectionSound]);

  const toggleVerseAudio = async () => {
    if (audioEnabled) {
      try {
        if (isPlayingVerse) {
          if (verseSound) {
            await verseSound.pauseAsync();
            setIsPlayingVerse(false);
          }
        } else {
          if (reflectionSound && isPlayingReflection) {
            await reflectionSound.stopAsync();
            setIsPlayingReflection(false);
          }

          if (!verseSound) {
            const { sound } = await Audio.Sound.createAsync(
              { uri: currentVerse.verse.audioUrl },
              { shouldPlay: true }
            );
            setVerseSound(sound);
            setIsPlayingVerse(true);

            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlayingVerse(false);
              }
            });
          } else {
            await verseSound.replayAsync();
            setIsPlayingVerse(true);
          }
        }
      } catch (error) {
        console.error('Error playing verse audio:', error);
        setIsPlayingVerse(false);
      }
    }
  };

  const toggleReflectionAudio = async () => {
    if (audioEnabled) {
      try {
        if (isPlayingReflection) {
          if (reflectionSound) {
            await reflectionSound.pauseAsync();
            setIsPlayingReflection(false);
          }
        } else {
          if (verseSound && isPlayingVerse) {
            await verseSound.stopAsync();
            setIsPlayingVerse(false);
          }

          if (!reflectionSound) {
            const { sound } = await Audio.Sound.createAsync(
              { uri: randomVerse.text },
              { shouldPlay: true }
            );
            setReflectionSound(sound);
            setIsPlayingReflection(true);

            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlayingReflection(false);
              }
            });
          } else {
            await reflectionSound.replayAsync();
            setIsPlayingReflection(true);
          }
        }
      } catch (error) {
        console.error('Error playing reflection audio:', error);
        setIsPlayingReflection(false);
      }
    }
  };

  const stopAllAudio = async () => {
    try {
      if (verseSound && isPlayingVerse) {
        await verseSound.stopAsync();
        setIsPlayingVerse(false);
      }
      if (reflectionSound && isPlayingReflection) {
        await reflectionSound.stopAsync();
        setIsPlayingReflection(false);
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const handleThemes = () => {
    console.log('Opening themes...');
  };

  const handleRewards = () => {
    console.log('Opening rewards...');
  };

  const handleCompleted = () => {
    console.log('Opening completed gallery...');
  };

  const formatDateTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      timeZoneName: 'short'
    }).format(date);
  };

  const handleTimezoneChange = () => {
    const timezones = [
      { label: 'Manila (GMT+8)', value: 'Asia/Manila' },
      { label: 'New York (GMT-5)', value: 'America/New_York' },
      { label: 'London (GMT+0)', value: 'Europe/London' },
      { label: 'Tokyo (GMT+9)', value: 'Asia/Tokyo' },
    ];
    console.log('Timezone selection:', timezones);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 100 }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={currentVerse.headerImage} style={styles.headerImage} />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
              <Menu color="#FFFFFF" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Daily</Text>
            <Text style={styles.headerSubtitle}>Verse</Text>
          </View>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeInfo}>
            <Clock color="#8B4513" size={16} />
            <Text style={styles.dateTimeText}>
              {formatDateTime(currentDate, userTimezone)}
            </Text>
          </View>
          <TouchableOpacity style={styles.timezoneButton} onPress={handleTimezoneChange}>
            <Globe color="#8B4513" size={16} />
            <Text style={styles.timezoneText}>{userTimezone.split('/')[1]?.replace('_', ' ') || userTimezone}</Text>
            <Settings color="#8B4513" size={14} />
          </TouchableOpacity>
        </View>

        <View style={styles.audioControlsBar}>
          <TouchableOpacity
            style={[styles.audioToggle, !audioEnabled && styles.audioDisabled]}
            onPress={() => {
              setAudioEnabled(!audioEnabled);
              if (!audioEnabled) stopAllAudio();
            }}
          >
            {audioEnabled ? (
              <Volume2 color="#FFFFFF" size={20} strokeWidth={2.5} />
            ) : (
              <VolumeX color="#FFFFFF" size={20} strokeWidth={2.5} />
            )}
            <Text style={styles.audioToggleText}>
              {audioEnabled ? 'Audio On' : 'Audio Off'}
            </Text>
          </TouchableOpacity>

          {(isPlayingVerse || isPlayingReflection) && (
            <TouchableOpacity style={styles.stopButton} onPress={stopAllAudio}>
              <RotateCcw color="#FFFFFF" size={16} strokeWidth={2.5} />
              <Text style={styles.stopButtonText}>Stop All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <Text style={styles.verseReference}>
              {language === 'english'
                ? currentVerse.verse.english.reference
                : currentVerse.verse.tagalog.reference}
            </Text>
            <View style={styles.verseActions}>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setLanguage(language === 'english' ? 'tagalog' : 'english')}
              >
                <Text style={styles.languageButtonText}>
                  {language === 'english' ? 'TAG' : 'ENG'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, isFavorited && styles.favorited]}
                onPress={() => setIsFavorited(!isFavorited)}
              >
                <Heart
                  color={isFavorited ? "#FFFFFF" : "#8B4513"}
                  size={18}
                  fill={isFavorited ? "#FFFFFF" : "none"}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share color="#8B4513" size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.verseText}>
            {language === 'english'
              ? currentVerse.verse.english.text
              : currentVerse.verse.tagalog.text}
          </Text>

          <TouchableOpacity
            style={[styles.playButton, isPlayingVerse && styles.playingButton]}
            onPress={toggleVerseAudio}
            disabled={!audioEnabled}
          >
            {isPlayingVerse ? (
              <Pause color="#FFFFFF" size={20} strokeWidth={2.5} />
            ) : (
              <Play color="#FFFFFF" size={20} strokeWidth={2.5} />
            )}
            <Text style={styles.playButtonText}>
              {isPlayingVerse
                ? (language === 'english' ? 'Pause Verse' : 'Ihinto ang Talata')
                : (language === 'english' ? 'Listen to Verse' : 'Pakinggan ang Talata')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>
            {language === 'english' ? 'Random Reflection' : 'Random na Pagninilay'}
          </Text>
          <Text style={styles.reflectionReference}>
            {language === 'english' ? randomVerse.reference : randomVerse.reference}
          </Text>
          <Text style={styles.reflectionText}>
            {language === 'english' ? randomVerse.text : randomVerse.text}
          </Text>

          <TouchableOpacity
            style={[styles.playButton, styles.reflectionPlayButton, isPlayingReflection && styles.playingButton]}
            onPress={toggleReflectionAudio}
            disabled={!audioEnabled}
          >
            {isPlayingReflection ? (
              <Pause color="#FFFFFF" size={20} strokeWidth={2.5} />
            ) : (
              <Play color="#FFFFFF" size={20} strokeWidth={2.5} />
            )}
            <Text style={styles.playButtonText}>
              {isPlayingReflection
                ? (language === 'english' ? 'Pause' : 'Ihinto')
                : (language === 'english' ? 'Listen' : 'Pakinggan')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prayerCorner}>
          <Text style={styles.prayerTitle}>
            🙏 {language === 'english' ? 'Prayer Corner' : 'Sulok ng Panalangin'}
          </Text>
          <Text style={styles.prayerText}>
            {language === 'english' ? randomPrayer.english : randomPrayer.tagalog}
          </Text>
          <TouchableOpacity style={styles.prayerButton} onPress={() => setRandomPrayer(getRandomPrayer())}>
            <Text style={styles.prayerButtonText}>
              {language === 'english' ? 'Get New Prayer' : 'Makakuha ng Bagong Panalangin'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <HamburgerMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onThemes={handleThemes}
        onRewards={handleRewards}
        onCompleted={handleCompleted}
      />
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
    height: 200,
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
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    padding: 12,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#F7D154',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dateTimeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 6,
    textAlign: 'center',
  },
  timezoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7D154',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  timezoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    marginHorizontal: 6,
  },
  audioControlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioToggle: {
    backgroundColor: '#50C878',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  audioDisabled: {
    backgroundColor: '#FF6B6B',
  },
  audioToggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  stopButton: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  verseCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseReference: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  verseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#F7D154',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favorited: {
    backgroundColor: '#FF6B9D',
  },
  verseText: {
    fontSize: 18,
    color: '#5D4037',
    lineHeight: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  playingButton: {
    backgroundColor: '#E67E22',
  },
  reflectionPlayButton: {
    backgroundColor: '#8FBC8F',
    marginTop: 16,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
  },
  reflectionCard: {
    backgroundColor: '#8FBC8F',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  reflectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  reflectionReference: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  reflectionText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  prayerCorner: {
    backgroundColor: '#DDA0DD',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  prayerText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 16,
  },
  prayerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  prayerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
