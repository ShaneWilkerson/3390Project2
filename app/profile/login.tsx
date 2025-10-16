import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from "../../constants/colors";
import { createProfile, profileLogin } from '../../database';

type LoginProps = {
  onLoginSuccess: (profile: any) => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const profile = await profileLogin(username, password);
    if (profile) {
      Alert.alert('Login successful');
      onLoginSuccess(profile);
    } else {
      Alert.alert('Login failed', 'Invalid username or password');
    }
  };

  const handleSignup = async () => {
    try {
      await createProfile(username, password);
      Alert.alert('Signup successful', 'You can now log in');
    } catch (err) {
      Alert.alert('Signup failed', 'Username may already exist');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swolemates</Text>
      <Text style={styles.title}>Login / Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title:{
    fontSize:32,
    fontWeight:'bold',
    marginBottom:32
  },
  input:{
    width:'80%',
    height:50,
    borderWidth:1,
    borderColor:'#ccc',
    marginBottom:16,
    paddingHorizontal:12,
    borderRadius:10
    },
  button: {
    width:'80%',
    backgroundColor: colors.green,
    padding:16,
    borderRadius:12,
    marginTop:12
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize:18
  },
});
