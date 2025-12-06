import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  useFrameworkReady();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
