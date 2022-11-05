import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const GoogleButton = () => {
  return (
    <Pressable style={styles.google}>
      <Ionicons
        name="logo-google"
        size={24}
        color="#4DB192"
        style={{ marginRight: 14 }}
      />
      <Text style={{ fontWeight: "500" }}>Continue With Google</Text>
    </Pressable>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  google: {
    flexDirection: "row",
    // backgroundColor: "",
    backgroundColor: "white",
    paddingHorizontal: 40,
    // width: "100%",
    paddingVertical: 10,
    borderRadius: 6,
    elevation: 3,
    // shadowColor: "#171717",
    // shadowOffset: { width: -2, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    alignItems: "center",
    marginTop: 20,
  },
});
