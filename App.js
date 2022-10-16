import { StyleSheet, View } from "react-native";
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
    backgroundColor: "#3e3c4a",
  },
});
