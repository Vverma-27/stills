import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../redux";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";
import { auth } from "../services/firebase";
import Linking from "expo-linking";

const SettingsScreen = (props: RootStackScreenProps<"Settings">) => {
  // console.log(props.route.params.title);
  const { currentUser: user } = useSelector((state: IAppState) => state.auth);
  const itemsToBeRendered = ["name", "username", "dob", "phoneNumber"];
  const headings = ["name", "username", "birthday", "mobile number"];
  // console.log(Linking.createURL("/"));
  const renderedItems = itemsToBeRendered.map((item, i) => {
    const error =
      //@ts-ignore
      !user[item] || (item === "email" && !auth.currentUser?.emailVerified)
        ? "error"
        : "";
    return (
      <Pressable
        style={styles.item}
        onPress={() =>
          props.navigation.navigate("SettingsEdit", { title: headings[i] })
        }
        key={item}
      >
        <Text style={[styles[`${error}Title`], styles.title]}>
          {headings[i]}
        </Text>
        {!error ? (
          //@ts-ignore
          <Text style={styles.value}>{user[item]}</Text>
        ) : (
          <FontAwesome name="exclamation" color="#FF7B7B" size={16} />
        )}
      </Pressable>
    );
  });
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <Text style={styles.heading}>My account</Text>
      {renderedItems}
      <Pressable
        style={styles.item}
        onPress={() =>
          props.navigation.navigate("ConfirmLogin", { title: "email" })
        }
      >
        <Text style={styles.title}>Email</Text>
        {auth.currentUser?.emailVerified ? (
          <Text style={styles.value}>{user?.email}</Text>
        ) : (
          <>
            <Text style={styles.value}>Email Not Verified</Text>
            <FontAwesome name="exclamation" color="#FF7B7B" size={16} />
          </>
        )}
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() =>
          props.navigation.navigate("ConfirmLogin", { title: "password" })
        }
      >
        <Text style={styles.title}>Password</Text>
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() =>
          props.navigation.navigate("SettingsEdit", { title: "notifications" })
        }
      >
        <Text style={styles.title}>Notifications</Text>
      </Pressable>
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
