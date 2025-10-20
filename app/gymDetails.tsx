import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "../constants/colors";
import { addReview, gymReviews } from "../database";

// Type for a review
type Review = {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
};

export default function GymDetails() {
  const { id, name, address } = useLocalSearchParams(); // gym info from previous screen
  const router = useRouter(); // used for navigation
  const [reviews, setReviews] = useState<Review[]>([]); // store reviews
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

  // Load all reviews for this gym
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      const result = await gymReviews(Number(id));
      setReviews(result);
    };
    fetchReviews();
  }, [id]);

  // Add new review
  const handleAddReview = async () => {
    if (!rating || !comment) {
      Alert.alert("Error", "Please fill out both rating and comment.");
      return;
    }

    const userData = await AsyncStorage.getItem("currentUser");
    if (!userData) {
      Alert.alert("Error", "You must be logged in to leave a review.");
      return;
    }

    const user = JSON.parse(userData);
    const date = new Date().toLocaleDateString();

    await addReview(user.id, Number(id), Number(rating), comment, date);
    Alert.alert("Success", "Review added!");

    // refresh review list
    const result = await gymReviews(Number(id));
    setReviews(result);
    setComment("");
    setRating("");
  };

  // Simple back button
  const handleGoBack = () => {
    router.back(); // goes to the previous screen (Home)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header section with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerSubtitle}>{address}</Text>
        </View>

        {/* Review input area */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Write a Review</Text>

          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Write your comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleAddReview}>
            <Text style={styles.buttonText}>Post Review</Text>
          </TouchableOpacity>
        </View>

        {/* Review list area */}
        <View style={styles.reviewsList}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet.</Text>
          ) : (
            reviews.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <Text style={styles.reviewUser}>{r.username}</Text>
                <Text style={styles.reviewRating}>Rating: {r.rating}/5</Text>
                <Text style={styles.reviewComment}>{r.comment}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  header: {
    backgroundColor: colors.green,
    paddingVertical: 25,
    alignItems: "center",
    paddingTop: 50, // extra space for iPhone notch
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  headerSubtitle: {
    color: "white",
    fontSize: 15,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 15,
  },
  reviewSection: {
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.green,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  reviewsList: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  reviewCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  reviewUser: {
    fontWeight: "bold",
    color: colors.textDark,
  },
  reviewRating: {
    color: colors.textDark,
    marginTop: 4,
  },
  reviewComment: {
    color: "#444",
    marginTop: 6,
  },
  reviewDate: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },
  noReviews: {
    textAlign: "center",
    color: "#555",
    marginTop: 10,
  },
});
