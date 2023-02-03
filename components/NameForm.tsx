import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Input from "./Input";
import { Feather, Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { RootStackScreenProps } from "../types";
import GoogleButton from "./GoogleButton";
import Divider from "./Divider";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/auth";
import { IAppState, useAppDispatch } from "../redux";
import ToastContainer from "./ToastContainer";

const SignUpNameForm = (props: any) => {
  //   const [firstname, setFirstName] = useState("");
  //   const [lastName, setLastName] = useState("");
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<string[]>([]);
  // const input =[null,null];
  const lastNameInputRef = useRef<TextInput>();
  const { loading } = useSelector((state: IAppState) => state.auth);
  return (
    <>
      <View style={styles.form}>
        <Input
          label="First Name"
          type="default"
          placeholder="Enter your first name"
          blurOnSubmit={false}
          value={props.firstname}
          setValue={props.setFirstName}
          returnKeyType="next"
          onSubmitEditing={() => lastNameInputRef?.current?.focus()}
          errorText={errors[0]}
        />
        <Input
          label="Last Name"
          //   icon="mail"
          type="default"
          returnKeyType="done"
          placeholder="Enter your last name"
          blurOnSubmit={true}
          value={props.lastName}
          ref={lastNameInputRef}
          errorText={errors[1]}
          setValue={props.setLastName}
        />
        {props.title ? null : (
          <Text style={styles.disclaimer}>
            By tapping "Sign Up & Accept", you acknowledge that you have read
            the <Text style={styles.link}> Privacy Policy </Text>and agree to
            the <Text style={styles.link}>Terms of Service</Text>
          </Text>
        )}
      </View>
      <SubmitButton
        title={props.title || "Sign Up & Accept"}
        onPress={props.handleSubmit}
        style={{ marginTop: 20, width: "100%" }}
        color="#4DB192"
        loading={loading}
      />
    </>
  );
};

export default SignUpNameForm;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   paddingTop: 80,
  //   alignItems: "center",
  //   // overflow: "scroll",
  //   justifyContent: "flex-start",
  //   paddingHorizontal: 16,
  //   paddingBottom: 20,
  // },
  disclaimer: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
    color: "rgba(0,0,0,0.4)",
  },
  form: { marginBottom: 20 },
  existing: {
    fontSize: 11,
    fontWeight: "900",
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
