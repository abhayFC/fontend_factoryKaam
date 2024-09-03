import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emptyText}>Coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
});

export default Home;
