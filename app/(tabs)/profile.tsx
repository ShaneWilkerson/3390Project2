
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";

// functions for profile 
export default function ProfileScreen() {
  // stores username 
  const [username, setUsername] = useState("");

  const router = useRouter();

  // runs when screen loads 
  useEffect(() => {
    const loadUser = async () => {
      // retrieves stuff from AsyncStorage
      const stored = await AsyncStorage.getItem("currentUser");
      if (stored) {
        // converts JSON string to object and set username
        const user = JSON.parse(stored);
        setUsername(user.username);
      }
    };
    loadUser();
  }, []);

  // logout button function
  const handleLogout = async () => {
    // Remove saved user info
    await AsyncStorage.removeItem("currentUser");
    // Send back to login
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Green header section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* Main content section */}
      <View style={styles.content}>
        <Text style={styles.title}>Logged in as:</Text>
        <Text style={styles.username}>{username}</Text>

        {/* Logout button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Page styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.green,
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    color: "#333",
    marginBottom: 25,
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
