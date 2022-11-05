import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { useSelector } from "react-redux";
import navigation from "../navigation";
import { IAppState } from "../redux";

const SignInEmailForm = (props: any) => {
  const passwordInputRef = useRef<TextInput>();
  const { loading } = useSelector((state: IAppState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Input
        label="Email"
        icon="mail"
        type="email-address"
        placeholder="Enter your email"
        value={props.email}
        setValue={props.setEmail}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => passwordInputRef?.current?.focus()}
      />
      <Pressable style={styles.existing} onPress={props.changeMode}>
        <Text style={styles.link}>Continue with phone instead</Text>
      </Pressable>
      <Input
        label="Password"
        icon="lock-closed"
        type={showPassword ? "visible-password" : "default"}
        isPassword={true}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        placeholder="Enter your password"
        ref={passwordInputRef}
        value={props.password}
        setValue={props.setPassword}
      />
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
      <SubmitButton
        title="Sign In"
        onPress={props.handleSubmit}
        style={{ marginTop: 20 }}
        color="#4DB192"
        loading={loading}
      />
    </>
  );
};

export default SignInEmailForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  form: { marginBottom: 20 },
  existing: {
    fontSize: 11,
    fontWeight: "900",
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
