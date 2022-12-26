import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState, useAppDispatch } from "../redux";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";
import PhoneForm from "../components/PhoneForm";
import SignInEmailForm from "../components/SignInEmailForm";
import ToastContainer from "../components/ToastContainer";
import navigation from "../navigation";
import NameForm from "../components/NameForm";
import UsernameForm from "../components/UsernameForm";
import DOBForm from "../components/DOBForm";
import EmailForm from "../components/EmailForm";
import { signInWithPhoneNumber } from "firebase/auth";
import {
  setLoading,
  setError,
  setSuccess,
  signupUserPhone,
  updateUser,
  logOutUser,
} from "../redux/auth";
import { auth } from "../services/firebase";
import { emailExists, phoneNumberExists } from "../utils/api";
import {
  EmailAuthProvider,
  linkWithCredential,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePhoneNumber,
  verifyBeforeUpdateEmail,
} from "firebase/auth/react-native";
import sendVerificationCode from "../utils/sendVerification";

let HAS_CHANGED = false;

const SettingsEditScreen = ({
  route: {
    params: { title },
  },
  navigation,
}: RootStackScreenProps<"SettingsEdit">) => {
  // console.log(props.route.params.title);
  const dispatch = useAppDispatch();
  const { currentUser: user } = useSelector((state: IAppState) => state.auth);
  const [phone, setPhone] = useState(0);
  const [verificationId, setVerificationId] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [firstname, setFirstName] = useState(user?.name?.split(" ")[0]);
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1]);
  const [email, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.username);
  const [date, setDate] = useState<Date | null>(new Date(user?.dob || ""));
  const recaptchaVerifier = React.useRef<any>(null);
  const { currentUser } = auth;
  if (!currentUser) return null;
  // useEffect(() => {
  //   if (credential && !HAS_CHANGED) {
  //     reauthenticateWithCredential(currentUser, credential);
  //     title === "email" ? handleEmailSubmit() : null;
  //   }
  // }, [credential]);

  const handleSubmit = async (property: string, value: any) => {
    const response = await dispatch(updateUser({ [property]: value }));
    if (response.meta.requestStatus === "fulfilled")
      navigation.navigate("Settings");
  };

  // const handleSignInAgain = async () => {
  //   dispatch(setLoading(true));
  //   else navigation.navigate("ConfirmLogin", { title });
  //   dispatch(setLoading(false));
  // };

  const handleEmailSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const emailExist = await emailExists(email || "");
      const expression =
        /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if (!email) dispatch(setError("Email cannot be empty"));
      else if (expression.test(email.toLowerCase()) === false) {
        dispatch(setError("Email does not match correct format"));
      } else if (emailExist)
        dispatch(setError("Account linked to this email already exists."));
      else {
        await updateEmail(currentUser, email);
        //@ts-ignore
        await sendEmailVerification(auth.currentUser);
        dispatch(
          setSuccess(
            "Your email has been changed and a verification link has been sent to your email. You will be logged out for the time being."
          )
        );
        dispatch(logOutUser(""));
      }
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(
        "🚀 ~ file: SettingsEdit.tsx ~ line 91 ~ handleEmailSubmit ~ error",
        error
      );
      // const { code } = error;
      // if (code === "auth/requires-recent-login") {
      //   const emailProvider = new EmailAuthProvider();
      //   const credential = emailProvider
      //   reauthenticateWithCredential(currentUser, credential);
      // }
      dispatch(setLoading(false));
    }
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
        recaptchaVerifier.current
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
  const handlePhoneSubmit = async (verificationCode: string) => {
    if (!phone) return dispatch(setError("Phone cannot be empty"));
    console.log(
      "🚀 ~ file: SettingsEdit.tsx ~ line 93 ~ handlePhoneSubmit ~ currentUser",
      currentUser
    );

    try {
      dispatch(setLoading(true));
      const cred = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const phoneNumber = `${countryCode}${phone}`;
      const res = await updatePhoneNumber(currentUser, cred);
      console.log(
        "🚀 ~ file: SettingsEdit.tsx ~ line 94 ~ handlePhoneSubmit ~ res",
        res
      );
      //@ts-ignore
      dispatch(updateUser({ ...user, phoneNumber }));
      // dispatch(
      //   signupUserPhone({
      //     verificationCode,
      //     confirm: confirmRes,
      //     userData: {
      //       name: `${firstname} ${lastName}`,
      //       uid: "",
      //       username,
      //       phoneNumber: `${countryCode}${phone}`,
      //       dob: `${datestring[0]}, ${datestring[2]} ${datestring[1]}, ${datestring[3]}`,
      //       age,
      //     },
      //   })
      // );
      // dispatch(setSu{ text: 'Phone authentication successful 👍' });
    } catch (err: any) {
      console.log(
        "🚀 ~ file: SettingsEdit.tsx ~ line 120 ~ handlePhoneSubmit ~ err",
        err
      );

      dispatch(setError(err.message));
      // showMessage({ text: `Error: ${err.message}`, color: 'red' });
    } finally {
      dispatch(setError(""));
      dispatch(setLoading(false));
    }
  };
  let renderedElement = (() => {
    switch (title[0]) {
      case "n":
        return (
          <NameForm
            firstname={firstname}
            lastName={lastName}
            title="Update Name"
            setFirstName={setFirstName}
            setLastName={setLastName}
            handleSubmit={() =>
              handleSubmit("name", `${firstname} ${lastName}`)
            }
          />
        );
      case "p":
        return (
          <NameForm
            firstname={firstname}
            lastName={lastName}
            title="Update Name"
            setFirstName={setFirstName}
            setLastName={setLastName}
            handleSubmit={() =>
              handleSubmit("name", `${firstname} ${lastName}`)
            }
          />
        );
      case "u":
        return (
          <UsernameForm
            username={username}
            setUsername={setUsername}
            handleSubmit={() => handleSubmit("username", username)}
          />
        );
      case "b":
        return (
          <DOBForm
            date={date}
            setDate={setDate}
            handleSubmit={() => {
              //@ts-ignore
              const datestring = date.toString().split(" ").slice(0, 4);
              handleSubmit(
                "dob",
                `${datestring[0]}, ${datestring[2]} ${datestring[1]}, ${datestring[3]}`
              );
            }}
          />
        );
      case "m":
        return (
          <PhoneForm
            phone={phone}
            setPhone={setPhone}
            isNotAuth={true}
            confirmTitle="Update Mobile Number"
            handleSubmit={handlePhoneSubmit}
            verificationId={verificationId}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            sendVerificationCode={sendVerification}
            recaptchaVerifier={recaptchaVerifier}
          />
        );
      case "e":
        return (
          <EmailForm
            email={email}
            setEmail={setEmail}
            handleSubmit={handleEmailSubmit}
            title="Change Email"
          />
        );
      default:
        break;
    }
  })();
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="dark" /> */}
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: 100, width: 100, marginBottom: 40 }}
      />
      <ToastContainer />
      <View style={styles.form}>{renderedElement}</View>
    </SafeAreaView>
  );
};

export default SettingsEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
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
