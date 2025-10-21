// login screen 

// imports asyncstorage to save which user is logged in 
import AsyncStorage from '@react-native-async-storage/async-storage';

// import router so we can move between screens 
import { useRouter } from 'expo-router';

// react and hooks
import React, { useState } from 'react';

// basic react native components
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// imports custom color file for consistent colors 
import colors from '../constants/colors';

// import database functions for login and create profile
import { createProfile, profileLogin } from '../database';


// main function 
export default function LoginScreen() {
  // keeps track of the username input
  const [username, setUsername] = useState('');

  // keeps track of the password input
  const [password, setPassword] = useState('');

  // allows navigation to different screens (like homepage)
  const router = useRouter();


  // function runs when user clicks login
  const handleLogin = async () => {
    // checks if both fields are filled out
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both fields');
      return;
    }

    // check if username and password match a user in database
    const user = await profileLogin(username, password);

    if (user) {
      // if username and password are correct, save the user
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      // navigate to the main tabs (home, profile, reviews)
      router.replace('/(tabs)');
    } else {
      // if the username or password don’t match
      Alert.alert('This password does not match the username');
    }
  };


  // function runs when user clicks create profile
  const handleCreateProfile = async () => {
    // checks if both fields are filled out
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both fields');
      return;
    }

    try {
      // adds a new profile to the database
      await createProfile(username, password);
      Alert.alert('You can now login!');
    } catch (e) {
      // shows error if username already exists
      Alert.alert('That username already exists.');
    }
  };


  // everything that appears on the screen
  return (
    <View style={styles.container}>
      {/* app title */}
      <Text style={styles.title}>Swolemates</Text>

      {/* username input box */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* password input box */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* create profile button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#8EA98E' }]} // lighter green for variety
        onPress={handleCreateProfile}
      >
        <Text style={styles.buttonText}>Create Profile</Text>
      </TouchableOpacity>
    </View>
  );
}


// styling for the screen 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray, 
    alignItems: 'center', // center horizontally
    justifyContent: 'center', // center vertically
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
