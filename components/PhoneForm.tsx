import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Input from "./Input";
import { Feather, Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { RootStackScreenProps } from "../types";
import GoogleButton from "./GoogleButton";
import Divider from "./Divider";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setSuccess, signUpUser } from "../redux/auth";
import { IAppState, useAppDispatch } from "../redux";
import ToastContainer from "./ToastContainer";
import { ApplicationVerifier, PhoneAuthProvider } from "firebase/auth";
import { auth, firebaseConfig } from "../services/firebase";
import {
  FirebaseRecaptchaBanner,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { CountryList, CountryPicker } from "react-native-country-codes-picker";

const PhoneForm = (props: any) => {
  //   const [firstPassword, setFirstPassword] = useState("");
  //   const [lastPassword, setLastPassword] = useState("");
  // const input =[null,null];
  //   console.log(
  //     "🚀 ~ file: SignUpPhoneForm.tsx ~ line 32 ~ SignUpPhoneForm ~ props.verificationId",
  //     props.verificationId
  //   );
  const [verificationCode, setVerificationCode] = React.useState("");
  const [timer, setTimer] = useState(30);
  const attemptInvisibleVerification = false;
  const [show, setShow] = useState(false);
  const [flag, setFlag] = useState("🇮🇳");
  const { loading } = useSelector((state: IAppState) => state.auth);
  const dispatch = useAppDispatch();
  // const timerRef = useRef<number>(timer);
  // useEffect(() => {
  //   timerRef.current = timer;
  // }, [timer]);
  useEffect(() => {
    if (!props.verificationId) return;
    console.log("🚀 ~ file: PhoneForm.tsx ~ line 49 ~ id ~ timer", "v changed");
    setTimer(30);
    const id = setInterval(() => {
      // if (timer <= 0) {
      //   clearInterval(id);
      //   setTimer(30);
      //   return;
      // } else
      setTimer((timer) => {
        if (timer <= 0) {
          clearInterval(id);
          return 0;
        }
        return timer - 1;
      });
      // console.log("🚀 ~ file: PhoneForm.tsx ~ line 49 ~ id ~ timer", timer);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [props.verificationId]);

  return (
    <>
      <View style={styles.form}>
        <FirebaseRecaptchaVerifierModal
          ref={props.recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          //   attemptInvisibleVerification={true}
        />
        <CountryPicker
          show={show}
          onBackdropPress={() => setShow(false)}
          lang="en"
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={(item: any) => {
            console.log(item.flag);
            props.setCountryCode(item.dial_code);
            setFlag(item.flag);
            setShow(false);
          }}
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              //   width: "30%",
              marginRight: 20,
            }}
          >
            <Text style={styles.label}>Country Code</Text>
            <Pressable
              onPress={() => setShow(true)}
              disabled={Boolean(props.verificationId)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 19,
                //   paddingVertical: 0,
                borderRadius: 2,
                backgroundColor: "#eee",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#000",
                  flex: 1,
                  fontWeight: "400",
                  letterSpacing: 0.3,
                  paddingTop: 0,
                }}
              >
                {flag} {props.countryCode}
              </Text>
            </Pressable>
          </View>
          <Input
            label="Phone Number"
            icon="call"
            type="phone-pad"
            style={{ width: "60%" }}
            editable={!Boolean(props.verificationId)}
            returnKeyType="done"
            placeholder="Enter your number"
            blurOnSubmit={true}
            value={props.phone}
            setValue={props.setPhone}
          />
        </View>
        {(!props.verificationId && (
          <Pressable style={styles.disclaimer} onPress={props.changeMode}>
            <Text style={styles.link}>Continue with email instead</Text>
          </Pressable>
        )) ||
          null}
        {props.verificationId ? (
          <>
            <Input
              label="Verification Code"
              icon="mail"
              type="numeric"
              returnKeyType="done"
              placeholder="Enter verification code"
              blurOnSubmit={true}
              value={verificationCode}
              setValue={setVerificationCode}
            />
            {timer === 0 ? (
              <Pressable
                style={styles.disclaimer}
                onPress={props.sendVerificationCode}
              >
                <Text style={styles.link}>Resend Code</Text>
              </Pressable>
            ) : (
              <Text style={styles.link}>
                {"Resend in " + timer + " seconds"}
              </Text>
            )}
          </>
        ) : null}
      </View>
      <SubmitButton
        title={!props.verificationId ? "Send Code" : "Verify Code"}
        onPress={
          !props.verificationId
            ? props.sendVerificationCode
            : () => props.handleSubmit(verificationCode)
        }
        style={{ marginTop: 20, width: "100%" }}
        color="#4DB192"
        loading={loading}
      />
      {(attemptInvisibleVerification && <FirebaseRecaptchaBanner />) || null}
    </>
  );
};

export default PhoneForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    alignItems: "center",
    // overflow: "scroll",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  disclaimer: {
    fontSize: 11,
    fontWeight: "500",
    marginVertical: 16,
    textAlign: "left",
    color: "rgba(0,0,0,0.4)",
  },
  label: {
    marginVertical: 8,
    fontWeight: "bold",
    letterSpacing: 0.3,
    color: "#000",
  },
  form: { marginBottom: 20, width: "100%" },
  existing: {
    fontSize: 11,
    fontWeight: "900",
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
