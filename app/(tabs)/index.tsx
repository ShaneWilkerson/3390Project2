import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import { ProfileContext } from "../context/ProfileContext";

// for database
import { loadGyms } from "../../database";
type Gym = {
  id: number;
  name: string;
  address: string;
};

export default function HomeScreen() {

  const { profile } = useContext(ProfileContext);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const username = profile?.username || "Guest";
  const message = profile? "Search and review gyms near you." : "Please login to post reviews for gyms near you.";

  useEffect(() => {
    const fetchGyms = async () => {
      const gymsFromDB = await loadGyms();
      setGyms(gymsFromDB);
    };
    fetchGyms();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> Swolemates</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome, {username}</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
      <View style={styles.gymList}>
        {gyms.map((gym) => (
        <TouchableOpacity key={gym.id} onPress={() => console.log(`Pressed ${gym.name}`)}>
        <View key={gym.id} style={styles.gymCard}>
          <Text style={styles.gymCardText}>{gym.name}</Text>
          <Text style={styles.gymCardText}>{gym.address}</Text>
          <Text style={styles.gymCardText}>Reviews: 0</Text>
        </View>
        </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gymList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  gymCard: {
    width:'80%',
    padding:16,
    borderRadius:12,
    marginTop:12,
    backgroundColor: colors.green,
  },
  gymCardText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});
