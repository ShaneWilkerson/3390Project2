// imports asyncstorage for info for user 
import AsyncStorage from "@react-native-async-storage/async-storage";

// imports router tools so we can grab gym info  from other screens
import { useLocalSearchParams, useRouter } from "expo-router";

// react and hooks
import React, { useEffect, useState } from "react";

// basic react native components
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

// database functions 
import { addReview, gymReviews } from "../database";


// sets up review 
type Review = {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
};


// main screen for gym details
export default function GymDetails() {
  // pulls gym id, name, and address from previous screen
  const { id, name, address } = useLocalSearchParams();

  // allows navigation to go back to home or move between screens
  const router = useRouter();

  // stores all reviews 
  const [reviews, setReviews] = useState<Review[]>([]);

  // keeps track of what the user types for their review
  const [comment, setComment] = useState("");

  // keeps track of the rating input
  const [rating, setRating] = useState("");


  // loads all reviews for this gym when the screen first opens
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      const result = await gymReviews(Number(id));
      setReviews(result);
    };
    fetchReviews();
  }, [id]);


  // adds a new review to the gym
  const handleAddReview = async () => {
    // makes sure both rating and comment are filled out
    if (!rating || !comment) {
      Alert.alert("Error", "Please fill out both rating and comment.");
      return;
    }

    // gets current user info from asyncstorage
    const userData = await AsyncStorage.getItem("currentUser");

    // makes sure user is logged in before posting
    if (!userData) {
      Alert.alert("Error", "You must be logged in to leave a review.");
      return;
    }

    // turns the user data back into an object
    const user = JSON.parse(userData);

    // creates a date for review 
    const date = new Date().toLocaleDateString();

    // adds review to the database
    await addReview(user.id, Number(id), Number(rating), comment, date);

    Alert.alert("Success", "Review added!"); // simple alert 

    // refreshes the reviews so the new one appears right away
    const result = await gymReviews(Number(id));
    setReviews(result);

    // clears the input boxes after posting
    setComment("");
    setRating("");
  };


  // goes back to the previous screen (home)
  const handleGoBack = () => {
    router.back();
  };


  // jsx to display
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        {/* top header with back button and gym info */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerSubtitle}>{address}</Text>
        </View>

        {/* section for writing a new review */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Write a Review</Text>

          {/* rating input */}
          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />

          {/* comment input */}
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Write your comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          {/* post review button */}
          <TouchableOpacity style={styles.button} onPress={handleAddReview}>
            <Text style={styles.buttonText}>Post Review</Text>
          </TouchableOpacity>
        </View>

        {/* section that lists all reviews */}
        <View style={styles.reviewsList}>
          <Text style={styles.sectionTitle}>Reviews</Text>

          {/* if there are no reviews yet */}
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet.</Text>
          ) : (
            // shows each review card
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


// styles 
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
    paddingTop: 50,
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

