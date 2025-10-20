import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import { inputGyms, loadGyms } from "../../database";

// Define what a gym object looks like
type Gym = {
  id: number;
  name: string;
  address: string;
};

export default function HomeScreen() {
  const [gyms, setGyms] = useState<Gym[]>([]); // list of gyms
  const router = useRouter();

  // Load gyms from database when page opens
  useEffect(() => {
    const fetchGyms = async () => {
      await inputGyms(); // make sure default gyms exist
      const gymsFromDB = await loadGyms(); // get gyms from database
      setGyms(gymsFromDB); // store them in state
    };
    fetchGyms();
  }, []);

  // When user taps a gym, go to that gym’s details page
  const handleGymPress = (gym: Gym) => {
    router.push({
      pathname: "../gymDetails",
      params: {
        id: String(gym.id),
        name: gym.name,
        address: gym.address,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Swolemates</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Gyms in Bakersfield</Text>
        <Text style={styles.subtitle}>Tap a gym to view reviews or leave one</Text>
      </View>

      <View style={styles.gymList}>
        {gyms.map((gym) => (
          <TouchableOpacity key={gym.id} onPress={() => handleGymPress(gym)}>
            <View style={styles.gymCard}>
              <Text style={styles.gymCardTitle}>{gym.name}</Text>
              <Text style={styles.gymCardText}>{gym.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// Style settings for this page
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
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
  },
  gymList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  gymCard: {
    width: "85%",
    padding: 18,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: colors.green,
  },
  gymCardTitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  gymCardText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    marginTop: 4,
  },
});

