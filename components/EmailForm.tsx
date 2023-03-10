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

const SignUpEmailForm = (props: any) => {
  //   const [firstPassword, setFirstPassword] = useState("");
  //   const [lastPassword, setLastPassword] = useState("");
  // const input =[null,null];
  const { loading } = useSelector((state: IAppState) => state.auth);
  return (
    <>
      <View style={styles.form}>
        <Input
          label="Email"
          icon="mail"
          type="email-address"
          returnKeyType="done"
          placeholder="Enter your email"
          blurOnSubmit={true}
          value={props.email}
          setValue={props.setEmail}
        />
        {props.title ? null : (
          <Pressable style={styles.disclaimer} onPress={props.changeMode}>
            <Text style={styles.link}>Continue with phone number instead</Text>
          </Pressable>
        )}
      </View>
      <SubmitButton
        title={props.title || "Continue"}
        onPress={props.handleSubmit}
        style={{ marginTop: 20, width: "100%" }}
        color="#4DB192"
        loading={loading}
      />
    </>
  );
};

export default SignUpEmailForm;

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
    textAlign: "left",
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
