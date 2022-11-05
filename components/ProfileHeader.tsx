import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ProfileHeader = ({ navigation, style }: any) => {
  // console.log(style);
  return (
    <View style={style}>
      <View
        style={{
          backgroundColor: "transparent",
          paddingHorizontal: 8,
          paddingVertical: 8,
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          //   height: layout.height * 0.05,
        }}
      >
        <Pressable
          style={[styles.iconContainer]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={20} color="white" />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable style={[styles.iconContainer, { marginRight: 20 }]}>
            <Ionicons name="share-social" size={20} color="white" />
          </Pressable>
          <Pressable
            style={styles.iconContainer}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 200,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#777",
  },
});
