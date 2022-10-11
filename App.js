import { StyleSheet, Text, View } from "react-native";
import TabBarAnimation from "./src/TabBarAnimation";

export default function App() {
  return (
    <View style={styles.container}>
      <TabBarAnimation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
});
