// color scheme
import { useColorScheme } from '@/hooks/use-color-scheme';

// imports AsyncStorage to save which user is logged in 
import AsyncStorage from '@react-native-async-storage/async-storage';

// default and dark color themes for navigation
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Stack to help navigate 
import { Stack } from 'expo-router';

// phone’s top status bar 
import { StatusBar } from 'expo-status-bar';

// useEffect and useState hooks for managing state and side effects
import React, { useEffect, useState } from 'react';

// smoother animations 
import 'react-native-reanimated';

// imports setupDatabase function 
import { setupDatabase } from '../database';


// for Expo Router – it helps define navigation between tabs 
export const unstable_settings = {
  anchor: '(tabs)',
};

// MAIN APP LAYOUT COMPONENT

export default function RootLayout() {
  // dark mode or light mode
  const colorScheme = useColorScheme();

  // keeps track of whether the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // keeps track if app is loading data from asynch
  const [loading, setLoading] = useState(true);


  // runs when app loads 
  useEffect(() => {
    const init = async () => {
      // wait for tables to load 
      await setupDatabase();

      // checks if a user is already logged in by reading from AsyncStorage
      const user = await AsyncStorage.getItem('currentUser');

      // set login state to true
      if (user) {
        setIsLoggedIn(true);
      }

      //stop the loading screen
      setLoading(false);
    };

    // call init function 
    init();
  }, []); // Empty array, only runs one time when the app first starts


  // stops glitching 
  if (loading) return null;


  
  return (
    // ThemeProvider for dark mode (didnt end up using )
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
      {/* navigation between screens */}
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* show the login screen */}
        {!isLoggedIn ? (
          <Stack.Screen name="login" />
        ) : (
          // show the main tab navigation 
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>

      {/* StatusBar for top color  */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
