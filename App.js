import { StyleSheet, View } from "react-native";
import TabBar from "./src/TabBar";

export default function App() {
  return (
    <View style={styles.container}>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3e3c4a",
  },
});
