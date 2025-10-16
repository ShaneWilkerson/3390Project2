import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

// for database


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> Swolemates</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Home</Text>
        <Text style={styles.subtitle}>Search and review gyms near you.</Text>
      </View>
    </SafeAreaView>
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
