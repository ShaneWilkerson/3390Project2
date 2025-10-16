// Profile screen
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";

// for database
type ProfileScreenProps = {
  profile: { username: string };
  onLogout: () => void;
};

export default function ProfileScreen({profile, onLogout}: ProfileScreenProps) {

  const username = profile?.username || "Unknown User";

  return (
    <ScrollView 
      style={styles.scroll} 
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Profile</Text>
      <View style={styles.halfBackground}></View>
      <View style={styles.profileShadow}>
        <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=14' }}
        style={styles.profileImage}
      />
      </View>

      <View>
        <Text style={styles.cardText}>{username}</Text>
      </View>
      <View>
        <Text style={styles.cardText}>Joined October 14, 2025</Text>
      </View>
      <View>
        <Text style={styles.cardText}>Gym Reviews: 0</Text>
        <Text style={styles.subtitle}>You haven’t left any reviews yet.</Text>
      </View>
      <TouchableOpacity style={styles.cardButton} onPress={() => console.log('Change Username pressed')}>
        <Text style={styles.cardText}>Change Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardButton} onPress={() => console.log('Change Password pressed')}>
        <Text style={styles.cardText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logOutButton} onPress={onLogout}>
        <Text style={styles.logOutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
/*
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
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});
*/
const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#fff',
  },
  halfBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: colors.green,
  },
  container: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 16,
    zIndex: 1,
    color: '#fff',
  },
  profileShadow: {
    height: 120,
    width: 120,
    borderRadius: 60,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    zIndex: 99,
  },
  logOutButton: {
    width: 300,
    backgroundColor: colors.green,
    borderRadius: 15,
    padding: 24,
  },
  logOutText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
  cardButton: {
    width: 300,
    backgroundColor: '#efefef',
    borderRadius: 15,
    padding: 24,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});
