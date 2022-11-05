import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../redux";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";

const SettingsScreen = (props: RootStackScreenProps<"Settings">) => {
  const { currentUser: user } = useSelector((state: IAppState) => state.auth);
  const itemsToBeRendered = ["name", "username", "dob", "phoneNumber", "email"];
  const headings = ["name", "username", "birthday", "mobile number", "email"];
  const renderedItems = itemsToBeRendered.map((item, i) => {
    //@ts-ignore
    const error = !user[item] ? "error" : "";
    return (
      <View style={styles.item}>
        <Text style={[styles[`${error}Title`], styles.title]}>
          {headings[i]}
        </Text>
        {!error ? (
          //@ts-ignore
          <Text style={styles.value}>{user[item]}</Text>
        ) : (
          <FontAwesome name="exclamation" color="#FF7B7B" size={16} />
        )}
      </View>
    );
  });
  return (
    <View>
      <Text style={styles.heading}>My account</Text>
      {renderedItems}
      <View style={styles.item}>
        <Text style={styles.title}>Password</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.title}>Notifications</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  heading: {
    color: "#4DB192",
    marginVertical: 10,
    fontSize: 12,
    fontWeight: "400",
    textTransform: "uppercase",
    paddingHorizontal: 10,
  },
  title: {
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: 14,
  },
  value: {
    fontWeight: "400",
    fontSize: 14,
    color: "#777",
    // fontSize:""
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  errorTitle: { color: "#FF7B7B" },
});
