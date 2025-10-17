import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import { addReview, loadGyms, profileLogin } from "../../database";
import { ProfileContext } from "../context/ProfileContext";

// for database
type Gym = {
  id: number;
  name: string;
  address: string
};

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

export default function ReviewsScreen() {
  const { profile } = useContext(ProfileContext); // get logged-in profile
  const [gymName, setGymName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);

  useEffect(() => {
    const fetchGyms = async () => {
      const allGyms = await loadGyms();
      setGyms(allGyms);
    };
    fetchGyms();
  }, []);

  const handlePostReview = async () => {

    const profile = await profileLogin(username, password);

    // Not working for some reason
    if (!profile) {
      alert("You must be logged in to post a review.");
      return;
    }

    const gym = gyms.find((gym) => gym.name.toLowerCase() === gymName.toLowerCase());

    if (!gym) {
      alert("Gym not found. Please type the gym name exactly as in the database.");
      return;
    }

    const date = new Date().toISOString();
    const rating = 0; // default rating

    await addReview(profile.id, gym.id, rating, reviewText, date);

    alert(`Review added for ${gym.name}!`);

    setGymName("");
    setReviewText("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> My Reviews</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Review Creator</Text>
        <Text style={styles.subtitle}>Add a review below!</Text>
      </View>

      <View style={styles.reviewCard}>
        <TextInput
          style={styles.input}
          placeholder="Enter the gym's name here"
          value={gymName}
          onChangeText={setGymName}
        />
        <TextInput
          style={styles.reviewInput}
          placeholder="Enter your review here"
          multiline
          textAlignVertical="top"
          value={reviewText}
          onChangeText={setReviewText}
        />
        <TouchableOpacity style={styles.cardButton} onPress={handlePostReview}>
          <Text style={styles.cardText}>Post Review</Text>
        </TouchableOpacity>
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
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textDark,
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
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
  reviewInput:{
    width:'80%',
    height:350,
    borderWidth:1,
    borderColor:'#ccc',
    marginBottom:16,
    paddingHorizontal:12,
    borderRadius:10
  },
  cardButton: {
    width:'80%',
    padding:16,
    borderRadius:12,
    marginTop:12,
    backgroundColor: colors.green,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
    color: "#fff",
  },
  reviewCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});

