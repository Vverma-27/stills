import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../styles";
import InfoButton from "../components/InfoButton";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  getFriends,
  getFriendsFromContacts,
  getFriendSuggestions,
} from "../redux/friends";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../redux/auth/types";
import { IAppState, useAppDispatch, useAppSelector } from "../redux";
import ToastContainer from "../components/ToastContainer";
import FriendCard from "../components/FriendCard";
import { RootStackScreenProps } from "../types";

const MyFriends = ({ navigation }: RootStackScreenProps<"MyFriends">) => {
  const dispatch = useAppDispatch();
  const { friends, loading } = useAppSelector((state) => state.friend);
  console.log("🚀 ~ file: MyFriends.tsx:38 ~ MyFriends ~ friends", friends);
  useEffect(() => {
    dispatch(getFriends("h"));
  }, []);
  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        {
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          width: "100%",
          // backgroundColor: "blue",
          paddingTop: 0,
        },
      ]}
    >
      <ToastContainer />
      <InfoButton
        onPress={() => navigation.navigate("AddFriends")}
        PrecedingIcon={
          <Ionicons
            name="person-add"
            size={24}
            color="rgba(0,0,0,0.8)"
            style={{ marginRight: 10 }}
          />
        }
        SucceedingIcon={
          <Ionicons name="chevron-forward" size={22} color="rgba(0,0,0,0.8)" />
        }
        title="Add Friends"
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {friends.map((suggestion, i) => (
            <FriendCard
              user={suggestion}
              key={i}
              isContact={true}
              onPress={(uid: string) => navigation.navigate("Profile", { uid })}
            />
          ))}
        </>
      )}
    </SafeAreaView>
  );
};

export default MyFriends;
