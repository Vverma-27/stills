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

const SignUpPasswordForm = (props: any) => {
  //   const [firstPassword, setFirstPassword] = useState("");
  //   const [lastPassword, setLastPassword] = useState("");
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<string[]>([]);
  // const input =[null,null];
  const passwordInputRef = useRef<TextInput>();
  const { loading } = useSelector((state: IAppState) => state.auth);
  return (
    <>
      <View style={styles.form}>
        <Input
          label="Password"
          //   icon="lock-closed"
          type={props.showPassword ? "visible-password" : "default"}
          returnKeyType="next"
          isPassword={true}
          //   ref={props.passwordInputRef}
          showPassword={props.showPassword}
          setShowPassword={props.setShowPassword}
          placeholder="Enter your password"
          value={props.password}
          onSubmitEditing={() => passwordInputRef?.current?.focus()}
          setValue={props.setPassword}
        />
        {props.title ? (
          <Pressable
            style={{
              alignSelf: "flex-start",
            }}
            onPress={() => props.navigate("ResetPassword")}
          >
            <Text
              style={[
                styles.existing,
                styles.link,
                {
                  marginLeft: 0,
                },
              ]}
            >
              Forgot Password?
            </Text>
          </Pressable>
        ) : (
          <Input
            label="Re-enter Password"
            //   icon="lock-closed"
            type={props.showRePassword ? "visible-password" : "default"}
            returnKeyType="done"
            isPassword={true}
            ref={passwordInputRef}
            showPassword={props.showRePassword}
            setShowPassword={props.setShowRePassword}
            placeholder="Re-enter your password"
            value={props.rePassword}
            setValue={props.setRePassword}
          />
        )}
      </View>
      <SubmitButton
        title={props.title || "Continue"}
        onPress={() => props.handleSubmit()}
        style={{ marginTop: 20, width: "100%" }}
        color="#4DB192"
        loading={loading}
      />
    </>
  );
};

export default SignUpPasswordForm;

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
