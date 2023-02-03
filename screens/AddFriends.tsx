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
import { MaterialIcons } from "@expo/vector-icons";
import {
  getFriends,
  getFriendsFromContacts,
  getFriendSuggestions,
} from "../redux/friends";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../redux/auth/types";
import { IAppState, useAppDispatch, useAppSelector } from "../redux";
import ToastContainer from "../components/ToastContainer";
import { RootStackScreenProps } from "../types";
import FriendCard from "../components/FriendCard";

const AddFriends = ({ navigation }: RootStackScreenProps<"AddFriends">) => {
  const [status, setStatus] = useState<Contacts.PermissionStatus>();
  const dispatch = useAppDispatch();
  const { contactSuggestions, loading, suggestions } = useAppSelector(
    (state) => state.friend
  );
  console.log(
    "🚀 ~ file: AddFriends.tsx:38 ~ AddFriends ~ contactSuggestions",
    contactSuggestions
  );
  const handleContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setStatus(status);
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });
        if (data.length > 0) {
          console.log(
            "🚀 ~ file: AddFriends.tsx:18 ~ data",
            data[0].phoneNumbers
          );
          // console.log(contact);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    //@ts-ignore
    // dispatch(getFriends("h"));
    dispatch(getFriendSuggestions());
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        setStatus(status);
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });
          if (data.length > 0) {
            const phoneNumbers: string[] = [];
            data.forEach((c) => {
              c?.phoneNumbers?.[0].number
                ? phoneNumbers.push(c?.phoneNumbers?.[0].number)
                : null;
            });
            dispatch(getFriendsFromContacts(phoneNumbers));
          }
        }
      } catch (error) {
        console.log("🚀 ~ file: AddFriends.tsx:47 ~ error", error);
      }
    })();
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
      {}
      {status !== "granted" ? (
        <InfoButton
          onPress={handleContactsPermission}
          PrecedingIcon={
            <MaterialIcons
              name="contacts"
              size={24}
              color="rgba(0,0,0,0.8)"
              style={{ marginRight: 10 }}
            />
          }
          title="Find Friends From Contacts"
        />
      ) : loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {contactSuggestions.map((suggestion, i) => (
            <FriendCard
              user={suggestion}
              key={i}
              isContact={true}
              onPress={(uid: string) => navigation.navigate("Profile", { uid })}
            />
          ))}
          {suggestions.map((suggestion, i) => (
            <FriendCard
              user={suggestion}
              key={i}
              isContact={false}
              onPress={(uid: string) => navigation.navigate("Profile", { uid })}
            />
          ))}
        </>
      )}
    </SafeAreaView>
  );
};

export default AddFriends;
