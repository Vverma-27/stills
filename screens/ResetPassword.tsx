import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Input from "../components/Input";
import { Feather, Ionicons } from "@expo/vector-icons";
import SubmitButton from "../components/SubmitButton";
import { RootStackScreenProps } from "../types";
import Divider from "../components/Divider";
import GoogleButton from "../components/GoogleButton";
import { sendPasswordResetEmail } from "firebase/auth/react-native";
import { auth } from "../services/firebase";
import { IAppState, useAppDispatch } from "../redux";
import { setError, setLoading, setSuccess } from "../redux/auth";
import ToastContainer from "../components/ToastContainer";
import { useSelector } from "react-redux";
import globalStyles from "../styles";

const ResetPassword = ({
  navigation,
}: RootStackScreenProps<"ResetPassword">) => {
  const { currentUser: user } = useSelector((state: IAppState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    try {
      dispatch(setLoading(true));
      const expression =
        /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if (!email) dispatch(setError("Email cannot be empty"));
      else if (expression.test(email.toLowerCase()) === false) {
        dispatch(setError("Email does not match correct format"));
      } else {
        dispatch(setError(""));
      }
      dispatch(setLoading(false));
      sendPasswordResetEmail(auth, email);
      dispatch(setSuccess("Password reset link sent."));
    } catch (e) {
      console.log(e);
      dispatch(setError("Could not complete the request. Please try later."));
    }
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      {/* <StatusBar style="dark" /> */}
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: 100, width: 100, marginBottom: 40 }}
      />
      <ToastContainer />
      <View style={styles.form}>
        <Input
          label="Email"
          icon="mail"
          type="email-address"
          placeholder="Enter your email"
          value={email}
          setValue={setEmail}
        />
        <SubmitButton
          title="Reset Password"
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
          color="#4DB192"
        />
      </View>
      <Pressable
        style={{
          alignSelf: "flex-start",
          marginLeft: 4,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color="#4DB192"
          style={{ marginRight: 2 }}
        />
        <Text style={[styles.existing, styles.link]}>Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   paddingTop: 80,
  //   alignItems: "center",
  //   justifyContent: "flex-start",
  //   paddingHorizontal: 16,
  //   paddingBottom: 20,
  // },
  form: { marginBottom: 20 },
  existing: {
    fontSize: 14,
    fontWeight: "900",
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
