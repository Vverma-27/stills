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
import Input from "../components/Input";
import { Feather, Ionicons } from "@expo/vector-icons";
import SubmitButton from "../components/SubmitButton";
import { RootStackScreenProps } from "../types";
import Divider from "../components/Divider";
import GoogleButton from "../components/GoogleButton";
import { useSelector } from "react-redux";
import { IAppState, useAppDispatch } from "../redux";
import {
  loginUser,
  loginUserPhone,
  setError,
  setLoading,
  setSuccess,
} from "../redux/auth";
import ToastContainer from "../components/ToastContainer";
import SignInEmailForm from "../components/SignInEmailForm";
import PhoneForm from "../components/PhoneForm";
import { phoneNumberExists } from "../utils/api";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../services/firebase";
import sendVerificationCode from "../utils/sendVerification";
import {
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth/react-native";

const SignInScreen = ({ navigation }: RootStackScreenProps<"SignIn">) => {
  const [mode, setMode] = useState<"mobile" | "email">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = React.useRef<any>(null);
  const dispatch = useAppDispatch();
  const handleEmailSubmit = () => {
    dispatch(setLoading(true));
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (!email) dispatch(setError("Email cannot be empty"));
    else if (expression.test(email.toLowerCase()) === false) {
      dispatch(setError("Email does not match correct format"));
    } else {
      dispatch(setError(""));
    }
    if (!password) dispatch(setError("Password cannot be empty"));
    dispatch(setError(""));
    dispatch(setLoading(false));
    dispatch(loginUser({ email, password }));
  };

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
      dispatch(setLoading(true));
    }
  };
  // const sendVerificationCode = async () => {
  //   // The FirebaseRecaptchaVerifierModal ref implements the
  //   // FirebaseAuthApplicationVerifier interface and can be
  //   // passed directly to `verifyPhoneNumber`.
  //   // console.log(
  //   //   "🚀 ~ file: SignUpPhoneForm.tsx ~ line 53 ~ sendVerificationCode ~ props.verificationId",
  //   //   "hello"
  //   // );
  //   try {
  //     if (!recaptchaVerifier.current) return;
  //     dispatch(setLoading(true));
  //     const phoneNumber = `${countryCode}${phone}`;
  //     const phoneNumberExist = await phoneNumberExists(phoneNumber);
  //     if (!phoneNumberExist)
  //       dispatch(setError("No account linked to this number exists."));
  //     else {
  //       const response = await signInWithPhoneNumber(
  //         auth,
  //         phoneNumber,
  //         recaptchaVerifier.current
  //       );
  //       //@ts-ignore
  //       setConfirmRes(response);
  //       // const phoneProvider = new PhoneAuthProvider(auth);
  //       // const verificationId = await phoneProvider.verifyPhoneNumber(
  //       //   `${countryCode}${phone}`,
  //       //   recaptchaVerifier.current
  //       // );
  //       // setVerificationId(response.verificationId);
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
  const handlePhoneSubmit = async (verificationCode: string) => {
    if (!phone) return dispatch(setError("Phone cannot be empty"));
    try {
      dispatch(setLoading(true));
      const cred = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const { user } = await signInWithCredential(auth, cred);
      dispatch(loginUserPhone(user.uid));

      // dispatch(setSu{ text: 'Phone authentication successful 👍' });
    } catch (err: any) {
      dispatch(setError(err.message));
      // showMessage({ text: `Error: ${err.message}`, color: 'red' });
    } finally {
      dispatch(setError(""));
      dispatch(setLoading(false));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="dark" /> */}
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: 100, width: 100, marginBottom: 40 }}
      />
      <ToastContainer />
      <View style={styles.form}>
        {mode === "email" ? (
          <SignInEmailForm
            handleSubmit={handleEmailSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            changeMode={() => setMode("mobile")}
            setPassword={setPassword}
            navigate={navigation.navigate}
          />
        ) : (
          <PhoneForm
            phone={phone}
            setPhone={setPhone}
            changeMode={() => setMode("email")}
            handleSubmit={handlePhoneSubmit}
            verificationId={verificationId}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            sendVerificationCode={sendVerification}
            recaptchaVerifier={recaptchaVerifier}
          />
        )}
      </View>
      <Pressable
        style={{
          alignSelf: "flex-start",
          marginLeft: 4,
        }}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.existing}>
          Don't have an account? <Text style={styles.link}>Sign up here</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignInScreen;

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
  form: { marginBottom: 20, width: "100%" },
  existing: {
    fontSize: 11,
    fontWeight: "900",
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
