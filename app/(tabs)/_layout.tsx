import { Tabs } from 'expo-router';
import { Palette, Image as ImageIcon, BookOpen, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F7D154',
          borderTopWidth: 0,
          height: 90 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: Math.max(insets.left, insets.right, 10),
        },
        tabBarActiveTintColor: '#8B4513',
        tabBarInactiveTintColor: '#D2691E',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Storytelling',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ size, color }) => (
            <ImageIcon size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}