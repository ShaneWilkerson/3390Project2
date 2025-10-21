// reviews screen 

// imports asyncstorage 
import AsyncStorage from "@react-native-async-storage/async-storage";

// react and hooks
import React, { useEffect, useState } from "react";

// basic react native components
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "../../constants/colors";

// database functions for deleting, loading, and updating reviews
import { deleteReview, getUserReviews, updateReview } from "../../database";
// to refresh 
import { useIsFocused } from "@react-navigation/native";


// review setup typescript
type Review = {
  id: number;
  gymName: string;
  rating: number;
  comment: string;
};


// main function 
export default function ReviewsScreen() {
  // stores all reviews made by the current user
  const [reviews, setReviews] = useState<Review[]>([]);

  // keeps track of which review is being edited
  const [editingId, setEditingId] = useState<number | null>(null);

  // stores the updated rating and comment while editing
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");

  const isFocused = useIsFocused();
// loads reviews 
useEffect(() => {
  const loadReviews = async () => {
    // gets user data 
    const userData = await AsyncStorage.getItem("currentUser");
    if (!userData) return;
 // turns data from string to object
    const user = JSON.parse(userData);
    // loads all reviews from the database that match user
    const data = await getUserReviews(user.id);
    setReviews(data);
  };

  // run every time screen is focused
  if (isFocused) {
    loadReviews();
  }
}, [isFocused]);



  // when user clicks the edit button
  const handleEdit = (review: Review) => {
    // set the current review id to editing mode
    setEditingId(review.id);

    // fill the input boxes with the current values
    setEditRating(String(review.rating));
    setEditComment(review.comment);
  };


  // when user clicks save after editing
  const handleSave = async (id: number) => {
    // makes sure both fields are filled
    if (!editRating || !editComment) {
      Alert.alert("Error", "Please fill out both fields");
      return;
    }

    // updates the review in the database
    await updateReview(id, Number(editRating), editComment);
    Alert.alert("Success", "Review updated");

    // exit edit mode
    setEditingId(null);

    // refresh the reviews list to show the new data
    const userData = await AsyncStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      const data = await getUserReviews(user.id);
      setReviews(data);
    }
  };


  // deletes a review 
  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Delete this review?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          // removes the review from database
          await deleteReview(id);

          // reloads the list after deleting
          const userData = await AsyncStorage.getItem("currentUser");
          if (userData) {
            const user = JSON.parse(userData);
            const data = await getUserReviews(user.id);
            setReviews(data);
          }
        },
      },
    ]);
  };


  // what each review looks like on the screen
  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <Text style={styles.gymName}>{item.gymName}</Text>

      {/* if user is editing this review */}
      {editingId === item.id ? (
        <>
          {/* editable rating */}
          <TextInput
            style={styles.input}
            value={editRating}
            onChangeText={setEditRating}
            placeholder="Rating (1-5)"
            keyboardType="numeric"
          />

          {/* editable comment */}
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={editComment}
            onChangeText={setEditComment}
            placeholder="Comment"
            multiline
          />

          {/* save button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave(item.id)}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* normal view when not editing */}
          <Text style={styles.rating}>Rating: {item.rating}/5</Text>
          <Text style={styles.comment}>{item.comment}</Text>

          {/* edit and delete buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );


  // show everything 
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* page title */}
        <Text style={styles.title}>My Reviews</Text>

        {/* if user has no reviews */}
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>You have not written any reviews yet.</Text>
        ) : (
          // list of all user reviews
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReview}
          />
        )}
      </View>
    </SafeAreaView>
  );
}


// styles 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textDark,
    textAlign: "center",
    marginVertical: 15,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  gymName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.green,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: colors.textDark,
  },
  comment: {
    fontSize: 15,
    color: "#444",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  editButton: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  editText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: colors.green,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  noReviews: {
    textAlign: "center",
    color: "#555",
    marginTop: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
});



