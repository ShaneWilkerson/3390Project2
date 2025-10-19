// Login screen 
// Using sqlite and AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import { createProfile, profileLogin } from '../database';


export default function LoginScreen() {
  // variables to login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // useRouter to allow user to access homepage 
  const router = useRouter();

  // check to make sure both fields are filled out
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both fields');
      return;
    }

    // check for result 
    const user = await profileLogin(username, password);

    if (user) {
      // If correct - 
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      router.replace('/(tabs)');
    } else {
      // Error message if its not found
      Alert.alert('This password does not match the username');
    }
  };

  // For create profile, same concept as login
  const handleCreateProfile = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both fields');
      return;
    }

    try {
      // This creates a new user
      await createProfile(username, password);
      Alert.alert('You can now login!');
    } catch (e) {
        // if username already exists 
      Alert.alert('That username already exists.');
    }
  };

  // what you see 
  return (
    <View style={styles.container}>
      {/* App title */}
      <Text style={styles.title}>Swolemates</Text>

      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      
      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Create profile button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#8EA98E' }]} // different green
        onPress={handleCreateProfile}
      >
        <Text style={styles.buttonText}>Create Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lightGray, 
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.green, 
      marginBottom: 40,
    },
    input: {
      width: '90%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      backgroundColor: colors.background, 
    },
    button: {
      backgroundColor: colors.green, 
      padding: 14,
      borderRadius: 10,
      width: '90%',
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
  });
