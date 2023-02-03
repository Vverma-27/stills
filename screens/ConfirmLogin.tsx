import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { RootStackScreenProps } from "../types";
import SignInEmailForm from "../components/SignInEmailForm";
import PhoneForm from "../components/PhoneForm";
import { useSelector } from "react-redux";
import { IAppState, useAppDispatch } from "../redux";
import PasswordForm from "../components/PasswordForm";
import SettingsEditScreen from "./SettingsEdit";
import { auth } from "../services/firebase";
import {
  EmailAuthProvider,
  PhoneAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth/react-native";
import { setLoading, setError, setSuccess } from "../redux/auth";
import { phoneNumberExists } from "../utils/api";
import ToastContainer from "../components/ToastContainer";
import sendVerificationCode from "../utils/sendVerification";

const ConfirmLogin = (props: RootStackScreenProps<"ConfirmLogin">) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const [phone, setPhone] = useState(0);
  const [verificationId, setVerificationId] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const recaptchaVerifier = React.useRef<any>(null);
  const mode = useSelector(
    (state: IAppState) => state.auth?.currentUser?.providerType
  );
  const { currentUser } = auth;
  if (!currentUser) return null;
  const sendVerification = async () => {
    if (!recaptchaVerifier.current) return;
    try {
      dispatch(setLoading(true));
      const phoneNumber = `${countryCode}${phone}`;
      const verificationId = await sendVerificationCode(
        phoneNumber,
        (t: string) => {
          dispatch(setError(t));
        },
        recaptchaVerifier.current,
        true
      );
      setVerificationId(verificationId);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  // const sendVerificationCode = async () => {
  //   try {
  //     if (!recaptchaVerifier.current) return;
  // dispatch(setLoading(true));
  // const phoneNumber = `${countryCode}${phone}`;
  //     console.log(
  //       "🚀 ~ file: SettingsEdit.tsx ~ line 61 ~ sendVerificationCode ~ phoneNumber",
  //       phoneNumber
  //     );
  //     const phoneNumberExist = await phoneNumberExists(phoneNumber);
  //     if (phoneNumberExist)
  //       dispatch(setError("Account linked to this number already exists."));
  //     else {
  //       const phoneProvider = new PhoneAuthProvider(auth);
  //       const verificationId = await phoneProvider.verifyPhoneNumber(
  //         phoneNumber,
  //         recaptchaVerifier.current
  //       );
  //       console.log(
  //         "🚀 ~ file: SettingsEdit.tsx ~ line 71 ~ sendVerificationCode ~ verificationId",
  //         verificationId
  //       );
  //       setVerificationId(verificationId);
  //       dispatch(setSuccess("Verification code has been sent to your mobile."));
  //     }
  //     dispatch(setLoading(false));
  //   } catch (err: any) {
  //     const { code, message } = err;
  //     if (code === "auth/invalid-phone-number")
  //       dispatch(setError("Invalid Phone Number"));
  //     else if (code === "auth/too-many-requests")
  //       dispatch(setError("Too many requests. Please try later."));
  //     else dispatch(setError(message));
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };
  const handleSubmit = async (verificationCode?: string) => {
    let cred: any;
    try {
      if (mode === "email") {
        cred = EmailAuthProvider.credential(currentUser.email, password);
        console.log(
          "🚀 ~ file: ConfirmLogin.tsx:99 ~ handleSubmit ~ cred",
          cred
        );
        // console.log(
        //   "🚀 ~ file: ConfirmLogin.tsx:100 ~ handleSubmit ~ emailCredential",
        //   emailCredential
        // );
      } else if (verificationCode) {
        if (!phone) return dispatch(setError("Phone cannot be empty"));
        dispatch(setLoading(true));
        cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        // props.navigation.navigate("SettingsEdit", {
        //   credential: cred,
        //   title: props.route.params.title,
        // });
      }
      const res = await reauthenticateWithCredential(currentUser, cred);
      console.log("🚀 ~ file: ConfirmLogin.tsx:102 ~ handleSubmit ~ res", res);
      props.navigation.navigate("SettingsEdit", {
        title: props.route.params.title,
      });
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/wrong-password") {
        return dispatch(setError("Invalid Credentials"));
      } else if (errorCode == "auth/invalid-email") {
        return dispatch(setError("Invalid Credentials"));
      } else if (errorCode == "auth/user-not-found") {
        return dispatch(setError("Invalid Credentials"));
      } else if (errorCode == "auth/code-expired") {
        return dispatch(setError("Code has expired. Request a new one."));
      } else if (errorCode == "auth/invalid-verification-code") {
        return dispatch(setError("Invalid code."));
      } else if (errorCode == "auth/user-not-found") {
        return dispatch(setError("Invalid Credentials"));
      } else if (errorCode == "auth/too-many-requests") {
        return dispatch(
          setError(
            "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
          )
        );
      } else {
        return dispatch(setError(errorMessage));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  // console.log()
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: 100, width: 100, marginBottom: 40 }}
      />
      <ToastContainer />
      {mode === "phone" ? (
        <PhoneForm
          phone={phone}
          setPhone={setPhone}
          isNotAuth={true}
          confirmTitle="Re-Authenticate"
          handleSubmit={handleSubmit}
          verificationId={verificationId}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          sendVerificationCode={sendVerification}
          recaptchaVerifier={recaptchaVerifier}
        />
      ) : (
        <PasswordForm
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          navigate={(screen) => props.navigation.navigate(screen)}
          title="Re-Authenticate"
        />
      )}
    </SafeAreaView>
  );
};

export default ConfirmLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // transform: [{ translateY: -80 }],
    alignItems: "center",
    // overflow: "scroll",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
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
