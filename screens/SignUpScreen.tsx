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
import GoogleButton from "../components/GoogleButton";
import Divider from "../components/Divider";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUserPhone,
  setError,
  setLoading,
  setSuccess,
  signUpUser,
} from "../redux/auth";
import { IAppState, useAppDispatch } from "../redux";
import ToastContainer from "../components/ToastContainer";
import SignUpNameForm from "../components/NameForm";
import SignUpDOBForm from "../components/DOBForm";
import SignUpPasswordForm from "../components/PasswordForm";
import SignUpEmailForm from "../components/EmailForm";
import SignUpPhoneForm from "../components/PhoneForm";
import {
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../services/firebase";
import SignUpUsernameForm from "../components/UsernameForm";
import { checkUsernameValidity } from "../utils/api";
import { phoneNumberExists } from "../utils/api";
import sendVerificationCode from "../utils/sendVerification";
import globalStyles from "../styles";

export const getAge = (birthDate: number) =>
  Math.floor(
    (new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e10
  );

const SignUpScreen = ({ navigation }: RootStackScreenProps<"SignUp">) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState(0);
  const [verificationId, setVerificationId] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [date, setDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signInMode, setSignInMode] = useState<"email" | "phone">("email");
  // const [verificationId, setVerificationId] = React.useState("");
  // const [confirmRes, setConfirmRes] = React.useState<any>({});
  const recaptchaVerifier = React.useRef<any>(null);
  const [age, setAge] = useState(0);
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();
  // const input =[null,null];
  const { loading } = useSelector((state: IAppState) => state.auth);
  const handleNameSubmit = () => {
    dispatch(setLoading(true));
    if (!firstname || !lastName) {
      dispatch(setError("Name cannot be empty"));
    } else {
      dispatch(setError(""));
      setStep((step) => step + 1);
    }
    dispatch(setLoading(false));
  };
  const handleDateSubmit = () => {
    dispatch(setLoading(true));
    if (!date) dispatch(setError("DOB cannot be empty"));
    else {
      const age = getAge(date.getTime());
      setAge(age);
      if (age < 12) dispatch(setError("Cannot make an account"));
      else {
        dispatch(setError(""));
        setStep((step) => step + 1);
      }
    }
    dispatch(setLoading(false));
  };
  // const handlePhoneSubmit = () => {
  // else {
  //   setStep((step) => step + 1);
  // }
  // };

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
      // console.log(
      //   "🚀 ~ file: SignUpScreen.tsx:114 ~ sendVerification ~ verificationId",
      //   verificationId
      // );
      setVerificationId(verificationId);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
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
  //     if (phoneNumberExist)
  //       dispatch(setError("Account linked to this number already exists."));
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
      //@ts-ignore
      const datestring = date.toString().split(" ").slice(0, 4);
      dispatch(
        signupUserPhone({
          name: `${firstname} ${lastName}`,
          uid: user.uid,
          username,
          phoneNumber: `${countryCode}${phone}`,
          dob: `${datestring[0]}, ${datestring[2]} ${datestring[1]}, ${datestring[3]}`,
          age,
        })
      );
      // dispatch(setSu{ text: 'Phone authentication successful 👍' });
    } catch (err: any) {
      dispatch(setError(err.message));
      // showMessage({ text: `Error: ${err.message}`, color: 'red' });
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleEmailSubmit = () => {
    dispatch(setLoading(true));
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (!email) dispatch(setError("Email cannot be empty"));
    else if (expression.test(email.toLowerCase()) === false) {
      dispatch(setError("Email does not match correct format"));
    } else {
      dispatch(setError(""));
      setStep((step) => step + 1);
    }
    dispatch(setLoading(false));
  };
  const handleUsernameSubmit = async () => {
    dispatch(setLoading(true));
    if (!username) dispatch(setError("Username cannot be empty"));
    else {
      const unique = await checkUsernameValidity(username);
      console.log(
        "🚀 ~ file: SignUpScreen.tsx ~ line 164 ~ handleUsernameSubmit ~ unique",
        unique
      );
      if (!unique) dispatch(setError("Username already in use"));
      else {
        dispatch(setError(""));
        setStep((step) => step + 1);
      }
    }
    dispatch(setLoading(false));
  };
  const handlePasswordSubmit = async () => {
    dispatch(setLoading(true));
    let passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!password) dispatch(setError("Password cannot be empty"));
    else if (password.trim().length < 8)
      dispatch(setError("Password must be atleast 8 characters"));
    else if (
      password.trim().toLowerCase().includes(firstname.trim().toLowerCase()) ||
      password.trim().toLowerCase().includes(lastName.trim().toLowerCase())
    )
      dispatch(setError("Password cannot contain your name"));
    else if (passwordRegex.test(password) === false) {
      dispatch(
        setError("Password must contain a special character and a number")
      );
    } else {
      dispatch(setError(""));
      //@ts-ignore
      const datestring = date.toString().split(" ").slice(0, 4);
      const response = await dispatch(
        signUpUser({
          name: `${firstname} ${lastName}`,
          uid: "",
          username,
          email,
          phoneNumber: `${countryCode}${phone}`,
          password,
          dob: `${datestring[0]}, ${datestring[2]} ${datestring[1]}, ${datestring[3]}`,
          age,
        })
      );
      // console.log("🚀 ~ file: SignUpScreen.tsx ~ line 234 ~ handlePasswordSubmit ~ response", response)
      if (response.meta.requestStatus === "fulfilled")
        navigation.navigate("SignIn");
    }
    dispatch(setLoading(false));
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      {/* <StatusBar style="dark" /> */}
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: 100, width: 100, marginBottom: 40 }}
      />
      <ToastContainer />
      {step === 1 ? (
        <SignUpNameForm
          firstName={firstname}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          handleSubmit={handleNameSubmit}
        />
      ) : step === 2 ? (
        <SignUpDOBForm
          date={date}
          setDate={setDate}
          handleSubmit={handleDateSubmit}
        />
      ) : step === 3 ? (
        <SignUpUsernameForm
          username={username}
          setUsername={setUsername}
          // setUsername={(text: string) => {
          //   console.log(
          //     "🚀 ~ file: SignUpScreen.tsx ~ line 244 ~ SignUpScreen ~ text",
          //     text
          //   );
          //   setUsername(text.toLowerCase());
          // }}
          handleSubmit={handleUsernameSubmit}
        />
      ) : step === 4 ? (
        signInMode === "email" ? (
          <SignUpEmailForm
            email={email}
            setEmail={setEmail}
            changeMode={() => setSignInMode("phone")}
            handleSubmit={handleEmailSubmit}
          />
        ) : (
          <SignUpPhoneForm
            phone={phone}
            setPhone={setPhone}
            changeMode={() => setSignInMode("email")}
            handleSubmit={handlePhoneSubmit}
            verificationId={verificationId}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            sendVerificationCode={sendVerification}
            recaptchaVerifier={recaptchaVerifier}
          />
        )
      ) : step === 5 ? (
        <SignUpPasswordForm
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          password={password}
          setPassword={setPassword}
          showRePassword={showRePassword}
          setShowRePassword={setShowRePassword}
          rePassword={rePassword}
          setRePassword={setRePassword}
          handleSubmit={handlePasswordSubmit}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default SignUpScreen;

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
  form: { marginBottom: 20 },
  existing: {
    fontSize: 11,
    fontWeight: "900",
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
