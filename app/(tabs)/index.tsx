// to move between screens 
import { useRouter } from "expo-router";

// react and hooks
import React, { useEffect, useState } from "react";

// basic react native components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../../constants/colors";

// database functions 
import { inputGyms, loadGyms } from "../../database";


// gym object (typescript)
type Gym = {
  id: number;
  name: string;
  address: string;
};


// main screen that shows all gyms
export default function HomeScreen() {
  // stores all gym data from the database
  const [gyms, setGyms] = useState<Gym[]>([]);

  // used to navigate 
  const router = useRouter();


  // loads gyms
  useEffect(() => {
    const fetchGyms = async () => {
      // (hardcoded list)
      await inputGyms();

      // gets gyms
      const gymsFromDB = await loadGyms();

      // puts gyms into a state 
      setGyms(gymsFromDB);
    };

    fetchGyms(); // gets gyms
  }, []); // only run when screen opens 


  // runs when the user taps on a gym
  const handleGymPress = (gym: Gym) => {
    // takes user to that gym
    router.push({
      pathname: "../gymDetails",
      params: {
        id: String(gym.id),
        name: gym.name,
        address: gym.address,
      },
    });
  };


  // everything that shows on the screen
  return (
    <ScrollView style={styles.container}>
      {/* top header with app name */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Swolemates</Text>
      </View>

      {/* small intro message */}
      <View style={styles.content}>
        <Text style={styles.title}>Gyms in Bakersfield</Text>
        <Text style={styles.subtitle}>Tap a gym to view reviews or leave one</Text>
      </View>

      {/* list of all gyms */}
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


// styles 
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


