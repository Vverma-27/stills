import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import {
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Header = ({
  navigation,
  route,
  options,
  layout,
}: BottomTabHeaderProps) => {
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: "transparent",
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          //   height: layout.height * 0.05,
        }}
      >
        <Pressable
          style={[styles.iconContainer]}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person" size={22} color="white" />
        </Pressable>
        <Text style={styles.title}>{options.title || route.name}</Text>
        <Pressable style={styles.iconContainer}>
          <Ionicons name="search" size={22} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 200,
    backgroundColor: "#777",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#777",
  },
});
