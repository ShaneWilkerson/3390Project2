import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { ProfileProvider } from './context/ProfileContext';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { removeDuplicateGyms, setupDatabase } from '../database';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // runs when app is opened
  useEffect(() => {
    setupDatabase();
    removeDuplicateGyms();
  }, []);

  return (
    <ProfileProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </ProfileProvider>
  );
}

