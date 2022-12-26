import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Contacts from "expo-contacts";
import * as Linking from "expo-linking";

const AddFriends = () => {
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails],
          });
          if (data.length > 0) {
            const contact = data[0];
            console.log("🚀 ~ file: AddFriends.tsx:18 ~ contact", contact);
            // console.log(contact);
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  return (
    <View>
      <Text>AddFriends</Text>
    </View>
  );
};

export default AddFriends;

const styles = StyleSheet.create({});
